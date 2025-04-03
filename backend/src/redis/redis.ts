import { createClient } from "redis";

import { config } from "dotenv";
import { log } from "../lib/utils";

config({ path: ".env.local" });
// Initialize Redis client
const redisClient = createClient({
    url: process.env.REDIS_URL,
});

redisClient.connect().catch((err) => {
    log("Redis connection error:", err, "error");
});

redisClient.on("error", (err) => {
    log("Redis Client Error:", err, "error");
})

export default redisClient;