// Feito por Leonardo (corrigido)

// Conexão com o banco
const db = require('../config/db');
const csv = require("csv-parser");
const stream = require("stream");


// ============================================================
// 1 — LISTAR TODOS OS ALUNOS
// ============================================================
exports.getAllAlunos = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM aluno');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar alunos', error });
  }
};



// ============================================================
// 2 — BUSCAR ALUNOS POR TURMA  (FALTAVA NO SEU PROJETO)
// ============================================================
exports.getAlunosByTurma = async (req, res) => {
  try {
    const { turmaId } = req.params;

    const [rows] = await db.query(
      'SELECT * FROM aluno WHERE turma_id = ?',
      [turmaId]
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar alunos da turma', error });
  }
};



// ============================================================
// 3 — BUSCAR ALUNO POR ID
// ============================================================
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



// ============================================================
// 4 — CRIAR NOVO ALUNO (CORRIGIDO: USA turmaId DA ROTA)
// ============================================================
exports.createAluno = async (req, res) => {
  try {
    const { turmaId } = req.params;
    const { matricula, nome } = req.body;

    if (!matricula || !nome) {
      return res.status(400).json({ message: 'Matrícula e nome são obrigatórios' });
    }

    await db.query(
      'INSERT INTO aluno (matricula, nome, turma_id) VALUES (?, ?, ?)',
      [matricula, nome, turmaId]
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



// ============================================================
// 5 — ATUALIZAR ALUNO
// ============================================================
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



// ============================================================
// 6 — DELETAR ALUNO
// ============================================================
exports.deleteAluno = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query('DELETE FROM aluno WHERE id = ?', [id]);
    res.json({ message: 'Aluno removido com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao remover aluno', error });
  }
};



// ============================================================
// 7 — IMPORTAR CSV
// ============================================================
exports.importarCSV = async (req, res) => {
  try {
    const { turmaId } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: "Nenhum arquivo enviado" });
    }

    const results = [];
    const readable = new stream.Readable();

    readable._read = () => {};
    readable.push(req.file.buffer);
    readable.push(null);

    readable
      .pipe(csv())
      .on("data", row => {
        const cleanKeys = Object.keys(row).map(k => k.replace(/\ufeff/g, ""));
        const matricula = row[cleanKeys[0]];
        const nome = row[cleanKeys[1]];

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

