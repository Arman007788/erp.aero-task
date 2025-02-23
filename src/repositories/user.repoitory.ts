import { AppDataSource } from "../config/data-source";
import { Repository } from "typeorm";
import { UserEntity } from "../entities/user.entity";

export class UserRepository {
  private repo: Repository<UserEntity>;

  constructor() {
    this.repo = AppDataSource.getRepository(UserEntity);
  }

  async findById(id: number): Promise<UserEntity | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByEmailOrPhoneNumber(id: string): Promise<UserEntity | null> {
    return this.repo.findOne({ where: [{ email: id }, { phoneNumber: id }] });
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.repo.findOne({ where: { email } });
  }

  async findByPhoneNumber(phoneNumber: string): Promise<UserEntity | null> {
    return this.repo.findOne({ where: { phoneNumber } });
  }

  async createUser(userData: Partial<UserEntity>): Promise<UserEntity> {
    const user = this.repo.create(userData);
    return this.repo.save(user);
  }
}
