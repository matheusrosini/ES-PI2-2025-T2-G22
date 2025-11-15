import { register } from './api.js';

const form = document.getElementById('cadastroForm');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = form.elements['nome'].value.trim();
    const email = form.elements['email'].value.trim();
    const telefone = form.elements['telefone'].value.trim();
    const senha = form.elements['senha'].value.trim();

    if (!nome || !email || !telefone || !senha) {
        return alert('Nome, e-mail, telefone e senha são obrigatórios!');
    }

    try {
        const response = await register(nome, email, senha, telefone);
        alert('Conta criada com sucesso!');
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        alert(`Erro ao criar conta: ${error.message}`);
    }
});
