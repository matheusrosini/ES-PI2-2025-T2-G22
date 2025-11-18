// Feito por Leonardo

const express = require('express');
const router = express.Router();
const alunoController = require('../controllers/alunoController');
const { authMiddleware } = require("../middlewares/authmiddleware");

// Listar todos os alunos com filtros opcionais (instituicao_id, disciplina_id, turma_id)
router.get('/', authMiddleware, alunoController.getAllAlunos);

// Criar aluno (aceita nome, matricula, turma_id no body)
router.post('/', authMiddleware, alunoController.createAluno);

// Listar alunos por turma
router.get('/turma/:turmaId', authMiddleware, alunoController.getAlunosByTurma);

// Criar aluno em uma turma (endpoint antigo mantido para compatibilidade)
router.post('/turma/:turmaId', authMiddleware, alunoController.createAlunoByTurma);

// Buscar aluno por ID
router.get('/:id', authMiddleware, alunoController.getAlunoById);

// Atualizar aluno
router.put('/:id', authMiddleware, alunoController.updateAluno);

// Deletar aluno
router.delete('/:id', authMiddleware, alunoController.deleteAluno);

module.exports = router;