var express = require("express");
var mongo = require("../config/config_db");
var router = express.Router();
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

var boutique = require('../modals/boutique');
var login = require("../modals/login")
const crypto = require('crypto'); // Utilisation de crypto pour générer un mot de passe aléatoire


router.post('/Nouveau_boutique', function (req, res) {   
    if (!req.body || !req.body.id_boutik) {
        return res.status(400).json({ message: 'Données de requête incorrectes.' });
    }

    // Supposons que vous ayez un modèle "boutique" configuré comme suit :
    var nouvelleBoutique = new boutique({
        id_boutik: req.body.id_boutik,
        nom_boutique: req.body.nom_boutique,
        adresse_boutique: req.body.adresse_boutique,
        email_boutique:req.body.email_boutique,
        contact: req.body.contact,
        facebook: req.body.facebook,
        password: req.body.password
    });

    // Enregistrez la boutique dans la base de données
    nouvelleBoutique.save()
        .then(boutique => {
            console.log('Boutique créée :', boutique);

        })
        .then(login => {
            console.log('Compte créé :', login);
            res.status(201).json({ message: 'Boutique, client et compte créés avec succès.' });
        })
        .catch(err => {
            console.error('Erreur lors de la création de la boutique ou du compte :', err);
            res.status(500).json({ message: 'Erreur lors de la création de la boutique ou du compte.' });
        });
});

router.get('/list',function(req,res){

    boutique.find({})
    .sort({ id_boutik: -1 })
    .then(boutiques => {
        // Traitez les résultats ici
        console.log('Boutiques trouvées :', boutiques);
        res.json(boutiques); // Envoyez les données en réponse
    })
    .catch(err => {
        console.error('Erreur lors de la recherche des boutiques :', err);
        res.status(500).json({ message: 'Erreur lors de la recherche des boutiques.' });
    });

});

router.get('/:Id_boutik',function(req,res){

});

router.put('/update/:id_boutik', function (req, res) {

    const idBoutiqueAUpdater = req.params.id_boutik; // Vous pouvez utiliser la chaîne telle quelle

    // Les données que vous souhaitez mettre à jour
    const nouvellesDonnees = {
        nom_boutique: req.body.nom_boutique,
        adresse_boutique: req.body.adresse_boutique,
        contact: req.body.contact,
        facebook: req.body.facebook
    };
    
    // Utilisez findOneAndUpdate pour mettre à jour la boutique
    boutique.findOneAndUpdate(
        { id_boutik: idBoutiqueAUpdater }, // Filtrez en fonction de l'id_boutik
        nouvellesDonnees, // Les données à mettre à jour
        { new: true } // Option pour renvoyer le document mis à jour
    )
    .then(boutiqueMiseAJour => {
        if (!boutiqueMiseAJour) {
            // Si aucune boutique n'a été trouvée avec cet id_boutik
            return res.status(404).json({ message: 'Boutique non trouvée.' });
        }
        console.log('Boutique mise à jour :', boutiqueMiseAJour);
        res.json(boutiqueMiseAJour); // Renvoie la boutique mise à jour
    })
    .catch(err => {
        console.error('Erreur lors de la mise à jour de la boutique :', err);
        res.status(500).json({ message: 'Erreur lors de la mise à jour de la boutique.' });
    });    

});
  
router.delete('/delete/:id_boutik',function(req,res){
    const idBoutiqueASupprimer = req.params.id_boutik; // Vous pouvez utiliser la chaîne telle quelle

    // Utilisez findOneAndRemove ou findOneAndDelete pour supprimer la boutique
    boutique.findOneAndRemove(
        { id_boutik: idBoutiqueASupprimer } // Filtrez en fonction de l'id_boutik
    )
    .then(boutiqueSupprimee => {
        if (!boutiqueSupprimee) {
            // Si aucune boutique n'a été trouvée avec cet id_boutik
            return res.status(404).json({ message: 'Boutique non trouvée.' });
        }
        console.log('Boutique supprimée :', boutiqueSupprimee);
        res.json({ message: 'Boutique supprimée avec succès.' });
    })
    .catch(err => {
        console.error('Erreur lors de la suppression de la boutique :', err);
        res.status(500).json({ message: 'Erreur lors de la suppression de la boutique.' });
    });
});

module.exports = router;
