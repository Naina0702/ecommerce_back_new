import { MVOLA_MERCHANT_API_URL } from ".";
import { MvolaTransactionDetails, MvolaTransactionData, MvolaTransactionResult, MvolaTransactionState, Config } from "./@types";
import { ClientAPI } from "./ClientAPI";

export class Transaction extends ClientAPI {

    
    async getDetails(transactionId: string): Promise<MvolaTransactionDetails> {
        const result = await this.api.get<MvolaTransactionDetails>(`${MVOLA_MERCHANT_API_URL}/${transactionId}`);
        return result.data;
    }

    async getStatus(serverCorrelationId: string): Promise<MvolaTransactionState> {
        const result = await this.api.get<MvolaTransactionState>(`${MVOLA_MERCHANT_API_URL}/status/${serverCorrelationId}`);
        return result.data
    }

    async initiateTranscation(params: MvolaTransactionData): Promise<MvolaTransactionResult> {
        const result = await this.api.post<MvolaTransactionResult>(`${MVOLA_MERCHANT_API_URL}/`,
            { 
               ...params, 
               amount: params.amount.toString() 
            }
        );
        return result.data;
    }

    initConfig(configs: Config): void {
        this.api.defaults.headers.common["Version"] = configs.version;
        this.api.defaults.headers.common["X-CorrelationID"] = configs.xCorrelationID;
        this.api.defaults.headers.common["Cache-Control"] = "no-cache";
        this.api.defaults.headers.common["UserAccountIdentifier"] =  configs.userAccountIdentifier;

        if (configs.partnerName) {
          this.api.defaults.headers.common["PartnerName"] = configs.partnerName;
        }
        if (configs.xCallbackURL) {
          this.api.defaults.headers.common["X-Callback-URL"] = configs.xCallbackURL;
        }
        if (configs.userLanguage) {
            this.api.defaults.headers.common["UserLanguage"] = configs.userLanguage;
        }
    }

   
}