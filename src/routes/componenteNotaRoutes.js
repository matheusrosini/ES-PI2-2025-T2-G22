// Feito por Leonardo

const express = require("express");
const router = express.Router();
const componenteNotaController = require("../controllers/componenteNotaController");

// Listar componentes por disciplina
router.get("/disciplina/:disciplinaId", componenteNotaController.getByDisciplina);

// Criar componente
router.post("/", componenteNotaController.create);

// Atualizar componente
router.put("/:id", componenteNotaController.update);

// Deletar componente
router.delete("/:id", componenteNotaController.delete);

module.exports = router;
