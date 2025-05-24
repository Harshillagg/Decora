import { Request } from "express";
import { UserProps } from "../models/user.model";

interface CustomRequest extends Request {
  user?: UserProps; 
  files?: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] };
}

export default CustomRequest;