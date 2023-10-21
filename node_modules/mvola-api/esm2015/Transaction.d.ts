import { MvolaTransactionDetails, MvolaTransactionData, MvolaTransactionResult, MvolaTransactionState, Config } from "./@types";
import { ClientAPI } from "./ClientAPI";
export declare class Transaction extends ClientAPI {
    getDetails(transactionId: string): Promise<MvolaTransactionDetails>;
    getStatus(serverCorrelationId: string): Promise<MvolaTransactionState>;
    initiateTranscation(params: MvolaTransactionData): Promise<MvolaTransactionResult>;
    initConfig(configs: Config): void;
}
