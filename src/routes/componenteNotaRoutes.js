// Feito por Leonardo

const express = require("express");
const router = express.Router();
const componenteNotaController = require("../controllers/componenteNotaController");

// Rota para listar todas as componente de nota
router.get('/', componenteNotaController.getAllcomponenteNotas);

// Rota para buscar uma componente de nota pelo ID
router.get('/:id', componenteNotaController.getcomponenteNotaById);

// Rota para criar uma nova componente de nota
router.post('/', componenteNotaController.createcomponenteNota);

// Rota para atualizar uma componente de nota existente
router.put('/:id', componenteNotaController.updatecomponenteNota);

// Rota para deletar uma componente de nota
router.delete('/:id', componenteNotaController.deletecomponenteNota);

module.exports = router;