import { apiGet, apiPost, apiPut, apiDelete } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
    const formComponente = document.getElementById('form-componente');
    const tbody = document.querySelector('.list-componente table tbody');

    async function carregarComponentes() {
        try {
            const componentes = await apiGet('/componentes');
            tbody.innerHTML = componentes.map(c => `
                <tr data-id="${c.id}">
                    <td>${c.nome}</td>
                    <td>${c.sigla}</td>
                    <td>${c.descricao || '-'}</td>
                    <td>${c.disciplina_id}</td>
                    <td>
                        <button class="edit">Editar</button>
                        <button class="delete">Excluir</button>
                    </td>
                </tr>
            `).join('');
            adicionarEventos();
        } catch (error) {
            console.error('Erro ao carregar componentes:', error);
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
                const siglaAtual = tr.children[1].textContent;
                const descricaoAtual = tr.children[2].textContent;
                const disciplinaAtual = tr.children[3].textContent;

                const novoNome = prompt('Nome:', nomeAtual);
                const novaSigla = prompt('Sigla:', siglaAtual);
                const novaDescricao = prompt('Descrição:', descricaoAtual);
                const novaDisciplina = prompt('Disciplina ID:', disciplinaAtual);

                if (novoNome && novaSigla) {
                    try {
                        await apiPut(`/componentes/${id}`, { nome: novoNome, sigla: novaSigla, descricao: novaDescricao, disciplina_id: novaDisciplina });
                        alert('Componente atualizado!');
                        carregarComponentes();
                    } catch (error) {
                        console.error('Erro ao atualizar componente:', error);
                        alert('Erro ao atualizar componente.');
                    }
                }
            });
        });

        document.querySelectorAll('.delete').forEach(btn => {
            btn.addEventListener('click', async e => {
                const tr = e.target.closest('tr');
                const id = tr.dataset.id;

                if (confirm('Deseja realmente excluir este componente?')) {
                    try {
                        await apiDelete(`/componentes/${id}`);
                        alert('Componente removido!');
                        carregarComponentes();
                    } catch (error) {
                        console.error('Erro ao excluir componente:', error);
                        alert('Erro ao excluir componente.');
                    }
                }
            });
        });
    }

    if (formComponente) {
        formComponente.addEventListener('submit', async e => {
            e.preventDefault();
            const nome = formComponente.elements["nome"].value.trim();
            const sigla = formComponente.elements["sigla"].value.trim();
            const descricao = formComponente.elements["descricao"].value.trim();
            const disciplina_id = formComponente.elements["disciplina_id"].value.trim();

            if (!nome || !sigla || !disciplina_id) return alert('Nome, sigla e disciplina são obrigatórios');

            try {
                await apiPost('/componentes', { nome, sigla, descricao, disciplina_id });
                alert('Componente cadastrado!');
                formComponente.reset();
                carregarComponentes();
            } catch (error) {
                console.error('Erro ao cadastrar componente:', error);
                alert('Erro ao cadastrar componente.');
            }
        });
    }

    carregarComponentes();
});
