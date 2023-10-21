const express = require('express');
const bodyParser = require('body-parser');
const boutique = require('./routes/boutik');
const produit = require('./routes/produit');
const client = require('./routes/client');
const commande = require('./routes/commade'); // Correction de la typo
const mvola = require('./routes/mvola');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware CORS pour autoriser les requêtes depuis n'importe quelle origine (*)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Remarque : Vous pouvez spécifier des origines spécifiques au lieu de '*'
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use('/mvola', mvola);
app.use('/Boutique', boutique);
app.use('/Client', client);
app.use('/Produit', produit);
app.use('/Commande', commande);

app.listen(3030, () => {
  console.log("Serveur en cours d'exécution sur le port 3000...");
});
