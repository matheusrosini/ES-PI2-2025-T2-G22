// Feito por Leonardo

const express = require('express');
const router = express.Router();
const professorController = require('../controllers/professorController');

// Rota para listar todas as professors
router.get('/', professorController.getAllprofessors);

// Rota para buscar uma professor pelo ID
router.get('/:id', professorController.getprofessorById);

// Rota para criar uma nova professor
router.post('/', professorController.createprofessor);

// Rota para atualizar uma professor existente
router.put('/:id', professorController.updateprofessor);

// Rota para deletar uma professor
router.delete('/:id', professorController.deleteprofessor);

module.exports = router;