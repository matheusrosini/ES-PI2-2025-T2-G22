const db = require('../config/db');

// Buscar todos os cursos
exports.getAllCursos = async (req, res) => {
    try {
        const [rows] = await db.query(`
      SELECT c.id, c.nome, c.duracao, i.nome AS instituicao
      FROM cursos c
      LEFT JOIN instituicao i ON c.instituicao_id = i.id
    `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar cursos', error });
    }
};

// Buscar curso por ID
exports.getCursoById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query('SELECT * FROM cursos WHERE id = ?', [id]);
        if (rows.length === 0)
            return res.status(404).json({ message: 'Curso não encontrado' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar curso', error });
    }
};

// Criar novo curso
exports.createCurso = async (req, res) => {
    try {
        const { nome, duracao, instituicao_id } = req.body;
        if (!nome) return res.status(400).json({ message: 'Nome é obrigatório' });

        await db.query(
            'INSERT INTO cursos (nome, duracao, instituicao_id) VALUES (?, ?, ?)',
            [nome, duracao, instituicao_id]
        );

        res.status(201).json({ message: 'Curso criado com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar curso', error });
    }
};

// Atualizar curso
exports.updateCurso = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, duracao, instituicao_id } = req.body;

        await db.query(
            'UPDATE cursos SET nome = ?, duracao = ?, instituicao_id = ? WHERE id = ?',
            [nome, duracao, instituicao_id, id]
        );

        res.json({ message: 'Curso atualizado com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar curso', error });
    }
};

// Deletar curso
exports.deleteCurso = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query('DELETE FROM cursos WHERE id = ?', [id]);
        if (result.affectedRows === 0)
            return res.status(404).json({ message: 'Curso não encontrado' });

        res.json({ message: 'Curso removido com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao remover curso', error });
    }
};
