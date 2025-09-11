CREATE TABLE rooms
(
    id            SERIAL PRIMARY KEY,                              -- Auto-incremented unique ID
    room_id       VARCHAR(255) UNIQUE NOT NULL,                    -- Public room code
    host_user_id  INTEGER REFERENCES users(id),                    -- Host user (FK to users table)
    game_type     VARCHAR(50) NOT NULL CHECK (game_type IN ('sam', 'phom')), -- Game type constraint
    max_players   INTEGER NOT NULL DEFAULT 4,                      -- Max number of players
    buy_in        INTEGER NOT NULL,                                -- Entry cost
    bet_unit      INTEGER NOT NULL,                                -- Amount bet per unit/round
    players       INTEGER[] DEFAULT '{}',                          -- Array of user IDs in the room
    is_online     BOOLEAN DEFAULT FALSE,                           -- Room status (open/closed)
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,             -- Creation timestamp
    updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP              -- Update timestamp
);


-- To store players, we can use a JOIN table or an array of user references
CREATE TABLE room_players
(
    room_id INTEGER REFERENCES rooms (id),
    user_id INTEGER REFERENCES users (id),
    PRIMARY KEY (room_id, user_id)
);