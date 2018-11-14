const crypto = require('crypto');
class User {
    constructor() {
        //Generate keys pair
        crypto.generateKeyPair('rsa', {
            modulusLength: 4096,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem'
            }
        }, (err, publicKey, privateKey) => {
            if(err){
                console.log(err);
            }else{
                this.RSAPublicKey=publicKey;
                this.RSAPrivateKey=privateKey;
            }
        });
        this.keysChain = new Map();
        this.messagesChain = new Map();
    }
}
module.exports={
    User:User
}