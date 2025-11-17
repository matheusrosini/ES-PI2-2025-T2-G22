// Feito por Leonardo

const jwt = require('jsonwebtoken');

const requireAuth =(req, res, next) =>{
  const token = req.cookies.jwt;

  // checa para ver se o jwt ja existe e é verificado
  if(token) {
    jwt.verify(token, '5g45vcxsd2-gdmfwqzsplf0gs-4qwrtvbc-xcgsdpnbct1nh@8-bur40f69', (err, decodedToken) => {
      if(err) {
        console.log(err.message);
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