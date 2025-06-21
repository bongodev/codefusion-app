import type { Request, Response, NextFunction } from "express";
import envConfig from "../config/envConfig";

export const requestLogger = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  if (envConfig.IS_DEVELOPMENT) {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  }
  next();
};
