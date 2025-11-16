const db = require('../db');

// GET /turma
exports.getAllTurmas = (req, res) => {
  const sql = `
    SELECT t.*, d.nome AS disciplina_nome
    FROM turma t
    JOIN disciplina d ON d.id = t.disciplina_id
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

// GET /turma/:id
exports.getTurmaById = (req, res) => {
  db.query("SELECT * FROM turma WHERE id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result[0]);
  });
};

// POST /turma
exports.createTurma = (req, res) => {
  const { nome, codigo, periodo, disciplina_id } = req.body;

  const sql = `
    INSERT INTO turma (nome, codigo, periodo, disciplina_id)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [nome, codigo, periodo, disciplina_id], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json({ id: result.insertId, message: "Turma criada." });
  });
};

// PUT /turma/:id
exports.updateTurma = (req, res) => {
  const { nome, codigo, periodo, disciplina_id } = req.body;

  const sql = `
    UPDATE turma SET nome=?, codigo=?, periodo=?, disciplina_id=?
    WHERE id=?
  `;

  db.query(sql, [nome, codigo, periodo, disciplina_id, req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Turma atualizada." });
  });
};

// DELETE /turma/:id
exports.deleteTurma = (req, res) => {
  db.query("DELETE FROM turma WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Turma excluída." });
  });
};
