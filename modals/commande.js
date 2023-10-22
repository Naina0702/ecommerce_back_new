const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commandeSchema = new Schema({
    id_client: String,
    id_produit: Number,
    date: Date,
    designation:String,
    qte: Number,
    Valeur: Number,
    etat: Number
});

const Commande = mongoose.model('Commande', commandeSchema);

module.exports = Commande;
