import oracledb from "oracledb";
import dotenv from "dotenv";

dotenv.config();

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

// Inicializa o cliente Oracle
try {
    oracledb.initOracleClient({ libDir: process.env.ORACLE_LIB_PATH });
    console.log("Oracle Client inicializado.");
} catch (err) {
    console.error("Erro ao inicializar Oracle Client:", err);
}

export async function getConnection() {
    try {
        const connection = await oracledb.getConnection({
            user: process.env.ORACLE_USER,
            password: process.env.ORACLE_PASSWORD,
            connectString: process.env.ORACLE_CONNECTION_STRING
        });

        return connection;
    } catch (error) {
        console.error("Erro ao conectar ao OracleDB:", error);
        throw error;
    }
}
