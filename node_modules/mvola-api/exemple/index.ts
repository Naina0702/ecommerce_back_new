import { MVolaMarchantPayAPI, SANDBOX_URL, MvolaTransactionData } from "../lib";
import { v4 } from "uuid";
require('dotenv').config()

async function app() {

    const consumerKey = process.env.CONSUMER_KEY || '';
    const consumerSecret = process.env.CONSUMER_SECRET || '';

    const mvolaApi = new MVolaMarchantPayAPI(SANDBOX_URL);

    // mvolaApi.setAccessToken(access_token);

    await mvolaApi.revokeToken(consumerKey, consumerSecret, true);


    mvolaApi.initConfig({
      version: "1.0",
      xCorrelationID: v4(),
      userLanguage: "MG",
      userAccountIdentifier: "msisdn;034350003",
      partnerName: "Mvola API",
    });
  
    const transaction: MvolaTransactionData = {
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

    const result = await mvolaApi.initiateTranscation(transaction);
    return result
  }
  
app().then(result => console.log(result));