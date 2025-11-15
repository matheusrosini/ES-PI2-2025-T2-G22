//Feita por Matheus Rosini

// src/config/db.js
const mysql = require("mysql2");
require("dotenv").config();

// Cria um pool de conexões — mais estável para uso em produção (Railway)
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false }, // Railway exige SSL
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// Testa a conexão inicial
pool.getConnection((err, connection) => {
    if (err) {
        console.error("❌ Erro ao conectar ao MySQL:", err.message);
    } else {
        console.log("✅ Conectado ao MySQL (Railway) com sucesso!");
        connection.release();
    }
});

module.exports = pool;
