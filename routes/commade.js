var express = require("express");
var router = express.Router();
const mongoose = require('mongoose');

var commande = require('../modals/commande');
var Produit = require('../modals/produit');

router.post('/nouvelle_commande/:id_boutik', async (req, res) => {
  const id_boutik_params = req.params.id_boutik;

  const { id_client, id_produit,id_boutik, date, designation, qte, Valeur, etat } = req.body;

  console.log(Valeur);

  let session;

  try {
    session = await mongoose.startSession();
    session.startTransaction();

    // Vérifier si le produit existe en fonction de id_produit et id_boutik
    const produit = await Produit.findOne({ id_produit: id_produit, id_boutik: id_boutik_params });

    if (!produit) {
      throw new Error('STOCK EMPTY. Produit non trouvé.');
    }

    if (produit.qte - qte < 0) {
      throw new Error('STOCK EMPTY. Quantité insuffisante.');
    }
    // Mettre à jour la commande

    const nouvelleCommande = new commande({
      id_client,
      id_produit,
      id_boutik:id_boutik_params,
      date,
      designation,
      qte,
      Valeur,
      etat
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
  router.get('/commande/:id_client', (req, res) => {
    const id_client = req.params.id_client;

    // Recherchez la commande par id_client et état
    commande.find({ id_client: id_client, etat: null })
      .then((commandes) => {
        if (commandes.length > 0) {
          console.log('Commandes trouvées :', commandes);
          res.json(commandes);

          console.log(commandes.length);

        } else {
          console.log('Aucune commande correspondante n\'a été trouvée.');
          res.status(404).json({ message: 'Aucune commande correspondante trouvée.' });
        }
      })
      .catch((err) => {
        console.error('Erreur lors de la recherche des commandes :', err);
        res.status(500).json({ message: 'Erreur lors de la recherche des commandes.' });
      });
});




router.delete('/supprimer_commande/:id', async (req, res) => {
  const _id = req.params.id;

  console.log(_id);

  let session;

  try {
    session = await mongoose.startSession();
    session.startTransaction();

    // Récupérez la commande que vous êtes sur le point de supprimer
    const commandeASupprimer = await commande.findOne({ _id });

    if (!commandeASupprimer) {
      throw new Error('Commande non trouvée.');
    }

    // Récupérez le produit associé à la commande
    const produit = await Produit.findOne({ id_produit: commandeASupprimer.id_produit });

    if (!produit) {
      throw new Error('Produit non trouvé.');
    }

    // Ajoutez la quantité de la commande à la quantité du produit
    produit.qte += commandeASupprimer.qte;

    // Sauvegardez le produit mis à jour
    await produit.save();

    // Supprimez la commande
    const result = await commande.deleteOne({ _id });

    if (result.deletedCount > 0) {
      console.log('Commande supprimée avec succès pour _id:', _id);
      res.status(200).json({ message: 'Commande supprimée avec succès.' });
    } else {
      console.log('Aucune commande correspondante n\'a été trouvée.');
      res.status(404).json({ message: 'Aucune commande correspondante trouvée.' });
    }

    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }
    console.error('Erreur lors de la suppression de la commande :', error);
    res.status(500).json({ message: 'Erreur lors de la suppression de la commande.' });
  }
});


// Route pour mettre à jour une commande par son ID de commande
router.put('/update_commande/:id', async (req, res) => {
  const commandeId = req.params.id;
  const nouvellesDonnees = req.body;

  let session;

  try {
    session = await mongoose.startSession();
    session.startTransaction();

    // Rechercher la commande par son ID de commande
    const commandeExistante = await commande.findOne({_id :commandeId});

    if (!commandeExistante) {
      throw new Error('Commande non trouvée.');
    }

    // Rechercher le produit associé à la commande
    const produitAssocie = await Produit.findOne({ id_produit: commandeExistante.id_produit });

    if (!produitAssocie) {
      throw new Error('STOCK EMPTY. Produit non trouvé.');
    }

    // Calculer la différence de quantité
    const differenceQuantite = commandeExistante.qte - nouvellesDonnees.qte ;

    console.log(differenceQuantite);
    Object.assign(commandeExistante, nouvellesDonnees);

    if(differenceQuantite == 0 ){
      await commandeExistante.save();
      await session.commitTransaction();
      session.endSession();
  
      console.log('Commande mise à jour avec succès :', commandeExistante);
      res.status(200).json(commandeExistante);
    }

    else if(differenceQuantite>0){
      produitAssocie.qte -= differenceQuantite;
      await produitAssocie.save();
      await commandeExistante.save();
      await session.commitTransaction();
      session.endSession();
  
      console.log('Commande mise à jour avec succès :', commandeExistante);
      res.status(200).json(commandeExistante);

    }
    else if(differenceQuantite<0){
      produitAssocie.qte += differenceQuantite;
      await produitAssocie.save();
      await commandeExistante.save();
      await session.commitTransaction();
      session.endSession();
  
      console.log('Commande mise à jour avec succès :', commandeExistante);
      res.status(200).json(commandeExistante);

    }

    // Restituer la quantité précédente au stock

    // Mettre à jour la commande avec les nouvelles données

    // Mettre à jour la quantité du produit avec la nouvelle quantité (qte) de la commande

    // Sauvegarder les modifications


  } catch (error) {
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }
    console.error('Erreur lors de la mise à jour de la commande :', error.message);
    res.status(500).json({ message: error.message });
  }
});

router.delete('/delete_commandes_reset/:id_client', async (req, res) => {
  const id_client = req.params.id_client;

  try {
    // Utilisez deleteMany pour supprimer toutes les commandes ayant le même id_client et etat=0
    const result = await commande.deleteMany({ id_client: id_client, etat: 0 });

    if (result.deletedCount > 0) {
      console.log('Toutes les commandes du même id_client avec etat=0 ont été supprimées avec succès pour id_client :', id_client);
      res.status(200).json({ message: 'Toutes les commandes du même id_client avec etat=0 ont été supprimées avec succès.' });
    } else {
      console.log('Aucune commande correspondante n\'a été trouvée pour id_client :', id_client, 'avec etat=0.');
      res.status(404).json({ message: 'Aucune commande correspondante trouvée pour id_client avec etat=0.' });
    }
  } catch (error) {
    console.error('Erreur lors de la suppression des commandes :', error);
    res.status(500).json({ message: 'Erreur lors de la suppression des commandes.' });
  }
});

// Route pour mettre à jour l'état des commandes avec état = null pour le même id_client en "1"
router.put('/valider_commandes_client/:id_client', async (req, res) => {
  const id_client = req.params.id_client;

  try {
    // Mettre à jour l'état de toutes les commandes avec état = null pour le même id_client en "1"
    const result = await commande.updateMany({ id_client: id_client, etat: null }, { $set: { etat: 1 } });

    if (result.nModified > 0) {
      console.log('État de', result.nModified, 'commandes mises à jour avec succès pour le même id_client :', id_client);
      res.status(200).json({ message: 'État des commandes mises à jour avec succès.' });
    } else {
      console.log('Aucune commande avec un état de null correspondante n\'a été trouvée pour le même id_client :', id_client);
      res.status(404).json({ message: 'Aucune commande avec un état de null correspondante trouvée pour le même id_client.' });
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'état des commandes :', error);
    res.status(500).json({ message: "Erreur lors de la mise à jour de l'état des commandes."});
  }
});

router.put('/valider_commandes_boutique/:id_client', async (req, res) => {
  const id_client = req.params.id_client;

  try {
    // Mettre à jour l'état de toutes les commandes avec état = null pour le même id_client en "1"
    const result = await commande.updateMany({ id_client: id_client, etat: "1" }, { $set: { etat: 2 } });

    if (result.nModified > 0) {
      console.log('État de', result.nModified, 'commandes mises à jour avec succès pour le même id_client :', id_client);
      res.status(200).json({ message: 'État des commandes mises à jour avec succès.' });
    } else {
      console.log('Aucune commande avec un état de null correspondante n\'a été trouvée pour le même id_client :', id_client);
      res.status(404).json({ message: 'Aucune commande avec un état de null correspondante trouvée pour le même id_client.' });
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'état des commandes :', error);
    res.status(500).json({ message: "Erreur lors de la mise à jour de l'état des commandes."});
  }
});

// Route pour récupérer les données avec id_client et etat = null
router.get('/donnees_id_client_etat_null/:id_client', async (req, res) => {
  const id_client = req.params.id_client;

  try {
    // Recherchez les données avec id_client et etat = null
    const donnees = await commande.find({ id_client: id_client, etat: null });

    if (donnees.length > 0) {
      res.status(200).json(donnees);
    } else {
      res.status(404).json({ message: 'Aucune donnée correspondante n\'a été trouvée.' });
    }
  } catch (error) {
    console.error('Erreur lors de la recherche des données :', error);
    res.status(500).json({ message: 'Erreur lors de la recherche des données.' });
  }
});


router.get('/donnees_id_client_etat_1/:id_client', async (req, res) => {
  const id_client = req.params.id_client;

  try {
    // Recherchez les données avec id_client et etat = null
    const donnees = await commande.find({ id_client: id_client, etat:"1" });

    if (donnees.length > 0) {
      res.status(200).json(donnees);
    } else {
      res.status(404).json({ message: 'Aucune donnée correspondante n\'a été trouvée.' });
    }
  } catch (error) {
    console.error('Erreur lors de la recherche des données :', error);
    res.status(500).json({ message: 'Erreur lors de la recherche des données.' });
  }
});

  module.exports = router;