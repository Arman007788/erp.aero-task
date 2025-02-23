import { AppDataSource } from "../config/data-source";
import { Repository } from "typeorm";
import { TokenEntity } from "../entities/token.entity";
import { CreateTokenProps } from "../interfaces/token.interface";
import { UserEntity } from "../entities/user.entity";

export class TokenRepository {
  private repo: Repository<TokenEntity>;

  constructor() {
    this.repo = AppDataSource.getRepository(TokenEntity);
  }

  async create(data: CreateTokenProps, user: UserEntity): Promise<TokenEntity | null> {
    const tokens = this.repo.create({ ...data, user: user });
    return this.repo.save(tokens);
  }

  async deactivate(accessToken: string): Promise<void> {
    this.repo.update({ accessToken: accessToken }, { active: false });
  }

  async updateToken(refreshToken: string, accessToken: string): Promise<void> {
    this.repo.update({ refreshToken }, { accessToken });
  }

  async findActiveToken(accessToken: string): Promise<TokenEntity | null> {
    return this.repo.findOne({ where: { accessToken, active: true } });
  }
}
