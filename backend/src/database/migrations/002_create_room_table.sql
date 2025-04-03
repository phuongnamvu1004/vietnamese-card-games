CREATE TABLE rooms (
  id SERIAL PRIMARY KEY,  -- PostgreSQL equivalent of _id
  room_id VARCHAR(255) UNIQUE NOT NULL,
  host_user_id INTEGER REFERENCES users(id),  -- Foreign Key to users table
  game_type VARCHAR(50) NOT NULL CHECK (game_type IN ('sam', 'phom')),
  max_players INTEGER DEFAULT 4 NOT NULL,
  buy_in INTEGER NOT NULL,
  value_per_point INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- To store players, we can use a JOIN table or an array of user references
CREATE TABLE room_players (
  room_id INTEGER REFERENCES rooms(id),
  user_id INTEGER REFERENCES users(id),
  PRIMARY KEY (room_id, user_id)
);