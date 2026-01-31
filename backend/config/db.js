import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config(); // ✅ Load .env variables

export const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

console.log("✅ MySQL Pool Created Successfully");
console.log("DB USER =", process.env.DB_USER);
