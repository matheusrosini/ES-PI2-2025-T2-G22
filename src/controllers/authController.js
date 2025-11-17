// Feito por Leonardo

const oracledb = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const crypto = require('crypto');
const { sendMail } = require('../utils/mailer');

const JWT_SECRET = process.env.JWT_SECRET;
const FRONT_URL = process.env.FRONT_URL || "http://localhost:3000";


// ======================================
// REGISTER
// ======================================
exports.register = async (req, res) => {
  let conn;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { nome, email, telefone, senha } = req.body;

    conn = await oracledb.getConnection();

    // Verificar email duplicado
    const result = await conn.execute(
      `SELECT id FROM usuario WHERE email = :email`,
      { email }
    );

    if (result.rows.length > 0) {
      return res.status(400).json({ message: 'Email já cadastrado' });
    }

    const hashed = await bcrypt.hash(senha, 10);

    await conn.execute(
      `INSERT INTO usuario (nome, email, telefone, senha)
       VALUES (:nome, :email, :telefone, :senha)`,
      { nome, email, telefone, senha: hashed },
      { autoCommit: true }
    );

    res.status(201).json({ message: 'Usuário registrado com sucesso' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro no registro', error: err.message });
  } finally {
    if (conn) await conn.close();
  }
};


// ======================================
// LOGIN
// ======================================
exports.login = async (req, res) => {
  let conn;

  try {
    const { email, senha } = req.body;

    conn = await oracledb.getConnection();

    const result = await conn.execute(
      `SELECT id, nome, email, senha
       FROM usuario 
       WHERE email = :email`,
      { email }
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const row = result.rows[0];

    const user = {
      id: row.ID,
      nome: row.NOME,
      email: row.EMAIL,
      senhaHash: row.SENHA
    };


    const validPassword = await bcrypt.compare(senha, user.senhaHash);
    if (!validPassword) {
      return res.status(400).json({ message: 'Senha incorreta' });
    }

    const token = jwt.sign(
      { id: user.id, nome: user.nome, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      message: 'Login bem-sucedido',
      token,
      user: { id: user.id, nome: user.nome, email: user.email }
    });

  } catch (err) {
    console.error("Erro no login:", err);
    res.status(500).json({ message: 'Erro interno no servidor' });
  } finally {
    if (conn) await conn.close();
  }
};


// ======================================
// FORGOT PASSWORD
// ======================================
exports.forgotPassword = async (req, res) => {
  let conn;

  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email é obrigatório' });

    conn = await oracledb.getConnection();

    const result = await conn.execute(
      `SELECT id, nome 
       FROM usuario 
       WHERE email = :email`,
      { email }
    );

    if (result.rows.length === 0) {
      return res.json({ message: 'Se o e-mail estiver cadastrado, você receberá instruções.' });
    }

    const user = {
      id: result.rows[0][0],
      nome: result.rows[0][1]
    };

    const token = crypto.randomBytes(32).toString('hex');
    const expira = new Date(Date.now() + 60 * 60 * 1000);

    await conn.execute(
      `UPDATE usuario 
       SET reset_token = :token, reset_token_expira = :expira 
       WHERE id = :id`,
      { token, expira, id: user.id },
      { autoCommit: true }
    );

    const resetLink = `${FRONT_URL.replace(/\/$/, '')}/reset-password.html?token=${token}&email=${encodeURIComponent(email)}`;

    const subject = 'Recuperação de senha';
    const html = `
      <p>Olá ${user.nome},</p>
      <p>Para redefinir sua senha, clique no link abaixo (válido por 1 hora):</p>
      <p><a href="${resetLink}">${resetLink}</a></p>
    `;

    await sendMail({ to: email, subject, html, text: resetLink });

    return res.json({ message: 'Se o e-mail estiver cadastrado, você receberá instruções.' });

  } catch (err) {
    console.error('forgotPassword error:', err);
    return res.status(500).json({ message: 'Erro ao processar recuperação de senha', error: err.message });
  } finally {
    if (conn) await conn.close();
  }
};


// ======================================
// RESET PASSWORD
// ======================================
exports.resetPassword = async (req, res) => {
  let conn;

  try {
    const { token, senha, email } = req.body;

    if (!token || !senha || !email)
      return res.status(400).json({ message: 'Dados incompletos' });

    if (senha.length < 6)
      return res.status(400).json({ message: 'Senha precisa ter ao menos 6 caracteres' });

    conn = await oracledb.getConnection();

    const result = await conn.execute(
      `SELECT id, reset_token_expira
       FROM usuario
       WHERE email = :email AND reset_token = :token`,
      { email, token }
    );

    if (result.rows.length === 0)
      return res.status(400).json({ message: 'Token inválido ou expirado' });

    const user = {
      id: result.rows[0][0],
      expira: result.rows[0][1]
    };

    if (!user.expira || new Date(user.expira) < new Date()) {
      return res.status(400).json({ message: 'Token expirado' });
    }

    const hashed = await bcrypt.hash(senha, 10);

    await conn.execute(
      `UPDATE usuario
       SET senha = :senha, reset_token = NULL, reset_token_expira = NULL
       WHERE id = :id`,
      { senha: hashed, id: user.id },
      { autoCommit: true }
    );

    return res.json({ message: 'Senha redefinida com sucesso' });

  } catch (err) {
    console.error('resetPassword error:', err);
    return res.status(500).json({ message: 'Erro ao redefinir senha', error: err.message });
  } finally {
    if (conn) await conn.close();
  }
};
