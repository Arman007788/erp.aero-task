import { AuthenticationService } from "./authentication.service";
import { FileService } from "./file.service";
import { TokenService } from "./token.service";
import { UserService } from "./user.service";
export class ApiService {
  public userService;
  public authenticationService;
  public tokenService;
  public fileService;

  constructor() {
    this.userService = new UserService(this);
    this.authenticationService = new AuthenticationService(this);
    this.tokenService = new TokenService();
    this.fileService = new FileService(this);
  }
}
