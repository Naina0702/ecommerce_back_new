const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProduitSchema = new Schema({
    id_produit: {type:Number, required:true},
    id_boutik: {type:Number, required:true},
    designation: String,
    prix: Number,
    qte: Number,
    nom_fichier_image:String
});

const Produit = mongoose.model('Produit', ProduitSchema);

module.exports = Produit;
