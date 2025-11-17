const db = require('../config/db');

// ==============================
// LISTAR TODAS AS TURMAS
// ==============================
exports.getAllTurmas = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM turmas');
    return res.json(rows);
  } catch (error) {
    console.error("Erro ao buscar turmas:", error);
    return res.status(500).json({ error: 'Erro ao buscar turmas' });
  }
};

// ==============================
// BUSCAR TURMA POR ID
// ==============================
exports.getTurmaById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM turmas WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Turma não encontrada' });
    }

    return res.json(rows[0]);
  } catch (error) {
    console.error("Erro ao buscar turma:", error);
    return res.status(500).json({ error: 'Erro ao buscar turma' });
  }
};

// ==============================
// CRIAR TURMA
// ==============================
exports.createTurma = async (req, res) => {
  try {
    const { nome, professor_id } = req.body;

    if (!nome || !professor_id) {
      return res.status(400).json({ error: 'Nome e professor_id são obrigatórios' });
    }

    const [result] = await db.query(
      'INSERT INTO turmas (nome, professor_id) VALUES (?, ?)',
      [nome, professor_id]
    );

    return res.status(201).json({
      id: result.insertId,
      nome,
      professor_id,
    });
  } catch (error) {
    console.error("Erro ao criar turma:", error);
    return res.status(500).json({ error: 'Erro ao criar turma' });
  }
};

// ==============================
// ATUALIZAR TURMA
// ==============================
exports.updateTurma = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, professor_id } = req.body;

    const [result] = await db.query(
      'UPDATE turmas SET nome = ?, professor_id = ? WHERE id = ?',
      [nome, professor_id, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Turma não encontrada' });
    }

    return res.json({ message: 'Turma atualizada com sucesso' });
  } catch (error) {
    console.error("Erro ao atualizar turma:", error);
    return res.status(500).json({ error: 'Erro ao atualizar turma' });
  }
};

// ==============================
// DELETAR TURMA
// ==============================
exports.deleteTurma = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query('DELETE FROM turmas WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Turma não encontrada' });
    }

    return res.json({ message: 'Turma deletada com sucesso' });
  } catch (error) {
    console.error("Erro ao deletar turma:", error);
    return res.status(500).json({ error: 'Erro ao deletar turma' });
  }
};
