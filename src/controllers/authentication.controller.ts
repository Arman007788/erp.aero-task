import { NextFunction, Request, Response } from "express";
import { ResponseStatus } from "../interfaces/common.interface";
import { ApiService } from "../services/index.service";

export class Authentication {
  private apiServices: ApiService;

  constructor(apiServices: ApiService) {
    this.apiServices = apiServices;
  }

  public signup = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const response = await this.apiServices.userService.signup(req.body);
      res.status(ResponseStatus.CREATED).json(response);
    } catch (error) {
      next(error);
    }
  };

  public signin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const response = await this.apiServices.userService.signin(req.body);
      res.status(ResponseStatus.SUCCESS).json(response);
    } catch (error) {
      next(error);
    }
  };

  public logout = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const response = await this.apiServices.userService.logout(
        req.accessToken
      );
      res.status(ResponseStatus.SUCCESS).json(response);
    } catch (error) {
      next(error);
    }
  };

  public refreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const refreshToken = req.body.refreshToken;
      const reponse =
        await this.apiServices.authenticationService.refreshAccessToken(
          refreshToken
        );
      console.log(refreshToken);
      res.status(ResponseStatus.SUCCESS).json(reponse);
    } catch (error) {
      next(error);
    }
  };
}
