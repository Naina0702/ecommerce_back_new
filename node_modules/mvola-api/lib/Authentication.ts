import qs from "qs";
import { AuthResult} from "./@types";
import { Buffer } from 'buffer';
import { ClientAPI } from "./ClientAPI";

export class Authentication extends ClientAPI  {

    async getToken( consumerKey: string, consumerSecret: string ): Promise<AuthResult> {
        const params = qs.stringify({
          grant_type: "client_credentials",
          scope: "EXT_INT_MVOLA_SCOPE",
        });
        const response = await this.api.post<AuthResult>(`/token`, params, {
          headers: {
            Authorization: `Basic ${Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64')}`,
            ContentType : 'application/x-www-form-urlencoded',
            CacheControl : 'no-cache'
          },
        });
        return response.data;
      }
}