// Feito por Leonardo

const oracledb = require("oracledb");
require("dotenv").config();

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

try {
    oracledb.initOracleClient({
        libDir: process.env.ORACLE_CLIENT_PATH,
        configDir: process.env.ORACLE_WALLET_PATH
    });
    console.log("Oracle Client + Wallet inicializados.");
} catch (err) {
    console.warn("Oracle Client NÃO carregou. Usando modo Thin.");
}

const connectString = "(description=" +
"(address=(protocol=tcps)(port=1522)(host=adb.sa-saopaulo-1.oraclecloud.com))" +
"(connect_data=(service_name=g2b205040796624_meudb_high.adb.oraclecloud.com))" +
"(security=(ssl_server_dn_match=yes))" +
")";

async function getConnection() {
    try {
        return await oracledb.getConnection({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            connectString
        });
    } catch (err) {
        console.error("Erro ao conectar ao Oracle:", err);
        throw err;
    }
}

module.exports = { getConnection };
