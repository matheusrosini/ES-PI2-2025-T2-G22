const db = require('../config/db');

// Buscar todos os usuários
exports.getAllUsuarios = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM usuario');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar usuários', error });
    }
};

// Buscar usuário por ID
exports.getUsuariosById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query('SELECT * FROM usuario WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar usuário', error });
    }
};

// Criar novo usuário
exports.createUsuarios = async (req, res) => {
    try {
        const { nome, email, telefone, senha } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).json({ message: 'Nome, e-mail e senha são obrigatórios' });
        }

        await db.query(
            'INSERT INTO usuario (nome, email, telefone, senha) VALUES (?, ?, ?, ?)',
            [nome, email, telefone, senha]
        );

        res.status(201).json({ message: 'Usuário criado com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar usuário', error });
    }
};

// Atualizar usuário
exports.updateUsuarios = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, email, telefone, senha } = req.body;

        await db.query(
            'UPDATE usuario SET nome = ?, email = ?, telefone = ?, senha = ? WHERE id = ?',
            [nome, email, telefone, senha, id]
        );

        res.json({ message: 'Usuário atualizado com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar usuário', error });
    }
};

// Remover usuário
exports.removeUsuarios = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query('DELETE FROM usuario WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        res.json({ message: 'Usuário removido com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao remover usuário', error });
    }
};
