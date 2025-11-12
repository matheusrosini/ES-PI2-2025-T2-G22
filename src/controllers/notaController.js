// Feito por Leonardo

const db = require('../config/db');

// Buscar todas as notas
exports.getAllNotas = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT n.id, a.nome AS aluno, c.nome AS componente, n.valor
      FROM nota n
      JOIN aluno a ON n.aluno_id = a.id
      JOIN componente_nota c ON n.componente_id = c.id
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar notas', error });
  }
};

// Buscar nota por ID
exports.getNotaById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM nota WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Nota não encontrada' });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar nota', error });
  }
};

// Criar nova nota
exports.createNota = async (req, res) => {
  try {
    const { aluno_id, componente_id, valor } = req.body;

    if (!aluno_id || !componente_id || valor === undefined) {
      return res.status(400).json({ message: 'Campos aluno_id, componente_id e valor são obrigatórios' });
    }

    if (valor < 0 || valor > 10) {
      return res.status(400).json({ message: 'O valor da nota deve ser entre 0 e 10' });
    }

    await db.query(
      'INSERT INTO nota (aluno_id, componente_id, valor) VALUES (?, ?, ?)',
      [aluno_id, componente_id, valor]
    );

    res.status(201).json({ message: 'Nota registrada com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar nota', error });
  }
};

// Atualizar nota existente
exports.updateNota = async (req, res) => {
  try {
    const { id } = req.params;
    const { valor } = req.body;

    if (valor < 0 || valor > 10) {
      return res.status(400).json({ message: 'O valor da nota deve ser entre 0 e 10' });
    }

    const [result] = await db.query('UPDATE nota SET valor = ? WHERE id = ?', [valor, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Nota não encontrada' });
    }

    res.json({ message: 'Nota atualizada com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar nota', error });
  }
};

// Deletar nota
exports.deleteNota = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query('DELETE FROM nota WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Nota não encontrada' });
    }

    res.json({ message: 'Nota removida com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao remover nota', error });
  }
};
