import express from "express";
import { ApiService } from "../services/index.service";
import { authMiddleware } from "../middleware/auth";
import { File } from "../controllers/file.controller";
import {
  idParamValidation,
  paginationValidation,
} from "../middleware/validation/file.middleware";
const router = express.Router();
const apiService = new ApiService();
const fileController = new File(apiService);

router.use(authMiddleware);

router.post("/upload", fileController.upload);
router.get("/list", paginationValidation, fileController.list);
router.delete("/delete/:id", idParamValidation, fileController.delete);
router.get("/:id", idParamValidation, fileController.get);
router.get("/download/:id", idParamValidation, fileController.download);
router.put("/update/:id", idParamValidation, fileController.update);

export { router as fileRouter };
