import { transaction } from "./types";


/**
 * Allows for easy changing between
 * remote and local connections 
 */
export abstract class DataConnection {
    
    
    public abstract connect() : void

    public abstract async requestTransactions(count: number) : Promise<transaction[]>
}