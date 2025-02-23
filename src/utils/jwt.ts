import { VerifyOptions, verify } from "jsonwebtoken";
import * as fs from "fs";
import * as path from "path";
import { JwtProps } from "../interfaces/user.interface";
import { INVALID_TOKEN_PAYLOAD } from "../constants/errorMessages.constants";


export const validateToken = (token: string): Promise<JwtProps> => {
  return new Promise((resolve, reject) => {
    try {
      const publicKey = fs.readFileSync(
        path.resolve(__dirname, "../../public.pem"),
        "utf8"
      );

      const verifyOptions: VerifyOptions = {
        algorithms: ["RS256"],
      };

      verify(token, publicKey, verifyOptions, (error, decoded) => {
        if (error) {
          return reject(error);
        }

        if (!decoded || typeof decoded !== "object") {
          return reject(new Error(INVALID_TOKEN_PAYLOAD));
        }

        resolve(decoded as JwtProps);
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const splitJwt = (jwt: string): string => {
  let splitedJwt = jwt;
  if (splitedJwt.toLowerCase().startsWith("bearer")) {
    splitedJwt = jwt.slice("bearer".length).trim();
  }
  return splitedJwt;
};
