// Feito por Leonardo

const db = require("../config/db");

// ================================
// Listar alunos por turma
// ================================
exports.getAlunosByTurma = async (req, res) => {
  try {
    const { turmaId } = req.params;

    const result = await db.query(
      `SELECT id_aluno, nome, email, telefone 
       FROM aluno 
       WHERE id_turma = :turmaId`,
      { turmaId }
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Erro getAlunosByTurma:", err);
    res.status(500).json({ message: "Erro ao buscar alunos da turma" });
  }
};

// ================================
// Criar aluno em uma turma
// ================================
exports.createAluno = async (req, res) => {
  try {
    const { turmaId } = req.params;
    const { nome, email, telefone } = req.body;

    await db.query(
      `INSERT INTO aluno (nome, email, telefone, id_turma)
       VALUES (:nome, :email, :telefone, :turmaId)`,
      { nome, email, telefone, turmaId }
    );

    res.status(201).json({ message: "Aluno criado com sucesso" });
  } catch (err) {
    console.error("Erro createAluno:", err);
    res.status(500).json({ message: "Erro ao criar aluno" });
  }
};

// ================================
// Buscar aluno por ID
// ================================
exports.getAlunoById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `SELECT id_aluno, nome, email, telefone, id_turma
       FROM aluno
       WHERE id_aluno = :id`,
      { id }
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Aluno não encontrado" });

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Erro getAlunoById:", err);
    res.status(500).json({ message: "Erro ao buscar aluno" });
  }
};

// ================================
// Atualizar aluno
// ================================
exports.updateAluno = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, telefone, id_turma } = req.body;

    await db.query(
      `UPDATE aluno
       SET nome = :nome,
           email = :email,
           telefone = :telefone,
           id_turma = :id_turma
       WHERE id_aluno = :id`,
      { nome, email, telefone, id_turma, id }
    );

    res.json({ message: "Aluno atualizado com sucesso" });
  } catch (err) {
    console.error("Erro updateAluno:", err);
    res.status(500).json({ message: "Erro ao atualizar aluno" });
  }
};

// ================================
// Deletar aluno
// ================================
exports.deleteAluno = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `DELETE FROM aluno WHERE id_aluno = :id`,
      { id }
    );

    if (result.rowsAffected === 0)
      return res.status(404).json({ message: "Aluno não encontrado" });

    res.json({ message: "Aluno removido com sucesso" });
  } catch (err) {
    console.error("Erro deleteAluno:", err);
    res.status(500).json({ message: "Erro ao remover aluno" });
  }
};
