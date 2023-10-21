const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const boutiqueSchema = new Schema({
    id_boutik: {type:Number, unique:true},
    nom_boutique: String,
    adresse_boutique: String,
    contact: String,
    facebook: String,
});

const Boutique = mongoose.model('Boutique', boutiqueSchema);

module.exports = Boutique;
