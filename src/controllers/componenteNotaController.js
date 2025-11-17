// Feito por Leonardo - versão final corrigida para Oracle

const db = require('../config/db');

/* ===============================
    LISTAR COMPONENTES POR DISCIPLINA
================================= */
exports.getByDisciplina = async (req, res) => {
  try {
    const { disciplinaId } = req.params;

    const result = await db.execute(
      `SELECT id, nome, peso, disciplina_id 
       FROM componente_nota 
       WHERE disciplina_id = :disciplinaId`,
      { disciplinaId },
      { outFormat: db.OUT_FORMAT_OBJECT }
    );

    return res.json(result.rows);

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
    const { nome, peso, disciplina_id } = req.body;

    await db.execute(
      `INSERT INTO componente_nota (nome, peso, disciplina_id)
       VALUES (:nome, :peso, :disciplina_id)`,
      { nome, peso, disciplina_id }
    );

    await db.commit();

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
    const { nome, peso } = req.body;

    await db.execute(
      `UPDATE componente_nota
       SET nome = :nome,
           peso = :peso
       WHERE id = :id`,
      { nome, peso, id }
    );

    await db.commit();

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
      `DELETE FROM componente_nota WHERE id = :id`,
      { id }
    );

    await db.commit();

    res.json({ message: "Componente removido com sucesso!" });

  } catch (err) {
    console.error("Erro ao deletar componente:", err);
    res.status(500).json({ message: "Erro ao remover componente", error: err.message });
  }
};
