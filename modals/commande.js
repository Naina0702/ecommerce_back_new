const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commandeSchema = new Schema({
    id_client: String,
    id_produit: Number,
    date: Date,
    qte: Number,
    Valeur: Number,
    etat: Number,
});

const Commande = mongoose.model('Commande', commandeSchema);

module.exports = Commande;
