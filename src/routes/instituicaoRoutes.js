const express = require("express");
const router = express.Router();
const controller = require("../controllers/instituicaoController");

// Rotas de instituições
router.get("/", controller.getAllInstituicoes);
router.post("/", controller.createInstituicao);
router.get("/:id", controller.getInstituicaoById);
router.put("/:id", controller.updateInstituicao);
router.delete("/:id", controller.deleteInstituicao);

module.exports = router;
