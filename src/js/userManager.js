const path = './resources/users/';
const crypto = require('crypto');
const fs = require('fs');
const encapsulator = new(require('./encapsulator'));
const decapsulator = new(require('./decapsulator'));
const User = require('./user');


/**
 * Users manager. Its goal is to load and save user data.
 */
class UserManager {
    constructor() {
        if (!fs.existsSync('./resources/')) {
            fs.mkdirSync('./resources/')
        }
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path)
        }
        this.currentUser = null;
    }

    /**
     * Decrypt and load a user data into the manager. If user doesn't exist, it will create a new user.
     * @param {*} username unique username.
     * @param {*} passphrase super secret.
     */
    loadUser(username, passphrase) {
        try {

            //Hashing username
            let hash = crypto.createHash('sha256');
            hash.update(username);
            let fileName = hash.digest('hex');

            //Load user data into manager
            if (fs.existsSync(path + fileName + ".json")) {
                let encryptedInfo = JSON.parse(fs.readFileSync(path + fileName + ".json", 'utf8'));
                let decryptedInfo = decapsulator.decryptPassphrase(encryptedInfo, passphrase);
                this.currentUser = JSON.parse(decryptedInfo);
            } else {
                this.currentUser = new User();
                this.saveUser(username, passphrase);
            }

        } catch (err) {
            console.log(err);
            console.error('Failed to load user');
        }

    }

    /**
     * Encrypt and write user data into file.
     * @param {*} username unique username
     * @param {*} passphrase super secret
     */
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
            console.log(err);
            console.error('Fail to save user');
        }

    }

    /**
     * Get the current user.
     */
    getUser() {
        return this.currentUser;
    }
    setUser(user){
        this.currentUser=user;
    }
}

const um = new UserManager();
module.exports = um;