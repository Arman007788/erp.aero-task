import { NextFunction, Request, Response } from "express";
import { ResponseStatus } from "../interfaces/common.interface";
import { ApiService } from "../services/index.service";
import { AppError } from "../utils/AppError";
import { PaginationProps } from "../interfaces/file.interface";

export class File {
  private apiServices: ApiService;

  constructor(apiServices: ApiService) {
    this.apiServices = apiServices;
  }

  public upload = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.files) {
        throw new AppError("No files uploaded", ResponseStatus.BAD_REQUEST);
      }
      const response = await this.apiServices.fileService.upload(
        req.files,
        req.user.id
      );
      res.status(ResponseStatus.SUCCESS).json(response);
    } catch (error) {
      next(error);
    }
  };

  public update = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.files) {
        throw new AppError("No files uploaded", ResponseStatus.BAD_REQUEST);
      }

      const response = await this.apiServices.fileService.upload(
        req.files,
        req.user.id,
        Number(req.params.id)
      );
      res.status(ResponseStatus.SUCCESS).json(response);
    } catch (error) {
      next(error);
    }
  };

  public delete = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const response = await this.apiServices.fileService.delete(
        Number(req.params.id),
        req.user.id
      );
      res.status(ResponseStatus.SUCCESS).json(response);
    } catch (error) {
      next(error);
    }
  };

  public list = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const paginationParams: PaginationProps = {
        list_size: (req.query.list_size as string) || "10",
        page: (req.query.page as string) || "1",
      };
      const response = await this.apiServices.fileService.getList(
        req.user.id,
        paginationParams
      );
      res.status(ResponseStatus.SUCCESS).json(response);
    } catch (error) {
      next(error);
    }
  };

  public download = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { path, name } = await this.apiServices.fileService.download(
        Number(req.params.id),
        req.user.id
      );
      res.download(path, name);
    } catch (error) {
      next(error);
    }
  };

  public get = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const response = await this.apiServices.fileService.get(
        Number(req.params.id),
        req.user.id
      );
      res.status(ResponseStatus.SUCCESS).json(response);
    } catch (error) {
      next(error);
    }
  };
}
