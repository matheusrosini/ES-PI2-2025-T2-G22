// Feito por Leonardo

const db = require("../config/db");

// ================================
// Listar alunos com filtros (instituição, disciplina, turma)
// ================================
exports.getAllAlunos = async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ error: "Usuário não autenticado." });

    const { instituicao_id, disciplina_id, turma_id } = req.query;

    // Base SQL com JOINs
    let sql = `
      SELECT
        a.ID AS "id",
        a.NOME AS "nome",
        a.MATRICULA AS "matricula",
        a.TURMA_ID AS "turma_id",
        t.NOME AS "turma_nome",
        d.ID AS "disciplina_id",
        d.NOME AS "disciplina_nome",
        i.ID AS "instituicao_id",
        i.NOME AS "instituicao_nome"
      FROM ALUNO a
      JOIN TURMA t ON t.ID = a.TURMA_ID
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

    if (turma_id) {
      sql += ` AND t.ID = :turma_id`;
      binds.turma_id = Number(turma_id);
    }

    sql += ` ORDER BY a.NOME`;

    const result = await db.execute(sql, binds);
    return res.status(200).json(rowsOrEmpty(result));
  } catch (err) {
    console.error("Erro getAllAlunos:", err);
    return res.status(500).json({ error: "Erro ao buscar alunos." });
  }
};

function rowsOrEmpty(result) {
  return result.rows || [];
}

// ================================
// Listar alunos por turma
// ================================
exports.getAlunosByTurma = async (req, res) => {
  try {
    const { turmaId } = req.params;

    const result = await db.query(
      `SELECT id_aluno, nome, email, telefone 
       FROM aluno 
       WHERE id_turma = :turmaId`,
      { turmaId }
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Erro getAlunosByTurma:", err);
    res.status(500).json({ message: "Erro ao buscar alunos da turma" });
  }
};

// ================================
// Criar aluno (novo endpoint que aceita turma_id no body)
// ================================
exports.createAluno = async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ error: "Usuário não autenticado." });

    const { nome, matricula, turma_id } = req.body;

    if (!nome || !matricula || !turma_id) {
      return res.status(400).json({ error: "Nome, matrícula e turma_id são obrigatórios." });
    }

    // Verificar se a turma pertence ao usuário
    const turmaCheck = await db.execute(
      `SELECT t.ID 
       FROM TURMA t
       JOIN DISCIPLINA d ON d.ID = t.DISCIPLINA_ID
       JOIN INSTITUICAO i ON i.ID = d.INSTITUICAO_ID
       WHERE t.ID = :turma_id AND i.USUARIO_ID = :userId`,
      { turma_id: Number(turma_id), userId: Number(userId) }
    );

    if (!turmaCheck.rows || turmaCheck.rows.length === 0) {
      return res.status(403).json({ error: "Turma não encontrada ou você não tem permissão para adicionar alunos nesta turma." });
    }

    const result = await db.execute(
      `INSERT INTO ALUNO (NOME, MATRICULA, TURMA_ID)
       VALUES (:nome, :matricula, :turma_id)`,
      { nome, matricula, turma_id: Number(turma_id) }
    );

    res.status(201).json({ message: "Aluno criado com sucesso", id: result.lastRowid });
  } catch (err) {
    console.error("Erro createAluno:", err);
    res.status(500).json({ error: "Erro ao criar aluno.", details: err.message });
  }
};

// ================================
// Criar aluno em uma turma (endpoint antigo mantido para compatibilidade)
// ================================
exports.createAlunoByTurma = async (req, res) => {
  try {
    const { turmaId } = req.params;
    const { nome, email, telefone } = req.body;

    await db.query(
      `INSERT INTO aluno (nome, email, telefone, id_turma)
       VALUES (:nome, :email, :telefone, :turmaId)`,
      { nome, email, telefone, turmaId }
    );

    res.status(201).json({ message: "Aluno criado com sucesso" });
  } catch (err) {
    console.error("Erro createAlunoByTurma:", err);
    res.status(500).json({ message: "Erro ao criar aluno" });
  }
};

// ================================
// Buscar aluno por ID
// ================================
exports.getAlunoById = async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ error: "Usuário não autenticado." });

    const { id } = req.params;

    const result = await db.execute(
      `SELECT 
        a.ID AS "id",
        a.NOME AS "nome",
        a.MATRICULA AS "matricula",
        a.TURMA_ID AS "turma_id",
        t.NOME AS "turma_nome",
        d.ID AS "disciplina_id",
        d.NOME AS "disciplina_nome",
        i.ID AS "instituicao_id",
        i.NOME AS "instituicao_nome"
       FROM ALUNO a
       JOIN TURMA t ON t.ID = a.TURMA_ID
       JOIN DISCIPLINA d ON d.ID = t.DISCIPLINA_ID
       JOIN INSTITUICAO i ON i.ID = d.INSTITUICAO_ID
       WHERE a.ID = :id AND i.USUARIO_ID = :userId`,
      { id: Number(id), userId: Number(userId) }
    );

    if (!result.rows || result.rows.length === 0)
      return res.status(404).json({ error: "Aluno não encontrado" });

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Erro getAlunoById:", err);
    res.status(500).json({ error: "Erro ao buscar aluno.", details: err.message });
  }
};

// ================================
// Atualizar aluno
// ================================
exports.updateAluno = async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ error: "Usuário não autenticado." });

    const { id } = req.params;
    const { nome, matricula, turma_id } = req.body;

    if (!nome || !matricula || !turma_id) {
      return res.status(400).json({ error: "Nome, matrícula e turma_id são obrigatórios." });
    }

    // Verificar se o aluno pertence ao usuário
    const alunoCheck = await db.execute(
      `SELECT a.ID 
       FROM ALUNO a
       JOIN TURMA t ON t.ID = a.TURMA_ID
       JOIN DISCIPLINA d ON d.ID = t.DISCIPLINA_ID
       JOIN INSTITUICAO i ON i.ID = d.INSTITUICAO_ID
       WHERE a.ID = :id AND i.USUARIO_ID = :userId`,
      { id: Number(id), userId: Number(userId) }
    );

    if (!alunoCheck.rows || alunoCheck.rows.length === 0) {
      return res.status(403).json({ error: "Aluno não encontrado ou você não tem permissão para editá-lo." });
    }

    // Verificar se a nova turma pertence ao usuário
    const turmaCheck = await db.execute(
      `SELECT t.ID 
       FROM TURMA t
       JOIN DISCIPLINA d ON d.ID = t.DISCIPLINA_ID
       JOIN INSTITUICAO i ON i.ID = d.INSTITUICAO_ID
       WHERE t.ID = :turma_id AND i.USUARIO_ID = :userId`,
      { turma_id: Number(turma_id), userId: Number(userId) }
    );

    if (!turmaCheck.rows || turmaCheck.rows.length === 0) {
      return res.status(403).json({ error: "Turma não encontrada ou você não tem permissão para usar esta turma." });
    }

    const result = await db.execute(
      `UPDATE ALUNO
       SET NOME = :nome,
           MATRICULA = :matricula,
           TURMA_ID = :turma_id
       WHERE ID = :id`,
      { nome, matricula, turma_id: Number(turma_id), id: Number(id) }
    );

    res.json({ message: "Aluno atualizado com sucesso" });
  } catch (err) {
    console.error("Erro updateAluno:", err);
    res.status(500).json({ error: "Erro ao atualizar aluno.", details: err.message });
  }
};

// ================================
// Deletar aluno
// ================================
exports.deleteAluno = async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ error: "Usuário não autenticado." });

    const { id } = req.params;

    // Verificar se o aluno pertence ao usuário
    const alunoCheck = await db.execute(
      `SELECT a.ID 
       FROM ALUNO a
       JOIN TURMA t ON t.ID = a.TURMA_ID
       JOIN DISCIPLINA d ON d.ID = t.DISCIPLINA_ID
       JOIN INSTITUICAO i ON i.ID = d.INSTITUICAO_ID
       WHERE a.ID = :id AND i.USUARIO_ID = :userId`,
      { id: Number(id), userId: Number(userId) }
    );

    if (!alunoCheck.rows || alunoCheck.rows.length === 0) {
      return res.status(404).json({ error: "Aluno não encontrado ou você não tem permissão para excluí-lo." });
    }

    const result = await db.execute(
      `DELETE FROM ALUNO WHERE ID = :id`,
      { id: Number(id) }
    );

    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: "Aluno não encontrado" });
    }

    res.json({ message: "Aluno removido com sucesso" });
  } catch (err) {
    console.error("Erro deleteAluno:", err);
    res.status(500).json({ error: "Erro ao remover aluno.", details: err.message });
  }
};
