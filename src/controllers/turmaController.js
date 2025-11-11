// Feito por Leonardo

const db = require('../config/db');

// Buscar todas as turmas
exports.getAllTurmas = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM turma');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar turmas', error });
  }
};

// Buscar uma turma pelo ID
exports.getTurmaById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM turma WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Turma não encontrada' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar turma', error });
  }
};

// Criar uma nova turma
exports.createTurma = async (req, res) => {
  try {
    const { nome, ano, semestre } = req.body;
    await db.query('INSERT INTO turma (nome, ano, semestre) VALUES (?, ?, ?)', [nome, ano, semestre]);
    res.status(201).json({ message: 'Turma criada com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar turma', error });
  }
};

// Atualizar turma
exports.updateTurma = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, ano, semestre } = req.body;
    await db.query('UPDATE turma SET nome=?, ano=?, semestre=? WHERE id=?', [nome, ano, semestre, id]);
    res.json({ message: 'Turma atualizada com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar turma', error });
  }
};

// Deletar turma
exports.deleteTurma = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM turma WHERE id=?', [id]);
    res.json({ message: 'Turma removida com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao remover turma', error });
  }
};