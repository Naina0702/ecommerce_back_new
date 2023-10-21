var express = require("express");
var mongo = require("../config/config_db");
var router = express.Router();
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

var commande = require('../modals/commande');
var Produit = require('../modals/produit');

router.post('/nouvelle_commande/:id_boutik', async (req, res) => {
  const id_boutik_params = req.params.id_boutik;

  const { id_commande, id_produit, date, qte, Valeur } = req.body;

  let session;

  try {
    session = await mongoose.startSession();
    session.startTransaction();

    // Vérifier si le produit existe en fonction de id_produit et id_boutik
    const produit = await Produit.findOne({ id_produit: id_produit, id_boutik: id_boutik_params });
    if (!produit) {
      throw new Error('Stock empty. Produit non trouvé.');
    }

    if (produit.qte - qte < 0) {
      throw new Error('STOCK EMPTY. Quantité insuffisante.');
    }

    // Mettre à jour la commande
    const nouvelleCommande = new commande({
      id_commande,
      id_produit,
      date,
      qte,
      Valeur
    });
    await nouvelleCommande.save();

    // Mettre à jour la quantité du produit
    produit.qte -= qte;
    await produit.save();

    await session.commitTransaction();
    session.endSession();

    console.log('Commande créée avec succès :', nouvelleCommande);
    res.status(201).json({ message: 'Commande créée avec succès.' });
  } catch (error) {
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }
    console.error('Erreur lors de la création de la commande :', error.message);
    res.status(500).json({ message: error.message });
  }
});

  // Route pour récupérer une commande par son ID
router.get('/commande/:id', (req, res) => {
    const id_commande = req.params.id;
  
    // Recherchez la commande par son ID
    Commande.findById(id_commande)
      .then((commande) => {
        if (commande) {
          console.log('Commande trouvée :', commande);
          res.json(commande);
        } else {
          console.log('Aucune commande correspondante n\'a été trouvée.');
          res.status(404).json({ message: 'Aucune commande correspondante trouvée.' });
        }
      })
      .catch((err) => {
        console.error('Erreur lors de la recherche de la commande :', err);
        res.status(500).json({ message: 'Erreur lors de la recherche de la commande.' });
      });
});
  
  // Route pour supprimer une commande par son ID
router.delete('/delete_commande/:id', (req, res) => {
    const id_commande_supprimer = req.params.id;
  
    // Utilisez findOneAndDelete pour supprimer la commande
    commande.findOneAndDelete({ id_commande: id_commande_supprimer })
      .then((commandeSupprimee) => {
        if (commandeSupprimee) {
          console.log('Commande supprimée avec succès :', commandeSupprimee);
          res.status(200).json(commandeSupprimee);
        } else {
          console.log('Aucune commande correspondante n\'a été trouvée.');
          res.status(404).json({ message: 'Aucune commande correspondante trouvée.' });
        }
      })
      .catch((err) => {
        console.error('Erreur lors de la suppression de la commande :', err);
        res.status(500).json({ message: 'Erreur lors de la suppression de la commande.' });
      });
  });
  

// Route pour mettre à jour une commande par son ID de commande
router.put('/update_commande/:id_commande', async (req, res) => {
  const id_commande_updater = req.params.id_commande;
  const nouvellesDonnees = req.body;

  let session;

  try {
      session = await mongoose.startSession();
      session.startTransaction();

      // Rechercher la commande par son ID de commande
      const commandeExistante = await commande.findOne({ id_commande: id_commande_updater });

      if (!commandeExistante) {
          throw new Error('Commande non trouvée.');
      }

      // Rechercher le produit associé à la commande
      const produitAssocie = await Produit.findOne({ id_produit: commandeExistante.id_produit });

      if (!produitAssocie) {
          throw new Error('STOCK EMPTY. Produit non trouvé.');
      }

      // Restituer la quantité précédente au stock
      produitAssocie.qte += commandeExistante.qte;
      await produitAssocie.save();

      // Mettre à jour la commande avec les nouvelles données
      Object.assign(commandeExistante, nouvellesDonnees);
      await commandeExistante.save();

      // Mettre à jour la quantité du produit avec la nouvelle quantité (qte) de la commande
      produitAssocie.qte -= nouvellesDonnees.qte;
      await produitAssocie.save();

      await session.commitTransaction();
      session.endSession();

      console.log('Commande mise à jour avec succès :', commandeExistante);
      res.status(200).json(commandeExistante);
  } catch (error) {
      if (session) {
          await session.abortTransaction();
          session.endSession();
      }
      console.error('Erreur lors de la mise à jour de la commande :', error.message);
      res.status(500).json({ message: error.message });
  }
});


  module.exports = router;