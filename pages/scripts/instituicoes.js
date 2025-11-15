import { apiGet, apiPost, apiPut, apiDelete } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
    const formInstituicao = document.getElementById('form-instituicao');
    const tbody = document.querySelector('.list-instituicao table tbody');

    async function carregarInstituicoes() {
        try {
            const instituicoes = await apiGet('/instituicoes');
            tbody.innerHTML = instituicoes.map(i => `
                <tr data-id="${i.id}">
                    <td>${i.nome}</td>
                    <td>${i.cnpj || '-'}</td>
                    <td>${i.endereco || '-'}</td>
                    <td>
                        <button class="edit">Editar</button>
                        <button class="delete">Excluir</button>
                    </td>
                </tr>
            `).join('');
            adicionarEventos();
        } catch (error) {
            console.error('Erro ao carregar instituições:', error);
        }
    }

    function adicionarEventos() {
        document.querySelectorAll('.edit').forEach(btn => btn.replaceWith(btn.cloneNode(true)));
        document.querySelectorAll('.delete').forEach(btn => btn.replaceWith(btn.cloneNode(true)));

        document.querySelectorAll('.edit').forEach(btn => {
            btn.addEventListener('click', async e => {
                const tr = e.target.closest('tr');
                const id = tr.dataset.id;
                const nomeAtual = tr.children[0].textContent;
                const cnpjAtual = tr.children[1].textContent;
                const enderecoAtual = tr.children[2].textContent;

                const novoNome = prompt('Nome:', nomeAtual);
                const novoCNPJ = prompt('CNPJ:', cnpjAtual);
                const novoEndereco = prompt('Endereço:', enderecoAtual);

                if (novoNome) {
                    try {
                        await apiPut(`/instituicoes/${id}`, { nome: novoNome, cnpj: novoCNPJ, endereco: novoEndereco });
                        alert('Instituição atualizada!');
                        carregarInstituicoes();
                    } catch (error) {
                        console.error('Erro ao atualizar instituição:', error);
                        alert('Erro ao atualizar instituição.');
                    }
                }
            });
        });

        document.querySelectorAll('.delete').forEach(btn => {
            btn.addEventListener('click', async e => {
                const tr = e.target.closest('tr');
                const id = tr.dataset.id;

                if (confirm('Deseja realmente excluir esta instituição?')) {
                    try {
                        await apiDelete(`/instituicoes/${id}`);
                        alert('Instituição removida!');
                        carregarInstituicoes();
                    } catch (error) {
                        console.error('Erro ao excluir instituição:', error);
                        alert('Erro ao excluir instituição.');
                    }
                }
            });
        });
    }

    if (formInstituicao) {
        formInstituicao.addEventListener('submit', async e => {
            e.preventDefault();
            const nome = formInstituicao.elements["nome"].value.trim();
            const cnpj = formInstituicao.elements["cnpj"].value.trim();
            const endereco = formInstituicao.elements["endereco"].value.trim();

            if (!nome) return alert('Nome é obrigatório');

            try {
                await apiPost('/instituicoes', { nome, cnpj, endereco });
                alert('Instituição cadastrada!');
                formInstituicao.reset();
                carregarInstituicoes();
            } catch (error) {
                console.error('Erro ao cadastrar instituição:', error);
                alert('Erro ao cadastrar instituição.');
            }
        });
    }

    carregarInstituicoes();
});
