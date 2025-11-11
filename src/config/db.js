const mysql = require("mysql2");
require("dotenv").config(); // carrega variáveis do .env

// Cria conexão com o banco de dados
const connection = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "projetoNotaDez",
  port: process.env.DB_PORT || 3306
});

// Tenta conectar
connection.connect((err) => {
  if (err) {
    console.error("❌ Erro ao conectar ao MySQL:", err.message);
  } else {
    console.log("✅ Conectado ao MySQL");
  }
});

module.exports = connection;
