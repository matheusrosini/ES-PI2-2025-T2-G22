import * as dotenv from "dotenv";
import mysql from "mysql2";

dotenv.config();

export const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("❌ Erro ao conectar ao MySQL:", err.message);
    return;
  }
  console.log("✅ Conectado ao MySQL com sucesso!");
});
