const db = require("../database/db");

exports.list = (req, res) => {
  db.query("SELECT * FROM disciplinas", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

exports.create = (req, res) => {
  const { nome, sigla, codigo, periodo, curso_id } = req.body;
  if (!nome || !sigla || !curso_id) return res.status(400).json({ error: "nome, sigla e curso_id obrigatórios" });

  db.query(
    "INSERT INTO disciplinas (nome, sigla, codigo, periodo, curso_id) VALUES (?, ?, ?, ?, ?)",
    [nome, sigla, codigo || null, periodo || null, curso_id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: result.insertId, message: "Disciplina criada" });
    }
  );
};

exports.getById = (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM disciplinas WHERE id = ?", [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!rows.length) return res.status(404).json({ error: "Disciplina não encontrada" });
    res.json(rows[0]);
  });
};

exports.update = (req, res) => {
  const { id } = req.params;
  const { nome, sigla, codigo, periodo, curso_id } = req.body;
  db.query(
    "UPDATE disciplinas SET nome = ?, sigla = ?, codigo = ?, periodo = ?, curso_id = ? WHERE id = ?",
    [nome, sigla, codigo, periodo, curso_id, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ error: "Disciplina não encontrada" });
      res.json({ message: "Disciplina atualizada" });
    }
  );
};

exports.remove = (req, res) => {
  const { id } = req.params;
  // Regra importante: não excluir disciplina se houver turmas associadas.
  db.query("SELECT 1 FROM turmas WHERE disciplina_id = ? LIMIT 1", [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (rows.length) return res.status(400).json({ error: "Não é possível excluir: existem turmas vinculadas a essa disciplina" });

    db.query("DELETE FROM disciplinas WHERE id = ?", [id], (err2, result) => {
      if (err2) return res.status(500).json({ error: err2.message });
      if (result.affectedRows === 0) return res.status(404).json({ error: "Disciplina não encontrada" });
      res.json({ message: "Disciplina excluída" });
    });
  });
};
