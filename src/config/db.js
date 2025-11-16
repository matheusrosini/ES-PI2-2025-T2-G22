// Feito por Leonardo e Matheus Rosini

const mysql = require("mysql2");
require("dotenv").config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false },
    waitForConnections: true,
    connectionLimit: 10,
}).promise();

pool.getConnection()
    .then(conn => {
        console.log("✅ Conectado ao MySQL com sucesso!");
        conn.release();
    })
    .catch(err => {
        console.error("❌ Erro ao conectar MySQL:", err);
    });

module.exports = pool;
