// Feito por Leonardo e Matheus Rosini

const express = require("express");
const router = express.Router();
const notaController = require("../controllers/notaController");
const { requireAuth } = require('../middlewares/authmiddleware');

router.use(requireAuth);

// LISTAR alunos + componentes + notas da turma
router.get(
  "/turma/:turmaId/disciplina/:disciplinaId",
  notaController.getNotasByTurmaEDisciplina
);

// REGISTRAR / ATUALIZAR nota via PUT
router.put("/registrar", notaController.registrarNota);

// CRUD
router.get("/", notaController.getAllNotas);
router.get("/:id", notaController.getNotaById);
router.post("/", notaController.createNota);
router.put("/:id", notaController.updateNota);
router.delete("/:id", notaController.deleteNota);

module.exports = router;
