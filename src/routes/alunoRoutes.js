// Feito por Leonardo

const express = require('express');
const router = express.Router();
const alunoController = require('../controllers/alunoController');
const { requireAuth } = require('../middlewares/authmiddleware');


router.use(requireAuth);

// Listar alunos por turma
router.get('/turma/:turmaId', alunoController.getAlunosByTurma);

// Criar aluno em uma turma
router.post('/turma/:turmaId', alunoController.createAluno);

// Buscar aluno por ID
router.get('/:id', alunoController.getAlunoById);

// Atualizar aluno
router.put('/:id', alunoController.updateAluno);

// Deletar aluno
router.delete('/:id', alunoController.deleteAluno);

module.exports = router;
