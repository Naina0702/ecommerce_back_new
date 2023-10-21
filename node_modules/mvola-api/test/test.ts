
import  axios  from 'axios';
import { AxiosInstance } from 'axios';
import { ClientAPI } from '../lib/ClientAPI';
import { Transaction } from '../lib';



class D  extends ClientAPI {
    blue(){
        console.log('Blue')
    }
}

class Client extends Transaction {
    params2: any;
    d: D
    constructor(params2: any){
        super(params2)
        this.params2 = params2
        this.d = new D(params2)
    }
    change(p: any){
        this.api.defaults.baseURL = p
        console.log(p)
    }
}

const c = new Client('Bonjour')
c.change('Kaiza')


