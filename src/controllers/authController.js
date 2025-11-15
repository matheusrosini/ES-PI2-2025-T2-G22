const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// ideal: mover segredo para process.env.JWT_SECRET
const JWT_SECRET = process.env.JWT_SECRET;

exports.register = async (req, res) => {
  try {
    // validação de entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { nome, email, telefone, senha } = req.body;

    // verifica se já existe email
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, senha } = req.body;

    const [rows] = await db.query('SELECT * FROM usuario WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(400).json({ message: 'Credenciais inválidas' });

    const user = rows[0];
    const valid = await bcrypt.compare(senha, user.senha);
    if (!valid) return res.status(400).json({ message: 'Credenciais inválidas' });

    // gera token JWT (payload mínimo)
    const token = jwt.sign({ id: user.id, nome: user.nome, email: user.email }, JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({ token, user: { id: user.id, nome: user.nome, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro no login', error: err.message });
  }
};
