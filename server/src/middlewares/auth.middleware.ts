import type { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import CustomRequest from "../types/customRequest";
import asyncHandler from "../utils/asyncHandler";

interface JwtPayload {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export const verifyJwt = asyncHandler( async (req:CustomRequest, res:Response, next: NextFunction) => {
    try{
        const token = req.header("Authorization")?.split(" ")[1];

        if(!token) return res.status(401).json({ message: "Unauthorized" });
        
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET as string) as JwtPayload;
        
        const user = await User.findById(decodedToken?._id).select("-password");
        
        if(!user) return res.status(401).json({ message: "Unauthorized" });
        
        req.user = user;
        
        next();
    }
    catch(error){
        return res.status(401).json({ message: error || "Unauthorized" });
    }
})

export const verifyAdmin = (req:CustomRequest, res:Response, next: NextFunction) => {
    if(req.user?.role !== "admin") return res.status(403).json({ message: "Forbidden" });
    next();
}