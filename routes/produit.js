var express = require("express");
var mongo = require("../config/config_db");
var router = express.Router();
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

var produit = require('../modals/produit');

router.post('/Nouveau_Produit',function(req,res){
    if (!req.body || !req.body.id_boutik) {
        return res.status(400).json({ message: 'Données de requête incorrectes.' });
    }

    var nouvelProduit = new produit({
        id_produit: req.body.id_produit,
        id_boutik: req.body.id_boutik,
        designation: req.body.designation,
        prix: req.body.prix,
        qte: req.body.qte,
        nom_fichier_image:req.body.nom_fichier_image
        
    });

    nouvelProduit.save()
        .then(Produit => {
            console.log('Boutique créée :', Produit);
            res.status(201).json({ message: 'Produit créée avec succès.' });
        })
        .catch(err => {
            console.error('Erreur lors de la création du produit :', err);
            res.status(500).json({ message: 'Erreur lors de la création du produit.' });
        });
});

router.get('/list_produit',function(req,res){
    produit.find({})
    .sort({ id_produit: -1 })
    .then(produit => {
        // Traitez les résultats ici
        console.log('Produit trouvées :', produit);
        res.json(produit); // Envoyez les données en réponse
    })
    .catch(err => {
        console.error('Erreur lors de la recherche des Produits :', err);
        res.status(500).json({ message: 'Erreur lors de la recherche des Produits.' });
    });

});

router.put('/update_produit/:id_produit/:id_boutik', (req, res) => {
        const id_produit_updater = req.params.id_produit;
        const id_boutik_updater = req.params.id_boutik;
      
        const nouvelProduit = {
          designation: req.body.designation,
          prix: req.body.prix,
          qte: req.body.qte
        };
      
        // Utilisez findOneAndUpdate pour mettre à jour le produit (excluez "_id")
        produit.findOneAndUpdate(
          { id_produit: id_produit_updater, id_boutik: id_boutik_updater },
          { $set: nouvelProduit }, // Utilisez $set pour mettre à jour les champs spécifiés
          { new: true }
        )
        .then((produitMaj) => {
          if (produitMaj) {
            console.log('Produit mis à jour avec succès :', produitMaj);
            res.status(200).json(produitMaj); // Réponse JSON avec le produit mis à jour
          } else {
            console.log('Aucun produit correspondant n\'a été trouvé.');
            res.status(404).json({ message: 'Aucun produit correspondant trouvé.' });
          }
        })
        .catch((err) => {
          console.error('Erreur lors de la mise à jour du produit :', err);
          res.status(500).json({ message: 'Erreur lors de la mise à jour du produit.' });
        });      
});  

router.delete('/delete/:id_produit/:id_boutik', (req, res) => {
    const id_produit_supprimer = req.params.id_produit;
    const id_boutik_supprimer = req.params.id_boutik;
  
    // Utilisez findOneAndDelete pour supprimer le produit
    produit.findOneAndDelete(
      { id_produit: id_produit_supprimer, id_boutik: id_boutik_supprimer }
    )
    .then((produitSupprime) => {
      if (produitSupprime) {
        console.log('Produit supprimé avec succès :', produitSupprime);
        res.status(200).json(produitSupprime); // Réponse JSON avec le produit supprimé
      } else {
        console.log('Aucun produit correspondant n\'a été trouvé.');
        res.status(404).json({ message: 'Aucun produit correspondant trouvé.' });
      }
    })
    .catch((err) => {
      console.error('Erreur lors de la suppression du produit :', err);
      res.status(500).json({ message: 'Erreur lors de la suppression du produit.' });
    });
});

router.get("/Chercher_produit/:valeur", (req, res) => {
  const valeurRecherchee = req.params.valeur;

  // Utilisez l'opérateur $regex pour effectuer une recherche
  produit.find({
    designation: {
      $regex: valeurRecherchee,
      $options: 'i', // 'i' pour rendre la recherche insensible à la casse
    }
  })
  .then(produitsTrouves => {
    console.log('Produits trouvés :', produitsTrouves);
    res.json(produitsTrouves); // Envoyez les données en réponse
  })
  .catch(err => {
    console.error('Erreur lors de la recherche des produits :', err);
    res.status(500).json({ message: 'Erreur lors de la recherche des produits.' });
  });
});

// Route pour rechercher un produit par son id_produit
router.get('/chercher_un_produit/:id_produit', (req, res) => {
  const id_produit = req.params.id_produit;

  // Utilisez la méthode findOne de Mongoose pour rechercher le produit par son id_produit
  produit.findOne({ id_produit: id_produit })
    .then((produitTrouve) => {
      if (produitTrouve) {
        console.log('Produit trouvé :', produitTrouve);
        res.json(produitTrouve);
      } else {
        console.log('Aucun produit correspondant n\'a été trouvé.');
        res.status(404).json({ message: 'Aucun produit correspondant trouvé.' });
      }
    })
    .catch((err) => {
      console.error('Erreur lors de la recherche du produit :', err);
      res.status(500).json({ message: 'Erreur lors de la recherche du produit.' });
    });
});

module.exports = router;