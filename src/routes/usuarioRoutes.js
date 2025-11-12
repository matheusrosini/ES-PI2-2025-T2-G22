const express = require("express");
const router = express.Router();
const controller = require("../controllers/usuarioController");

// Rotas de usuários
router.get("/", controller.getAllUsuarios);
router.post("/", controller.createUsuarios);
router.get("/:id", controller.getUsuariosById);
router.put("/:id", controller.updateUsuarios);
router.delete("/:id", controller.removeUsuarios);

module.exports = router;
