const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./config/db");

// Importar rotas
const userRoutes = require("./routes/usuarioRoutes");
const instituicaoRoutes = require("./routes/instituicaoRoutes");
const cursoRoutes = require("./routes/cursoRoutes");
const disciplinaRoutes = require("./routes/disciplinaRoutes");
const turmaRoutes = require("./routes/turmaRoutes");
const alunoRoutes = require("./routes/alunoRoutes");
const notaRoutes = require("./routes/notaRoutes");
const componenteNotaRoutes = require("./routes/componenteNotaRoutes");
const professorRoutes = require("./routes/professorRoutes");

const app = express();

// 🔧 Middleware
app.use(cors()); // <-- ESSENCIAL pro front conseguir chamar a API
app.use(express.json());

// 🧩 Rotas principais da API
app.use("/api/usuarios", userRoutes);
app.use("/api/instituicoes", instituicaoRoutes);
app.use("/api/cursos", cursoRoutes);
app.use("/api/disciplinas", disciplinaRoutes);
app.use("/api/turmas", turmaRoutes);
app.use("/api/alunos", alunoRoutes);
app.use("/api/notas", notaRoutes);
app.use("/api/componenteNotas", componenteNotaRoutes);
app.use("/api/professores", professorRoutes);

// 🏠 Rota raiz de teste
app.get("/", (req, res) => res.send("✅ API ProjetoNotaDez — módulo Rosini funcionando!"));

// 🚀 Inicializar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => console.log(`Servidor rodando na porta ${PORT} 🚀`));

