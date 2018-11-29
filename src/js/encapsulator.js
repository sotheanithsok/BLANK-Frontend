const crypto = require('crypto');

/**
 * Encapsulator uses to encrypt data.
 */
class Encapsulator {
    constructor() {
        //Define the algorithem that will be use 
        this._algorithm = 'aes-256-gcm';
    }

    /**
     * Encrypt data with RSA public key and turns it into PGP encrypted data.
     * 
     * @param {*} text raw data.
     * @param {*} publicKey RSA public key.
     */
    encryptPGP(text, publicKey) {
        publicKey=this.unbackslash(publicKey);
        try {
            //Generate needed variables
            let aesKey = crypto.randomBytes(32); //32 Bytes = 256 bits
            let iv = crypto.randomBytes(16); // 16 bytes = 128 bits

            //Performance encryption on content
            //Default: Padding->PKCS #7
            let cipher = crypto.createCipheriv(this._algorithm, aesKey, iv);
            let encryptedContent = cipher.update(text, 'utf8', 'hex');
            encryptedContent += cipher.final('hex');
            let tag = cipher.getAuthTag();

            //Prepend IV (hex) on to text
            encryptedContent = iv.toString('hex') + encryptedContent;

            //Encrypt key with public key
            //Default: padding-> RSA_PKCS1_OAEP_PADDING
            let encryptedKey = crypto.publicEncrypt(publicKey, aesKey);

            //Return value as hex
            return {
                content: encryptedContent,
                key: encryptedKey.toString('hex'),
                tag: tag.toString('hex')
            };

        } catch (e) {
            console.log('Failed to encrypt data');
        }

    }

    /**
     * Encrypt data with passphrase and turns it into PGP encrypted data.
     * 
     * @param {*} text raw data.
     * @param {*} passphrase super secret.
     */
    encryptPassphrase(text, passphrase) {
        try {

            //Derive AES key
            let salt = crypto.randomBytes(32);
            let iteration = 10000;
            let keylen = 32;
            let digest = 'sha256';
            let derivedKey = crypto.pbkdf2Sync(passphrase, salt, iteration, keylen, digest);

            let aesKey = derivedKey; //32 Bytes = 256 bits
            let iv = crypto.randomBytes(16); // 16 bytes = 128 bits

            //Performance encryption on content
            //Default: Padding->PKCS #7
            let cipher = crypto.createCipheriv(this._algorithm, aesKey, iv);
            let encryptedContent = cipher.update(text, 'utf8', 'hex');
            encryptedContent += cipher.final('hex');
            let tag = cipher.getAuthTag();
            return {
                salt: salt.toString('hex'),
                iv: iv.toString('hex'),
                content: encryptedContent,
                tag: tag.toString('hex')
            }
        } catch (err) {
            console.log('Fail to encrypt with passphrases.')
        }
    }
    unbackslash(s) {
        return s.replace(/\\([\\rnt'"])/g, function(match, p1) {
            if (p1 === 'n') return '\n';
            if (p1 === 'r') return '\r';
            if (p1 === 't') return '\t';
            if (p1 === '\\') return '\\';
            return p1;       // unrecognised escape
        });
    }
}

module.exports = Encapsulator;