// src/controllers/userController.js

exports.getAll = (req, res) => {
  res.send("Retornando todos os usuários 🚀");
};

exports.getById = (req, res) => {
  const { id } = req.params;
  res.send(`Retornando usuário com id ${id}`);
};

exports.create = (req, res) => {
  const dados = req.body;
  res.send(`Criando usuário: ${JSON.stringify(dados)}`);
};

exports.update = (req, res) => {
  const { id } = req.params;
  const dados = req.body;
  res.send(`Atualizando usuário ${id}: ${JSON.stringify(dados)}`);
};

exports.remove = (req, res) => {
  const { id } = req.params;
  res.send(`Removendo usuário ${id}`);
};
