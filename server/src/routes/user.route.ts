import { Router } from "express";
import upload from "../middlewares/multer.middleware";
import { getCurrentUser, loginUser, registerUser } from "../controllers/user.controller";
import { verifyJwt } from "../middlewares/auth.middleware";

const userRouter = Router()

userRouter.route("/register").post(
    upload.fields([{
        name: "avatar",
        maxCount: 1
    }]),

    registerUser
)

userRouter.route("/login").post(loginUser)

userRouter.route("/current-user").get(verifyJwt, getCurrentUser)

export default userRouter