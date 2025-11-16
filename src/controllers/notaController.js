// Feito por Leonardo
const db = require('../config/db');


// 1 — ALUNOS DA TURMA + COMPONENTES + NOTAS

exports.getNotasByTurmaEDisciplina = async (req, res) => {
    try {
        const { turmaId, disciplinaId } = req.params;

        // Buscar alunos da turma
        const [alunos] = await db.query(
            "SELECT id, nome, matricula FROM aluno WHERE turma_id = ?",
            [turmaId]
        );

        // Componentes da disciplina
        const [componentes] = await db.query(
            "SELECT id, nome, sigla FROM componente_nota WHERE disciplina_id = ?",
            [disciplinaId]
        );

        // Notas existentes
        const [notas] = await db.query(
            `SELECT n.id, n.valor, n.aluno_id, n.componente_id
             FROM nota n
             JOIN componente_nota c ON c.id = n.componente_id
             WHERE c.disciplina_id = ?`,
            [disciplinaId]
        );

        // Montar estrutura final
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

        res.json({
            alunos: resposta,
            componentes
        });

    } catch (err) {
        res.status(500).json({ message: "Erro ao carregar notas", error: err });
    }
};

// 2 — REGISTRAR OU ATUALIZAR NOTA

exports.registrarNota = async (req, res) => {
    try {
        const { aluno_id, componente_id, valor } = req.body;

        if (!aluno_id || !componente_id || valor === undefined)
            return res.status(400).json({ message: "Dados incompletos" });

        if (valor < 0 || valor > 10)
            return res.status(400).json({ message: "A nota deve ser entre 0 e 10" });

        // Verificar se já existe uma nota
        const [existe] = await db.query(
            "SELECT id FROM nota WHERE aluno_id = ? AND componente_id = ?",
            [aluno_id, componente_id]
        );

        if (existe.length > 0) {
            // Atualiza
            await db.query(
                "UPDATE nota SET valor = ? WHERE id = ?",
                [valor, existe[0].id]
            );
            return res.json({ message: "Nota atualizada" });
        } else {
            // Cria nova
            await db.query(
                "INSERT INTO nota (aluno_id, componente_id, valor) VALUES (?, ?, ?)",
                [aluno_id, componente_id, valor]
            );
            return res.json({ message: "Nota registrada" });
        }

    } catch (err) {
        res.status(500).json({ message: "Erro ao registrar nota", error: err });
    }
};
