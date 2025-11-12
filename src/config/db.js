const mysql = require("mysql2");
require("dotenv").config();

// 🔧 Cria um pool de conexões — mais seguro e confiável para deploys (como Railway)
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: { rejectUnauthorized: false }, // aceita certificado autoassinado
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// 🔍 Testa a conexão inicial
pool.getConnection((err, connection) => {
    if (err) {
        console.error("❌ Erro ao conectar ao MySQL:", err.message);
    } else {
        console.log("✅ Conectado ao MySQL (Railway) com sucesso!");
        connection.release();
    }
});

module.exports = pool;
