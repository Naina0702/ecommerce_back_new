require("dotenv").config();
const { MVolaMarchatPayAPI } = require("./../esm2015");
const { v4 } = require("uuid");

const consumerKey = process.env.CONSUMER_KEY || "";
const consumerSecret = process.env.CONSUMER_SECRET || "";
const mvolaApi = new MVolaMarchatPayAPI();

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


