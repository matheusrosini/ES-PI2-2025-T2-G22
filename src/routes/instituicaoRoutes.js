const express = require("express");
const router = express.Router();
const controller = require("../controllers/instituicaoController");

// Rotas de instituições
router.get("/", controller.getAll);
router.post("/", controller.create);
router.get("/:id", controller.getById);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

module.exports = router;
