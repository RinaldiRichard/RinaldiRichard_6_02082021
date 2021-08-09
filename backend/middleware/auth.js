
// Pour chaque requête sur une route protégée, on passe d'abord par ce middleware

//Package pour vérifier les tokens
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {

    //Récupération du token d'authentification (deuxième élément du tableau)
    const token = req.headers.authorization.split(' ')[1];

    //Décodage du token. 1er argument -> le token
    //2ème argument -> clef secrète qui est dans /controllers/user
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');

    //Récupération du user.id dans le token décrypté
    const userId = decodedToken.userId;

    //Vérification si le userId avec la requête correspond bien a celui avec le token
    if (req.body.userId && req.body.userId !== userId) {
      throw 'User ID non valable';
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Requête non authentifiée !')
    });
  }
};