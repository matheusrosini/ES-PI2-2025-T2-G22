// Feito por Leonardo

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');

// POST /auth/register
router.post(
  '/register',
  [
    body('nome').notEmpty().withMessage('Nome obrigatório'),
    body('email').isEmail().withMessage('Email inválido'),
    body('telefone').optional().isString(),
    body('senha').isLength({ min: 6 }).withMessage('Senha precisa ter ao menos 6 caracteres')
  ],
  authController.register   
);

// POST /auth/login
router.post(
  '/login',
  [
    body('email').isEmail(),
    body('senha').notEmpty()
  ],
  authController.login
);

module.exports = router;
