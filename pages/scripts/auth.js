// Feito por Leonardo e Matheus Rosini

import { apiPost } from './api.js';

async function login(email, senha) {
    return apiPost(`/auth/login`, { email, senha });
}

async function register(nome, email, senha, telefone) {
    return apiPost(`/auth/register`, { nome, email, senha, telefone });
}

document.addEventListener('DOMContentLoaded', () => {
    const formLogin = document.getElementById('loginForm') || document.getElementById('form-login');
    const formCadastro = document.getElementById('cadastroForm') || document.getElementById('form-cadastro');

    // LOGIN
    if (formLogin) {
        formLogin.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = formLogin.elements['email'].value.trim();
            const senha = formLogin.elements['senha'].value.trim();

            if (!email || !senha) {
                alert('Email e senha são obrigatórios!');
                return;
            }

            try {
                const res = await login(email, senha);

                if (res.token) {
                    localStorage.setItem('token', res.token);
                    localStorage.setItem('user', JSON.stringify(res.user));
                }

                alert(`Bem-vindo, ${res.user.nome}!`);
                window.location.href = 'dashboard.html';

            } catch (error) {
                alert(`Erro no login: ${error.message}`);
            }
        });
    }

    // CADASTRO
    if (formCadastro) {
        formCadastro.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nome = formCadastro.elements['nome'].value.trim();
            const email = formCadastro.elements['email'].value.trim();
            const senha = formCadastro.elements['senha'].value.trim();
            const telefone = formCadastro.elements['telefone'] ? formCadastro.elements['telefone'].value.trim() : '';

            if (!nome || !email || !senha) {
                alert('Nome, email e senha são obrigatórios!');
                return;
            }

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
