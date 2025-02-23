import { NextFunction, Request, Response } from "express";
import { splitJwt, validateToken } from "../utils/jwt";
import { ApiService } from "../services/index.service";
import * as Yup from "yup";
import { AppError } from "../utils/AppError";
import { ResponseStatus } from "../interfaces/common.interface";
import { JwtProps } from "../interfaces/user.interface";
import { INVALID_TOKEN, TOKEN_DEACTIVATED, TOKEN_NOT_FOUND } from "../constants/errorMessages.constants";

const apiService = new ApiService();
const tokenService = apiService.tokenService;

declare global {
  namespace Express {
    interface Request {
      user: JwtProps;
      accessToken: string;
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let jwt = req.headers.authorization;

    if (!jwt) {
      throw new AppError(TOKEN_NOT_FOUND, ResponseStatus.UNAUTORIZED);
    }

    jwt = splitJwt(jwt);

    const isActive = await tokenService.isActive(jwt);
    if (!isActive) {
      throw new AppError(
        TOKEN_DEACTIVATED,
        ResponseStatus.UNAUTORIZED
      );
    }

    const decodedUser = await validateToken(jwt);

    if (!decodedUser) {
      throw new AppError(INVALID_TOKEN, ResponseStatus.UNAUTORIZED);
    }

    req.user = decodedUser;
    req.accessToken = jwt;

    next();
  } catch (error) {
    if (error instanceof Error) {
      if (error instanceof Yup.ValidationError) {
        res.status(400).json({
          success: false,
          error: error.errors.join(", "),
        });
      } else {
        next(error);
      }
    }
  }
};
