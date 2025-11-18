// Feito por Leonardo e Matheus Rosini

const { open, close } = require("../config/db");

// =======================================================
// 1 — LISTAR ALUNOS + COMPONENTES + NOTAS
// =======================================================
exports.getNotasByTurmaEDisciplina = async (req, res) => {
    let conn;

    try {
        const { turmaId, disciplinaId } = req.params;

        conn = await open();

        // Buscar alunos da turma
        const alunos = await conn.execute(
            `SELECT ID, NOME, MATRICULA
             FROM ALUNO
             WHERE TURMA_ID = :turmaId`,
            { turmaId }
        );

        // Buscar componentes da disciplina
        const componentes = await conn.execute(
            `SELECT ID, NOME, SIGLA
             FROM COMPONENTE_NOTA
             WHERE DISCIPLINA_ID = :disciplinaId`,
            { disciplinaId }
        );

        // Buscar notas existentes
        const notas = await conn.execute(
            `SELECT n.ID, n.VALOR, n.ALUNO_ID, n.COMPONENTE_ID
             FROM NOTA n
             JOIN COMPONENTE_NOTA c ON c.ID = n.COMPONENTE_ID
             WHERE c.DISCIPLINA_ID = :disciplinaId`,
            { disciplinaId }
        );

        // Montar resposta final
        const resposta = alunos.rows.map(a => ({
            aluno_id: a.ID,
            nome: a.NOME,
            matricula: a.MATRICULA,
            componentes: componentes.rows.map(c => {
                const nota = notas.rows.find(n =>
                    n.ALUNO_ID === a.ID && n.COMPONENTE_ID === c.ID
                );

                return {
                    componente_id: c.ID,
                    nome: c.NOME,
                    sigla: c.SIGLA,
                    valor: nota ? nota.VALOR : null,
                    nota_id: nota ? nota.ID : null
                };
            })
        }));

        res.json({ alunos: resposta, componentes: componentes.rows });

    } catch (err) {
        res.status(500).json({
            message: "Erro ao carregar notas.",
            error: err.message
        });
    } finally {
        if (conn) await close(conn);
    }
};


// =======================================================
// 2 — REGISTRAR / ATUALIZAR NOTA
// =======================================================
exports.registrarNota = async (req, res) => {
    let conn;

    try {
        const { aluno_id, componente_id, valor } = req.body;

        if (!aluno_id || !componente_id || valor === undefined)
            return res.status(400).json({ message: "Dados incompletos." });

        conn = await open();

        // Verifica aluno
        const alunoExiste = await conn.execute(
            "SELECT ID FROM ALUNO WHERE ID = :id",
            { id: aluno_id }
        );
        if (alunoExiste.rows.length === 0)
            return res.status(404).json({ message: "Aluno não encontrado." });

        // Verifica componente
        const compExiste = await conn.execute(
            "SELECT ID FROM COMPONENTE_NOTA WHERE ID = :id",
            { id: componente_id }
        );
        if (compExiste.rows.length === 0)
            return res.status(404).json({ message: "Componente não encontrado." });

        // Verifica se nota existe
        const existe = await conn.execute(
            `SELECT ID FROM NOTA
             WHERE ALUNO_ID = :aluno_id
             AND COMPONENTE_ID = :componente_id`,
            { aluno_id, componente_id }
        );

        if (existe.rows.length > 0) {
            await conn.execute(
                `UPDATE NOTA SET VALOR = :valor WHERE ID = :id`,
                { valor, id: existe.rows[0].ID },
                { autoCommit: true }
            );

            return res.json({ message: "Nota atualizada com sucesso." });
        }

        // Inserir nova nota
        await conn.execute(
            `INSERT INTO NOTA (ALUNO_ID, COMPONENTE_ID, VALOR)
             VALUES (:aluno_id, :componente_id, :valor)`,
            { aluno_id, componente_id, valor },
            { autoCommit: true }
        );

        res.json({ message: "Nota registrada com sucesso." });

    } catch (err) {
        res.status(500).json({
            message: "Erro ao registrar nota.",
            error: err.message
        });
    } finally {
        if (conn) await close(conn);
    }
};


// =======================================================
// 3 — CRUD COMPLETO
// =======================================================

// GET — listar todas as notas
exports.getAllNotas = async (req, res) => {
    let conn;
    try {
        conn = await open();

        const result = await conn.execute(
            `SELECT n.id, n.valor, a.nome AS aluno, c.nome AS componente
             FROM nota n
             JOIN aluno a ON a.id = n.aluno_id
             JOIN componente_nota c ON c.id = n.componente_id`
        );

        res.json(result.rows);

    } catch (err) {
        res.status(500).json({ message: "Erro ao buscar notas.", error: err.message });
    } finally {
        if (conn) await close(conn);
    }
};

// GET — nota por ID
exports.getNotaById = async (req, res) => {
    let conn;
    try {
        conn = await open();

        const result = await conn.execute(
            "SELECT * FROM nota WHERE id = :id",
            { id: req.params.id }
        );

        if (result.rows.length === 0)
            return res.status(404).json({ message: "Nota não encontrada." });

        res.json(result.rows[0]);

    } catch (err) {
        res.status(500).json({ message: "Erro ao buscar nota.", error: err.message });
    } finally {
        if (conn) await close(conn);
    }
};

// POST — criar nota
exports.createNota = async (req, res) => {
    let conn;
    try {
        const { aluno_id, componente_id, valor } = req.body;

        conn = await open();

        await conn.execute(
            `INSERT INTO nota (aluno_id, componente_id, valor)
             VALUES (:aluno_id, :componente_id, :valor)`,
            { aluno_id, componente_id, valor },
            { autoCommit: true }
        );

        res.status(201).json({ message: "Nota criada com sucesso." });

    } catch (err) {
        res.status(500).json({ message: "Erro ao criar nota.", error: err.message });
    } finally {
        if (conn) await close(conn);
    }
};

// PUT — atualizar nota
exports.updateNota = async (req, res) => {
    let conn;
    try {
        const { valor } = req.body;

        conn = await open();

        await conn.execute(
            `UPDATE nota SET valor = :valor WHERE id = :id`,
            { valor, id: req.params.id },
            { autoCommit: true }
        );

        res.json({ message: "Nota atualizada com sucesso." });

    } catch (err) {
        res.status(500).json({ message: "Erro ao atualizar nota.", error: err.message });
    } finally {
        if (conn) await close(conn);
    }
};

// DELETE — deletar nota
exports.deleteNota = async (req, res) => {
    let conn;
    try {
        conn = await open();

        await conn.execute(
            "DELETE FROM nota WHERE id = :id",
            { id: req.params.id },
            { autoCommit: true }
        );

        res.json({ message: "Nota deletada com sucesso." });

    } catch (err) {
        res.status(500).json({ message: "Erro ao deletar nota.", error: err.message });
    } finally {
        if (conn) await close(conn);
    }
};
