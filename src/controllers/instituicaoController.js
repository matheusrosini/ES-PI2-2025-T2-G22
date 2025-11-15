// Feito por Matheus Rosini

const db = require('../config/db');

// Buscar todas as instituições
exports.getAllInstituicoes = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM instituicao');
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
        const { nome, cnpj, endereco, usuario_id } = req.body;
        if (!nome || !cnpj || !endereco)
            return res.status(400).json({ message: 'Todos os campos são obrigatórios' });

        await db.query(
            'INSERT INTO instituicao (nome, cnpj, endereco, usuario_id) VALUES (?, ?, ?, ?)',
            [nome, cnpj, endereco, usuario_id]
        );

        res.status(201).json({ message: 'Instituição criada com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar instituição', error });
    }
};

// Atualizar instituição
exports.updateInstituicao = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, cnpj, endereco, usuario_id } = req.body;
        if (!nome || !cnpj || !endereco)
            return res.status(400).json({ message: 'Todos os campos são obrigatórios' });

        const [result] = await db.query(
            'UPDATE instituicao SET nome = ?, cnpj = ?, endereco = ?, usuario_id = ? WHERE id = ?',
            [nome, cnpj, endereco, usuario_id, id]
        );

        if (result.affectedRows === 0)
            return res.status(404).json({ message: 'Instituição não encontrada' });

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
