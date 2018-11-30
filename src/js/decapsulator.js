const crypto = require('crypto');

/**
 * Decapsulator uses to decrypt data
 */
class Decapsulator {
    constructor(keyPath) {
        //Read private key
        this._algorithm = 'aes-256-gcm';
    }



    /**
     * Decrypt PGP encrypted data with RSA private key.
     * @param {*} encrypted PGP encrypted data.
     * @param {*} privateKey RSA private key.
     */
    decryptPGP(encrypted, privateKey) {
        try{
            let asekey = crypto.privateDecrypt(privateKey, Buffer.from(encrypted.key, 'hex'));
            let tag = Buffer.from(encrypted.tag, 'hex');
    
            //extract the first 32 bytes from the content to get the iv.
            let iv = Buffer.from(encrypted.content.substring(0, 32), 'hex');
    
            //Decript the content
            var decipher = crypto.createDecipheriv(this._algorithm, asekey, iv)
            decipher.setAuthTag(tag);
            var decrypt = decipher.update(encrypted.content.substring(32), 'hex', 'utf8')
            decrypt += decipher.final('utf8');
            return decrypt;
        }catch(err){
            console.log('Failed to decrypt data')
        }
        
    }

    /**
     * Decrypt PGP encrypted data with passphrase.
     * @param {*} encrypted PGP encrypted data.
     * @param {*} passphrase passphrase.
     */
    decryptPassphrase(encrypted, passphrase) {
        try {
            //Generate AES key from passphrase
            let salt = Buffer.from(encrypted.salt, 'hex');
            let iteration = 10000;
            let keylen = 32;
            let digest = 'sha256';
            let derivedKey = crypto.pbkdf2Sync(passphrase, salt, iteration, keylen, digest);


            let asekey = derivedKey;
            let tag = Buffer.from(encrypted.tag, 'hex');

            //extract the first 32 bytes from the content to get the iv.
            let iv = Buffer.from(encrypted.iv, 'hex');

            //Decript the content
            var decipher = crypto.createDecipheriv(this._algorithm, asekey, iv)
            decipher.setAuthTag(tag);
            var decrypt = decipher.update(encrypted.content, 'hex', 'utf8')
            decrypt += decipher.final('utf8');
            return decrypt;
        } catch (err) {
            console.log('Failed to decrypt with passphrases')
        }
    }

}

module.exports = Decapsulator;