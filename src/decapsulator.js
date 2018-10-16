const crypto = require('crypto');
const fs = require('fs');

// Class definition
class Decapsulator {
    constructor(keyPath) {
        //Read private key
        try {
            this.privateKey = fs.readFileSync(keyPath, 'utf8');
        } catch (e) {
            console.log(e);
        }

    }

    //funtion to decapsulate asekey and tag.
    //function also decrypt the ciphertext.
    decrypt(encrypted) {

        const Algorithm = 'aes-256-gcm';

        let asekey = crypto.privateDecrypt(this.privateKey, Buffer.from(encrypted.key, 'hex'));
        let tag = crypto.privateDecrypt(this.privateKey, Buffer.from(encrypted.tag, 'hex'));

        //extract the first 32 bytes from the content to get the iv.
        let iv = Buffer.from(encrypted.content.substring(0, 32), 'hex');

        //Decript the content
        var decipher = crypto.createDecipheriv(Algorithm, asekey, iv)
        decipher.setAuthTag(tag);
        var decrypt = decipher.update(encrypted.content.substring(32), 'hex', 'utf8')
        decrypt += decipher.final('utf8');
        return decrypt;
    }

} module.exports = Decapsulator;

