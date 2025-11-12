// Feito por Leonardo

const db = require('../config/db');

// Buscar todos os professores
exports.getAllProfessores = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT p.id, p.nome, p.email, p.telefone, d.nome AS disciplina
      FROM professor p
      LEFT JOIN disciplina d ON p.disciplina_id = d.id
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar professores', error });
  }
};

// Buscar professor por ID
exports.getProfessorById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(`
      SELECT p.id, p.nome, p.email, p.telefone, d.nome AS disciplina
      FROM professor p
      LEFT JOIN disciplina d ON p.disciplina_id = d.id
      WHERE p.id = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Professor não encontrado' });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar professor', error });
  }
};

// Criar novo professor
exports.createProfessor = async (req, res) => {
  try {
    const { nome, email, telefone, disciplina_id } = req.body;

    if (!nome || !email) {
      return res.status(400).json({ message: 'Nome e email são obrigatórios' });
    }

    await db.query(
      'INSERT INTO professor (nome, email, telefone, disciplina_id) VALUES (?, ?, ?, ?)',
      [nome, email, telefone, disciplina_id]
    );

    res.status(201).json({ message: 'Professor criado com sucesso!' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ message: 'Email já cadastrado' });
    } else {
      res.status(500).json({ message: 'Erro ao criar professor', error });
    }
  }
};

// Atualizar professor
exports.updateProfessor = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, telefone, disciplina_id } = req.body;

    const [result] = await db.query(
      'UPDATE professor SET nome = ?, email = ?, telefone = ?, disciplina_id = ? WHERE id = ?',
      [nome, email, telefone, disciplina_id, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Professor não encontrado' });
    }

    res.json({ message: 'Professor atualizado com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar professor', error });
  }
};

// Deletar professor
exports.deleteProfessor = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query('DELETE FROM professor WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Professor não encontrado' });
    }

    res.json({ message: 'Professor removido com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao remover professor', error });
  }
};
