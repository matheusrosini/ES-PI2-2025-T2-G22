// Feito por Matheus Rosini e Leonardo

const db = require('../config/db');

// Helper: verifica user autenticado
function ensureAuth(req, res) {
  if (!req.user || !req.user.id) {
    res.status(401).json({ message: "Usuário não autenticado." });
    return false;
  }
  return true;
}

// ----------------------------------------
// Buscar TODAS as disciplinas do usuário logado
// ----------------------------------------
exports.getAllDisciplinas = async (req, res) => {
  try {
    if (!ensureAuth(req, res)) return;

    const usuario_id = req.user.id;

    const result = await db.query(
      `SELECT d.ID,
       d.NOME, 
       d.SIGLA, 
       d.CODIGO, 
       d.PERIODO,
       d.FORMULA_NOTA,
       d.INSTITUICAO_ID,
              i.NOME AS INSTITUICAO
       FROM DISCIPLINA d
       JOIN INSTITUICAO i ON d.INSTITUICAO_ID = i.ID
       WHERE i.USUARIO_ID = :usuario_id
       ORDER BY d.NOME`,
      { usuario_id }
    );

    return res.json(result.rows || []);
  } catch (error) {
    console.error("ERRO AO BUSCAR DISCIPLINAS:", error);
    return res.status(500).json({ message: "Erro ao buscar disciplinas.", error: error.message });
  }
};

// ----------------------------------------
// Criar disciplina
// ----------------------------------------
exports.createDisciplina = async (req, res) => {
  try {
    if (!ensureAuth(req, res)) return;

    const usuario_id = req.user.id;
    const { nome, sigla, codigo, periodo, formula_nota, instituicao_id } = req.body;

    if (!nome || !instituicao_id) {
      return res.status(400).json({ message: "Campos obrigatórios faltando: nome e instituicao_id." });
    }

    // Verifica se a instituição pertence ao usuário
    const checkInst = await db.query(
      `SELECT ID FROM INSTITUICAO WHERE ID = :inst AND USUARIO_ID = :usuario_id`,
      { inst: instituicao_id, usuario_id }
    );

    if (!checkInst.rows || checkInst.rows.length === 0) {
      return res.status(403).json({ message: "Instituição não pertence ao usuário." });
    }

    // Insert (usando bind simples). Ajuste caso precise do RETURNING do Oracle
    await db.query(
      `INSERT INTO DISCIPLINA (NOME, SIGLA, CODIGO, PERIODO, FORMULA_NOTA, INSTITUICAO_ID)
       VALUES (:nome, :sigla, :codigo, :periodo, :formula, :inst)`,
      { nome, sigla, codigo, periodo, formula: formula_nota, inst: instituicao_id }
    );

    return res.status(201).json({ message: "Disciplina criada com sucesso." });
  } catch (error) {
    console.error("ERRO AO CRIAR DISCIPLINA:", error);
    return res.status(500).json({ message: "Erro ao criar disciplina.", error: error.message });
  }
};

// ----------------------------------------
// Buscar disciplina por id
// ----------------------------------------
exports.getDisciplinaById = async (req, res) => {
  try {
    if (!ensureAuth(req, res)) return;

    const usuario_id = req.user.id;
    const id = req.params.id;

    const result = await db.query(
      `SELECT d.ID, d.NOME, d.SIGLA, d.CODIGO, d.PERIODO, d.FORMULA_NOTA, d.INSTITUICAO_ID,
              i.NOME AS INSTITUICAO
       FROM DISCIPLINA d
       JOIN INSTITUICAO i ON d.INSTITUICAO_ID = i.ID
       WHERE d.ID = :id AND i.USUARIO_ID = :usuario_id`,
      { id, usuario_id }
    );

    if (!result.rows || result.rows.length === 0) {
      return res.status(404).json({ message: "Disciplina não encontrada." });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    console.error("ERRO AO BUSCAR DISCIPLINA POR ID:", error);
    return res.status(500).json({ message: "Erro ao buscar disciplina.", error: error.message });
  }
};

// ----------------------------------------
// Update disciplina
// ----------------------------------------
exports.updateDisciplina = async (req, res) => {
  try {
    if (!ensureAuth(req, res)) return;

    const usuario_id = req.user.id;
    const id = req.params.id;
    const { nome, sigla, codigo, periodo, formula_nota, instituicao_id } = req.body;

    // Verifica se a disciplina existe e pertence ao usuário
    const check = await db.query(
      `SELECT d.ID
       FROM DISCIPLINA d
       JOIN INSTITUICAO i ON d.INSTITUICAO_ID = i.ID
       WHERE d.ID = :id AND i.USUARIO_ID = :usuario_id`,
      { id, usuario_id }
    );

    if (!check.rows || check.rows.length === 0) {
      return res.status(404).json({ message: "Disciplina não encontrada ou não pertence ao usuário." });
    }

    // Se passou, atualiza
    await db.query(
      `UPDATE DISCIPLINA
       SET NOME = :nome,
           SIGLA = :sigla,
           CODIGO = :codigo,
           PERIODO = :periodo,
           FORMULA_NOTA = :formula,
           INSTITUICAO_ID = :inst
       WHERE ID = :id`,
      { nome, sigla, codigo, periodo, formula: formula_nota, inst: instituicao_id, id }
    );

    return res.json({ message: "Disciplina atualizada com sucesso." });
  } catch (error) {
    console.error("ERRO AO ATUALIZAR DISCIPLINA:", error);
    return res.status(500).json({ message: "Erro ao atualizar disciplina.", error: error.message });
  }
};

// ----------------------------------------
// Remover disciplina
// ----------------------------------------
exports.deleteDisciplina = async (req, res) => {
  try {
    if (!ensureAuth(req, res)) return;

    const usuario_id = req.user.id;
    const id = req.params.id;

    // Verifica se a disciplina existe e pertence ao usuário
    const check = await db.query(
      `SELECT d.ID
       FROM DISCIPLINA d
       JOIN INSTITUICAO i ON d.INSTITUICAO_ID = i.ID
       WHERE d.ID = :id AND i.USUARIO_ID = :usuario_id`,
      { id, usuario_id }
    );

    if (!check.rows || check.rows.length === 0) {
      return res.status(404).json({ message: "Disciplina não encontrada ou não pertence ao usuário." });
    }

    await db.query(`DELETE FROM DISCIPLINA WHERE ID = :id`, { id });

    return res.json({ message: "Disciplina removida com sucesso!" });
  } catch (error) {
    console.error("ERRO AO REMOVER DISCIPLINA:", error);
    return res.status(500).json({ message: "Erro ao remover disciplina", error: error.message });
  }
};
