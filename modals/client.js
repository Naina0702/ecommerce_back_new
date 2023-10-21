const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientSchema = new Schema({
    id_client: {type:Number, unique:true},
    nom: String,
    prenoms: String,
    adresse: String,
    tel: String,
});

const Client = mongoose.model('Client',clientSchema);

module.exports = Client;