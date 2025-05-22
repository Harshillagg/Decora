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

//route import
// import userRouter from "./routes/user.routes.js"

//api route declaration
// app.use("/api/v1/users", userRouter) //this will go as localhost:8000/api/v1/user/... rest will be from userRouter

export default app