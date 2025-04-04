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