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
app.use("/api/auth", authRoutes);

// Rota raiz
app.get("/", (req, res) => {
  res.send("✅ API ProjetoNotaDez — ONLINE (Railway)!");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
