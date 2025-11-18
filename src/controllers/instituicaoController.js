// Feito por Matheus Rosini
const db = require("../config/db");

module.exports = {
    // GET: listar apenas instituições do usuário logado
    async getAllInstituicoes(req, res) {
        try {
            const userId = req.user.id;

            const result = await db.execute(
                "SELECT * FROM instituicao WHERE usuario_id = :usuario_id",
                { usuario_id: userId }
            );

            const rows = result.rows.map(r => ({
                id: r.ID,
                nome: r.NOME,
                usuario_id: r.USUARIO_ID
            }));

            res.json(rows);

        } catch (error) {
            console.error("Erro ao listar instituições:", error);
            res.status(500).json({ message: "Erro ao listar instituições", error });
        }
    },

    // POST: criar instituição ligada ao usuário logado
    async createInstituicao(req, res) {
        try {
            const userId = req.user.id;
            const { nome } = req.body;

            const result = await db.execute(
                `INSERT INTO instituicao (nome, usuario_id)
                 VALUES (:nome, :usuario_id)`,
                { nome, usuario_id: userId }
            );

            res.status(201).json({ message: "Instituição criada com sucesso" });
        } catch (error) {
            console.error("Erro ao criar instituição:", error);
            res.status(500).json({ message: "Erro ao criar instituição", error });
        }
    },

    // GET por id (somente se for dono)
    async getInstituicaoById(req, res) {
        try {
            const userId = req.user.id;
            const instituicaoId = req.params.id;

            const result = await db.execute(
                `SELECT * FROM instituicao 
                 WHERE id = :id AND usuario_id = :usuario_id`,
                { id: instituicaoId, usuario_id: userId }
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ message: "Instituição não encontrada" });
            }

            res.json(result.rows[0]);
        } catch (error) {
            console.error("Erro ao buscar instituição:", error);
            res.status(500).json({ message: "Erro ao buscar instituição", error });
        }
    },

    // PUT (somente se for dono)
    async updateInstituicao(req, res) {
        try {
            const userId = req.user.id;
            const instituicaoId = req.params.id;
            const { nome } = req.body;

            const result = await db.execute(
                `UPDATE instituicao
                 SET nome = :nome
                 WHERE id = :id AND usuario_id = :usuario_id`,
                { id: instituicaoId, nome, usuario_id: userId }
            );

            res.json({ message: "Instituição atualizada com sucesso" });
        } catch (error) {
            console.error("Erro ao atualizar instituição:", error);
            res.status(500).json({ message: "Erro ao atualizar instituição", error });
        }
    },

    // DELETE (somente se for dono)
    async deleteInstituicao(req, res) {
        try {
            const userId = req.user.id;
            const instituicaoId = req.params.id;

            await db.execute(
                `DELETE FROM instituicao
                 WHERE id = :id AND usuario_id = :usuario_id`,
                { id: instituicaoId, usuario_id: userId }
            );

            res.json({ message: "Instituição excluída com sucesso" });
        } catch (error) {
            console.error("Erro ao excluir instituição:", error);
            res.status(500).json({ message: "Erro ao excluir instituição", error });
        }
    }
};
