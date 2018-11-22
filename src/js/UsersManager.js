const path= './';
const hash=(require('crypto')).createHash('sha256');
const fs = require('fs');
const utilities = require('./utilities');
console.log(utilities);

class UserManager{
    constructor(){
        this.currentUser;
    }

    loadUser(username, password){
        hash.update(username);
        let fileName= hash.update('hex');
        if(fs.existsSync(path+filename)){
            let encryptedInfo = JSON.parse(fs.readFileSync(path+filename,'utf8'));

            let decryptedInfo = utilities.decapsulator.decryptPassphrase(encryptedInfo,password);
            return(JSON.parse(decryptedInfo));
        }
    }

    saveUser(username, password){
        console.log(utilities)

        // hash.update(username);
        // let fileName= hash.update('hex');
        // let encryptedInfo = utilities.encapsulator.encryptPassphrase(JSON.stringify(this.currentUser),password);
        // fs.writeFileSync(path+fileName, JSON.stringify(encryptedInfo,null,4));
    }

    getUser(){
        return this.currentUser;
    }
    setUser(user){
        this.currentUser=user;
    }
}

const um = new UserManager();
module.exports=um;