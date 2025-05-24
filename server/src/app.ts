import express from "express";
import cors from "cors";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

// Middleware to parse cookies
// app.use(cookieParser());

import userRouter from "./routes/user.route"

app.use("/api/user", userRouter)

export default app