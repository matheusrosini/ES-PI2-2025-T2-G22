// Feito por Leonardo

const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const crypto = require('crypto');
const { sendMail } = require('../utils/mailer');

const JWT_SECRET = process.env.JWT_SECRET;
const FRONT_URL = process.env.FRONT_URL || "http://localhost:3000"; // frontend base (Vercel URL)

exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { nome, email, telefone, senha } = req.body;

    const [rows] = await db.query('SELECT id FROM usuario WHERE email = ?', [email]);
    if (rows.length > 0) return res.status(400).json({ message: 'Email já cadastrado' });

    const hashed = await bcrypt.hash(senha, 10);

    await db.query(
      'INSERT INTO usuario (nome, email, telefone, senha) VALUES (?, ?, ?, ?)',
      [nome, email, telefone, hashed]
    );

    res.status(201).json({ message: 'Usuário registrado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro no registro', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    const user = await Usuario.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const validPassword = await bcrypt.compare(senha, user.senha);
    if (!validPassword) {
      return res.status(400).json({ message: 'Senha incorreta' });
    }

    const JWT_SECRET = process.env.JWT_SECRET;

    const token = jwt.sign(
      {
        id: user.id,
        nome: user.nome,
        email: user.email
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      message: 'Login bem-sucedido',
      token,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email
      }
    });

  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
};


/* ======================
   ESQUECI A SENHA
   ====================== */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email é obrigatório' });

    const [rows] = await db.query('SELECT id, nome FROM usuario WHERE email = ?', [email]);
    if (rows.length === 0) {
      // Para evitar user enumeration, retornamos mensagem genérica
      return res.json({ message: 'Se o e-mail estiver cadastrado, você receberá instruções.' });
    }

    const user = rows[0];

    // gerar token aleatório
    const token = crypto.randomBytes(32).toString('hex');
    const expira = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    // salvar token e expiração no banco
    await db.query(
      'UPDATE usuario SET reset_token = ?, reset_token_expira = ? WHERE id = ?',
      [token, expira, user.id]
    );

    // link de reset
    const resetLink = `${FRONT_URL.replace(/\/$/, '')}/reset-password.html?token=${token}&email=${encodeURIComponent(email)}`;

    // enviar e-mail (se mailer configurado, caso contrário log)
    const subject = 'Recuperação de senha';
    const html = `
      <p>Olá ${user.nome},</p>
      <p>Recebemos um pedido para redefinir sua senha. Clique no link abaixo para criar uma nova senha (válido por 1 hora):</p>
      <p><a href="${resetLink}">${resetLink}</a></p>
      <p>Se você não solicitou, ignore essa mensagem.</p>
    `;

    await sendMail({ to: email, subject, html, text: `Redefinir: ${resetLink}` });

    return res.json({ message: 'Se o e-mail estiver cadastrado, você receberá instruções.' });
  } catch (err) {
    console.error('forgotPassword error:', err);
    return res.status(500).json({ message: 'Erro ao processar recuperação de senha', error: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, senha, email } = req.body;

    if (!token || !senha || !email) return res.status(400).json({ message: 'Dados incompletos' });
    if (senha.length < 6) return res.status(400).json({ message: 'Senha precisa ter ao menos 6 caracteres' });

    // buscar usuário de acordo com token e email
    const [rows] = await db.query('SELECT id, reset_token_expira FROM usuario WHERE email = ? AND reset_token = ?', [email, token]);
    if (rows.length === 0) return res.status(400).json({ message: 'Token inválido ou expirado' });

    const user = rows[0];
    const expira = new Date(user.reset_token_expira);
    if (!expira || expira < new Date()) {
      return res.status(400).json({ message: 'Token expirado' });
    }

    // atualizar senha
    const hashed = await bcrypt.hash(senha, 10);
    await db.query('UPDATE usuario SET senha = ?, reset_token = NULL, reset_token_expira = NULL WHERE id = ?', [hashed, user.id]);

    return res.json({ message: 'Senha redefinida com sucesso' });
  } catch (err) {
    console.error('resetPassword error:', err);
    return res.status(500).json({ message: 'Erro ao redefinir senha', error: err.message });
  }
};
