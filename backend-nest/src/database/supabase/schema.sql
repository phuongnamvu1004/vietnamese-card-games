CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    profile_pic VARCHAR(255) DEFAULT '',
    balance INTEGER DEFAULT 1000,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP FUNCTION IF EXISTS add_to_user_balance(int, int);
CREATE OR REPLACE FUNCTION add_to_user_balance(p_user_id int, p_delta int)
RETURNS TABLE (
    id int,
    email text,
    full_name text,
    profile_pic text,
    balance int,
    created_at timestamptz,
    updated_at timestamptz
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
    UPDATE users
    SET balance = balance + p_delta,
            updated_at = NOW()
    WHERE id = p_user_id
    RETURNING id, email, full_name, profile_pic, balance, created_at, updated_at;
$$;

GRANT EXECUTE ON FUNCTION add_to_user_balance(int, int) TO anon, authenticated, service_role;

CREATE TABLE IF NOT EXISTS rooms (
    id SERIAL PRIMARY KEY,
    room_id VARCHAR(255) UNIQUE NOT NULL,
    host_user_id INTEGER REFERENCES users (id),
    game_type VARCHAR(50) NOT NULL CHECK (game_type IN ('sam', 'phom')),
    max_players INTEGER NOT NULL DEFAULT 4,
    buy_in INTEGER NOT NULL,
    bet_unit INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS game_logs (
    id SERIAL PRIMARY KEY,
    room_id INTEGER REFERENCES rooms (id),
    player_id INTEGER REFERENCES users (id),
    action VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_type
        WHERE typname = 'room_player_status'
    ) THEN
        CREATE TYPE room_player_status AS ENUM (
            'host',
            'invited',
            'accepted',
            'declined',
            'canceled',
            'joined',
            'left',
            'kicked'
        );
    END IF;
END
$$;

CREATE TABLE IF NOT EXISTS room_players (
    room_id INTEGER NOT NULL REFERENCES rooms (id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    status room_player_status NOT NULL,
    invited_by INTEGER REFERENCES users (id),
    invited_at TIMESTAMPTZ,
    joined_at TIMESTAMPTZ,
    PRIMARY KEY (room_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_room_players_room ON room_players (room_id);
CREATE INDEX IF NOT EXISTS idx_room_players_user ON room_players (user_id);
CREATE INDEX IF NOT EXISTS idx_room_players_status ON room_players (status);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_type
        WHERE typname = 'invitation_status'
    ) THEN
        CREATE TYPE invitation_status AS ENUM (
            'pending',
            'accepted',
            'declined',
            'canceled',
            'expired'
        );
    END IF;
END
$$;

CREATE TABLE IF NOT EXISTS invitations (
    invitor_id INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    invitee_id INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    room_id INTEGER NOT NULL REFERENCES rooms (id) ON DELETE CASCADE,
    invite_token VARCHAR(255) NOT NULL,
    status invitation_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ,
    expired_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    PRIMARY KEY (invitor_id, invitee_id, room_id)
);

CREATE INDEX IF NOT EXISTS idx_invitations_invite_token ON invitations (invite_token);

CREATE TABLE IF NOT EXISTS user_statistics_sam (
    user_id INTEGER PRIMARY KEY REFERENCES users (id) ON DELETE CASCADE,
    total_games INTEGER NOT NULL DEFAULT 0,
    total_wins INTEGER NOT NULL DEFAULT 0,
    instant_wins JSONB NOT NULL DEFAULT '{}',
    win_rate REAL NOT NULL DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

DROP FUNCTION IF EXISTS update_sam_stats_wins(int, int, int);
CREATE OR REPLACE FUNCTION update_sam_stats_wins(
    p_user_id int,
    p_wins_inc int,
    p_games_inc int
)
RETURNS TABLE (
    user_id int,
    total_games int,
    total_wins int,
    win_rate real,
    instant_wins jsonb,
    created_at timestamptz,
    updated_at timestamptz
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
    UPDATE user_statistics_sam
    SET total_wins = total_wins + p_wins_inc,
            total_games = total_games + p_games_inc,
            win_rate = CASE
                WHEN (total_games + p_games_inc) > 0
                THEN ROUND(((total_wins + p_wins_inc)::numeric / (total_games + p_games_inc)::numeric) * 100, 2)
                ELSE 0
            END,
            updated_at = NOW()
    WHERE user_id = p_user_id
    RETURNING user_id, total_games, total_wins, win_rate, instant_wins, created_at, updated_at;
$$;

GRANT EXECUTE ON FUNCTION update_sam_stats_wins(int, int, int) TO anon, authenticated, service_role;

DROP FUNCTION IF EXISTS update_sam_stats_instant_wins(int, int, int, int, int, int);
CREATE OR REPLACE FUNCTION update_sam_stats_instant_wins(
    p_user_id int,
    p_dragon_straight_inc int,
    p_four_twos_inc int,
    p_flush_hand_inc int,
    p_three_triplets_inc int,
    p_five_pairs_inc int
)
RETURNS TABLE (
    user_id int,
    total_games int,
    total_wins int,
    win_rate real,
    instant_wins jsonb,
    created_at timestamptz,
    updated_at timestamptz
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
    UPDATE user_statistics_sam
    SET instant_wins = jsonb_set(
        jsonb_set(
            jsonb_set(
                jsonb_set(
                    jsonb_set(
                        COALESCE(instant_wins, '{}'::jsonb),
                        '{dragonStraight}',
                        to_jsonb(GREATEST(0, COALESCE((instant_wins->>'dragonStraight')::int, 0) + p_dragon_straight_inc))
                    ),
                    '{fourTwos}',
                    to_jsonb(GREATEST(0, COALESCE((instant_wins->>'fourTwos')::int, 0) + p_four_twos_inc))
                ),
                '{flushHand}',
                to_jsonb(GREATEST(0, COALESCE((instant_wins->>'flushHand')::int, 0) + p_flush_hand_inc))
            ),
            '{threeTriplets}',
            to_jsonb(GREATEST(0, COALESCE((instant_wins->>'threeTriplets')::int, 0) + p_three_triplets_inc))
        ),
        '{fivePairs}',
        to_jsonb(GREATEST(0, COALESCE((instant_wins->>'fivePairs')::int, 0) + p_five_pairs_inc))
    ),
    updated_at = NOW()
    WHERE user_id = p_user_id
    RETURNING user_id, total_games, total_wins, win_rate, instant_wins, created_at, updated_at;
$$;

GRANT EXECUTE ON FUNCTION update_sam_stats_instant_wins(int, int, int, int, int, int) TO anon, authenticated, service_role;

CREATE TABLE IF NOT EXISTS user_statistics_phom (
    user_id INTEGER PRIMARY KEY REFERENCES users (id) ON DELETE CASCADE,
    total_games INTEGER NOT NULL DEFAULT 0,
    total_wins INTEGER NOT NULL DEFAULT 0,
    instant_wins JSONB NOT NULL DEFAULT '{}',
    win_rate REAL NOT NULL DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);