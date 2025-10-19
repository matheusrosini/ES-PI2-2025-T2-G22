const mariadb = require('mariadb');

const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',       // padrão do XAMPP
  password: '',        // se não colocou senha no XAMPP, deixa vazio
  database: 'projeto_integrador',
  connectionLimit: 5
});

async function getConnection() {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log('Conectado ao MariaDB!');
    return conn;
  } catch (err) {
    console.error('Erro na conexão:', err);
  }
}

module.exports = { getConnection };
