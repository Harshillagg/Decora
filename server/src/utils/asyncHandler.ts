import { Response, NextFunction, RequestHandler } from "express";
import CustomRequest from "../types/customRequest";

const asyncHandler = (requestHandler: (req: CustomRequest, res: Response, next: NextFunction) => Promise<any>): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch(next);
  };

export default asyncHandler;
