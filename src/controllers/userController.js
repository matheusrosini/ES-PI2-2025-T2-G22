const db = require("../database/db");

exports.getAll = (req, res) => {
  db.query("SELECT id, nome, email, telefone, tipo FROM usuarios", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.create = (req, res) => {
  const { nome, email, senha, tipo } = req.body;
  if (!nome || !email || !senha) return res.status(400).json({ error: "nome, email e senha obrigatórios" });

  db.query(
    "INSERT INTO usuarios (nome, email, senha, tipo) VALUES (?, ?, ?, ?)",
    [nome, email, senha, tipo || "admin"],
    (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") return res.status(400).json({ error: "E-mail já cadastrado" });
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: result.insertId, message: "Usuário criado" });
    }
  );
};

exports.getById = (req, res) => {
  const { id } = req.params;
  db.query("SELECT id, nome, email, telefone, tipo FROM usuarios WHERE id = ?", [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!rows.length) return res.status(404).json({ error: "Usuário não encontrado" });
    res.json(rows[0]);
  });
};

exports.update = (req, res) => {
  const { id } = req.params;
  const { nome, email, telefone, tipo } = req.body;
  db.query(
    "UPDATE usuarios SET nome = ?, email = ?, telefone = ?, tipo = ? WHERE id = ?",
    [nome, email, telefone, tipo, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ error: "Usuário não encontrado" });
      res.json({ message: "Usuário atualizado" });
    }
  );
};

exports.remove = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM usuarios WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Usuário não encontrado" });
    res.json({ message: "Usuário excluído" });
  });
};
