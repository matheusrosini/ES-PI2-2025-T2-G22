// Feito por Matheus Rosini


const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");

// ===== LOGIN e REGISTRO =====
router.post("/login", usuarioController.login);
router.post("/register", usuarioController.register);

const { authMiddleware } = require('../middlewares/authmiddleware');

// ===== CRUD Usuário =====
router.get("/", authMiddleware, usuarioController.getAllUsuarios);
router.get("/:id", authMiddleware, usuarioController.getUsuariosById);
router.post("/", authMiddleware, usuarioController.createUsuarios);
router.put("/:id", authMiddleware, usuarioController.updateUsuarios);
router.delete("/:id", authMiddleware, usuarioController.removeUsuarios);



module.exports = router;
