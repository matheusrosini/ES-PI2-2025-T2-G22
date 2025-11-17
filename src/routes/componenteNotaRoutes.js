// Feito por Leonardo

const express = require("express");
const router = express.Router();
const componenteNotaController = require("../controllers/componenteNotaController");
const { authMiddleware } = require("../middlewares/authmiddleware");

// Listar componentes por disciplina
router.get("/disciplina/:disciplinaId", authMiddleware, componenteNotaController.getByDisciplina);

// Criar componente
router.post("/", authMiddleware, componenteNotaController.create);

// Atualizar componente
router.put("/:id", authMiddleware, componenteNotaController.update);

// Deletar componente
router.delete("/:id", authMiddleware, componenteNotaController.delete);

module.exports = router;
