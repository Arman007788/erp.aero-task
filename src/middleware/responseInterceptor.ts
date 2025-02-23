import { Response, Request, NextFunction } from "express";

export const responseInterceptor = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const originalJson = res.json;

  res.json = function (data: any) {
    if (res.statusCode >= 400) {
      return originalJson.call(this, data);
    }

    return originalJson.call(this, { success: true, data });
  };

  next();
};
