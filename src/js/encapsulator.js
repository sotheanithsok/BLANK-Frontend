const crypto = require('crypto');
const fs = require('fs');

class Encapsulator{
    constructor(){
        //Define the algorithem that will be use 
        this._algorithm='aes-256-gcm';
    }

    encryptPGP(text, publicKey){
        try{
            //Generate needed variables
            let aesKey=crypto.randomBytes(32); //32 Bytes = 256 bits
            let iv = crypto.randomBytes(16); // 16 bytes = 128 bits

            //Performance encryption on content
            //Default: Padding->PKCS #7
            let cipher = crypto.createCipheriv(this._algorithm,aesKey,iv);
            let encryptedContent = cipher.update(text,'utf8','hex');
            encryptedContent += cipher.final('hex');
            let tag = cipher.getAuthTag();

            //Prepend IV (hex) on to text
            encryptedContent= iv.toString('hex')+encryptedContent;

            //Encrypt key with public key
            //Default: padding-> RSA_PKCS1_OAEP_PADDING
            let encryptedKey=crypto.publicEncrypt(publicKey,aesKey);

            //Return value as hex
            return {
                content : encryptedContent,
                key: encryptedKey.toString('hex'),
                tag: tag.toString('hex')
            };

        }catch (e){
            console.log('Failed to encrypt data');
            console.log(e);
            return;
        }
        
    }
}
module.exports=Encapsulator;
