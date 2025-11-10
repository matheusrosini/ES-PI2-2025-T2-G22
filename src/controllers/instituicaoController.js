// src/controllers/instituicaoController.js

exports.getAll = (req, res) => {
  res.send("Retornando todas as instituições 🚀");
};

exports.getById = (req, res) => {
  const { id } = req.params;
  res.send(`Retornando instituição com id ${id}`);
};

exports.create = (req, res) => {
  const dados = req.body;
  res.send(`Criando instituição: ${JSON.stringify(dados)}`);
};

exports.update = (req, res) => {
  const { id } = req.params;
  const dados = req.body;
  res.send(`Atualizando instituição ${id}: ${JSON.stringify(dados)}`);
};

exports.remove = (req, res) => {
  const { id } = req.params;
  res.send(`Removendo instituição ${id}`);
};
