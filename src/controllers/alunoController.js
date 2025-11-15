// Feito por Leonardo

const db = require('../config/db');
const csv = require("csv-parser");
const stream = require("stream");

// Buscar todos os alunos
exports.getAllAlunos = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM aluno');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar alunos', error });
  }
};

// Buscar um aluno por ID
exports.getAlunoById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM aluno WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Aluno não encontrado' });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar aluno', error });
  }
};

// Criar um novo aluno
exports.createAluno = async (req, res) => {
  try {
    const { matricula, nome, turma_id } = req.body;

    if (!matricula || !nome) {
      return res.status(400).json({ message: 'Matrícula e nome são obrigatórios' });
    }

    await db.query(
      'INSERT INTO aluno (matricula, nome, turma_id) VALUES (?, ?, ?)',
      [matricula, nome, turma_id]
    );

    res.status(201).json({ message: 'Aluno criado com sucesso!' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ message: 'Matrícula já cadastrada' });
    } else {
      res.status(500).json({ message: 'Erro ao criar aluno', error });
    }
  }
};

// Atualizar aluno
exports.updateAluno = async (req, res) => {
  try {
    const { id } = req.params;
    const { matricula, nome, turma_id } = req.body;

    await db.query(
      'UPDATE aluno SET matricula = ?, nome = ?, turma_id = ? WHERE id = ?',
      [matricula, nome, turma_id, id]
    );

    res.json({ message: 'Aluno atualizado com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar aluno', error });
  }
};

// Deletar aluno
exports.deleteAluno = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query('DELETE FROM aluno WHERE id = ?', [id]);
    res.json({ message: 'Aluno removido com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao remover aluno', error });
  }
};

// Importar CSV
exports.importarCSV = async (req, res) => {
  try {
    const turmaId = req.params.turmaId;

    if (!req.file) {
      return res.status(400).json({ message: "Nenhum arquivo enviado" });
    }

    const buffer = req.file.buffer;
    const results = [];
    const readable = new stream.Readable();
    readable._read = () => {};
    readable.push(buffer);
    readable.push(null);

    readable
      .pipe(csv())
      .on("data", (row) => {
        const keys = Object.keys(row).map(k => k.replace(/\ufeff/g, ""));

        const matricula = row[keys[0]];
        const nome = row[keys[1]];

        if (matricula && nome) {
          results.push({ matricula, nome });
        }
      })
      .on("end", async () => {
        let inseridos = 0;

        for (const aluno of results) {
          const [existente] = await db.query(
            "SELECT id FROM aluno WHERE matricula = ? AND turma_id = ?",
            [aluno.matricula, turmaId]
          );

          if (existente.length === 0) {
            await db.query(
              "INSERT INTO aluno (matricula, nome, turma_id) VALUES (?, ?, ?)",
              [aluno.matricula, aluno.nome, turmaId]
            );
            inseridos++;
          }
        }

        res.json({
          message: "Importação concluída",
          totalProcessado: results.length,
          inseridos
        });
      });

  } catch (error) {
    res.status(500).json({
      message: "Erro ao importar CSV",
      error: error.message
    });
  }
};
