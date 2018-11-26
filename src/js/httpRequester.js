const request = require('request').defaults({ baseUrl: 'http://localhost:3000/', json: true });
const app = require('./app');
const { ipcRenderer } = require('electron');
/**
 * This ia a http requester
 */
class HttpRequester {

    constructor() {

    }

    /**
     * A post request to signup an account.
     * 
     * @param {*} username unique username.
     * @param {*} email unique email.
     * @param {*} name in-app identifier.
     * @param {*} passphrase super secret.
     */
    signup(username, email, name, passphrase) {

    }

    /**
     * A post request to login and request a JwtToken.
     * After completion, it saves the returned token into user data using userManager.
     * 
     * @param {*} username unique username.
     * @param {*} passphrase super secret.
     */
    login(username, passphrase) {

    }

    /**
     * A post request to send a message. It is authenticated with JwtToken.
     * 
     * @param {*} receiver who will receieve the message.
     * @param {*} content content of the message.
     * @param {*} key key uses to encrypt the message.
     * @param {*} tag tag uses to verify the message.
     */
    postMessage(receiver, content, key, tag) {
        request.post('/messages',
            {
                auth: {
                    bearer: userManager.getUser().jwtToken
                },
                body: {
                    receiver: receiver,
                    content: content,
                    key: key,
                    tag: tag
                }
            }, (err, res, body) => {
                console.log(res.statusCode);
            }
        )
    }

    /**
     * A get request to obtain unread messages. It is authenticated with JwtToken.
     */
    getMessage() {
        request.get('/messages',
            {
                auth: {
                    bearer: userManager.getUser().jwtToken
                }
            }, (err, res, body) => {
                console.log(body);
            }
        )
    }

    /**
     * A get request to obtain all messages including read and unread. It is authenticated with JwtToken.
     */
    getAllMessages() {
        request.get('/messagesAll',
            {
                auth: {
                    bearer: userManager.getUser().jwtToken
                }
            }, (err, res, body) => {
                console.log(body);
            }
        )
    }

    /**
     * A get request to obtain list of names that satisfy specific criteria.
     * 
     * @param {*} name complete or partial parts of a name 
     */
    searchUserByName(name) {
        let k = ipcRenderer.sendSync('synchronous-get-userManager');
        k.currentUser.RSAPublicKey="HELLOTHERE"
        setTimeout(()=>{
            ipcRenderer.send('print');
        },1);
        
        request.get('/names/' + name,
            {
                auth: {
                    bearer: userManager.getUser().jwtToken
                }
            }, (err, res, body) => {
                console.log(body);
            }
        )
    }

}
const hr = new HttpRequester();
module.exports = hr;