import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

export default new Pool(process.env.NODE_ENV === "production" ? {
  connectionString: process.env.DATABASE_URL,
} : {
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: Number(process.env.PG_PORT),
})

