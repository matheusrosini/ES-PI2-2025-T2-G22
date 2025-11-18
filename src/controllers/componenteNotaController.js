// Feito por Leonardo

const db = require('../config/db');

/* LISTAR COMPONENTES POR DISCIPLINA */
exports.getByDisciplina = async (req, res) => {
  try {
    const { disciplinaId } = req.params;

    const result = await db.execute(
      `SELECT ID, NOME, SIGLA, DESCRICAO, PESO, DISCIPLINA_ID 
       FROM COMPONENTE_NOTA 
       WHERE DISCIPLINA_ID = :disciplinaId`,
      { disciplinaId }
    );

    // Normalizar dados Oracle (maiúsculas → minúsculas)
    const componentesNormalizados = result.rows.map(c => ({
      id: c.ID,
      nome: c.NOME,
      sigla: c.SIGLA,
      descricao: c.DESCRICAO || null,
      peso: c.PESO || 1, // Padrão: peso 1 se não especificado
      disciplina_id: c.DISCIPLINA_ID
    }));

    return res.json(componentesNormalizados);

  } catch (err) {
    console.error("Erro ao buscar componentes:", err);
    res.status(500).json({ message: "Erro ao buscar componentes", error: err.message });
  }
};

/* ===============================
    CRIAR COMPONENTE
================================= */
exports.create = async (req, res) => {
  try {
    const { nome, sigla, descricao, peso, disciplina_id } = req.body;

    if (!nome || !sigla || !disciplina_id) {
      return res.status(400).json({ message: "Nome, sigla e disciplina_id são obrigatórios." });
    }

    await db.execute(
      `INSERT INTO COMPONENTE_NOTA (NOME, SIGLA, DESCRICAO, PESO, DISCIPLINA_ID)
       VALUES (:nome, :sigla, :descricao, :peso, :disciplina_id)`,
      { nome, sigla, descricao: descricao || null, peso: peso || 1, disciplina_id }
    );

    res.status(201).json({ message: "Componente criado com sucesso!" });

  } catch (err) {
    console.error("Erro ao criar componente:", err);
    res.status(500).json({ message: "Erro ao criar componente", error: err.message });
  }
};

/* ===============================
    ATUALIZAR COMPONENTE
================================= */
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, sigla, descricao, peso } = req.body;

    await db.execute(
      `UPDATE COMPONENTE_NOTA
       SET NOME = :nome,
           SIGLA = :sigla,
           DESCRICAO = :descricao,
           PESO = :peso
       WHERE ID = :id`,
      { nome, sigla, descricao: descricao || null, peso: peso || 1, id }
    );

    res.json({ message: "Componente atualizado com sucesso!" });

  } catch (err) {
    console.error("Erro ao atualizar componente:", err);
    res.status(500).json({ message: "Erro ao atualizar componente", error: err.message });
  }
};

/* ===============================
    DELETAR COMPONENTE
================================= */
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    await db.execute(
      `DELETE FROM COMPONENTE_NOTA WHERE ID = :id`,
      { id }
    );

    res.json({ message: "Componente removido com sucesso!" });

  } catch (err) {
    console.error("Erro ao deletar componente:", err);
    res.status(500).json({ message: "Erro ao remover componente", error: err.message });
  }
};
