import { AppDataSource } from "../config/data-source";
import { DeleteResult, Repository } from "typeorm";
import { FileEntity } from "../entities/file.entity";
import {
  FileListResponseProps,
  PaginationProps,
} from "../interfaces/file.interface";

export class FileRepository {
  private repo: Repository<FileEntity>;

  constructor() {
    this.repo = AppDataSource.getRepository(FileEntity);
  }

  async create(data: Partial<FileEntity>): Promise<FileEntity> {
    const user = this.repo.create(data);
    return this.repo.save(user);
  }

  async update(id: number, userId: number, data: Partial<FileEntity>) {
    return await this.repo.update(
      { id: id, user: { id: userId } },
      { ...data }
    );
  }

  async getList(
    userId: number,
    pagination: PaginationProps
  ): Promise<FileListResponseProps> {
    const limit = Number(pagination.list_size);
    const page = Number(pagination.page);
    const [data, total] = await this.repo.findAndCount({
      where: { user: { id: userId } },
      take: limit,
      skip: (page - 1) * limit,
    });
    return {
      total,
      data,
    };
  }

  async delete(id: number, userId: number): Promise<DeleteResult> {
    return await this.repo.delete({ id: id, user: { id: userId } });
  }

  async findById(id: number, userId: number): Promise<FileEntity | null> {
    return await this.repo.findOne({ where: { id: id, user: { id: userId } } });
  }
}
