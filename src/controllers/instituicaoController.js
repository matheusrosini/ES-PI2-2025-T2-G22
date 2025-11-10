const db = require("../database/db");

exports.list = (req, res) => {
  db.query("SELECT * FROM instituicoes", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

exports.create = (req, res) => {
  const { nome, cidade, estado, telefone } = req.body;
  if (!nome) return res.status(400).json({ error: "nome obrigatório" });

  db.query(
    "INSERT INTO instituicoes (nome, cidade, estado, telefone) VALUES (?, ?, ?, ?)",
    [nome, cidade || null, estado || null, telefone || null],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: result.insertId, message: "Instituição criada" });
    }
  );
};

exports.getById = (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM instituicoes WHERE id = ?", [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!rows.length) return res.status(404).json({ error: "Instituição não encontrada" });
    res.json(rows[0]);
  });
};

exports.update = (req, res) => {
  const { id } = req.params;
  const { nome, cidade, estado, telefone } = req.body;
  db.query(
    "UPDATE instituicoes SET nome = ?, cidade = ?, estado = ?, telefone = ? WHERE id = ?",
    [nome, cidade, estado, telefone, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ error: "Instituição não encontrada" });
      res.json({ message: "Instituição atualizada" });
    }
  );
};

  const { id } = req.params;

  db.query("SELECT 1 FROM cursos WHERE instituicao_id = ? LIMIT 1", [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (rows.length) return res.status(400).json({ error: "Não é possível excluir: existem cursos vinculados" });

    db.query("DELETE FROM instituicoes WHERE id = ?", [id], (err2, result) => {
      if (err2) return res.status(500).json({ error: err2.message });
      if (result.affectedRows === 0) return res.status(404).json({ error: "Instituição não encontrada" });
      res.json({ message: "Instituição excluída" });
    });
  });

