import firebase from 'firebase'


class DatabaseConnection{
    
    private connection : any;



    constructor(){

    }


    public connect(){

        firebase.initializeApp({
            apiKey: '',
            authDomain: '',
            projectId: ''
        })

        const db = firebase.firestore();

    }
    

}