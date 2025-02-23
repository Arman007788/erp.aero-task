import { NextFunction, Request, Response } from "express";
import * as Yup from "yup";
import {
  confirmPasswordSchema,
  emailSchema,
  idSchema,
  nameSchema,
  passwordSchema,
  phoneNumberSchema,
  refreshTokenSchema,
} from "../../utils/yup-schema";

const signupValidationYup = Yup.object().shape({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: confirmPasswordSchema,
  phoneNumber: phoneNumberSchema,
});

const signinValidationYup = Yup.object().shape({
  id: idSchema,
  password: passwordSchema,
});

const refreshTokenValidationYup = Yup.object().shape({
  refreshToken: refreshTokenSchema,
});

export const signupValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await signupValidationYup.validate(req.body);
    next();
  } catch (error) {
    if (error instanceof Yup.ValidationError) {
      res.status(400).json({
        success: false,
        error: error.errors.join(", "),
      });
    } else {
      next(error);
    }
  }
};

export const signinValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await signinValidationYup.validate(req.body);
    next();
  } catch (error) {
    if (error instanceof Yup.ValidationError) {
      res.status(400).json({
        success: false,
        error: error.errors.join(", "),
      });
    } else {
      next(error);
    }
  }
};

export const refreshTokenValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await refreshTokenValidationYup.validate(req.body);
    next();
  } catch (error) {
    if (error instanceof Yup.ValidationError) {
      res.status(400).json({
        success: false,
        error: error.errors.join(", "),
      });
    } else {
      next(error);
    }
  }
};
