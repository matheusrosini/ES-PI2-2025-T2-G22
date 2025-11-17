// Feito por Leonardo e Matheus Rosini

const express = require("express");
const router = express.Router();
const turmaController = require("../controllers/turmaController");

// Rotas da turma
router.get("/", turmaController.getAllTurmas);
router.get("/:id", turmaController.getTurmaById);
router.post("/", turmaController.createTurma);
router.put("/:id", turmaController.updateTurma);
router.delete("/:id", turmaController.deleteTurma);

module.exports = router;
