const db = require('../config/db');

exports.getTurmas = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM turmas');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar turmas' });
  }
};

exports.createTurma = async (req, res) => {
  try {
    const { nome, professor_id } = req.body;

    const [result] = await db.query(
      'INSERT INTO turmas (nome, professor_id) VALUES (?, ?)',
      [nome, professor_id]
    );

    res.status(201).json({ id: result.insertId, nome, professor_id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar turma' });
  }
};

exports.deleteTurma = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query('DELETE FROM turmas WHERE id = ?', [id]);

    res.json({ message: 'Turma deletada com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao deletar turma' });
  }
};
