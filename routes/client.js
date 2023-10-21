var express = require("express");
var mongo = require("../config/config_db");
var router = express.Router();
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const crypto = require('crypto'); // Utilisation de crypto pour générer un mot de passe aléatoire

var client = require('../modals/client');
var login = require('../modals/login');

router.post('/Nouveau_client', async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ message: 'Données de requête incorrectes.' });
        }

        // Générez un mot de passe aléatoire pour le compte du client
        const password = crypto.randomBytes(8).toString('hex'); // Génère un mot de passe de 16 caractères hexadécimaux

        // Créez un nouveau client avec les informations fournies
        const nouvelleClient = new client({
            id_client:req.body.id_client,
            nom: req.body.nom,
            prenoms: req.body.prenoms,
            adresse: req.body.adresse,
            tel: req.body.tel
        });

        // Enregistrez le client dans la base de données
        const clientSaved = await nouvelleClient.save();
        console.log('Client créé :', clientSaved);

        // Créez un compte avec les informations spécifiées
        const nouveauCompte = new login({
            id_compte:1,
            type_compte: 'Client',
            id_type_compte: clientSaved.id_client,
            Password: password
        });

        // Enregistrez le compte dans la base de données
        const loginSaved = await nouveauCompte.save();
        console.log('Compte créé :', loginSaved);

        res.status(201).json({ message: 'Client et compte créés avec succès.' });
    } catch (err) {
        console.error('Erreur lors de la création du client ou du compte :', err);
        res.status(500).json({ message: 'Erreur lors de la création du client ou du compte.' });
    }
});


router.get('/list',function(req,res){
    client.find({})
    .sort({ id_boutik: -1 })
    .then(client => {
        // Traitez les résultats ici
        console.log('client trouvées :', client);
        res.json(client); // Envoyez les données en réponse
    })
    .catch(err => {
        console.error('Erreur lors de la recherche des client :', err);
        res.status(500).json({ message: 'Erreur lors de la recherche des boutiques.' });
    });
});


router.put('/update/:id_client',function(req,res){
    const id_client_updater = req.params.id_client;

    var nouvelleClient = {
        nom: req.body.nom,
        prenoms: req.body.prenoms,
        adresse: req.body.adresse,
        tel: req.body.tel
    };

        // Utilisez findOneAndUpdate pour mettre à jour la boutique
        client.findOneAndUpdate(
            { id_client: id_client_updater }, // Filtrez en fonction de l'id_boutik
            nouvelleClient, // Les données à mettre à jour
            { new: true } // Option pour renvoyer le document mis à jour
        )
        .then(ClientMisAjour => {
            if (!ClientMisAjour) {
                // Si aucune boutique n'a été trouvée avec cet id_boutik
                return res.status(404).json({ message: 'Boutique non trouvée.' });
            }
            console.log('Client mise à jour :', ClientMisAjour);
            res.json(ClientMisAjour); // Renvoie la boutique mise à jour
        })
        .catch(err => {
            console.error('Erreur lors de la mise à jour du client :', err);
            res.status(500).json({ message: 'Erreur lors de la mise à jour de la boutique.' });
        });    

});

router.delete('/delete/:id_client',function(req,res){
    const id_client_delete = req.params.id_client; // Vous pouvez utiliser la chaîne telle quelle

    // Utilisez findOneAndRemove ou findOneAndDelete pour supprimer la boutique
    client.findOneAndRemove(
        { id_client: id_client_delete } // Filtrez en fonction de l'id_boutik
    )
    .then(ClientSupprimer => {
        if (!ClientSupprimer) {
            // Si aucune boutique n'a été trouvée avec cet id_boutik
            return res.status(404).json({ message: 'Client non trouvée.' });
        }
        console.log('Client supprimée :', ClientSupprimer);
        res.json({ message: 'Client supprimée avec succès.' });
    })
    .catch(err => {
        console.error('Erreur lors de la suppression de la boutique :', err);
        res.status(500).json({ message: 'Erreur lors de la suppression de la boutique.' });
    });
});

module.exports = router;