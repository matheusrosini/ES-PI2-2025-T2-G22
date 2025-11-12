const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./config/db");

// Importação das rotas
const userRoutes = require("./routes/usuarioRoutes");
const instituicaoRoutes = require("./routes/instituicaoRoutes");
const cursoRoutes = require("./routes/cursoRoutes");
const disciplinaRoutes = require("./routes/disciplinaRoutes");
const turmaRoutes = require("./routes/turmaRoutes");
const alunoRoutes = require("./routes/alunoRoutes");
const notaRoutes = require("./routes/notaRoutes");
const componenteNotaRoutes = require("./routes/componenteNotaRoutes");
const professorRoutes = require("./routes/professorRoutes");

// Cria o app
const app = express();
app.use(cors()); // <== ADICIONE ISSO
app.use(express.json());

// Usa as rotas
app.use("/api/usuarios", userRoutes);
app.use("/api/instituicoes", instituicaoRoutes);
app.use("/api/cursos", cursoRoutes);
app.use("/api/disciplinas", disciplinaRoutes);
app.use("/api/turmas", turmaRoutes);
app.use("/api/alunos", alunoRoutes);
app.use("/api/notas", notaRoutes);
app.use("/api/componenteNotas", componenteNotaRoutes);
app.use("/api/professores", professorRoutes);

// Rota padrão para teste
app.get("/", (req, res) => {
    res.send("✅ API ProjetoNotaDez — módulo Rosini ONLINE!");
});

// Porta dinâmica (Railway define automaticamente)
const PORT = process.env.PORT || 8080;

// Inicia o servidor
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
