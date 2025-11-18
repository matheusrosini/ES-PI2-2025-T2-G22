// Feito por Leonardo
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

function authMiddleware(req, res, next) {
  try {
    // 1. tenta header Authorization (Bearer ...)
    let token = null;
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // 2. se não veio no header, tenta cookie named "token"
    if (!token && req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    // 3. se ainda não tiver token -> 401
    if (!token) {
      return res.status(401).json({ message: "Token não enviado." });
    }

    // 4. valida o token
    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded || !decoded.id) {
      return res.status(401).json({ message: "Token inválido." });
    }

    // 5. insere req.user e continua
    req.user = { id: decoded.id };
    next();

  } catch (err) {
    console.error("Erro no authMiddleware:", err);
    return res.status(401).json({ message: "Token inválido ou expirado." });
  }
}

module.exports = { authMiddleware };
