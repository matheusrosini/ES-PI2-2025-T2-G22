// Feito por Leonardo
// index.js — usado somente em ambiente local

require("dotenv").config();

const app = require("./src/server");  // importa o app SEM listen()

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando localmente em http://localhost:${PORT}`);
});
