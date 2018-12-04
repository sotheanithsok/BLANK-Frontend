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
        request.post(
            '/signup', {
                body: {
                    username: username,
                    password: passphrase,
                    email:email,
                    name:name
                }
            },
            (err, res, body) => {
                if (!err) {
                    if(res.statusCode===201){
                        successfullToSignup();
                    }else{
                        failToSignup();
                    }
                }
            })
    }

    /**
     * A post request to login and request a JwtToken.
     * After completion, it saves the returned token into user data using userManager.
     * 
     * @param {*} username unique username.
     * @param {*} passphrase super secret.
     */
    login(username, passphrase) {
        request.post(
            '/login', {
                body: {
                    username: username,
                    password: passphrase
                }
            },
            (err, res, body) => {
                if (!err) {
                    console.log(res.statusCode)
                    if(res.statusCode===200){
                        ipcRenderer.send('asynchronous-updateJWT', {
                            username: username,
                            passphrase: passphrase,
                            token: body.token
                        });
                        document.getElementById('username').value = '';
                        document.getElementById('password').value = '';
                    }else{
                        failToLogin();
                    }   
                }
            })
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
        request.post('/messages', {
            auth: {
                bearer: ipcRenderer.sendSync('synchronous-main-getJWTToken')
            },
            body: {
                receiver: receiver,
                content: content,
                key: key,
                tag: tag
            }
        }, (err, res, body) => {
        })
    }

    /**
     * A get request to obtain unread messages. It is authenticated with JwtToken.
     */
    getMessage() {
        request.get('/messages', {
            auth: {
                bearer: ipcRenderer.sendSync('synchronous-main-getJWTToken')
            }
        }, (err, res, body) => {
            if (!err && res.statusCode === 200) {
                
                body.forEach(element => {
                    let message = decapsulator.decryptPGP({
                        content: element.content,
                        key: element.key,
                        tag: element.tag
                    }, ipcRenderer.sendSync('synchronous-main-getRSAPrivateKey'));                    
                    if(message){
                        ipcRenderer.send('asynchronous-main-addMessage', {
                            sender:element.sender,
                            type:'From',
                            message:message
                        })
                    }
                });
            }
        })
    }

    /**
     * A get request to obtain all messages including read and unread. It is authenticated with JwtToken.
     */
    getAllMessages() {
        request.get('/messagesAll', {
            auth: {
                bearer: ipcRenderer.sendSync('synchronous-main-getJWTToken')
            }
        }, (err, res, body) => {
        })
    }

    /**
     * A get request to obtain list of names that satisfy specific criteria.
     * 
     * @param {*} name complete or partial parts of a name 
     */
    searchUsersByName(name) {
        request.get('/names/' + name, {
            auth: {
                bearer: ipcRenderer.sendSync('synchronous-main-getJWTToken')
            }
        }, (err, res, body) => {
            if (!err && res.statusCode === 200) {
                while (proxies.searchResult.length > 0) {
                    proxies.searchResult.pop();
                }
                body.forEach(element => {
                    proxies.searchResult.push(element.name);
                });
            }
        })
    }

}
module.exports = HttpRequester;