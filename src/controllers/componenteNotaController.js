// Feito por Leonardo

const db = require('../config/db');

// Buscar todos os componentes
exports.getAllComponentes = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT c.id, c.nome, c.sigla, c.descricao, d.nome AS disciplina
      FROM componente_nota c
      LEFT JOIN disciplina d ON c.disciplina_id = d.id
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar componentes de nota', error });
  }
};

// Buscar componente por ID
exports.getComponenteById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM componente_nota WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Componente de nota não encontrado' });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar componente de nota', error });
  }
};

// Criar novo componente
exports.createComponente = async (req, res) => {
  try {
    const { nome, sigla, descricao, disciplina_id } = req.body;

    if (!nome || !sigla) {
      return res.status(400).json({ message: 'Nome e sigla são obrigatórios' });
    }

    await db.query(
      'INSERT INTO componente_nota (nome, sigla, descricao, disciplina_id) VALUES (?, ?, ?, ?)',
      [nome, sigla, descricao, disciplina_id]
    );

    res.status(201).json({ message: 'Componente de nota criado com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar componente de nota', error });
  }
};

// Atualizar componente
exports.updateComponente = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, sigla, descricao, disciplina_id } = req.body;

    await db.query(
      'UPDATE componente_nota SET nome = ?, sigla = ?, descricao = ?, disciplina_id = ? WHERE id = ?',
      [nome, sigla, descricao, disciplina_id, id]
    );

    res.json({ message: 'Componente de nota atualizado com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar componente de nota', error });
  }
};

// Deletar componente
exports.deleteComponente = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query('DELETE FROM componente_nota WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Componente de nota não encontrado' });
    }

    res.json({ message: 'Componente de nota removido com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao remover componente de nota', error });
  }
};
