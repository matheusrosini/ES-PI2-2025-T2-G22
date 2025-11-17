// Feito por Matheus Rosini

const db = require('../config/db');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// =============================================
// GET - Buscar todos os usuários
// =============================================
exports.getAllUsuarios = async (req, res) => {
    let conn;
    try {
        conn = await db.open();
        const result = await conn.execute(
            `SELECT id, nome, email, telefone FROM usuario`
        );

        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar usuários', error });
    } finally {
        if (conn) await db.close(conn);
    }
};

// =============================================
// GET - Buscar usuário por ID
// =============================================
exports.getUsuariosById = async (req, res) => {
    let conn;
    try {
        conn = await db.open();

        const result = await conn.execute(
            `SELECT id, nome, email, telefone 
             FROM usuario 
             WHERE id = :id`,
            { id: req.params.id }
        );

        if (result.rows.length === 0)
            return res.status(404).json({ message: 'Usuário não encontrado' });

        res.json(result.rows[0]);

    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar usuário', error });
    } finally {
        if (conn) await db.close(conn);
    }
};

// =============================================
// POST - Criar usuário
// =============================================
exports.createUsuarios = async (req, res) => {
    let conn;
    try {
        const { nome, email, telefone, senha } = req.body;

        if (!nome || !email || !senha) 
            return res.status(400).json({ message: 'Nome, email e senha são obrigatórios' });

        conn = await db.open();

        const check = await conn.execute(
            `SELECT id FROM usuario WHERE email = :email`,
            { email }
        );

        if (check.rows.length > 0)
            return res.status(409).json({ message: 'Email já cadastrado' });

        const senhaHash = await bcrypt.hash(senha, saltRounds);

        await conn.execute(
            `INSERT INTO usuario (nome, email, telefone, senha)
             VALUES (:nome, :email, :telefone, :senha)`,
            { nome, email, telefone, senha: senhaHash },
            { autoCommit: true }
        );

        res.status(201).json({ message: 'Usuário criado com sucesso!' });

    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar usuário', error });
    } finally {
        if (conn) await db.close(conn);
    }
};

// =============================================
// PUT - Atualizar usuário
// =============================================
exports.updateUsuarios = async (req, res) => {
    let conn;
    try {
        const { id } = req.params;
        const { nome, email, telefone, senha } = req.body;

        conn = await db.open();

        let senhaHash = null;
        if (senha) {
            senhaHash = await bcrypt.hash(senha, saltRounds);
        }

        await conn.execute(
            `UPDATE usuario 
             SET nome = :nome, 
                 email = :email, 
                 telefone = :telefone, 
                 senha = NVL(:senha, senha)
             WHERE id = :id`,
            {
                nome,
                email,
                telefone,
                senha: senhaHash,
                id
            },
            { autoCommit: true }
        );

        res.json({ message: 'Usuário atualizado com sucesso!' });

    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar usuário', error });
    } finally {
        if (conn) await db.close(conn);
    }
};

// =============================================
// DELETE - Remover usuário
// =============================================
exports.removeUsuarios = async (req, res) => {
    let conn;
    try {
        conn = await db.open();

        const result = await conn.execute(
            `DELETE FROM usuario WHERE id = :id`,
            { id: req.params.id },
            { autoCommit: true }
        );

        if (result.rowsAffected === 0)
            return res.status(404).json({ message: 'Usuário não encontrado' });

        res.json({ message: 'Usuário removido com sucesso!' });

    } catch (error) {
        res.status(500).json({ message: 'Erro ao remover usuário', error });
    } finally {
        if (conn) await db.close(conn);
    }
};

// =============================================
// LOGIN
// =============================================
exports.login = async (req, res) => {
    let conn;
    try {
        const { email, senha } = req.body;
        if (!email || !senha)
            return res.status(400).json({ error: "Email e senha são obrigatórios" });

        conn = await db.open();

        const result = await conn.execute(
            `SELECT * FROM usuario WHERE email = :email`,
            { email }
        );

        if (result.rows.length === 0)
            return res.status(404).json({ error: "Usuário não encontrado" });

        const usuario = result.rows[0];

        const senhaValida = await bcrypt.compare(senha, usuario.SENHA);
        if (!senhaValida)
            return res.status(401).json({ error: "Senha incorreta" });

        return res.json({
            message: "Login OK",
            usuario: {
                id: usuario.ID,
                nome: usuario.NOME,
                email: usuario.EMAIL
            }
        });

    } catch (err) {
        return res.status(500).json({ error: "Erro no servidor" });
    } finally {
        if (conn) await db.close(conn);
    }
};

// =============================================
// REGISTRO
// =============================================
exports.register = async (req, res) => {
    let conn;
    try {
        const { nome, email, telefone, senha } = req.body;

        if (!nome || !email || !senha)
            return res.status(400).json({ error: "Nome, email e senha são obrigatórios" });

        conn = await db.open();

        const check = await conn.execute(
            `SELECT id FROM usuario WHERE email = :email`,
            { email }
        );

        if (check.rows.length > 0)
            return res.status(409).json({ error: "Email já cadastrado" });

        const senhaHash = await bcrypt.hash(senha, saltRounds);

        await conn.execute(
            `INSERT INTO usuario (nome, email, telefone, senha)
             VALUES (:nome, :email, :telefone, :senha)`,
            { nome, email, telefone, senha: senhaHash },
            { autoCommit: true }
        );

        return res.status(201).json({ message: "Usuário cadastrado com sucesso!" });

    } catch (err) {
        return res.status(500).json({ error: "Erro ao cadastrar usuário" });
    } finally {
        if (conn) await db.close(conn);
    }
};
