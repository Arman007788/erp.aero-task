import bcrypt from "bcrypt";
import { UserEntity } from "../entities/user.entity";
import { ResponseStatus } from "../interfaces/common.interface";
import {
  JwtProps,
  SigninProps,
  SignupProps,
} from "../interfaces/user.interface";
import { UserRepository } from "../repositories/user.repoitory";
import { ApiService } from "./index.service";
import { AppError } from "../utils/AppError";
import { EMAIL_ALREADY_EXIST, INTERNAL, PHONE_NUMBER_ALREADY_EXIST, UNKNOWN, USER_NOT_FOUND, WRONG_CREDENTIALS, WRONG_EMAIL_OR_PHONE } from "../constants/errorMessages.constants";

export class UserService {
  private apiServices: ApiService;
  private userRepository: UserRepository;

  constructor(apiServices: ApiService) {
    this.apiServices = apiServices;
    this.userRepository = new UserRepository();
  }

  public signup = async (payload: SignupProps): Promise<UserEntity> => {
    try {
      const { email, phoneNumber } = payload;
      const userBySameEmail = await this.userRepository.findByEmail(email);

      if (userBySameEmail) {
        throw new AppError(
          EMAIL_ALREADY_EXIST,
          ResponseStatus.BAD_REQUEST
        );
      }

      const userByPhoneNumber =
        await this.userRepository.findByPhoneNumber(phoneNumber);

      if (userByPhoneNumber) {
        throw new AppError(
          PHONE_NUMBER_ALREADY_EXIST,
          ResponseStatus.BAD_REQUEST
        );
      }

      payload.password = await bcrypt.hash(payload.password, 10);
      const createdUser = await this.userRepository.createUser(payload);

      if (!createdUser) {
        throw new AppError(UNKNOWN, ResponseStatus.INTERNAL);
      }

      return createdUser;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(INTERNAL, ResponseStatus.INTERNAL);
    }
  };

  public signin = async (payload: SigninProps) => {
    try {
      const { id, password } = payload;
      const user = await this.userRepository.findByEmailOrPhoneNumber(id);

      if (!user) {
        throw new AppError(
          WRONG_EMAIL_OR_PHONE,
          ResponseStatus.UNAUTORIZED
        );
      }

      const passIsValid = await bcrypt.compare(password, user.password);

      if (!passIsValid) {
        throw new AppError(WRONG_CREDENTIALS, ResponseStatus.UNAUTORIZED);
      }

      const tokens =
        this.apiServices.authenticationService.generateTokens(user);

      await this.apiServices.tokenService.create(tokens, user);

      return {
        ...tokens,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(INTERNAL, ResponseStatus.INTERNAL);
    }
  };

  public logout = async (accessToken: string) => {
    try {
      return await this.apiServices.tokenService.deactivateToken(accessToken);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(INTERNAL, ResponseStatus.INTERNAL);
    }
  };

  public info = async (jwtProps: JwtProps): Promise<number> => {
    try {
      return jwtProps.id;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(INTERNAL, ResponseStatus.INTERNAL);
    }
  };

  public findUserById = async (userId: number): Promise<UserEntity> => {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new AppError(USER_NOT_FOUND, ResponseStatus.BAD_REQUEST);
      }
      return user;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(INTERNAL, ResponseStatus.INTERNAL);
    }
  };
}
