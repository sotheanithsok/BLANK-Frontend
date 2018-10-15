const crypto = require('crypto');
const fs = require('fs');

class Decapsulator{
       constructor(keyPath){
           //Read private key
        try{
            this.privateKey=fs.readFileSync(keyPath,'utf8');
        }catch(e){
            console.log(e);
        }
       }


  decrypt(encrypted){
      
    const Algorithm = 'aes-256-gcm';

    let key = crypto.privateDecrypt(this.privateKey,Buffer.from(encrypted.key,'hex'));
    let tag = crypto.privateDecrypt(this.privateKey,Buffer.from(encrypted.tag,'hex'));

    let iv =Buffer.from(encrypted.content.substring(0,32),'hex');
    //var asekey = crypto.privateDecrypt(this.privateKey, encrypted.key);
    //var iv = encrypted.slice(0,16);

    var decipher = crypto.createDecipheriv(Algorithm, key, iv)
    decipher.setAuthTag(tag);
    var dec = decipher.update(encrypted.content.substring(32),'hex','utf8')
    // var dec = decipher.update(encrypted.content, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
  }
    
}module.exports=Decapsulator;
