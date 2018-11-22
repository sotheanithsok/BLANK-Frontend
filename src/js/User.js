const crypto = require('crypto');
class User {
    constructor() {
        let k = crypto.generateKeyPairSync('rsa', {
            modulusLength: 4096,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem'
            }
        });
        this.RSAPublicKey = k.publicKey;
        this.RSAPrivateKey = k.privateKey;
        this.jwtToken=null;
        this.keysChain = {};
        this.messagesChain = {};
    }
}
module.exports = User;