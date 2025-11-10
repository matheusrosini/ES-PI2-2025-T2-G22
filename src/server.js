const express = require("express");
require("dotenv").config();
const db = require("./database/db");

const usuarioRoutes = require("./routes/usuarioRoutes");
const instituicaoRoutes = require("./routes/instituicaoRoutes");
const cursoRoutes = require("./routes/cursoRoutes");
const disciplinaRoutes = require("./routes/disciplinaRoutes");

const app = express();
app.use(express.json());

app.use("/api/usuarios", usuarioRoutes);
app.use("/api/instituicoes", instituicaoRoutes);
app.use("/api/cursos", cursoRoutes);
app.use("/api/disciplinas", disciplinaRoutes);

app.get("/", (req, res) => res.send("API ProjetoNotaDez — módulo Rosini"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT} 🚀`));
