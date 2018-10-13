const crypto = require('crypto');
const fs=require('fs');
class Decapsulator{
    constructor(path){
        this._algorithm='aes-256-gcm';
        
        //Read private key
        try{
            this._privateKey=fs.readFileSync(path,'utf8');
        }catch(e){
            console.log(e);
        }
    }

    decrypt(encrypted){
        try{
            //Decrypt key and tag
            let key = crypto.privateDecrypt(this._privateKey,Buffer.from(encrypted.key,'hex'));
            let tag = crypto.privateDecrypt(this._privateKey,Buffer.from(encrypted.tag,'hex'));

            //Obatain IV from content
            let iv =Buffer.from(encrypted.content.substring(0,32),'hex');

            //Decrypt content
            let decipher = crypto.createDecipheriv(this._algorithm,key,iv);
            decipher.setAuthTag(tag);
            let decryptedContent=decipher.update(encrypted.content.substring(32),'hex','utf8')
            decryptedContent += decipher.final('utf8');
            return decryptedContent;
            
        }catch(e){
            console.log('Failed to decrypt data');
            console.log(e);
            return;
        }
    }
}
module.exports=Decapsulator;