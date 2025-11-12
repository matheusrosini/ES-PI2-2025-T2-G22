const mysql = require("mysql2");
require("dotenv").config();

// Cria conexão com o banco de dados Railway
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: { rejectUnauthorized: false } // aceita certificado autoassinado
});

// Tenta conectar
connection.connect((err) => {
    if (err) {
        console.error("❌ Erro ao conectar ao MySQL:", err.message);
    } else {
        console.log("✅ Conectado ao MySQL (Railway) com sucesso!");
    }
});

module.exports = connection;
