// Feito por Leonardo

const express = require('express');
const router = express.Router();
const alunoController = require('../controllers/alunoController');
const uploadCSV = require("../middlewares/uploadCSV");
const authMiddleware = require("../middlewares/authmiddleware");

// Rota para listar todos os alunos
router.get('/', alunoController.getAllAlunos);

// Rota para buscar um aluno por ID
router.get('/:id', alunoController.getAlunoById);

// Rota para criar um novo aluno
router.post('/', alunoController.createAluno);

// Rota para atualizar um aluno existente
router.put('/:id', alunoController.updateAluno);

// Rota para deletar um aluno
router.delete('/:id', alunoController.deleteAluno);

// Rota para importar alunos via CSV
router.post(
  "/importar-csv/:turmaId",
  authMiddleware,
  uploadCSV.single("arquivo"),
  alunoController.importarCSV
);

module.exports = router;
