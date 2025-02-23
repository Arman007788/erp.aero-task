import express, { Application } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import fileUpload from "express-fileupload";
import { AppDataSource } from "./config/data-source";
import { authenticationRouter } from "./routes/authentication.route";
import { responseInterceptor } from "./middleware/responseInterceptor";
import { errorHandler } from "./middleware/errorHandler";
import { userRouter } from "./routes/user.route";
import { fileRouter } from "./routes/file.route";

const app: Application = express();

const options: cors.CorsOptions = {
  allowedHeaders: ["*"],
  credentials: true,
  methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
};
app.use(express.static("public"));
app.use(cors(options));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "500mb" }));
app.use(bodyParser.urlencoded({ limit: "500mb", extended: true }));
app.use(
  fileUpload({
    limits: { fileSize: 50000000 * 1024 * 1024 },
  })
);

app.use(responseInterceptor);

app.use("/api", [authenticationRouter, userRouter]);
app.use("/api/file", [fileRouter]);

app.use(errorHandler);

AppDataSource.initialize().then(() => {
  app.listen(3003, () => console.log(`Server running on port 3003`));
});
