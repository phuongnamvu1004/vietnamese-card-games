-- To store the game log
CREATE TABLE game_logs (
  id SERIAL PRIMARY KEY,
  room_id INTEGER REFERENCES rooms(id),
  player_id INTEGER REFERENCES users(id),
  action VARCHAR(255) NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);