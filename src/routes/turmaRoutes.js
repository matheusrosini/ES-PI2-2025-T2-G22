// Feito por Leonardo e Matheus Rosini

const express = require('express');
const router = express.Router();
const turmaController = require('../controllers/turmaController');

// Rota para listar todas as turmas
router.get('/', turmaController.getAllTurmas);

// Rota para buscar uma turma pelo ID
router.get('/:id', turmaController.getTurmaById);

// Rota para criar uma nova turma
router.post('/', turmaController.createTurma);

// Rota para atualizar uma turma existente
router.put('/:id', turmaController.updateTurma);

// Rota para deletar uma turma
router.delete('/:id', turmaController.deleteTurma);

module.exports = router;