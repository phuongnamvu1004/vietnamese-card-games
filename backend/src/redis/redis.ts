import { createClient } from "redis";
import { RedisStore } from "connect-redis"; // ✅ Named import
import { config } from "dotenv";
import { log } from "../lib/utils";

config({path: ".env.local"});

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.connect().catch((err) => {
  log("Redis connection error:", err, "error");
});

redisClient.on("error", (err) => {
  log("Redis Client Error:", err, "error");
});

// ✅ Create and return session store
export const createNewSessionStore = () => {
  return new RedisStore({
    client: redisClient,
    prefix: "game-session:",
  });
};

export default redisClient;
