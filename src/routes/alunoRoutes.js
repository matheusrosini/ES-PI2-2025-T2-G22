// Feito por Leonardo

const express = require('express');
const router = express.Router();
const alunoController = require('../controllers/alunoController');
const { authMiddleware } = require("../middlewares/authmiddleware");

// Listar alunos por turma
router.get('/turma/:turmaId', authMiddleware, alunoController.getAlunosByTurma);

// Criar aluno em uma turma
router.post('/turma/:turmaId', authMiddleware, alunoController.createAluno);

// Buscar aluno por ID
router.get('/:id', authMiddleware, alunoController.getAlunoById);

// Atualizar aluno
router.put('/:id', authMiddleware, alunoController.updateAluno);

// Deletar aluno
router.delete('/:id', authMiddleware, alunoController.deleteAluno);

module.exports = router;
