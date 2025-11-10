const db = require("../database/db");

exports.list = (req, res) => {
  db.query("SELECT * FROM cursos", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

exports.create = (req, res) => {
  const { nome, duracao, instituicao_id } = req.body;
  if (!nome || !instituicao_id) return res.status(400).json({ error: "nome e instituicao_id obrigatórios" });

  db.query(
    "INSERT INTO cursos (nome, duracao, instituicao_id) VALUES (?, ?, ?)",
    [nome, duracao || null, instituicao_id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: result.insertId, message: "Curso criado" });
    }
  );
};

exports.getById = (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM cursos WHERE id = ?", [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!rows.length) return res.status(404).json({ error: "Curso não encontrado" });
    res.json(rows[0]);
  });
};

exports.update = (req, res) => {
  const { id } = req.params;
  const { nome, duracao, instituicao_id } = req.body;
  db.query(
    "UPDATE cursos SET nome = ?, duracao = ?, instituicao_id = ? WHERE id = ?",
    [nome, duracao, instituicao_id, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ error: "Curso não encontrado" });
      res.json({ message: "Curso atualizado" });
    }
  );
};

exports.remove = (req, res) => {
  const { id } = req.params;
  // verificar disciplinas vinculadas
  db.query("SELECT 1 FROM disciplinas WHERE curso_id = ? LIMIT 1", [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (rows.length) return res.status(400).json({ error: "Não é possível excluir: existem disciplinas vinculadas" });

    db.query("DELETE FROM cursos WHERE id = ?", [id], (err2, result) => {
      if (err2) return res.status(500).json({ error: err2.message });
      if (result.affectedRows === 0) return res.status(404).json({ error: "Curso não encontrado" });
      res.json({ message: "Curso excluído" });
    });
  });
};
