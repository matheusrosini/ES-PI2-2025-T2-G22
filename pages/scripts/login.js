const API_URL = "https://es-pi2-2025-t2-g22-production-b5bc.up.railway.app/api";

document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha })
    });

    const data = await response.json();

    if (!response.ok) {
        alert(data.error);
        return;
    }

    alert("Login efetuado!");
    localStorage.setItem("usuarioId", data.usuario.id);
    window.location.href = "dashboard.html";
});
