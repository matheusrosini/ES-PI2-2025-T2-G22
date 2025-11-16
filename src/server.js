// Feito por Leonardo e Matheus Rosini

require("dotenv").config();
const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/usuarioRoutes");
const instituicaoRoutes = require("./routes/instituicaoRoutes");
const disciplinaRoutes = require("./routes/disciplinaRoutes");
const turmaRoutes = require("./routes/turmaRoutes");
const alunoRoutes = require("./routes/alunoRoutes");
const notaRoutes = require("./routes/notaRoutes");
const componenteNotaRoutes = require("./routes/componenteNotaRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

app.use("/api/usuarios", userRoutes);
app.use("/api/instituicoes", instituicaoRoutes);
app.use("/api/disciplinas", disciplinaRoutes);
app.use("/api/turmas", turmaRoutes);
app.use("/api/alunos", alunoRoutes);
app.use("/api/notas", notaRoutes);
app.use("/api/componentes", componenteNotaRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.send("API está funcionando!");
});

// Ignorar requisições para favicon.ico
app.get('/favicon.ico', (req, res) => res.status(204).end());


if (process.env.RAILWAY_ENVIRONMENT) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`🚀 Servidor rodando no Railway na porta ${PORT}`);
    });
}

module.exports = app;
