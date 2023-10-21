### MVOLA API

### JS and TS API Client FOR MVOLA API

**JAVASCRIPT**
```js

require("dotenv").config();
const { MVolaMarchantPayAPI } = require("mvola-api");
const { v4 } = require("uuid");

const consumerKey = process.env.CONSUMER_KEY || "";
const consumerSecret = process.env.CONSUMER_SECRET || "";
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



```

**TYPESCRIPT**

```ts
import { MVolaMarchantPayAPI, MvolaTransactionData } from "mvola-api";
import { v4 } from "uuid";
require('dotenv').config()

async function app() {

    const consumerKey = process.env.CONSUMER_KEY || '';
    const consumerSecret = process.env.CONSUMER_SECRET || '';

    const mvolaApi = new MVolaMarchantPayAPI();

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

```