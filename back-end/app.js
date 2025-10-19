const express = require('express');
const cors = require('cors');
const { getConnection } = require('./db');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Para ler EMAIL_USER, EMAIL_PASS e JWT_SECRET do .env

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// ====== JWT SECRET ======
const JWT_SECRET = process.env.JWT_SECRET || 'chave_super_secreta';

// ====================== ROTAS ======================

// 🔹 Cadastro de docente
app.post('/register', async (req, res) => {
    const { nome, email, telefone, senha } = req.body;

    if (!nome || !email || !telefone || !senha) {
        return res.status(400).json({ success: false, message: 'Preencha todos os campos.' });
    }

    try {
        const conn = await getConnection();

        // Verificar se o e-mail já existe
        const existe = await conn.query('SELECT * FROM docente WHERE email = ?', [email]);
        if (existe.length > 0) {
            conn.end();
            return res.status(400).json({ success: false, message: 'E-mail já cadastrado.' });
        }

        // Insere o docente com senha em texto puro
        await conn.query(
            'INSERT INTO docente (nome, email, telefone, senha) VALUES (?, ?, ?, ?)',
            [nome, email, telefone, senha]
        );

        conn.end();
        res.json({ success: true, message: 'Cadastro realizado com sucesso!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Erro ao cadastrar docente.' });
    }
});

// 🔹 Login de docente
app.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ success: false, message: 'Preencha e-mail e senha.' });
    }

    try {
        const conn = await getConnection();
        const resultado = await conn.query('SELECT * FROM docente WHERE email = ?', [email]);
        conn.end();

        if (resultado.length === 0) {
            return res.status(401).json({ success: false, message: 'Usuário não encontrado.' });
        }

        const usuario = resultado[0];

        // Comparação direta de senha em texto puro
        if (senha !== usuario.senha) {
            return res.status(401).json({ success: false, message: 'Senha incorreta.' });
        }

        // Gera token JWT
        const token = jwt.sign({ id: usuario.id_docente, email: usuario.email }, JWT_SECRET, { expiresIn: '2h' });

        res.json({ success: true, message: 'Login realizado com sucesso!', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Erro ao fazer login.' });
    }
});

// 🔹 Middleware para proteger rotas
function autenticar(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ erro: 'Acesso negado. Token ausente.' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ erro: 'Token inválido.' });
        req.user = user;
        next();
    });
}

// 🔹 Exemplo de rota protegida
app.get('/perfil', autenticar, async (req, res) => {
    try {
        const conn = await getConnection();
        const resultado = await conn.query(
            'SELECT id_docente, nome, email, telefone FROM docente WHERE id_docente = ?',
            [req.user.id]
        );
        conn.end();

        if (resultado.length === 0) return res.status(404).json({ erro: 'Usuário não encontrado' });

        res.json({ usuario: resultado[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: 'Erro ao buscar usuário' });
    }
});

// 🔹 Recuperação de senha (texto puro)
app.post('/esqueci-senha', async (req, res) => {
    const { email } = req.body;

    try {
        const conn = await getConnection();
        const resultado = await conn.query('SELECT * FROM docente WHERE email = ?', [email]);
        conn.end();

        if (resultado.length === 0) return res.status(404).json({ erro: 'E-mail não encontrado' });

        const usuario = resultado[0];
        const senha = usuario.senha; // senha em texto puro

        // Configura transporte Gmail
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Recuperação de senha - NotaDez',
            text: `Olá ${usuario.nome},\n\nSua senha cadastrada no sistema NotaDez é: ${senha}\n\nAtenciosamente,\nEquipe NotaDez`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ erro: 'Erro ao enviar e-mail' });
            }
            res.json({ mensagem: 'Senha enviada para o e-mail informado.' });
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: 'Erro ao processar recuperação de senha' });
    }
});


// =========================================
// 🔹 ROTAS DE INSTITUIÇÃO (requisito 3.2 - parte 1)
// =========================================

// Criar nova instituição
app.post('/instituicoes', autenticar, async (req, res) => {
    const { nome } = req.body;

    if (!nome) return res.status(400).json({ erro: 'Informe o nome da instituição.' });

    try {
        const conn = await getConnection();
        await conn.query('INSERT INTO instituicao (nome) VALUES (?)', [nome]);
        conn.end();
        res.json({ sucesso: true, mensagem: 'Instituição cadastrada com sucesso!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: 'Erro ao cadastrar instituição.' });
    }
});

// Listar todas as instituições
app.get('/instituicoes', autenticar, async (req, res) => {
    try {
        const conn = await getConnection();
        const resultado = await conn.query('SELECT * FROM instituicao');
        conn.end();
        res.json({ instituicoes: resultado });
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: 'Erro ao listar instituições.' });
    }
});

// Atualizar instituição
app.put('/instituicoes/:id', autenticar, async (req, res) => {
    const { nome } = req.body;
    const { id } = req.params;

    if (!nome) return res.status(400).json({ erro: 'Informe o novo nome da instituição.' });

    try {
        const conn = await getConnection();
        const [verifica] = await conn.query('SELECT * FROM instituicao WHERE id_instituicao = ?', [id]);

        if (!verifica) {
            conn.end();
            return res.status(404).json({ erro: 'Instituição não encontrada.' });
        }

        await conn.query('UPDATE instituicao SET nome = ? WHERE id_instituicao = ?', [nome, id]);
        conn.end();
        res.json({ sucesso: true, mensagem: 'Instituição atualizada com sucesso!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: 'Erro ao atualizar instituição.' });
    }
});

// Excluir instituição (somente se não tiver cursos)
app.delete('/instituicoes/:id', autenticar, async (req, res) => {
    const { id } = req.params;

    try {
        const conn = await getConnection();

        // Verifica se há cursos vinculados
        const cursos = await conn.query('SELECT * FROM curso WHERE id_instituicao = ?', [id]);
        if (cursos.length > 0) {
            conn.end();
            return res.status(400).json({ erro: 'Não é possível excluir: há cursos vinculados a esta instituição.' });
        }

        // Exclui instituição
        const resultado = await conn.query('DELETE FROM instituicao WHERE id_instituicao = ?', [id]);
        conn.end();

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: 'Instituição não encontrada.' });
        }

        res.json({ sucesso: true, mensagem: 'Instituição excluída com sucesso!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: 'Erro ao excluir instituição.' });
    }
});



app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}/`);
});
