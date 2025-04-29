import axios from "axios";
import { config } from "dotenv";

config({ path: ".env.local" });

export const axiosInstance = axios.create({
  baseURL: process.env.BACKEND_URL,
  timeout: 1000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

