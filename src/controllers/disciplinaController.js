// Feito por Matheus Rosini

const db = require('../config/db');

// Buscar todas as disciplinas
exports.getAllDisciplinas = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT d.ID, d.NOME, d.SIGLA, d.CODIGO, d.PERIODO,
              i.NOME AS INSTITUICAO
       FROM DISCIPLINA d
       LEFT JOIN INSTITUICAO i ON d.INSTITUICAO_ID = i.ID
       ORDER BY d.NOME`
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar disciplinas', error });
  }
};

// Buscar disciplina por ID
exports.getDisciplinaById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `SELECT * FROM DISCIPLINA WHERE ID = :id`,
      { id }
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: 'Disciplina não encontrada' });

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar disciplina', error });
  }
};

// Criar disciplina
exports.createDisciplina = async (req, res) => {
  try {
    const { nome, sigla, codigo, periodo, instituicao_id } = req.body;

    if (!nome || !sigla || !codigo || !periodo || !instituicao_id) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    await db.query(
      `INSERT INTO DISCIPLINA (NOME, SIGLA, CODIGO, PERIODO, INSTITUICAO_ID)
       VALUES (:nome, :sigla, :codigo, :periodo, :inst)`,
      { nome, sigla, codigo, periodo, inst: instituicao_id }
    );

    res.status(201).json({ message: 'Disciplina criada com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar disciplina', error });
  }
};

// Atualizar disciplina
exports.updateDisciplina = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, sigla, codigo, periodo, instituicao_id } = req.body;

    const result = await db.query(
      `UPDATE DISCIPLINA
       SET NOME = :nome,
           SIGLA = :sigla,
           CODIGO = :codigo,
           PERIODO = :periodo,
           INSTITUICAO_ID = :inst
       WHERE ID = :id`,
      {
        nome,
        sigla,
        codigo,
        periodo,
        inst: instituicao_id,
        id
      }
    );

    if (result.rowsAffected === 0)
      return res.status(404).json({ message: 'Disciplina não encontrada' });

    res.json({ message: 'Disciplina atualizada com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar disciplina', error });
  }
};

// Deletar disciplina
exports.deleteDisciplina = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `DELETE FROM DISCIPLINA WHERE ID = :id`,
      { id }
    );

    if (result.rowsAffected === 0)
      return res.status(404).json({ message: 'Disciplina não encontrada' });

    res.json({ message: 'Disciplina removida com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao remover disciplina', error });
  }
};
