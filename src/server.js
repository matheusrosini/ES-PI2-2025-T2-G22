const express = require("express");
require("dotenv").config();
const db = require("./database/db");

const userRoutes = require("./routes/userRoutes");
const instituicaoRoutes = require("./routes/instituicaoRoutes");
const cursoRoutes = require("./routes/cursoRoutes");
const disciplinaRoutes = require("./routes/disciplinaRoutes");

const app = express();
app.use(express.json());

app.use("/usuarios", userRoutes);
app.use("/api/instituicoes", instituicaoRoutes);
app.use("/api/cursos", cursoRoutes);
app.use("/api/disciplinas", disciplinaRoutes);

app.get("/", (req, res) => res.send("API ProjetoNotaDez — módulo Rosini"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT} 🚀`));
