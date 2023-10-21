const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/e_commerce',{ useNewUrlParser :true, useUnifiedTopology: true });

mongoose.connection.on('connected', ()=>{
    console.log('Connexion établie avec succès')
})

/*
if (mongoose.connection.readyState === 1) {
    console.log('La base de données MongoDB est connectée.');
  } else {
    console.error('Erreur de connexion à la base de données MongoDB.');
  }
*/
module.exports = mongoose;