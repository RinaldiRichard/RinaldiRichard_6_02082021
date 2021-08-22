const express = require('express');

//Création de routeur avec la méthode d'Express
const router = express.Router();

const stuffCtrl = require('../controllers/stuff');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config')



// ! IMPORTANT ! On ne met pas les parenthèses car on n'appelle pas la fonction, on l'applique juste à la route 
//Il faut IMPERATIVEMENT mettre multer après auth sinon les images des requêtes non authentifiées seront enregistrées dans le serveur !!

router.post("/", auth, multer, stuffCtrl.createSauce);
/* //Permet de traiter les requêtes POST (+ authentification pour chaque route)
router.post('/', auth, multer, stuffCtrl.createSauce); */
  
//Rajout du :id pour la récupération dynamique de l'id
router.get('/:id', auth, stuffCtrl.getOneSauce);
  
//Permet la modification d'un objet dans la base de données
router.put('/:id', auth, multer, stuffCtrl.modifySauce);
  
//Permet la suppression d'un objet dans la base de données
router.delete('/:id', auth, stuffCtrl.deleteSauce);
  
//Récupère tous les things pour les afficher
router.get('/', auth, stuffCtrl.getAllSauces); 

router.delete("/:id", auth, stuffCtrl.deleteSauce)
router.post("/:id/like", auth, stuffCtrl.likeDislikeSauce)

//Exportation du routeur de ce fichier
module.exports = router;