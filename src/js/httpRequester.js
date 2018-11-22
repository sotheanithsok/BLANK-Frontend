const request = require('request').defaults({ baseUrl: 'http://localhost:3000/',json:true});

const userManager = require('./userManager');
const User = require('./user');


class HttpRequester {

    constructor() {
    }

    signup(username, email, name, passphrase) {
        request.post('/signup',
            {
                body: {
                    username: username,
                    email: email,
                    name: name,
                    password: passphrase
                }
            }, (err, res, body) => {
                console.log(res.statusCode===400);
            }
        )
    }

    login() {

    }

    postMessage() {

    }

    getMessage() {

    }

    getAllMessages() {

    }

    searchUserByName() {

    }

}
const hr = new HttpRequester();
module.exports = hr;