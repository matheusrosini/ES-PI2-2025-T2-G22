// Feito por Leonardo e Matheus Rosini

const express = require("express");
const router = express.Router();
const notaController = require("../controllers/notaController");
const { authMiddleware } = require('../middlewares/authmiddleware');

// LISTAR alunos + componentes + notas da turma
router.get(
  "/turma/:turmaId/disciplina/:disciplinaId",
  authMiddleware,
  notaController.getNotasByTurmaEDisciplina
);

// REGISTRAR / ATUALIZAR nota via PUT
router.put("/registrar", authMiddleware, notaController.registrarNota);

// CRUD
router.get("/", authMiddleware, notaController.getAllNotas);
router.get("/:id", authMiddleware, notaController.getNotaById);
router.post("/", authMiddleware, notaController.createNota);
router.put("/:id", authMiddleware, notaController.updateNota);
router.delete("/:id", authMiddleware, notaController.deleteNota);

module.exports = router;
