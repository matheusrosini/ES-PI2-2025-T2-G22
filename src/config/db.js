import oracledb from "oracledb";
import dotenv from "dotenv";

// Carrega variáveis do .env
dotenv.config();

// Caminho do wallet
const walletPath = process.env.ORACLE_WALLET_DIR;

// Inicializar cliente Oracle usando o wallet
oracledb.initOracleClient({
    configDir: walletPath
});

// Formato da saída: objetos JS
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

const dbConfig = {
    user: process.env.ORACLE_USER,
    password: process.env.ORACLE_PASSWORD,
    connectString: process.env.ORACLE_CONNECT_STRING
};

// Abrir conexão
export async function open() {
    try {
        const connection = await oracledb.getConnection(dbConfig);
        console.log("Conexão OCI - aberta");
        return connection;
    } catch (err) {
        console.error(`Erro ao abrir conexão com o Oracle: ${err}`);
        throw err;
    }
}

// Fechar conexão
export async function close(connection) {
    try {
        await connection.close();
        console.log("Conexão OCI - fechada");
    } catch (err) {
        console.error(`Erro ao fechar conexão com o Oracle: ${err}`);
        throw err;
    }
}
