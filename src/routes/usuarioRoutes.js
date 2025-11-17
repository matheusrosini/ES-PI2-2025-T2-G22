// Feito por Matheus Rosini


const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");

// ===== LOGIN e REGISTRO =====
router.post("/login", usuarioController.login);
router.post("/register", usuarioController.register);


// ===== CRUD Usuário =====
router.get("/", usuarioController.getAllUsuarios);
router.get("/:id", usuarioController.getUsuariosById);
router.post("/", usuarioController.createUsuarios);
router.put("/:id", usuarioController.updateUsuarios);
router.delete("/:id", usuarioController.removeUsuarios);



module.exports = router;
