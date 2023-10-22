const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const boutiqueSchema = new Schema({
    id_boutik:Number,
    nom_boutique: String,
    adresse_boutique: String,
    email_boutique:String,
    contact: String,
    facebook: String,
    password:String
});

const Boutique = mongoose.model('Boutique', boutiqueSchema);

module.exports = Boutique;
