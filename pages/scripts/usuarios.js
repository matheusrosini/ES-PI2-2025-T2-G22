// usuarios.js

lucide.createIcons();

const tabelaUsuarios = document.getElementById('tabela-usuarios')?.querySelector('tbody');

// Função para criar linha de usuário na tabela
export function adicionarUsuario(usuario) {
  if (!tabelaUsuarios) return;

  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td>${usuario.nome}</td>
    <td>${usuario.email}</td>
    <td>${usuario.telefone || '-'}</td>
    <td>
      <button class="edit-btn">Editar</button>
      <button class="delete-btn">Excluir</button>
    </td>
  `;
  tabelaUsuarios.appendChild(tr);
}

// Função para excluir usuário
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('delete-btn')) {
    e.target.closest('tr').remove();
  }
});
