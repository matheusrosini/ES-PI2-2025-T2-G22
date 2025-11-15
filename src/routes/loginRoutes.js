const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Login simples (email + senha)
router.post("/", (req, res) => {
  const { email, senha } = req.body;

  const sql = "SELECT * FROM usuarios WHERE email = ? AND senha = ?";
  
  db.query(sql, [email, senha], (err, results) => {
    if (err) return res.status(500).json({ error: "Erro no servidor" });

    if (results.length === 0) {
      return res.status(401).json({ error: "Email ou senha incorretos" });
    }

    return res.json({
      message: "Login OK",
      usuario: results[0]
    });
  });
});

module.exports = router;
