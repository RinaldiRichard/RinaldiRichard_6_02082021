const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

//Fonction pour l'enregistrement de l'utilisateur
exports.signup = (req, res, next) => {
    
    // Hashage du mdp avec en 1er argument le password du corp de la requête
    // Salt = nombre d'éxécution de l'algo de hashage
    bcrypt.hash(req.body.password, 10)

    //Récupération du mdp hashé
    .then(hash => {

        // création du nouvel user avec le model user pour y enregistrer le mdp hashé
        const user = new User({

            // Mail fourni dans le corp de la requête et mdp hashé récupéré juste avant
            email: req.body.email,
            password: hash
        });

        // Enregistrement du user dans la base de données
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      // erreur 500 = erreur serveur
      .catch(error => res.status(500).json({ error }));
};

//Fonction pour la connection de l'utilisateur existant
exports.login = (req, res, next) => {

    //Permet de trouver un utilisateur dans la base de donnée grâce a l'adresse mail
    User.findOne({ email: req.body.email })
      .then(user => {
        
        // Si user non trouvé
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }

        //Comparaison entre le mdp que user envoi et le hash du user enregistré
        bcrypt.compare(req.body.password, user.password)

            // Réception d'un booléen (true/false)
            .then(valid => {
                if (!valid) {
                return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            res.status(200).json({
                
                //Identifiant de user dans la base de donnée
                userId: user._id,
                token: jwt.sign(

                    //1er argument -> donnée qu'on veux encoder (payload)
                    { userId: user._id },
                    'RANDOM_TOKEN_SECRET',
                    { expiresIn: '24h'}
                // Encodage du userId pour eviter qu'un user modifie un objet créé par un autre user
                )
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };