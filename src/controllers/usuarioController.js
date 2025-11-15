// Feito por Matheus Rosini
const db = require('../config/db');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// ===== CRUD Usuário =====

// Buscar todos os usuários
exports.getAllUsuarios = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, nome, email, telefone FROM usuario');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar usuários', error });
    }
};

// Buscar usuário por ID
exports.getUsuariosById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query('SELECT id, nome, email, telefone FROM usuario WHERE id = ?', [id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Usuário não encontrado' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar usuário', error });
    }
};

// Criar novo usuário
exports.createUsuarios = async (req, res) => {
    try {
        const { nome, email, telefone, senha } = req.body;
        if (!nome || !email || !senha) return res.status(400).json({ message: 'Nome, email e senha são obrigatórios' });

        const [existing] = await db.query('SELECT * FROM usuario WHERE email = ?', [email]);
        if (existing.length > 0) return res.status(409).json({ message: 'Email já cadastrado' });

        const senhaHash = await bcrypt.hash(senha, saltRounds);

        await db.query('INSERT INTO usuario (nome, email, telefone, senha) VALUES (?, ?, ?, ?)',
            [nome, email, telefone, senhaHash]);

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

        let senhaHash = senha;
        if (senha) {
            senhaHash = await bcrypt.hash(senha, saltRounds);
        }

        await db.query(
            'UPDATE usuario SET nome = ?, email = ?, telefone = ?, senha = ? WHERE id = ?',
            [nome, email, telefone, senhaHash, id]
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
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Usuário não encontrado' });

        res.json({ message: 'Usuário removido com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao remover usuário', error });
    }
};

// ===== LOGIN e REGISTRO =====

// Login
exports.login = async (req, res) => {
    try {
        const { email, senha } = req.body;
        if (!email || !senha) return res.status(400).json({ error: "Email e senha são obrigatórios" });

        const [rows] = await db.query('SELECT * FROM usuario WHERE email = ?', [email]);
        if (rows.length === 0) return res.status(404).json({ error: "Usuário não encontrado" });

        const usuario = rows[0];
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) return res.status(401).json({ error: "Senha incorreta" });

        return res.json({ message: "Login OK", usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email } });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Erro no servidor" });
    }
};

// Registro
exports.register = async (req, res) => {
    try {
        const { nome, email, telefone, senha } = req.body;
        if (!nome || !email || !senha) return res.status(400).json({ error: "Nome, email e senha são obrigatórios" });

        const [existing] = await db.query('SELECT * FROM usuario WHERE email = ?', [email]);
        if (existing.length > 0) return res.status(409).json({ error: "Email já cadastrado" });

        const senhaHash = await bcrypt.hash(senha, saltRounds);

        await db.query('INSERT INTO usuario (nome, email, telefone, senha) VALUES (?, ?, ?, ?)',
            [nome, email, telefone, senhaHash]);

        return res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Erro ao cadastrar usuário" });
    }
};
