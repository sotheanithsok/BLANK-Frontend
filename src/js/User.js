const keypair=require('keypair');

/**
 * A general representation of user data. It wil generates RSA key pair at its creation.
 */
class User {
    constructor() {
        let k = keypair();
        this.RSAPublicKey = k.public;
        this.RSAPrivateKey = k.private;
        this.jwtToken = null;
        this.keysChain = {};
        this.messagesChain = {};
    }
}
module.exports = User;