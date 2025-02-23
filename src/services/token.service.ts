import { UserEntity } from "../entities/user.entity";
import { ResponseStatus } from "../interfaces/common.interface";
import { AppError } from "../utils/AppError";
import { TokenRepository } from "../repositories/token.repoitory";
import { TokenEntity } from "../entities/token.entity";
import { CreateTokenProps } from "../interfaces/token.interface";
import { INTERNAL, UNKNOWN } from "../constants/errorMessages.constants";

export class TokenService {
  private tokenRepository: TokenRepository;

  constructor() {
    this.tokenRepository = new TokenRepository();
  }

  public create = async (
    payload: CreateTokenProps,
    user: UserEntity
  ): Promise<TokenEntity> => {
    try {
      const tokens = await this.tokenRepository.create(payload, user);

      if (!tokens) {
        throw new AppError(UNKNOWN, ResponseStatus.INTERNAL);
      }

      return tokens;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(INTERNAL, ResponseStatus.INTERNAL);
    }
  };

  public deactivateToken = async (accessToken: string): Promise<boolean> => {
    try {
      await this.tokenRepository.deactivate(accessToken);
      return true;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(INTERNAL, ResponseStatus.INTERNAL);
    }
  };

  public isActive = async (accessToken: string): Promise<TokenEntity | null> => {
    try {
      return await this.tokenRepository.findActiveToken(accessToken);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(INTERNAL, ResponseStatus.INTERNAL);
    }
  };

  public updateTokenByRefreshToken = async (
    refreshToken: string,
    accessToken: string
  ): Promise<void> => {
    try {
      await this.tokenRepository.updateToken(refreshToken, accessToken);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(INTERNAL, ResponseStatus.INTERNAL);
    }
  };
}
