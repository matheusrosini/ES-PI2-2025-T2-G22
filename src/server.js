// Feito por Matheus Rosini e Leonardo

require("dotenv").config();
const express = require("express");
const cors = require("cors");

// Importação das rotas
const userRoutes = require("./routes/usuarioRoutes");
const instituicaoRoutes = require("./routes/instituicaoRoutes");
const disciplinaRoutes = require("./routes/disciplinaRoutes");
const turmaRoutes = require("./routes/turmaRoutes");
const alunoRoutes = require("./routes/alunoRoutes");
const notaRoutes = require("./routes/notaRoutes");
const componenteNotaRoutes = require("./routes/componenteNotaRoutes");
const loginRoutes = require("./routes/loginRoutes");
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Rotas
app.use("/api/usuarios", userRoutes);
app.use("/api/instituicoes", instituicaoRoutes);
app.use("/api/disciplinas", disciplinaRoutes);
app.use("/api/turmas", turmaRoutes);
app.use("/api/alunos", alunoRoutes);
app.use("/api/notas", notaRoutes);
app.use("/api/componenteNotas", componenteNotaRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/auth", authRoutes)

// Rota raiz
app.get("/", (req, res) => {
    res.send("✅ API ProjetoNotaDez — módulo Rosini ONLINE!");
});

// ❌ Remover app.listen para Vercel
// ❌ const PORT = process.env.PORT || 8080;
// ❌ app.listen(PORT, "0.0.0.0", () => { ... });

// ✅ Exporta o app para Vercel
module.exports = app;
