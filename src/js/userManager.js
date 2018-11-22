const path = './resources/users/';
const crypto = require('crypto');
const fs = require('fs');
const encapsulator = require('./encapsulator');
const decapsulator = require('./decapsulator');

class UserManager {
    constructor() {
        if(!fs.existsSync(path)){
            fs.mkdirSync(path)
        }
        this.currentUser = null;
    }

    loadUser(username, passphrase) {
        try {
            let hash = crypto.createHash('sha256');
            hash.update(username);
            let fileName = hash.digest('hex');
            let encryptedInfo = JSON.parse(fs.readFileSync(path + fileName + ".json", 'utf8'));
            let decryptedInfo = decapsulator.decryptPassphrase(encryptedInfo, passphrase);
            this.currentUser = JSON.parse(decryptedInfo);
        } catch (err) {
            console.error('Failed to load user');
        }

    }

    saveUser(username, passphrase) {
        try {
            if (this.currentUser === null) {
                throw new Error('User hasn\'t been set yet.')
            }
            let hash = crypto.createHash('sha256');
            hash.update(username);
            let fileName = hash.digest('hex');
            let encryptedInfo = encapsulator.encryptPassphrase(JSON.stringify(this.currentUser), passphrase);
            fs.writeFile(path + fileName + ".json", JSON.stringify(encryptedInfo, null, 4), (err) => {
                if (err) {
                    console.error('Fail to write to file');
                }

            });
        } catch (err) {
            console.error('Fail to save user');
        }

    }

    getUser() {
        return this.currentUser;
    }
    setUser(user) {
        this.currentUser = user;
    }
}

const um = new UserManager();
module.exports = um;