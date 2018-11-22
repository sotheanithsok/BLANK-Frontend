const crypto = require('crypto');

/**
 * A general representation of user data. It wil generates RSA key pair at its creation.
 */
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
        this.jwtToken = null;
        this.keysChain = {};
        this.messagesChain = {};
    }
}
module.exports = User;