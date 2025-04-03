CREATE TABLE user_statistics_sam
(
    id           SERIAL PRIMARY KEY,
    user_id      INTEGER NOT NULL REFERENCES users (id),
    total_games  INTEGER NOT NULL         DEFAULT 0,
    total_wins   INTEGER NOT NULL         DEFAULT 0,
    instant_wins JSONB   NOT NULL         DEFAULT '{}',
    win_rate     REAL    NOT NULL         DEFAULT 0.0,
    created_at   TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
