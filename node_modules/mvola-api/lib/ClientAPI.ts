import axios, { AxiosInstance } from "axios";
export  class ClientAPI {
    
    api: AxiosInstance
    
    constructor(url : string) {
        this.api = axios.create({baseURL: url});
    }
      
}