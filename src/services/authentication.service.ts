import { JwtPayload, sign, verify } from "jsonwebtoken";
import * as fs from "fs";
import * as path from "path";
import { ApiService } from "./index.service";
import { UserEntity } from "../entities/user.entity";
import { AppError } from "../utils/AppError";
import { ResponseStatus } from "../interfaces/common.interface";
import {
  INVALID_REFRESH_TOKEN,
  TOKEN_NOT_GENERATED,
} from "../constants/errorMessages.constants";

export class AuthenticationService {
  private apiServices: ApiService;

  private accessTokenPrivateKey = fs.readFileSync(
    path.join(__dirname, "./../../private.pem")
  );

  private refreshTokenPrivateKey = fs.readFileSync(
    path.join(__dirname, "./../../refresh_private.pem")
  );

  private refreshTokenPublicKey = fs.readFileSync(
    path.join(__dirname, "./../../refresh_public.pem")
  );

  constructor(apiServices: ApiService) {
    this.apiServices = apiServices;
  }

  public generateTokens = (
    user: UserEntity
  ): { accessToken: string; refreshToken: string } => {
    try {
      const payload = { id: user.id };

      const accessToken = sign(payload, this.accessTokenPrivateKey, {
        algorithm: "RS256",
        expiresIn: "10m",
      });

      const refreshToken = sign(payload, this.refreshTokenPrivateKey, {
        algorithm: "RS256",
        expiresIn: "10m",
      });

      return { accessToken, refreshToken };
    } catch (error) {
      throw new AppError(TOKEN_NOT_GENERATED, ResponseStatus.UNAUTORIZED);
    }
  };

  public refreshAccessToken = async (refreshToken: string): Promise<string> => {
    try {
      const decoded = verify(
        refreshToken,
        this.refreshTokenPublicKey
      ) as JwtPayload;

      const newAccessToken = sign(
        { id: decoded.id },
        this.accessTokenPrivateKey,
        {
          algorithm: "RS256",
          expiresIn: "10m",
        }
      );
      await this.apiServices.tokenService.updateTokenByRefreshToken(
        refreshToken,
        newAccessToken
      );
      return newAccessToken;
    } catch (error) {
      throw new AppError(INVALID_REFRESH_TOKEN, ResponseStatus.UNAUTORIZED);
    }
  };
}
