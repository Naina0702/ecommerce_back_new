
import { Transaction } from "./Transaction";
import { Authentication } from './Authentication';
import { SANDBOX_URL } from './constants';
import { AuthResult } from "./@types";

export class MVolaMarchantPayAPI  extends Transaction {

    private baseURL : string

    constructor(url: string = SANDBOX_URL) {
        super(url)
        this.baseURL = url
    }

    async revokeToken(consumerKey: string, consumerSecret: string, updateToken: boolean = true) : Promise<AuthResult> {
        const result = await new Authentication(this.baseURL).getToken(consumerKey,consumerSecret)
        if(updateToken){
            this.setAccessToken(result.access_token)
        }
        return result
    }

    setAccessToken(accessToken: string): void {
        this.api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    }


}