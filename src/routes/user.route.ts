import express from "express";
import { ApiService } from "../services/index.service";
import { User } from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth";
const router = express.Router();
const apiService = new ApiService();
const userController = new User(apiService);

router.get("/info", authMiddleware, userController.info);

export { router as userRouter };
