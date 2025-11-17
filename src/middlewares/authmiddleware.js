// Feito por Leonardo

const jwt = require('jsonwebtoken');

const requireAuth =(req, res, next) =>{
  const token = req.cookies.jwt;
  const JWT_SECRET = process.env.JWT_SECRET;

  // checa para ver se o jwt ja existe e é verificado
  if(token) {
    jwt.verify(token, JWS_SECRET, (err, decodedToken) => {
      if(err) {
      console.log('JWT verify error:', err.message);
        res.redirect('/login');
      } else {
        console.log(decodedToken);
        next();
      }
    })
  }
  else{
    res.redirect('/login');
  }
}
module.exports = { requireAuth };