import { apiGet, apiPost, apiPut, apiDelete } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
    const formUsuario = document.getElementById('form-usuario');
    const tbody = document.querySelector('.list-usuario table tbody');

    async function carregarUsuarios() {
        try {
            const usuarios = await apiGet('/usuarios');
            tbody.innerHTML = usuarios.map(u => `
                <tr data-id="${u.id}">
                    <td>${u.nome}</td>
                    <td>${u.email}</td>
                    <td>${u.telefone || '-'}</td>
                    <td>
                        <button class="edit">Editar</button>
                        <button class="delete">Excluir</button>
                    </td>
                </tr>
            `).join('');
            adicionarEventos();
        } catch (error) {
            console.error('Erro ao carregar usuários:', error);
        }
    }

    function adicionarEventos() {
        document.querySelectorAll('.edit').forEach(btn => btn.replaceWith(btn.cloneNode(true)));
        document.querySelectorAll('.delete').forEach(btn => btn.replaceWith(btn.cloneNode(true)));

        // Editar
        document.querySelectorAll('.edit').forEach(btn => {
            btn.addEventListener('click', async e => {
                const tr = e.target.closest('tr');
                const id = tr.dataset.id;
                const nomeAtual = tr.children[0].textContent;
                const emailAtual = tr.children[1].textContent;
                const telefoneAtual = tr.children[2].textContent;

                const novoNome = prompt('Nome:', nomeAtual);
                const novoEmail = prompt('Email:', emailAtual);
                const novoTelefone = prompt('Telefone:', telefoneAtual);

                if (novoNome && novoEmail) {
                    try {
                        await apiPut(`/usuarios/${id}`, { nome: novoNome, email: novoEmail, telefone: novoTelefone });
                        alert('Usuário atualizado!');
                        carregarUsuarios();
                    } catch (error) {
                        console.error('Erro ao atualizar usuário:', error);
                        alert('Erro ao atualizar usuário.');
                    }
                }
            });
        });

        // Deletar
        document.querySelectorAll('.delete').forEach(btn => {
            btn.addEventListener('click', async e => {
                const tr = e.target.closest('tr');
                const id = tr.dataset.id;

                if (confirm('Deseja realmente excluir este usuário?')) {
                    try {
                        await apiDelete(`/usuarios/${id}`);
                        alert('Usuário removido!');
                        carregarUsuarios();
                    } catch (error) {
                        console.error('Erro ao excluir usuário:', error);
                        alert('Erro ao excluir usuário.');
                    }
                }
            });
        });
    }

    // Cadastrar novo usuário
    if (formUsuario) {
        formUsuario.addEventListener('submit', async e => {
            e.preventDefault();
            const nome = formUsuario.elements["nome"].value.trim();
            const email = formUsuario.elements["email"].value.trim();
            const telefone = formUsuario.elements["telefone"].value.trim();
            const senha = formUsuario.elements["senha"].value.trim();

            if (!nome || !email || !senha) return alert('Nome, email e senha são obrigatórios');

            try {
                await apiPost('/usuarios', { nome, email, telefone, senha });
                alert('Usuário cadastrado!');
                formUsuario.reset();
                carregarUsuarios();
            } catch (error) {
                console.error('Erro ao cadastrar usuário:', error);
                alert('Erro ao cadastrar usuário.');
            }
        });
    }

    carregarUsuarios();
});
