// Déclaration des variables pour l'importation de express, body-parser...
const express = require("express");
const mongoose = require("mongoose");
const stuffRoutes = require("./routes/stuff");
const userRoutes = require("./routes/user");
const path = require('path');
require('dotenv').config();

//Connection à la base de données de MongoDB
mongoose.connect('mongodb+srv://RinaldiRichard:Mlkjhg123456---@cluster0.i3dmz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  
  //Log pour vérifier la connection
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

//Pas de route dans ce middleware car il sera apliqué à toutes les requêtes envoyées au serveur
  app.use((req, res, next) => {

    // L'origine qui a le droit d'acces est -> tout le monde via le "*"
    res.setHeader('Access-Control-Allow-Origin', '*');

    //On donne l'autorisation d'utiliser certains headers (origin, content, accept...)
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');

    // on donne l'autorisation d'utiliser certaines méthodes (get, post, delete...)
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use(express.json());
app.use('/images', express.static(path.join(__dirname,'images')))
app.use('/api/sauces', stuffRoutes)
app.use('/api/auth', userRoutes)

module.exports = app;