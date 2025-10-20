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


// =========================================
// 🔹 ROTAS DE CURSO (requisito 3.2 - parte 2)
// =========================================

// Criar novo curso
app.post('/cursos', autenticar, async (req, res) => {
    const { nome, id_instituicao } = req.body;

    if (!nome || !id_instituicao) {
        return res.status(400).json({ erro: 'Informe nome e id_instituicao.' });
    }

    try {
        const conn = await getConnection();

        // Verifica se instituição existe
        const [inst] = await conn.query('SELECT * FROM instituicao WHERE id_instituicao = ?', [id_instituicao]);
        if (!inst) {
            conn.end();
            return res.status(404).json({ erro: 'Instituição não encontrada.' });
        }

        await conn.query('INSERT INTO curso (nome, id_instituicao) VALUES (?, ?)', [nome, id_instituicao]);
        conn.end();
        res.json({ sucesso: true, mensagem: 'Curso cadastrado com sucesso!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: 'Erro ao cadastrar curso.' });
    }
});

// Listar todos os cursos (com nome da instituição)
app.get('/cursos', autenticar, async (req, res) => {
    try {
        const conn = await getConnection();
        const resultado = await conn.query(`
            SELECT c.id_curso, c.nome AS nome_curso, i.nome AS nome_instituicao
            FROM curso c
            JOIN instituicao i ON c.id_instituicao = i.id_instituicao
        `);
        conn.end();
        res.json({ cursos: resultado });
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: 'Erro ao listar cursos.' });
    }
});

// Atualizar curso
app.put('/cursos/:id', autenticar, async (req, res) => {
    const { nome, id_instituicao } = req.body;
    const { id } = req.params;

    if (!nome || !id_instituicao) {
        return res.status(400).json({ erro: 'Informe nome e id_instituicao.' });
    }

    try {
        const conn = await getConnection();

        // Verifica se curso existe
        const [curso] = await conn.query('SELECT * FROM curso WHERE id_curso = ?', [id]);
        if (!curso) {
            conn.end();
            return res.status(404).json({ erro: 'Curso não encontrado.' });
        }

        // Verifica se instituição existe
        const [inst] = await conn.query('SELECT * FROM instituicao WHERE id_instituicao = ?', [id_instituicao]);
        if (!inst) {
            conn.end();
            return res.status(404).json({ erro: 'Instituição não encontrada.' });
        }

        await conn.query('UPDATE curso SET nome = ?, id_instituicao = ? WHERE id_curso = ?', [nome, id_instituicao, id]);
        conn.end();
        res.json({ sucesso: true, mensagem: 'Curso atualizado com sucesso!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: 'Erro ao atualizar curso.' });
    }
});

// Excluir curso (somente se não houver disciplinas vinculadas)
app.delete('/cursos/:id', autenticar, async (req, res) => {
    const { id } = req.params;

    try {
        const conn = await getConnection();

        // Verifica se há disciplinas vinculadas
        const disciplinas = await conn.query('SELECT * FROM disciplina WHERE id_curso = ?', [id]);
        if (disciplinas.length > 0) {
            conn.end();
            return res.status(400).json({ erro: 'Não é possível excluir: há disciplinas vinculadas a este curso.' });
        }

        // Exclui curso
        const resultado = await conn.query('DELETE FROM curso WHERE id_curso = ?', [id]);
        conn.end();

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: 'Curso não encontrado.' });
        }

        res.json({ sucesso: true, mensagem: 'Curso excluído com sucesso!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: 'Erro ao excluir curso.' });
    }
});


// =========================================
// 🔹 ROTAS DE DISCIPLINA (requisito 3.2 - parte 3)
// =========================================

// Criar disciplina
app.post('/disciplinas', autenticar, async (req, res) => {
    const { nome, sigla, codigo, periodo, id_curso } = req.body;

    if (!nome || !id_curso) {
        return res.status(400).json({ erro: 'Informe nome e id_curso.' });
    }

    try {
        const conn = await getConnection();

        // Verifica se o curso existe
        const [curso] = await conn.query('SELECT * FROM curso WHERE id_curso = ?', [id_curso]);
        if (!curso) {
            conn.end();
            return res.status(404).json({ erro: 'Curso não encontrado.' });
        }

        await conn.query(
            'INSERT INTO disciplina (nome, sigla, codigo, periodo, id_curso) VALUES (?, ?, ?, ?, ?)',
            [nome, sigla, codigo, periodo, id_curso]
        );
        conn.end();
        res.json({ sucesso: true, mensagem: 'Disciplina cadastrada com sucesso!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: 'Erro ao cadastrar disciplina.' });
    }
});

// Listar disciplinas com informações do curso
app.get('/disciplinas', autenticar, async (req, res) => {
    try {
        const conn = await getConnection();
        const resultado = await conn.query(`
            SELECT d.id_disciplina, d.nome AS nome_disciplina, d.sigla, d.codigo, d.periodo,
                   c.nome AS nome_curso
            FROM disciplina d
            JOIN curso c ON d.id_curso = c.id_curso
        `);
        conn.end();
        res.json({ disciplinas: resultado });
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: 'Erro ao listar disciplinas.' });
    }
});

// Atualizar disciplina
app.put('/disciplinas/:id', autenticar, async (req, res) => {
    const { nome, sigla, codigo, periodo, id_curso } = req.body;
    const { id } = req.params;

    if (!nome || !id_curso) {
        return res.status(400).json({ erro: 'Informe nome e id_curso.' });
    }

    try {
        const conn = await getConnection();

        // Verifica se a disciplina existe
        const [disciplina] = await conn.query('SELECT * FROM disciplina WHERE id_disciplina = ?', [id]);
        if (!disciplina) {
            conn.end();
            return res.status(404).json({ erro: 'Disciplina não encontrada.' });
        }

        // Verifica se o curso existe
        const [curso] = await conn.query('SELECT * FROM curso WHERE id_curso = ?', [id_curso]);
        if (!curso) {
            conn.end();
            return res.status(404).json({ erro: 'Curso não encontrado.' });
        }

        await conn.query(
            'UPDATE disciplina SET nome = ?, sigla = ?, codigo = ?, periodo = ?, id_curso = ? WHERE id_disciplina = ?',
            [nome, sigla, codigo, periodo, id_curso, id]
        );
        conn.end();
        res.json({ sucesso: true, mensagem: 'Disciplina atualizada com sucesso!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: 'Erro ao atualizar disciplina.' });
    }
});

// Excluir disciplina (apenas se não tiver turmas vinculadas)
app.delete('/disciplinas/:id', autenticar, async (req, res) => {
    const { id } = req.params;

    try {
        const conn = await getConnection();

        // Verifica se há turmas vinculadas
        const turmas = await conn.query('SELECT * FROM turma WHERE id_disciplina = ?', [id]);
        if (turmas.length > 0) {
            conn.end();
            return res.status(400).json({ erro: 'Não é possível excluir: há turmas vinculadas a esta disciplina.' });
        }

        const resultado = await conn.query('DELETE FROM disciplina WHERE id_disciplina = ?', [id]);
        conn.end();

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: 'Disciplina não encontrada.' });
        }

        res.json({ sucesso: true, mensagem: 'Disciplina excluída com sucesso!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: 'Erro ao excluir disciplina.' });
    }
});


// =========================================
// 🔹 ROTAS DE TURMA (requisito 3.2 - parte 4)
// =========================================

// Criar turma
app.post('/turmas', autenticar, async (req, res) => {
    const { nome, dia, horario, local, id_disciplina } = req.body;

    if (!nome || !id_disciplina) {
        return res.status(400).json({ erro: 'Informe nome e id_disciplina.' });
    }

    try {
        const conn = await getConnection();

        // Verifica se a disciplina existe
        const [disciplina] = await conn.query('SELECT * FROM disciplina WHERE id_disciplina = ?', [id_disciplina]);
        if (!disciplina) {
            conn.end();
            return res.status(404).json({ erro: 'Disciplina não encontrada.' });
        }

        await conn.query(
            'INSERT INTO turma (nome, dia, horario, local, id_disciplina) VALUES (?, ?, ?, ?, ?)',
            [nome, dia, horario, local, id_disciplina]
        );

        conn.end();
        res.json({ sucesso: true, mensagem: 'Turma cadastrada com sucesso!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: 'Erro ao cadastrar turma.' });
    }
});

// Listar turmas com informações da disciplina
app.get('/turmas', autenticar, async (req, res) => {
    try {
        const conn = await getConnection();
        const resultado = await conn.query(`
            SELECT t.id_turma, t.nome AS nome_turma, t.dia, t.horario, t.local,
                   d.nome AS nome_disciplina, d.sigla, d.codigo
            FROM turma t
            JOIN disciplina d ON t.id_disciplina = d.id_disciplina
        `);
        conn.end();
        res.json({ turmas: resultado });
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: 'Erro ao listar turmas.' });
    }
});

// Atualizar turma
app.put('/turmas/:id', autenticar, async (req, res) => {
    const { nome, dia, horario, local, id_disciplina } = req.body;
    const { id } = req.params;

    if (!nome || !id_disciplina) {
        return res.status(400).json({ erro: 'Informe nome e id_disciplina.' });
    }

    try {
        const conn = await getConnection();

        // Verifica se a turma existe
        const [turma] = await conn.query('SELECT * FROM turma WHERE id_turma = ?', [id]);
        if (!turma) {
            conn.end();
            return res.status(404).json({ erro: 'Turma não encontrada.' });
        }

        // Verifica se a disciplina existe
        const [disciplina] = await conn.query('SELECT * FROM disciplina WHERE id_disciplina = ?', [id_disciplina]);
        if (!disciplina) {
            conn.end();
            return res.status(404).json({ erro: 'Disciplina não encontrada.' });
        }

        await conn.query(
            'UPDATE turma SET nome = ?, dia = ?, horario = ?, local = ?, id_disciplina = ? WHERE id_turma = ?',
            [nome, dia, horario, local, id_disciplina, id]
        );
        conn.end();
        res.json({ sucesso: true, mensagem: 'Turma atualizada com sucesso!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: 'Erro ao atualizar turma.' });
    }
});

// Excluir turma (com confirmação simples)
app.delete('/turmas/:id', autenticar, async (req, res) => {
    const { id } = req.params;
    const { confirmar } = req.query;

    if (confirmar !== 'true') {
        return res.status(400).json({ mensagem: 'Confirme a exclusão enviando "?confirmar=true" na URL.' });
    }

    try {
        const conn = await getConnection();

        const resultado = await conn.query('DELETE FROM turma WHERE id_turma = ?', [id]);
        conn.end();

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: 'Turma não encontrada.' });
        }

        res.json({ sucesso: true, mensagem: 'Turma excluída com sucesso!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: 'Erro ao excluir turma.' });
    }
});



app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}/`);
});
