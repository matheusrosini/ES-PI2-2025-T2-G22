import { login, register } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
    // tentamos pegar pelo ID existente no HTML e também pelo ID antigo
    const formLogin = document.getElementById('loginForm') || document.getElementById('form-login');
    const formCadastro = document.getElementById('cadastroForm') || document.getElementById('form-cadastro');

    // LOGIN
    if (formLogin) {
        formLogin.addEventListener('submit', async e => {
            e.preventDefault();
            const email = formLogin.elements['email'].value.trim();
            const senha = formLogin.elements['senha'].value.trim();

            if (!email || !senha) return alert('Email e senha são obrigatórios!');

            try {
                const data = await login(email, senha);
                alert(`Bem-vindo, ${data.user.nome}!`);
                localStorage.setItem('token', data.token);
                window.location.href = 'dashboard.html';
            } catch (error) {
                alert(`Erro no login: ${error.message}`);
            }
        });
    }

    // CADASTRO
    if (formCadastro) {
        formCadastro.addEventListener('submit', async e => {
            e.preventDefault();
            const nome = formCadastro.elements['nome'].value.trim();
            const email = formCadastro.elements['email'].value.trim();
            const senha = formCadastro.elements['senha'].value.trim();
            const telefone = formCadastro.elements['telefone'] ? formCadastro.elements['telefone'].value.trim() : '';

            if (!nome || !email || !senha)
                return alert('Nome, email e senha são obrigatórios!');

            try {
                const data = await register(nome, email, senha, telefone);
                alert(data.message || 'Conta criada com sucesso!');
                window.location.href = 'index.html';
            } catch (error) {
                alert(`Erro no registro: ${error.message}`);
            }
        });
    }
});
