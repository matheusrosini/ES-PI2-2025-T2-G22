// Feito por Leonardo

const express = require('express');
const router = express.Router();
const professorController = require('../controllers/professorController');

// Rota para listar todas as professors
router.get('/', professorController.getAllProfessores);

// Rota para buscar uma professor pelo ID
router.get('/:id', professorController.getProfessorById);

// Rota para criar uma nova professor
router.post('/', professorController.createProfessor);

// Rota para atualizar uma professor existente
router.put('/:id', professorController.updateProfessor);

// Rota para deletar uma professor
router.delete('/:id', professorController.deleteProfessor);

module.exports = router;