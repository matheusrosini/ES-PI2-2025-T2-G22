// Feito por Leonardo

const express = require("express");
const router = express.Router();
const componenteNotaController = require("../controllers/componenteNotaController");

// Rota para listar todas as componente de nota
router.get('/', componenteNotaController.getAllComponentes);

// Rota para buscar uma componente de nota pelo ID
router.get('/:id', componenteNotaController.getComponenteById);

// Rota para criar uma nova componente de nota
router.post('/', componenteNotaController.createComponente);

// Rota para atualizar uma componente de nota existente
router.put('/:id', componenteNotaController.updateComponente);

// Rota para deletar uma componente de nota
router.delete('/:id', componenteNotaController.deleteComponente);

module.exports = router;