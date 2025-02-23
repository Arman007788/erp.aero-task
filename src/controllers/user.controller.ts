import { NextFunction, Request, Response } from "express";
import { ResponseStatus } from "../interfaces/common.interface";
import { ApiService } from "../services/index.service";

export class User {
  private apiServices: ApiService;

  constructor(apiServices: ApiService) {
    this.apiServices = apiServices;
  }

  public info = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const response = await this.apiServices.userService.info(req.user);
      res.status(ResponseStatus.SUCCESS).json(response);
    } catch (error) {
      next(error);
    }
  };
}
