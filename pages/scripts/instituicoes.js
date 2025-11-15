const API_URL = "https://es-pi2-2025-t2-g22-production-b5bc.up.railway.app/api";

import { apiGet, apiPost, apiPut, apiDelete } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
    const formInstituicao = document.getElementById('form-instituicao');
    const tbody = document.querySelector('.list-section table tbody');

    // Carregar todas as instituições
    async function carregarInstituicoes() {
        try {
            const instituicoes = await apiGet('/instituicoes');
            tbody.innerHTML = instituicoes.map(inst => `
                <tr data-id="${inst.id}">
                    <td>${inst.nome}</td>
                    <td>${inst.cnpj || '-'}</td>
                    <td>${inst.endereco || '-'}</td>
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

    // Adicionar eventos de editar e deletar
    function adicionarEventos() {
        // Limpa eventos antigos para não duplicar
        document.querySelectorAll('.edit').forEach(btn => btn.replaceWith(btn.cloneNode(true)));
        document.querySelectorAll('.delete').forEach(btn => btn.replaceWith(btn.cloneNode(true)));

        // Editar
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

                if (novoNome && novoCNPJ && novoEndereco) {
                    try {
                        await apiPut(`/instituicoes/${id}`, {
                            nome: novoNome,
                            cnpj: novoCNPJ,
                            endereco: novoEndereco,
                            usuario_id: 1 // Ajuste conforme usuário logado
                        });
                        alert('Instituição atualizada!');
                        carregarInstituicoes();
                    } catch (error) {
                        console.error('Erro ao atualizar instituição:', error);
                        alert('Erro ao atualizar instituição.');
                    }
                }
            });
        });

        // Deletar
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

    // Cadastrar nova instituição
    formInstituicao.addEventListener('submit', async e => {
        e.preventDefault();
        const nome = formInstituicao.elements["nome"].value.trim();
        const cnpj = formInstituicao.elements["cnpj"].value.trim();
        const endereco = formInstituicao.elements["endereco"].value.trim();

        if (!nome) return alert('Nome é obrigatório');

        try {
            await apiPost('/instituicoes', { nome, cnpj, endereco, usuario_id: 1 });
            alert('Instituição cadastrada!');
            formInstituicao.reset();
            carregarInstituicoes();
        } catch (error) {
            console.error('Erro ao cadastrar instituição:', error);
            alert('Erro ao cadastrar instituição.');
        }
    });

    // Inicializa
    carregarInstituicoes();
});
