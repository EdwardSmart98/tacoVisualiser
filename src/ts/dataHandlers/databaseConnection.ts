import firebase from 'firebase'
import * as google_services from '@/json/google_services.json';
import { transaction } from './types';
import { DataConnection } from './dataConnection';


export class DatabaseConnection extends DataConnection{
    
    private connection : firebase.firestore.Firestore;


    public connect(){
        firebase.initializeApp({
            apiKey: google_services.client[0].api_key[0].current_key,
            authDomain: google_services.project_info.firebase_url,
            projectId: google_services.project_info.project_id
        })
        this.connection = firebase.firestore();
    }

    public async requestTransactions(count : number = 100) : Promise<transaction[]>{
        if(!this.connection){
            console.warn("requested transactions without connections");
            this.connect();
        }
        const transactions : transaction[] = []
        const querySnapshot = await this.connection.collection("RawTransactions").orderBy("ts","desc").limit(count).get();
        querySnapshot.forEach(doc => {
            transactions.push(doc.data() as transaction)
            console.log("doc", doc.data())
        })
        return transactions
    }
    

}