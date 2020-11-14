
import * as localData from '@/json/transactions.json'
import { DataConnection } from './dataConnection';
import { transaction } from './types';

/**
 * Immitates server connection, using local json stored data
 * to save time and money. 
 */
export class LocalDataConnection extends DataConnection {
   
    public connect(): void {
        //no connection needed
        return
    }
    
    public async requestTransactions(count: number): Promise<transaction[]> {
        const all : transaction[] = localData.transactions;
        all.forEach(x => 
            {
                if(!x.tacos)
                { x.tacos = 1}
            })
        return all;
    }




}