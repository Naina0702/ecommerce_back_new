require("dotenv").config();
var express = require('express');
const { MVolaMarchantPayAPI } = require("mvola-api");
const { v4 } = require("uuid");
var router = express.Router();

const consumerKey = process.env.CONSUMER_KEY || "cCV7ImmVOGEGvCjYEXMXmqtzWKwa";
const consumerSecret = process.env.CONSUMER_SECRET || "kqtIvLh7_gE68krfynKyozItd6oa";
const mvolaApi = new MVolaMarchantPayAPI();

// set token directly 
// mvolaApi.setAccessToken(access_token);

// if you need to revoke token

router.post('/Transaction', async (req,res)=>{

    mvolaApi.revokeToken(consumerKey, consumerSecret, true).then(() => {

        // init transaction config 
        mvolaApi.initConfig({
          version: "1.0",
          xCorrelationID: v4(),
          userLanguage: "MG",
          userAccountIdentifier: "msisdn;0349601403",
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
              value: "0349601403",
            },
          ],
          creditParty: [
            {
              key: "msisdn",
              value: "0349601403",
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
    
})


  module.exports = router;