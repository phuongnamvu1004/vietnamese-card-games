-- 1) Enums
CREATE TYPE room_player_status AS ENUM ('host','invited','accepted','declined','left','kicked');
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

CREATE TYPE invitation_status AS ENUM ('pending','accepted','declined','canceled','expired');

CREATE TABLE room_invitations
(
    id              UUID PRIMARY KEY           DEFAULT gen_random_uuid(),

    room_id         INTEGER           NOT NULL REFERENCES rooms (id) ON DELETE CASCADE,
    inviter_user_id INTEGER           NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    invitee_user_id INTEGER           NOT NULL REFERENCES users (id) ON DELETE CASCADE,

    status          invitation_status NOT NULL DEFAULT 'pending',
    token           TEXT              NOT NULL, -- opaque or JWT
    expires_at      TIMESTAMPTZ       NOT NULL,
    created_at      TIMESTAMPTZ       NOT NULL DEFAULT NOW(),

    -- Only 1 pending invite per (room, invitee)
    CONSTRAINT uq_room_invitee_pending UNIQUE (room_id, invitee_user_id)
        DEFERRABLE INITIALLY IMMEDIATE
);

-- Optional helper indexes
CREATE INDEX idx_room_inv_room ON room_invitations (room_id);
CREATE INDEX idx_room_inv_invitee ON room_invitations (invitee_user_id);
CREATE INDEX idx_room_inv_status ON room_invitations (status);