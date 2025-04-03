import {createClient} from "redis";
import session from "express-session";
import * as connectRedis from "connect-redis"; // Import everything

import {config} from "dotenv";
import {log} from "../lib/utils";

config({path: ".env.local"});

// Create Redis client
const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.connect().catch((err) => {
  log("Redis connection error:", err, "error");
});

redisClient.on("error", (err) => {
  log("Redis Client Error:", err, "error");
});

// Create a session store
const initializeRedisStore = (client: ReturnType<typeof createClient>, prefix: string) => {
  const getRedisStore = (connectRedis as any).default(session);
  return new getRedisStore({client, prefix});
};

export const createNewSessionStore = () => {
  const sessionStore = initializeRedisStore(redisClient, "game-session:");
  return sessionStore;
};


export default redisClient;
