// Feito por Leonardo

const db = require("../config/db");
const oracledb = require("oracledb");

// Helper: normalizar rows (Oracle pode devolver array de objetos já)
function rowsOrEmpty(result) {
  return result && result.rows ? result.rows : [];
}

// GET /api/turmas?instituicao_id=...&disciplina_id=...
exports.getAllTurmas = async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ error: "Usuário não autenticado." });

    const { instituicao_id, disciplina_id } = req.query;

    // base SQL: somente turmas cujas disciplinas pertencem a instituições do usuário
    let sql = `
      SELECT
        t.ID              AS "id",
        t.NOME            AS "nome",
        t.CODIGO          AS "codigo",
        t.PERIODO         AS "periodo",
        t.DISCIPLINA_ID   AS "disciplina_id",
        d.NOME            AS "disciplina_nome",
        i.ID              AS "instituicao_id",
        i.NOME            AS "instituicao_nome"
      FROM TURMA t
      JOIN DISCIPLINA d ON d.ID = t.DISCIPLINA_ID
      JOIN INSTITUICAO i ON i.ID = d.INSTITUICAO_ID
      WHERE i.USUARIO_ID = :userId
    `;

    const binds = { userId: Number(userId) };

    if (instituicao_id) {
      sql += ` AND i.ID = :instituicao_id`;
      binds.instituicao_id = Number(instituicao_id);
    }
    if (disciplina_id) {
      sql += ` AND d.ID = :disciplina_id`;
      binds.disciplina_id = Number(disciplina_id);
    }

    sql += ` ORDER BY t.NOME`;

    const result = await db.execute(sql, binds);
    return res.status(200).json(rowsOrEmpty(result));
  } catch (err) {
    console.error("Erro ao buscar turmas:", err);
    return res.status(500).json({ error: "Erro ao buscar turmas." });
  }
};

// GET /api/turmas/:id
exports.getTurmaById = async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ error: "Usuário não autenticado." });

    const { id } = req.params;
    const sql = `
      SELECT
        t.ID            AS "id",
        t.NOME          AS "nome",
        t.CODIGO        AS "codigo",
        t.PERIODO       AS "periodo",
        t.DISCIPLINA_ID AS "disciplina_id",
        d.NOME          AS "disciplina_nome",
        i.ID            AS "instituicao_id"
      FROM TURMA t
      JOIN DISCIPLINA d ON d.ID = t.DISCIPLINA_ID
      JOIN INSTITUICAO i ON i.ID = d.INSTITUICAO_ID
      WHERE t.ID = :id AND i.USUARIO_ID = :userId
    `;
    const result = await db.execute(sql, { id: Number(id), userId: Number(userId) });
    const rows = rowsOrEmpty(result);
    if (rows.length === 0) return res.status(404).json({ error: "Turma não encontrada." });
    return res.status(200).json(rows[0]);
  } catch (err) {
    console.error("Erro ao buscar turma por id:", err);
    return res.status(500).json({ error: "Erro ao buscar turma." });
  }
};

// POST /api/turmas
exports.createTurma = async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ error: "Usuário não autenticado." });

    const { nome, codigo, periodo, disciplina_id } = req.body;
    if (!nome || !disciplina_id) {
      return res.status(400).json({ error: "Campos obrigatórios: nome e disciplina_id." });
    }

    // verifica se a disciplina pertence a uma instituição do usuário
    const checkSql = `
      SELECT d.ID
      FROM DISCIPLINA d
      JOIN INSTITUICAO i ON i.ID = d.INSTITUICAO_ID
      WHERE d.ID = :disciplina_id AND i.USUARIO_ID = :userId
    `;
    const check = await db.execute(checkSql, { disciplina_id: Number(disciplina_id), userId: Number(userId) });
    if (!check.rows || check.rows.length === 0) {
      return res.status(403).json({ error: "Disciplina não pertence ao usuário." });
    }

    // insere turma
    const insertSql = `
      INSERT INTO TURMA (NOME, CODIGO, PERIODO, DISCIPLINA_ID)
      VALUES (:nome, :codigo, :periodo, :disciplina_id)
      RETURNING ID INTO :id
    `;
    const binds = {
      nome,
      codigo: codigo || null,
      periodo: periodo || null,
      disciplina_id: Number(disciplina_id),
      id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
    };

    const result = await db.execute(insertSql, binds);
    const newId = result.outBinds && result.outBinds.id ? result.outBinds.id[0] : null;
    return res.status(201).json({ message: "Turma criada com sucesso.", id: newId });
  } catch (err) {
    console.error("Erro ao criar turma:", err);
    return res.status(500).json({ error: "Erro ao criar turma." });
  }
};

// PUT /api/turmas/:id
exports.updateTurma = async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ error: "Usuário não autenticado." });

    const { id } = req.params;
    const { nome, codigo, periodo, disciplina_id } = req.body;

    // verifica existência e propriedade (via disciplina->instituicao)
    const checkSql = `
      SELECT t.ID
      FROM TURMA t
      JOIN DISCIPLINA d ON d.ID = t.DISCIPLINA_ID
      JOIN INSTITUICAO i ON i.ID = d.INSTITUICAO_ID
      WHERE t.ID = :id AND i.USUARIO_ID = :userId
    `;
    const check = await db.execute(checkSql, { id: Number(id), userId: Number(userId) });
    if (!check.rows || check.rows.length === 0) {
      return res.status(404).json({ error: "Turma não encontrada para este usuário." });
    }

    // se fornecer disciplina_id nova, verifique que pertence ao usuário
    if (disciplina_id) {
      const checkDiscSql = `
        SELECT d.ID
        FROM DISCIPLINA d
        JOIN INSTITUICAO i ON i.ID = d.INSTITUICAO_ID
        WHERE d.ID = :disciplina_id AND i.USUARIO_ID = :userId
      `;
      const checkDisc = await db.execute(checkDiscSql, { disciplina_id: Number(disciplina_id), userId: Number(userId) });
      if (!checkDisc.rows || checkDisc.rows.length === 0) {
        return res.status(403).json({ error: "A nova disciplina não pertence ao usuário." });
      }
    }

    const updateSql = `
      UPDATE TURMA
      SET NOME = :nome,
          CODIGO = :codigo,
          PERIODO = :periodo,
          DISCIPLINA_ID = :disciplina_id
      WHERE ID = :id
    `;
    await db.execute(updateSql, {
      id: Number(id),
      nome,
      codigo: codigo || null,
      periodo: periodo || null,
      disciplina_id: disciplina_id ? Number(disciplina_id) : null
    });

    return res.status(200).json({ message: "Turma atualizada com sucesso." });
  } catch (err) {
    console.error("Erro ao atualizar turma:", err);
    return res.status(500).json({ error: "Erro ao atualizar turma." });
  }
};

// DELETE /api/turmas/:id
exports.deleteTurma = async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ error: "Usuário não autenticado." });

    const { id } = req.params;

    // verifica propriedade
    const checkSql = `
      SELECT t.ID
      FROM TURMA t
      JOIN DISCIPLINA d ON d.ID = t.DISCIPLINA_ID
      JOIN INSTITUICAO i ON i.ID = d.INSTITUICAO_ID
      WHERE t.ID = :id AND i.USUARIO_ID = :userId
    `;
    const check = await db.execute(checkSql, { id: Number(id), userId: Number(userId) });
    if (!check.rows || check.rows.length === 0) {
      return res.status(404).json({ error: "Turma não encontrada para este usuário." });
    }

    const deleteSql = `DELETE FROM TURMA WHERE ID = :id`;
    const result = await db.execute(deleteSql, { id: Number(id) });

    return res.status(200).json({ message: "Turma deletada com sucesso." });
  } catch (err) {
    console.error("Erro ao deletar turma:", err);
    return res.status(500).json({ error: "Erro ao deletar turma." });
  }
};
