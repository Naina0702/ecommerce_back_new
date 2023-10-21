export type AuthResult = {
  access_token: string;
  scope: string;
  token_type: string;
  expires_in: number;
};

// config for transaction
export type Config = {
    version: string;
    xCorrelationID: string;
    userLanguage?: string;
    userAccountIdentifier: string;
    partnerName?: string;
    xCallbackURL?: string;
};


export type HashedMap = {
  key: string;
  value: string;
}

export type MvolaTransactionState = {
  status: string;
  serverCorrelationId: string;
  notificationMethod: string;
  objectReference: string;
};
  
export type MvolaTransactionData = {
    amount: number;
    currency: string;
    descriptionText: string;
    requestDate: string;
    debitParty: HashedMap[];
    creditParty: HashedMap[];
    metadata: HashedMap[];
    requestingOrganisationTransactionReference: string;
    originalTransactionReference: string;
  };
  
export type MvolaTransactionResult = {
    status: string;
    serverCorrelationId: string;
    notificationMethod: string;
  };
  
export type MvolaTransactionDetails = {
    amount: number;
    currency: string;
    transactionReference: string;
    transactionStatus: string;
    createDate: string;
    debitParty: HashedMap[];
    creditParty: HashedMap[];
    metadata:HashedMap[];
    fee: {
      feeAmount: number;
    };
  };
  
  