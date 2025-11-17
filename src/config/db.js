// Feito por Leonardo

const oracledb = require("oracledb");
require("dotenv").config();

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

// Tentativa de inicializar Oracle Client / Wallet
try {
  oracledb.initOracleClient({
    libDir: process.env.ORACLE_CLIENT_PATH,
    configDir: process.env.ORACLE_WALLET_PATH
  });
  console.log("Oracle Client + Wallet inicializados.");
} catch (err) {
  console.warn("Oracle Client NÃO carregou. Usando modo Thin.");
}

// Conexão padrão
const connectString =
  "(description=" +
  "(address=(protocol=tcps)(port=1522)(host=adb.sa-saopaulo-1.oraclecloud.com))" +
  "(connect_data=(service_name=g2b205040796624_meudb_high.adb.oraclecloud.com))" +
  "(security=(ssl_server_dn_match=yes))" +
  ")";

async function getConnection() {
  return await oracledb.getConnection({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString
  });
}

// --------- EXECUTE (usado por instituições, usuários, etc) ----------
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
    if (conn) await conn.close();
  }
}

// --------- QUERY Inteligente ----------
async function query(sql, params = {}) {
  const isSelect = /^\s*SELECT/i.test(sql);
  return execute(sql, params, { autoCommit: !isSelect });
}

// Exporta tudo necessário
module.exports = {
  getConnection,
  execute,
  query
};
