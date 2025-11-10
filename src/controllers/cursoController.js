// src/controllers/cursoController.js

exports.getAll = (req, res) => {
  res.send("Retornando todos os cursos 🚀");
};

exports.getById = (req, res) => {
  const { id } = req.params;
  res.send(`Retornando curso com id ${id}`);
};

exports.create = (req, res) => {
  const dados = req.body;
  res.send(`Criando curso: ${JSON.stringify(dados)}`);
};

exports.update = (req, res) => {
  const { id } = req.params;
  const dados = req.body;
  res.send(`Atualizando curso ${id}: ${JSON.stringify(dados)}`);
};

exports.remove = (req, res) => {
  const { id } = req.params;
  res.send(`Removendo curso ${id}`);
};
