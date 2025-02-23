import { FileArray, UploadedFile } from "express-fileupload";
import { ResponseStatus } from "../interfaces/common.interface";
import { AppError } from "../utils/AppError";
import { ApiService } from "./index.service";
import { promises as fs } from "fs";
import path from "path";
import { FileRepository } from "../repositories/file.repoitory";
import { FileEntity } from "../entities/file.entity";
import { DeleteResult } from "typeorm";
import {
  FileDowloadResponseProps,
  FileListResponseProps,
  PaginationProps,
} from "../interfaces/file.interface";
import { FILE_NOT_FOUND, FILE_UPLOAD_FAIL, INTERNAL, UPLOAD_SINGLE_FILE } from "../constants/errorMessages.constants";

export class FileService {
  private apiServices: ApiService;
  private fileRepository: FileRepository;

  constructor(apiServices: ApiService) {
    this.apiServices = apiServices;
    this.fileRepository = new FileRepository();
  }

  public upload = async (
    files: FileArray,
    userId: number,
    fileId?: number
  ): Promise<FileEntity> => {
    try {
      if (Array.isArray(files.file)) {
        throw new AppError(
          UPLOAD_SINGLE_FILE,
          ResponseStatus.BAD_REQUEST
        );
      }

      const file = files.file as UploadedFile;
      const uniqueName = `${Date.now()}_${file.name}`;
      const { name, ext } = path.parse(file.name);
      const user = await this.apiServices.userService.findUserById(userId);

      const existingFile: FileEntity | null = fileId
        ? await this.fileRepository.findById(fileId, user.id)
        : null;

      if (fileId && !existingFile) {
        throw new AppError(FILE_NOT_FOUND, ResponseStatus.NOT_FOUND);
      }

      await this.saveFileToDisk(file, uniqueName);

      let result: FileEntity | null;
      const fileData = {
        name: uniqueName,
        mimeType: file.mimetype,
        extension: ext,
        originalName: name,
        size: file.size,
        user: user,
      };

      if (!fileId) {
        result = await this.fileRepository.create(fileData);
      } else {
        await this.deleteOldFile(existingFile!.name);
        await this.fileRepository.update(fileId, user.id, fileData);
        result = await this.fileRepository.findById(fileId, user.id);
      }

      if (!result) {
        throw new AppError(FILE_NOT_FOUND, ResponseStatus.NOT_FOUND);
      }

      return result;
    } catch (error) {
      throw error instanceof AppError
        ? error
        : new AppError(INTERNAL, ResponseStatus.INTERNAL);
    }
  };

  private async saveFileToDisk(
    file: UploadedFile,
    uniqueName: string
  ): Promise<string> {
    try {
      const filePath = `${__dirname}/../../public/${uniqueName}`;
      await fs.writeFile(filePath, file.data);
      return filePath;
    } catch (err) {
      throw new AppError(FILE_UPLOAD_FAIL, ResponseStatus.BAD_REQUEST);
    }
  }

  private async deleteOldFile(fileName: string): Promise<void> {
    try {
      const filePath = `${__dirname}/../../public/${fileName}`;
      await fs.unlink(filePath);
    } catch (err) {
      console.warn(`Failed to delete old file: ${fileName}`, err);
    }
  }

  public delete = async (id: number, userId: number): Promise<DeleteResult> => {
    try {
      const file = await this.fileRepository.findById(id, userId);

      if (!file) {
        throw new AppError(FILE_NOT_FOUND, ResponseStatus.NOT_FOUND);
      }
      await this.deleteOldFile(file.name);
      return await this.fileRepository.delete(id, userId);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(INTERNAL, ResponseStatus.INTERNAL);
    }
  };

  public getList = async (
    userId: number,
    pagination: PaginationProps
  ): Promise<FileListResponseProps> => {
    try {
      return await this.fileRepository.getList(userId, pagination);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(INTERNAL, ResponseStatus.INTERNAL);
    }
  };

  public download = async (
    id: number,
    userId: number
  ): Promise<FileDowloadResponseProps> => {
    try {
      const file = await this.fileRepository.findById(id, userId);

      if (!file) {
        throw new AppError(FILE_NOT_FOUND, ResponseStatus.NOT_FOUND);
      }

      const filePath = path.join(__dirname, "../../public/", file.name);
      await fs.access(filePath);

      return {
        path: filePath,
        name: file.originalName,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(INTERNAL, ResponseStatus.INTERNAL);
    }
  };

  public get = async (id: number, userId: number): Promise<FileEntity> => {
    try {
      const file = await this.fileRepository.findById(id, userId);

      if (!file) {
        throw new AppError(FILE_NOT_FOUND, ResponseStatus.NOT_FOUND);
      }

      return file;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(INTERNAL, ResponseStatus.INTERNAL);
    }
  };
}
