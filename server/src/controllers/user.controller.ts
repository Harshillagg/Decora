import jwt from "jsonwebtoken";
import User from "../models/user.model";
import type { Request, Response } from "express";
import { uploadOnCloudinary } from "../utils/cloudinary";
import CustomRequest from "../types/customRequest";
import asyncHandler from "../utils/asyncHandler";

const generateAuthToken = async (id: string) => {
  try {
    const user = await User.findById(id);

    if (!user) return null;

    const token = jwt.sign(
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      process.env.TOKEN_SECRET as string,
      { expiresIn: "30d" }
    );

    return token;
  } catch (error) {
    console.log("error in generating token : ", error);
    return null;
  }
};

export const registerUser = asyncHandler(async (req: CustomRequest, res: Response) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser)
      return res.status(404).json({
        success: false,
        message: "User already exists",
      });

    const avatarLocalPath = req.files && !Array.isArray(req.files) && req.files?.avatar?.[0]?.path;

    const avatar = avatarLocalPath
      ? await uploadOnCloudinary(avatarLocalPath)
      : null;

    const user = await User.create({
      avatar: avatar?.url || "",
      email,
      password,
      name: name.toLowerCase(),
    });

    const createdUser = await User.findById(user._id).select("-password");

    if (!createdUser)
      return res.status(404).json({
        success: false,
        message: "something went wrong while registering user",
      });

    const userId = createdUser._id?.toString();

    const token = await generateAuthToken(userId as string);

    return res.status(200).json({
      user: createdUser,
      token: token,
      message: "User created successfully",
    });
  } catch (error) {
    console.log("error in registering user : ", error);
    return res.status(500).json({
      success: false,
      message: "Server Error while registering",
    });
  }
});

export const loginUser = asyncHandler( async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(401).json({ message: "User does not exist" });

    // Check if password matches
    const isMatch = await user.comparePassword(password);

    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const createdUser = await User.findById(user._id).select("-password");

    if (!createdUser)
      return res.status(404).json({
        success: false,
        message: "something went wrong while registering user",
      });

    const userId = createdUser._id?.toString();

    const token = await generateAuthToken(userId as string);

    return res.status(200).json({
      user: createdUser,
      token: token,
      message: "User logged in successfully",
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export const getCurrentUser = asyncHandler(async (req: CustomRequest, res: Response) => {
  return res
    .status(200)
    .json({ message: "User fetched successfully", user: req.user });
});
