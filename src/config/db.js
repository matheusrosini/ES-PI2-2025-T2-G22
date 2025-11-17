// db.js - Oracle (CommonJS)

const oracledb = require("oracledb");
require("dotenv").config();

const walletPath = process.env.ORACLE_WALLET_DIR;

oracledb.initOracleClient({
    configDir: walletPath
});

// Sempre retornar objetos JS
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

const dbConfig = {
    user: process.env.ORACLE_USER,
    password: process.env.ORACLE_PASSWORD,
    connectString: process.env.ORACLE_CONNECT_STRING
};

// Abrir conexão
async function open() {
    try {
        const conn = await oracledb.getConnection(dbConfig);
        return conn;
    } catch (err) {
        console.error("Erro ao abrir conexão Oracle:", err);
        throw err;
    }
}

// Fechar conexão
async function close(conn) {
    if (!conn) return;
    try {
        await conn.close();
    } catch (err) {
        console.error("Erro ao fechar conexão Oracle:", err);
    }
}

module.exports = { open, close };
