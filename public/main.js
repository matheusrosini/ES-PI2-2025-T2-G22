const form = document.getElementById('loginForm');
const message = document.getElementById('message');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (data.success) {
        message.style.color = 'green';
        message.innerText = 'Login realizado com sucesso!';
        setTimeout(() => { window.location.href = '/dashboard'; }, 1000);
    } else {
        message.style.color = 'red';
        message.innerText = 'Usuário ou senha incorretos!';
    }
});
