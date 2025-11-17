// Feito por Leonardo 
const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    let token = null;

    if (authHeader && typeof authHeader === 'string') {
      const parts = authHeader.split(' ');
      if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') {
        token = parts[1];
      } else {
        token = authHeader;
      }
    }

    if (!token) {
      return res.status(401).json({ message: 'Token não fornecido' });
    }

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      console.error('JWT_SECRET não definido nas variáveis de ambiente');
      return res.status(500).json({ message: 'Configuração de servidor inválida' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log('JWT verify error:', err.message);
        return res.status(401).json({ message: 'Token inválido ou expirado' });
      }
      req.user = decoded;
      next();
    });
  } catch (err) {
    console.error('requireAuth error:', err);
    return res.status(500).json({ message: 'Erro interno no middleware de autenticação' });
  }
};

module.exports = { requireAuth };
