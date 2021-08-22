const express = require('express');
const router = express.Router();

//Controller pour associer les fonctions aux differentes routes
const userCtrl = require('../controllers/user');
const checkEmail = require("../middleware/check-email")

//Post car le front va envoyé des infos (mail, mdp...)
router.post('/signup', checkEmail, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;