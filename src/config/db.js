// config/db.js
const oracledb = require("oracledb");
require("dotenv").config();

try {
  oracledb.initOracleClient({
    libDir: process.env.ORACLE_CLIENT_PATH,
  });
  console.log("Oracle Client inicializado.");
} catch (err) {
  console.error("Erro ao iniciar Oracle Client:", err);
}

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

module.exports = {
  getConnection: async () => {
    try {
      return await oracledb.getConnection({
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        connectString: process.env.DB_CONNECT
      });
    } catch (err) {
      console.error("Erro ao obter conexão Oracle:", err);
      throw err;
    }
  }
};
