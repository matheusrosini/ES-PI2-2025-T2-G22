// Feito por Matheus Rosini

require("dotenv").config();
const express = require("express");
const cors = require("cors");

// Importação das rotas
const usuarioRoutes = require("./routes/usuarioRoutes");
const instituicaoRoutes = require("./routes/instituicaoRoutes");
const disciplinaRoutes = require("./routes/disciplinasRoutes");
const turmaRoutes = require("./routes/turmaRoutes");
const alunoRoutes = require("./routes/alunoRoutes");
const notaRoutes = require("./routes/notaRoutes");
const componenteNotaRoutes = require("./routes/componenteNotaRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(
    cors({
        origin: "https://es-pi-2-2025-t2-g22.vercel.app",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.options("*", cors());
app.use(express.json());

// Rotas
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/instituicoes", instituicaoRoutes);
app.use("/api/disciplinas", disciplinaRoutes);
app.use("/api/turmas", turmaRoutes);
app.use("/api/alunos", alunoRoutes);
app.use("/api/notas", notaRoutes);
app.use("/api/componenteNotas", componenteNotaRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.send("API ProjetoNotaDez ONLINE!");
});

module.exports = app;
