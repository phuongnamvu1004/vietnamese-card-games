import express from "express";
import authRouter from "./routes/auth.routes"

const app = express()

app.use("/api/auth", authRouter);

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
})