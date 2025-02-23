import { NextFunction, Request, Response } from "express";
import * as Yup from "yup";
import {
  numbericQueryParamSchema,
  uniqueIdSchema,
} from "../../utils/yup-schema";

const idValidationYup = Yup.object().shape({
  id: uniqueIdSchema,
});

const pagintaionValidationYup = Yup.object().shape({
  list_size: numbericQueryParamSchema,
  page: numbericQueryParamSchema,
});

export const idParamValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await idValidationYup.validate(req.params);
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

export const paginationValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await pagintaionValidationYup.validate(req.query);
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
