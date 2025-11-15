// Feito por Leonardo

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');

// POST /auth/register
router.post(
  '/register',
  [
    body('nome').notEmpty(),
    body('email').isEmail(),
    body('telefone').optional().isString(),
    body('senha').isLength({ min: 6 })
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
