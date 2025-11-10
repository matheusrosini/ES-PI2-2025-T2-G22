// src/controllers/disciplinaController.js

exports.getAll = (req, res) => {
  res.send("Retornando todas as disciplinas 🚀");
};

exports.getById = (req, res) => {
  const { id } = req.params;
  res.send(`Retornando disciplina com id ${id}`);
};

exports.create = (req, res) => {
  const dados = req.body;
  res.send(`Criando disciplina: ${JSON.stringify(dados)}`);
};

exports.update = (req, res) => {
  const { id } = req.params;
  const dados = req.body;
  res.send(`Atualizando disciplina ${id}: ${JSON.stringify(dados)}`);
};

exports.remove = (req, res) => {
  const { id } = req.params;
  res.send(`Removendo disciplina ${id}`);
};
