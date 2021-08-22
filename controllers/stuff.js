const Sauce = require('../models/Sauce');
const fs = require('fs');

// Exportation de la fonction pour la création d'un objet

exports.createSauce = (req, res, next) => {

    //Extraction de l'objet JSON du sauce du body
    const sauceObject = JSON.parse(req.body.sauce);

    //Suppression de l'id généré auto par MongoDB
    delete sauceObject._id;
  
    //Création d'une constante qui sera une nouvelle instance du model
    //Et on lui passeun objet qui contient toutes les infos dont on a besoin
    const sauce = new Sauce({

        // Raccourci copiant les champs de la body de la request
        ...sauceObject,

        //Récupération dynamique des segments de l'url où se trouve l'image
        //Exemple -> http ou https://host_du_serveur(localhost:3000)/images/nom_du_fichier_généré_avec_multer
        //Attention à ne pas mettre d'espace entre les éléments
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,

        likes: 0,
        dislikes: 0,
        usersLiked: [' '],
        usersdisLiked: [' '],
    });

    //Enregistrement de l'objet dans la base de données
    sauce.save()
    .then(() => res.status(201).json({ message: "Sauce enregistrée" }))
    .catch((error) => res.status(400).json({ error }));
}; 

exports.modifySauce = (req, res, next) => {

  const sauceObject = req.file ?
    {
      //Si on trouve un fichier, on récup la string (sauce) et on la parse en objet
      ...JSON.parse(req.body.sauce),
      //Modif de l'imageUrl
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`

    } : { ...req.body};
  // 1er argument = objet à modifier ( id égal à celui envoyé dans les param de requête)
  //2ème argument = nouvelle version de l'objet tout en lui précisant que l'id est celui des paramètres pour être sûr
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet modifié !'}))
      .catch(error => res.status(400).json({ error }));
}

exports.deleteSauce = (req, res, next) => {
  //Avant de le supprimer, on va le chercher pour avoir l'url de l'image pour avoir accès au nom du fichier pour le supprimer
  Sauce.findOne({ _id: req.params.id })
  .then(sauce => {
    //Récupération du nom du fichier précisément
    //Extraction du fichier
    //Réup de l'imageUrl du sauce retournée par la base
    //Split pour récup, sous forme de tableau, ce qu'il y a avant le /images/ et apres, donc le nom du fichier
    const filename = sauce.imageUrl.split('/images/')[1]

    //Unlike pour suppr un fichier
    //1er argument -> string qui correspond au chemin de ce fichier
    //2ème argument ->
    fs.unlink(`images/${filename}`, () => {
      
      //Suppression de l'objet de la base une fois la suppression du fichier effectuée
      Sauce.deleteOne({ _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
      .catch(error => res.status(400).json({ error }));
    })
  })
  .catch(error => res.status(500).json({ error }));
} 

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(404).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
}

exports.likeDislikeSauce = (req, res, next) => {
  let like = req.body.like
  let userId = req.body.userId
  let sauceId = req.params.id
  
  switch (like) {

    //Cas où l'utilisateur aime une sauce
    case 1 :
        Sauce.updateOne({ _id: sauceId }, { $push: { usersLiked: userId }, $inc: { likes: +1 }})
          .then(() => res.status(200).json({ message: `J'aime` }))
          .catch((error) => res.status(400).json({ error }))
            
      break;

    case 0 :
        Sauce.findOne({ _id: sauceId })
           .then((sauce) => {
            
            // Si l'utilisateur enlève son like
            if (sauce.usersLiked.includes(userId)) { 
              Sauce.updateOne({ _id: sauceId }, { $pull: { usersLiked: userId }, $inc: { likes: -1 }})
                .then(() => res.status(200).json({ message: `Neutre` }))
                .catch((error) => res.status(400).json({ error }))
            }
            if (sauce.usersDisliked.includes(userId)) { 

              // Si l'utilisateur enlève son dislike
              Sauce.updateOne({ _id: sauceId }, { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 }})
                .then(() => res.status(200).json({ message: `Neutre` }))
                .catch((error) => res.status(400).json({ error }))
            }
          })
          .catch((error) => res.status(404).json({ error }))
      break;
    
    // Cas où l'utilisateur dislike une sauce
    case -1 :
        Sauce.updateOne({ _id: sauceId }, { $push: { usersDisliked: userId }, $inc: { dislikes: +1 }})
          .then(() => { res.status(200).json({ message: `Je n'aime pas` }) })
          .catch((error) => res.status(400).json({ error }))
      break;
      
      default:
        console.log(error);
  }
}
