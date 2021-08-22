const multer = require('multer');

//Préparation du "dictionnaire de mime type (types de médias)"
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

//Création d'objet pour la configuration de multer
const storage = multer.diskStorage({

    //Explication pour dire a multer dans quel dossier enregistrer les fichiers
    destination: (req, file, callback) => {
    //1er argument null pour dire qu'il n'y a pas eu d'erreur
    //2ème argument -> nom du dossier
    callback(null, 'images');
  },
  //2ème élément de config pour multer -> quel nom de fichier utiliser
  filename: (req, file, callback) => {

    //Génération du nouveau nom pour le fichier
    //Suppression des espace blanc entre nom de fichier et remplacement par des _
    const name = file.originalname.split(' ').join('_');
    //Création de l'extension qui correspond au mime type du fichier envoyé par le front
    const extension = MIME_TYPES[file.mimetype];
    //Appel du callback
    callback(null, name + Date.now() + '.' + extension);
    //On aura le nom du fichier généré plus haut avec les _ + timestamp pour le rendre unique + l'extension du fichier
  }
});

//Exportation du module auquel on passe l'objet storage et appel de la methode single car fichier unique
module.exports = multer({storage: storage}).single('image');