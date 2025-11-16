const express = require('express');
const router = express.Router();
const alunoController = require('../controllers/alunoController');

// Listar alunos de uma turma
router.get('/turma/:turmaId', alunoController.getAlunosByTurma);

// Criar aluno em uma turma
router.post('/turma/:turmaId', alunoController.createAluno);

// Atualizar aluno
router.put('/:id', alunoController.updateAluno);

// Remover aluno
router.delete('/:id', alunoController.deleteAluno);

module.exports = router;
