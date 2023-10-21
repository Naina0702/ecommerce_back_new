const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commandeSchema = new Schema({
    id_commande: {type:Number, unique:true},
    id_produit: Number,
    date: Date,
    qte: Number,
    Valeur: Number,
});

const commande = mongoose.model('commande', commandeSchema);

module.exports = commande;
