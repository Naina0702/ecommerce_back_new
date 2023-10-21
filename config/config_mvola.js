require("dotenv").config();
const { MVolaMarchantPayAPI } = require("mvola-api");
const { v4 } = require("uuid");

const consumerKey = process.env.CONSUMER_KEY || "cCV7ImmVOGEGvCjYEXMXmqtzWKwa";
const consumerSecret = process.env.CONSUMER_SECRET || "kqtIvLh7_gE68krfynKyozItd6oa";
const mvolaApi = new MVolaMarchantPayAPI();

// set token directly 
// mvolaApi.setAccessToken(access_token);

// if you need to revoke token
mvolaApi.revokeToken(consumerKey, consumerSecret, true).then(() => {

  // init transaction config 
  mvolaApi.initConfig({
    version: "1.0",
    xCorrelationID: v4(),
    userLanguage: "MG",
    userAccountIdentifier: "msisdn;034350003",
    partnerName: "Mvola API",
  });

  const trans = {
    amount: 500,
    currency: "Ar",
    descriptionText: "Description",
    requestDate: new Date().toISOString(),
    debitParty: [
      {
        key: "msisdn",
        value: "034350003",
      },
    ],
    creditParty: [
      {
        key: "msisdn",
        value: "034350003",
      },
    ],
    metadata: [
      {
        key: "partnerName",
        value: "Mvola API",
      },
      {
        key: "fc",
        value: "USD",
      },
      {
        key: "amountFc",
        value: "1",
      },
    ],
    requestingOrganisationTransactionReference: v4(),
    originalTransactionReference: v4(),
  };
  mvolaApi.initiateTranscation(trans).then((result) => {
    console.log(result);
  });
});


require('dotenv').config();
const express = require('express');
const { MVolaMarchantPayAPI } = require('mvola-api');
const axios = require('axios');
const { v4 } = require('uuid');

const app = express();
const port = process.env.PORT || 3000;

// Créez une instance de l'API Mvola
const mvolaApi = new MVolaMarchantPayAPI();

// Middleware pour prendre en charge les données JSON
app.use(express.json());

// Middleware pour gérer les erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Une erreur s\'est produite.');
});

// Révocation du token (optionnel)
app.post('/revoke-token', async (req, res) => {
  try {
    await mvolaApi.revokeToken(process.env.CONSUMER_KEY, process.env.CONSUMER_SECRET, true);
    res.status(200).send('Token révoqué avec succès.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Une erreur s\'est produite lors de la révocation du token.');
  }
});

// Initiation de la transaction
app.post('/initiate-transaction', async (req, res) => {
  try {
    // Configuration initiale de la transaction
    mvolaApi.initConfig({
      version: '1.0',
      xCorrelationID: v4(),
      userLanguage: 'MG',
      userAccountIdentifier: 'msisdn;034350003',
      partnerName: 'Mvola API',
    });

    // Détails de la transaction à partir du corps de la demande POST
    const trans = req.body;

    // Initialisation de la transaction
    const result = await mvolaApi.initiateTranscation(trans);

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send('Une erreur s\'est produite lors de l\'initiation de la transaction.');
  }
});

app.listen(port, () => {
  console.log(`Serveur Express écoutant sur le port ${port}`);
});


/////////////////////////////////////////////////////////////////////////////////////////////////////
const axios = require('axios');

// Les détails de la transaction
const transactionDetails = {
  amount: 500,
  currency: "Ar",
  descriptionText: "Description de la transaction",
  requestDate: new Date().toISOString(),
  debitParty: [
    {
      key: "msisdn",
      value: "034350003",
    },
  ],
  creditParty: [
    {
      key: "msisdn",
      value: "034350003",
    },
  ],
  metadata: [
    {
      key: "partnerName",
      value: "Mvola API",
    },
    {
      key: "fc",
      value: "USD",
    },
    {
      key: "amountFc",
      value: "1",
    },
  ],
  requestingOrganisationTransactionReference: v4(),
  originalTransactionReference: v4(),
};

// Envoyer une demande POST pour initier la transaction
axios.post('http://localhost:3000/initiate-transaction', transactionDetails)
  .then((response) => {
    console.log('Réponse de l\'API Mvola :', response.data);
  })
  .catch((error) => {
    console.error('Erreur lors de la demande à l\'API Mvola :', error.message);
  });
