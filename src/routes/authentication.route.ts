import express from "express";
import { Authentication } from "../controllers/authentication.controller";
import { ApiService } from "../services/index.service";
import {
  refreshTokenValidation,
  signinValidation,
  signupValidation,
} from "../middleware/validation/authentication.middleware";
import { authMiddleware } from "../middleware/auth";
const router = express.Router();
const apiService = new ApiService();
const authenticationController = new Authentication(apiService);

router.post("/signup", signupValidation, authenticationController.signup);
router.post("/signin", signinValidation, authenticationController.signin);
router.get("/logout", authMiddleware, authenticationController.logout);
router.post(
  "/signin/new_token",
  refreshTokenValidation,
  authenticationController.refreshToken
);

export { router as authenticationRouter };
