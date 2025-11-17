// Feito por Matheus Rosini e Leonardo

const express = require("express");
const router = express.Router();
const controller = require("../controllers/disciplinaController");

// 
const { authMiddleware } = require("../middlewares/authmiddleware");

// Todas as rotas agora protegidas corretamente
router.get("/", authMiddleware, controller.getAllDisciplinas);
router.post("/", authMiddleware, controller.createDisciplina);
router.get("/:id", authMiddleware, controller.getDisciplinaById);
router.put("/:id", authMiddleware, controller.updateDisciplina);
router.delete("/:id", authMiddleware, controller.deleteDisciplina);

module.exports = router;
