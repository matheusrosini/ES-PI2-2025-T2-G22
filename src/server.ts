const express = require("express");
const { db } = require("./database/db");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("🚀 API ProjetoNotaDez rodando!");
});

app.listen(3000, () => console.log("Servidor rodando na porta 3000 🚀"));
