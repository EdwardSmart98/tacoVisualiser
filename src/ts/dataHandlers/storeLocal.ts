import { transaction } from "./types";
import * as names from "@/json/first_names.json"


export class StoreLocal{



    constructor(){

    }


    public store(transactions : transaction[], changeNames : boolean = true, clearMessages : boolean = true){
        if(changeNames){
            const allNames = transactions.map(x => x.giver_username).concat(transactions.map(x => x.receiver_username))
            console.log(allNames)
            const changeDict = {}
            allNames.forEach(name => {
                changeDict[name] = this.randomName();
            })
            console.log(changeDict)
            transactions.forEach(transaction => {
                transaction.giver_username = changeDict[transaction.giver_username]
                transaction.receiver_username = changeDict[transaction.receiver_username]
            })
            console.log(transactions)
        }
        if(clearMessages){
            transactions.forEach(transaction => {
                transaction.message = ""
            })
        }
        const to_store = {
            "transactions" : transactions
        }
        this.downloadObjectAsJson(to_store,"transactions")
    }

    private downloadObjectAsJson(exportObj : any, exportName : string){
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
        var downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href",     dataStr);
        downloadAnchorNode.setAttribute("download", exportName + ".json");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
      }

    private randomName(){
        const to_pick = Math.floor(Math.random() * names.names.length)
        console.log(names.names[to_pick])
        return names.names[to_pick]
    }

    private onlyUnique<T>(value : T,index : number,self : T[]){
        self.indexOf(value) === index
    }
}
