-- users table
CREATE TABLE users
(
    id          SERIAL PRIMARY KEY, -- PostgreSQL equivalent of _id
    email       VARCHAR(255) UNIQUE NOT NULL,
    full_name   VARCHAR(255)        NOT NULL,
    password    VARCHAR(255)        NOT NULL,
    profile_pic VARCHAR(255) DEFAULT '',
    balance     INTEGER      DEFAULT 1000,
    created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- Atomic balance increment function
DROP FUNCTION IF EXISTS add_to_user_balance(int, int);
CREATE
OR REPLACE FUNCTION add_to_user_balance(p_user_id int, p_delta int)
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
SET balance    = balance + p_delta,
    updated_at = NOW()
WHERE id = p_user_id RETURNING id, email, full_name, profile_pic, balance, created_at, updated_at;
$$;

-- Optional: grant execute to common Supabase roles (adjust as needed)
GRANT
EXECUTE
ON
FUNCTION
add_to_user_balance
(int, int) TO anon, authenticated, service_role;

-- rooms table
CREATE TABLE rooms
(
    id           SERIAL PRIMARY KEY,                                                -- Auto-incremented unique ID
    room_id      VARCHAR(255) UNIQUE NOT NULL,                                      -- Public room code
    host_user_id INTEGER REFERENCES users (id),                                     -- Host user (FK to users table)
    game_type    VARCHAR(50)         NOT NULL CHECK (game_type IN ('sam', 'phom')), -- Game type constraint
    max_players  INTEGER             NOT NULL DEFAULT 4,                            -- Max number of players
    buy_in       INTEGER             NOT NULL,                                      -- Entry cost
    bet_unit     INTEGER             NOT NULL,                                      -- Amount bet per unit/round
    created_at   TIMESTAMP                    DEFAULT CURRENT_TIMESTAMP,            -- Creation timestamp
    updated_at   TIMESTAMP                    DEFAULT CURRENT_TIMESTAMP             -- Update timestamp
);

-- To store the game log
CREATE TABLE game_logs
(
    id        SERIAL PRIMARY KEY,
    room_id   INTEGER REFERENCES rooms (id),
    player_id INTEGER REFERENCES users (id),
    action    VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- room_players and room_invitations tables
CREATE TYPE room_player_status AS ENUM ('host', 'invited', 'accepted', 'declined', 'canceled', 'joined', 'left', 'kicked');
CREATE TABLE room_players
(
    room_id    INTEGER            NOT NULL REFERENCES rooms (id) ON DELETE CASCADE,
    user_id    INTEGER            NOT NULL REFERENCES users (id) ON DELETE CASCADE,

    status     room_player_status NOT NULL, -- host / invited / accepted / ...
    invited_by INTEGER REFERENCES users (id),
    invited_at TIMESTAMPTZ,
    joined_at  TIMESTAMPTZ,

    PRIMARY KEY (room_id, user_id)
);

-- Helpful indexes (lookups by room or user)
CREATE INDEX idx_room_players_room ON room_players (room_id);
CREATE INDEX idx_room_players_user ON room_players (user_id);
CREATE INDEX idx_room_players_status ON room_players (status);


-- invitation table
CREATE TYPE invitation_status AS ENUM ('pending','accepted','declined','canceled','expired');
CREATE TABLE invitations
(
    invitor_id   INTEGER           NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    invitee_id   INTEGER           NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    room_id      INTEGER           NOT NULL REFERENCES rooms (id) ON DELETE CASCADE,
    invite_token VARCHAR(255)      NOT NULL,
    status       invitation_status NOT NULL DEFAULT 'pending',
    created_at   TIMESTAMPTZ,
    expired_at   TIMESTAMPTZ,
    updated_at   TIMESTAMPTZ,

    PRIMARY KEY (invitor_id, invitee_id, room_id)
)

CREATE INDEX idx_invitations_invite_token ON invitations (invite_token);

-- user_statistics tables for different game types
CREATE TABLE user_statistics_sam
(
    user_id      INTEGER PRIMARY KEY REFERENCES users (id) ON DELETE CASCADE,
    total_games  INTEGER NOT NULL         DEFAULT 0,
    total_wins   INTEGER NOT NULL         DEFAULT 0,
    instant_wins JSONB   NOT NULL         DEFAULT '{}',
    win_rate     REAL    NOT NULL         DEFAULT 0.0,
    created_at   TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Helper RPC function to update total_wins, total_games and win_rate
DROP FUNCTION IF EXISTS update_sam_stats_wins(int, int, int);

CREATE
OR REPLACE FUNCTION update_sam_stats_wins(
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
SET total_wins  = total_wins + p_wins_inc,
    total_games = total_games + p_games_inc,
    win_rate    = CASE
                      WHEN (total_games + p_games_inc) > 0
                          THEN ROUND(((total_wins + p_wins_inc):: numeric / (total_games + p_games_inc):: numeric ) * 100, 2)
                      ELSE 0
        END,
    updated_at  = NOW()
WHERE user_id = p_user_id RETURNING user_id, total_games, total_wins, win_rate, instant_wins, created_at, updated_at;
$$;

-- Optional: grant Supabase roles

GRANT
EXECUTE
ON
FUNCTION
update_sam_stats_wins
(int, int, int) TO anon, authenticated, service_role;

-- Helper RPC function to increment instant_wins JSON counters
DROP FUNCTION IF EXISTS update_sam_stats_instant_wins(int, int, int, int, int, int);

CREATE
OR REPLACE FUNCTION update_sam_stats_instant_wins(
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

-- Optional: grant Supabase roles
GRANT EXECUTE ON FUNCTION update_sam_stats_instant_wins (int, int, int, int, int, int) TO anon, authenticated, service_role;

CREATE TABLE user_statistics_phom
(
    user_id      INTEGER primary key references users (id) on delete CASCADE,
    total_games  INTEGER not null         default 0,
    total_wins   INTEGER not null         default 0,
    instant_wins JSONB   not null         default '{}',
    win_rate     REAL    not null         default 0.0,
    created_at   timestamp with time zone default CURRENT_TIMESTAMP,
    updated_at   timestamp with time zone default CURRENT_TIMESTAMP
);