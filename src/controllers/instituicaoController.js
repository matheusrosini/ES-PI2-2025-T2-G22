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

// Criar nova instituição (somente NOME)
exports.createInstituicao = async (req, res) => {
    try {
        const { nome } = req.body;

        if (!nome)
            return res.status(400).json({ message: 'O nome é obrigatório' });

        await db.query('INSERT INTO instituicao (nome) VALUES (?)', [nome]);

        res.status(201).json({ message: 'Instituição criada com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar instituição', error });
    }
};

// Atualizar instituição (somente NOME)
exports.updateInstituicao = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome } = req.body;

        if (!nome)
            return res.status(400).json({ message: 'O nome é obrigatório' });

        const [result] = await db.query(
            'UPDATE instituicao SET nome = ? WHERE id = ?',
            [nome, id]
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
