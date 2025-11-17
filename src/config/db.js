// src/config/db.js
// Versão segura e compatível — exporta execute() e getConnection()

const oracledb = require("oracledb");
require("dotenv").config();

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

// Tenta inicializar o Oracle Client / Wallet (mantém seu comportamento anterior)
try {
  oracledb.initOracleClient({
    libDir: process.env.ORACLE_CLIENT_PATH,
    configDir: process.env.ORACLE_WALLET_PATH
  });
  console.log("Oracle Client + Wallet inicializados.");
} catch (err) {
  console.warn("Oracle Client NÃO carregou. Usando modo Thin.");
}

// Conexão (mantive o connectString como estava)
const connectString = "(description=" +
  "(address=(protocol=tcps)(port=1522)(host=adb.sa-saopaulo-1.oraclecloud.com))" +
  "(connect_data=(service_name=g2b205040796624_meudb_high.adb.oraclecloud.com))" +
  "(security=(ssl_server_dn_match=yes))" +
  ")";

// Função para obter conexão (mantida para compatibilidade)
async function getConnection() {
  try {
    const conn = await oracledb.getConnection({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString
    });
    return conn;
  } catch (err) {
    console.error("Erro ao conectar ao Oracle (getConnection):", err);
    throw err;
  }
}

// Função executora simples e segura (a ser usada pelos controllers)
async function execute(sql, params = {}, options = { autoCommit: true }) {
  let conn;
  try {
    conn = await getConnection();
    const result = await conn.execute(sql, params, options);
    return result;
  } catch (err) {
    console.error("Erro em execute():", err);
    throw err;
  } finally {
    if (conn) {
      try {
        await conn.close();
      } catch (closeErr) {
        console.error("Erro ao fechar conexão:", closeErr);
      }
    }
  }
}

// Exporta ambas as funções para máxima compatibilidade
module.exports = {
  getConnection,
  execute
};
