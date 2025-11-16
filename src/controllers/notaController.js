const db = require("../config/db");

/* =======================================================
   1 — LISTAR ALUNOS + COMPONENTES + NOTAS
======================================================= */
exports.getNotasByTurmaEDisciplina = async (req, res) => {
    try {
        const { turmaId, disciplinaId } = req.params;

        if (!turmaId || !disciplinaId) {
            return res.status(400).json({ message: "Turma e disciplina são obrigatórias." });
        }

        const [alunos] = await db.query(
            "SELECT id, nome, matricula FROM aluno WHERE turma_id = ?",
            [turmaId]
        );

        const [componentes] = await db.query(
            "SELECT id, nome, sigla FROM componente_nota WHERE disciplina_id = ?",
            [disciplinaId]
        );

        const [notas] = await db.query(
            `SELECT n.id, n.valor, n.aluno_id, n.componente_id
             FROM nota n
             JOIN componente_nota c ON c.id = n.componente_id
             WHERE c.disciplina_id = ?`,
            [disciplinaId]
        );

        const resposta = alunos.map(a => ({
            aluno_id: a.id,
            nome: a.nome,
            matricula: a.matricula,
            componentes: componentes.map(c => {
                const nota = notas.find(n => n.aluno_id === a.id && n.componente_id === c.id);
                return {
                    componente_id: c.id,
                    nome: c.nome,
                    sigla: c.sigla,
                    valor: nota ? nota.valor : null,
                    nota_id: nota ? nota.id : null
                };
            })
        }));

        res.json({ alunos: resposta, componentes });

    } catch (err) {
        res.status(500).json({
            message: "Erro ao carregar notas.",
            error: err.message
        });
    }
};

/* =======================================================
   2 — REGISTRAR / ATUALIZAR NOTA
======================================================= */
exports.registrarNota = async (req, res) => {
    try {
        const { aluno_id, componente_id, valor } = req.body;

        if (!aluno_id || !componente_id || valor === undefined)
            return res.status(400).json({ message: "Dados incompletos." });

        if (isNaN(valor))
            return res.status(400).json({ message: "O valor da nota deve ser numérico." });

        if (valor < 0 || valor > 10)
            return res.status(400).json({ message: "A nota deve ser entre 0 e 10." });

        const [alunoExiste] = await db.query(
            "SELECT id FROM aluno WHERE id = ?",
            [aluno_id]
        );
        if (alunoExiste.length === 0)
            return res.status(404).json({ message: "Aluno não encontrado." });

        const [compExiste] = await db.query(
            "SELECT id FROM componente_nota WHERE id = ?",
            [componente_id]
        );
        if (compExiste.length === 0)
            return res.status(404).json({ message: "Componente não encontrado." });

        const [existe] = await db.query(
            "SELECT id FROM nota WHERE aluno_id = ? AND componente_id = ?",
            [aluno_id, componente_id]
        );

        if (existe.length > 0) {
            await db.query(
                "UPDATE nota SET valor = ? WHERE id = ?",
                [valor, existe[0].id]
            );
            return res.json({ message: "Nota atualizada com sucesso." });
        }

        await db.query(
            "INSERT INTO nota (aluno_id, componente_id, valor) VALUES (?, ?, ?)",
            [aluno_id, componente_id, valor]
        );

        res.json({ message: "Nota registrada com sucesso." });

    } catch (err) {
        res.status(500).json({ 
            message: "Erro ao registrar nota.", 
            error: err.message 
        });
    }
};

/* =======================================================
   3 — CRUD COMPLETO (GET, POST, PUT, DELETE)
======================================================= */

// GET — listar todas as notas
exports.getAllNotas = async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT n.id, n.valor, a.nome AS aluno, c.nome AS componente 
             FROM nota n
             JOIN aluno a ON a.id = n.aluno_id
             JOIN componente_nota c ON c.id = n.componente_id`
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: "Erro ao buscar notas.", error: err.message });
    }
};

// GET — nota por ID
exports.getNotaById = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM nota WHERE id = ?", [
            req.params.id,
        ]);

        if (rows.length === 0)
            return res.status(404).json({ message: "Nota não encontrada." });

        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ message: "Erro ao buscar nota.", error: err.message });
    }
};

// POST — criar nota manualmente
exports.createNota = async (req, res) => {
    try {
        const { aluno_id, componente_id, valor } = req.body;

        if (!aluno_id || !componente_id || valor === undefined)
            return res.status(400).json({ message: "Preencha todos os dados." });

        await db.query(
            "INSERT INTO nota (aluno_id, componente_id, valor) VALUES (?, ?, ?)",
            [aluno_id, componente_id, valor]
        );

        res.status(201).json({ message: "Nota criada com sucesso." });
    } catch (err) {
        res.status(500).json({ message: "Erro ao criar nota.", error: err.message });
    }
};

// PUT — atualizar nota por ID
exports.updateNota = async (req, res) => {
    try {
        const { valor } = req.body;

        if (valor === undefined)
            return res.status(400).json({ message: "Valor da nota é obrigatório." });

        await db.query("UPDATE nota SET valor = ? WHERE id = ?", [
            valor,
            req.params.id,
        ]);

        res.json({ message: "Nota atualizada com sucesso." });
    } catch (err) {
        res.status(500).json({ message: "Erro ao atualizar nota.", error: err.message });
    }
};

// DELETE — deletar nota
exports.deleteNota = async (req, res) => {
    try {
        await db.query("DELETE FROM nota WHERE id = ?", [req.params.id]);
        res.json({ message: "Nota deletada com sucesso." });
    } catch (err) {
        res.status(500).json({ message: "Erro ao deletar nota.", error: err.message });
    }
};
