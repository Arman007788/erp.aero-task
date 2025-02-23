import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { UNKNOWN } from "../constants/errorMessages.constants";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err instanceof Error ? err.message : UNKNOWN;

  res.status(statusCode).json({
    success: false,
    error: message,
  });
};
