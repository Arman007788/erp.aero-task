import { DataSource } from "typeorm";
import dotenv from "dotenv";

dotenv.config();

export default new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ["src/entities/*.ts"],
  migrations: ["src/migrations/*.ts"],
  synchronize: false,
  logging: false,
});
