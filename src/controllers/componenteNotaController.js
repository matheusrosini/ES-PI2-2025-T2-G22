// Feito por Leonardo

const db = require('../config/db');

// Listar componentes por disciplina
exports.getByDisciplina = async (req, res) => {
  try {
    const { disciplinaId } = req.params;

    const [rows] = await db.query(
      "SELECT * FROM componente_nota WHERE disciplina_id = ?",
      [disciplinaId]
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Erro ao listar componentes", error });
  }
};

// Criar componente
exports.create = async (req, res) => {
  try {
    const { nome, sigla, descricao, disciplina_id } = req.body;

    if (!nome || !sigla || !disciplina_id) {
      return res.status(400).json({ message: "Nome, sigla e disciplina são obrigatórios." });
    }

    // Verifica duplicação dentro da mesma disciplina
    const [existente] = await db.query(
      "SELECT id FROM componente_nota WHERE sigla = ? AND disciplina_id = ?",
      [sigla, disciplina_id]
    );

    if (existente.length > 0) {
      return res.status(400).json({ message: "Já existe um componente com essa sigla nesta disciplina." });
    }

    await db.query(
      "INSERT INTO componente_nota (nome, sigla, descricao, disciplina_id) VALUES (?, ?, ?, ?)",
      [nome, sigla, descricao || null, disciplina_id]
    );

    res.status(201).json({ message: "Componente criado com sucesso!" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar componente", error });
  }
};

// Atualizar componente
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, sigla, descricao } = req.body;

    await db.query(
      "UPDATE componente_nota SET nome = ?, sigla = ?, descricao = ? WHERE id = ?",
      [nome, sigla, descricao || null, id]
    );

    res.json({ message: "Componente atualizado com sucesso!" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar componente", error });
  }
};

// Deletar componente
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("DELETE FROM componente_nota WHERE id = ?", [id]);

    res.json({ message: "Componente removido com sucesso!" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao remover componente", error });
  }
};
