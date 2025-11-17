// Feito por Leonardo

(function() {
    const token = localStorage.getItem("token");

    // Se não tem token → usuário não logado → volta para login
    if (!token) {
        window.location.href = "index.html"; // sua página de login
    }
})();
