const express = require("express");
const router = express.Router();
const controller = require("../controllers/disciplinaController");

// Rotas de disciplinas
router.get("/", controller.getAllDisciplinas);
router.post("/", controller.createDisciplina);
router.get("/:id", controller.getDisciplinaById);
router.put("/:id", controller.updateDisciplina);
router.delete("/:id", controller.deleteDisciplina);

module.exports = router;
