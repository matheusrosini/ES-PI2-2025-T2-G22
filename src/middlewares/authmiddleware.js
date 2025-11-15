// Feito por Leonardo

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'Token ausente' });

  const parts = auth.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ message: 'Formato inválido' });

  const token = parts[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.id;
    req.user = payload; // opcional: nome/email no payload
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};
