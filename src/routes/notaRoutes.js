const express = require("express");
const router = express.Router();
const notaController = require("../controllers/notaController");

// LISTAR alunos + componentes + notas da turma
router.get(
  "/turma/:turmaId/disciplina/:disciplinaId",
  notaController.getNotasByTurmaEDisciplina
);

// REGISTRAR / ATUALIZAR nota
router.put("/registrar", notaController.registrarNota);

// CRUD básico
router.get("/", notaController.getAllNotas);
router.get("/:id", notaController.getNotaById);
router.post("/", notaController.createNota);
router.put("/:id", notaController.updateNota);
router.delete("/:id", notaController.deleteNota);

module.exports = router;
