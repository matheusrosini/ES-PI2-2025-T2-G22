// Feito por Matheus Rosini

const db = require('../config/db');

// Buscar todas as disciplinas (com nome da instituição como 'instituicao')
exports.getAllDisciplinas = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT d.id, d.nome, d.sigla, d.codigo, d.periodo, i.nome AS instituicao
            FROM disciplina d
            LEFT JOIN instituicao i ON d.instituicao_id = i.id
            ORDER BY d.nome
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar disciplinas', error });
    }
};

// Buscar disciplina por ID
exports.getDisciplinaById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query('SELECT * FROM disciplina WHERE id = ?', [id]);
        if (rows.length === 0)
            return res.status(404).json({ message: 'Disciplina não encontrada' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar disciplina', error });
    }
};

// Criar nova disciplina
exports.createDisciplina = async (req, res) => {
    try {
        const { nome, sigla, codigo, periodo, instituicao_id } = req.body;

        if (!nome || !sigla || !codigo || !periodo || !instituicao_id) {
            return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
        }

        await db.query(
            'INSERT INTO disciplina (nome, sigla, codigo, periodo, instituicao_id) VALUES (?, ?, ?, ?, ?)',
            [nome, sigla, codigo, periodo, instituicao_id]
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

        // validação mínima: pelo menos o nome deve existir (mas idealmente todos)
        if (!nome || !sigla || !codigo || !periodo) {
            return res.status(400).json({ message: 'Campos insuficientes para atualização' });
        }

        const [result] = await db.query(
            'UPDATE disciplina SET nome = ?, sigla = ?, codigo = ?, periodo = ?, instituicao_id = ? WHERE id = ?',
            [nome, sigla, codigo, periodo, instituicao_id || null, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Disciplina não encontrada' });
        }

        res.json({ message: 'Disciplina atualizada com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar disciplina', error });
    }
};

// Deletar disciplina
exports.deleteDisciplina = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query('DELETE FROM disciplina WHERE id = ?', [id]);
        if (result.affectedRows === 0)
            return res.status(404).json({ message: 'Disciplina não encontrada' });

        res.json({ message: 'Disciplina removida com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao remover disciplina', error });
    }
};
