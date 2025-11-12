const express = require("express");
const router = express.Router();
const controller = require("../controllers/cursoController");

// Rotas de cursos
router.get("/", controller.getAllCursos);
router.post("/", controller.createCurso);
router.get("/:id", controller.getCursoById);
router.put("/:id", controller.updateCurso);
router.delete("/:id", controller.deleteCurso);

module.exports = router;
