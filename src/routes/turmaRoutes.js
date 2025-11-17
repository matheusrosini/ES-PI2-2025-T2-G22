// Feito por Leonardo e Matheus Rosini

const express = require("express");
const router = express.Router();
const turmaController = require("../controllers/turmaController");
const { authMiddleware } = require('../middlewares/authmiddleware');

// Rotas da turma
router.get("/", authMiddleware, turmaController.getAllTurmas);
router.get("/:id", authMiddleware, turmaController.getTurmaById);
router.post("/", authMiddleware, turmaController.createTurma);
router.put("/:id", authMiddleware, turmaController.updateTurma);
router.delete("/:id", authMiddleware, turmaController.deleteTurma);

module.exports = router;
