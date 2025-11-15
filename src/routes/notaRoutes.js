// Feito por Leonardo 

const express = require("express");
const router = express.Router();
const notaController = require("../controllers/notaController");

// Rota para listar todas as Notas
router.get('/', notaController.getAllNotas);

// Rota para buscar uma Nota pelo ID
router.get('/:id', notaController.getNotaById);

// Rota para criar uma nova Nota
router.post('/', notaController.createNota);

// Rota para atualizar uma Nota existente
router.put('/:id', notaController.updateNota);

// Rota para deletar uma Nota
router.delete('/:id', notaController.deleteNota);

module.exports = router;