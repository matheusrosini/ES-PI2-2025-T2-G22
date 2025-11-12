const db = require('../config/db');

// Buscar todas as instituições
exports.getAllInstituicoes = async (req, res) => {
    try {
        const [rows] = await db.query(`
      SELECT i.id, i.nome, u.nome AS usuario
      FROM instituicao i
      LEFT JOIN usuario u ON i.usuario_id = u.id
    `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar instituições', error });
    }
};

// Buscar instituição por ID
exports.getInstituicaoById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query('SELECT * FROM instituicao WHERE id = ?', [id]);
        if (rows.length === 0)
            return res.status(404).json({ message: 'Instituição não encontrada' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar instituição', error });
    }
};

// Criar nova instituição
exports.createInstituicao = async (req, res) => {
    try {
        const { nome, usuario_id } = req.body;
        if (!nome) return res.status(400).json({ message: 'Nome é obrigatório' });

        await db.query('INSERT INTO instituicao (nome, usuario_id) VALUES (?, ?)', [
            nome,
            usuario_id,
        ]);

        res.status(201).json({ message: 'Instituição criada com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar instituição', error });
    }
};

// Atualizar instituição
exports.updateInstituicao = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, usuario_id } = req.body;

        await db.query('UPDATE instituicao SET nome = ?, usuario_id = ? WHERE id = ?', [
            nome,
            usuario_id,
            id,
        ]);

        res.json({ message: 'Instituição atualizada com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar instituição', error });
    }
};

// Deletar instituição
exports.deleteInstituicao = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query('DELETE FROM instituicao WHERE id = ?', [id]);
        if (result.affectedRows === 0)
            return res.status(404).json({ message: 'Instituição não encontrada' });

        res.json({ message: 'Instituição removida com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao remover instituição', error });
    }
};
