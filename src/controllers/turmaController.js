// Feito por Leonardo e Matheus Rosini

const { open, close } = require("../config/db");

// ==============================
// LISTAR TODAS AS TURMAS
// ==============================
exports.getAllTurmas = async (req, res) => {
  let connection;
  try {
    connection = await open();

    const result = await connection.execute(`
        SELECT id, nome, professor_id 
        FROM turmas
        ORDER BY nome
    `);

    res.json(result.rows);

  } catch (error) {
    console.error("Erro ao buscar turmas:", error);
    res.status(500).json({ error: "Erro ao buscar turmas" });

  } finally {
    if (connection) await close(connection);
  }
};

// ==============================
// BUSCAR TURMA POR ID
// ==============================
exports.getTurmaById = async (req, res) => {
  let connection;
  try {
    const { id } = req.params;

    connection = await open();

    const result = await connection.execute(
      `SELECT id, nome, professor_id FROM turmas WHERE id = :id`,
      [id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Turma não encontrada" });

    res.json(result.rows[0]);

  } catch (error) {
    console.error("Erro ao buscar turma:", error);
    res.status(500).json({ error: "Erro ao buscar turma" });

  } finally {
    if (connection) await close(connection);
  }
};

// ==============================
// CRIAR TURMA
// ==============================
exports.createTurma = async (req, res) => {
  let connection;
  try {
    const { nome, professor_id } = req.body;

    if (!nome || !professor_id)
      return res.status(400).json({ error: "Nome e professor_id são obrigatórios" });

    connection = await open();

    const result = await connection.execute(
      `INSERT INTO turmas (nome, professor_id) VALUES (:nome, :professor_id)
       RETURNING id INTO :id`,
      {
        nome,
        professor_id,
        id: { dir: require("oracledb").BIND_OUT, type: require("oracledb").NUMBER }
      }
    );

    await connection.commit();

    res.status(201).json({
      id: result.outBinds.id[0],
      nome,
      professor_id,
    });

  } catch (error) {
    console.error("Erro ao criar turma:", error);
    res.status(500).json({ error: "Erro ao criar turma" });

  } finally {
    if (connection) await close(connection);
  }
};

// ==============================
// ATUALIZAR TURMA
// ==============================
exports.updateTurma = async (req, res) => {
  let connection;
  try {
    const { id } = req.params;
    const { nome, professor_id } = req.body;

    connection = await open();

    const result = await connection.execute(
      `UPDATE turmas 
       SET nome = :nome, professor_id = :professor_id
       WHERE id = :id`,
      { nome, professor_id, id }
    );

    await connection.commit();

    if (result.rowsAffected === 0)
      return res.status(404).json({ error: "Turma não encontrada" });

    res.json({ message: "Turma atualizada com sucesso" });

  } catch (error) {
    console.error("Erro ao atualizar turma:", error);
    res.status(500).json({ error: "Erro ao atualizar turma" });

  } finally {
    if (connection) await close(connection);
  }
};

// ==============================
// DELETAR TURMA
// ==============================
exports.deleteTurma = async (req, res) => {
  let connection;
  try {
    const { id } = req.params;

    connection = await open();

    const result = await connection.execute(
      `DELETE FROM turmas WHERE id = :id`,
      [id]
    );

    await connection.commit();

    if (result.rowsAffected === 0)
      return res.status(404).json({ error: "Turma não encontrada" });

    res.json({ message: "Turma deletada com sucesso" });

  } catch (error) {
    console.error("Erro ao deletar turma:", error);
    res.status(500).json({ error: "Erro ao deletar turma" });

  } finally {
    if (connection) await close(connection);
  }
};
