const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir arquivos estáticos da pasta "public"
app.use(express.static('public'));

// Usuários de teste
const users = [
    { username: 'wagner', password: '123' },
    { username: 'teste', password: 'senha' }
];

// Rota para login (recebe dados do JS do front-end)
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if(user){
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

// Dashboard simples
app.get('/dashboard', (req, res) => {
    res.send('<h1>Dashboard</h1><p>Você está logado!</p><a href="/login.html">Voltar ao login</a>');
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}/`);
});
