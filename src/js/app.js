const messageInput = document.getElementById('message-input-box');
const userSearchInput = document.getElementById('search-user-field');
const sendButton = document.getElementById('sendButton');

/**
 * Check the last user that was clicked on.
 */
let btn = null;

/**
 * A proxies object that do something when its value change.
 */
let target = {
    _value: '',
    set value(v) {
        this._value = v;
        this.disable();
    },
    get value() {
        this.disable()
        return this._value;
    },
    disable() {
        if (this._value === '') {
            messageInput.disabled = true;
        } else {
            messageInput.disabled = false;
        }
    }
}

/**
 * Begin the search for users' name.
 */
function startFilterSearch() {
    if (userSearchInput.value.length > 0) {
        httpRequester.searchUsersByName(userSearchInput.value);
    } else {
        while (proxies.searchResult.length > 0) {
            proxies.searchResult.pop();
        }
    }
}

/**
 * End the search for users' name.
 */
function endSearch() {
    setTimeout(function () {
        while (proxies.searchResult.length > 0) {
            proxies.searchResult.pop();
        }
    }, 150);
}

/**
 * Send a message
 */
function sendMessage() {
    if (messageInput.value.trim() != '') { 
        let encrypted = encapsulator.encryptPGP(messageInput.value, ipcRenderer.sendSync('synchronous-main-getOtherPublicKey', target.value))
        httpRequester.postMessage(target.value, encrypted.content, encrypted.key, encrypted.tag)
        ipcRenderer.send('asynchronous-main-addMessage', {
            sender: target.value,
            type: 'To',
            message: messageInput.value
        })
        proxies.messages.push({
            sender: 'You',
            message: messageInput.value
        });
        messageInput.value = "";

    }
}

/**
 * Show prompt for the public key before allowing users to send a message.
 */
function promptForPublicKey() {
    vex.dialog.buttons.YES.text = 'Save'
    vex.dialog.buttons.NO.text = 'Cancel'
    vex.dialog.prompt({
        message: `You do not have RSA public key of ${target.value}. In order to send a message, please enter in the space provided below.`,
        placeholder: 'RSA public key',
        callback: function (value) {
            if (value === false) {} else {
                value = JSON.parse("\"" + value + "\"")
                let testResult = encapsulator.encryptPGP('Hello', value);
                if (testResult) {
                    ipcRenderer.send('asynchronous-main-setOtherPublicKey', {
                        name: target.value,
                        key: value
                    })
                } else {
                    promptForPublicKey('Invalid RSA public key!!!');
                }
            }
        }
    })
}

/**
 * Check if the user has the recepient pulic key. If he/she doesn't, prompt he/she for one.
 */
function checkForPublicKey() {
    if (target.value != '') {
        let public = ipcRenderer.sendSync('synchronous-main-getOtherPublicKey', target.value);
        if (public === null) {
            promptForPublicKey();
        }
    }
}

/**
 * Display the RSA key pair of the user.
 * @param {*} publicKey 
 * @param {*} privateKey 
 */
function displayUserKeyPair(publicKey, privateKey) {
    vex.dialog.open({
        message: 'Your RSA Key pairs',
        input: [
            '<label style=\'font-size: 14px;\' >RSA Public Key:</label>',
            '<input name="publicKey" type="text" style=\'font-size: 12px;\' placeholder="Public Key" value=' + JSON.stringify(publicKey) + 'required />',
            '<label style=\'font-size: 14px;\'>RSA Private Key:</label>',
            '<input name="privateKey" type="text" style=\'font-size: 12px;\' placeholder="Private Key" value=' + JSON.stringify(privateKey) + '"required />'
        ].join(''),
        buttons: [
            jQuery.extend({}, vex.dialog.buttons.YES, {
                text: 'Save'
            }),
            jQuery.extend({}, vex.dialog.buttons.NO, {
                text: 'Cancel'
            })
        ],
        callback: function (data) {
            if (!data) {} else {
                data.publicKey = (JSON.parse("\"" + data.publicKey + "\""));
                data.privateKey = (JSON.parse("\"" + data.privateKey + "\""));
                let m = encapsulator.encryptPGP('HelloWorld', data.publicKey)
                let k = decapsulator.decryptPGP(m, data.privateKey)
                if (k === 'HelloWorld') {
                    ipcRenderer.send('asynchronous-main-setRSAKeyPair', {
                        RSAPrivateKey: data.privateKey,
                        RSAPublicKey: data.publicKey
                    })
                } else {
                    displayUserKeyPair(publicKey, privateKey);
                    vex.dialog.alert('Invalid RSA key pair!!!');
                }
            }
        }
    })
}

/**
 * Display the public key of other users
 * @param {*} name 
 * @param {*} publicKey 
 */
function displayOtherKey(name, publicKey) {
    vex.dialog.open({
        message: `${name} public key:`,
        input: [
            '<input name="publicKey" style=\'font-size: 12px;\' type="text" placeholder="Public Key" value=' + JSON.stringify(publicKey) + 'required />',
        ].join(''),
        buttons: [
            jQuery.extend({}, vex.dialog.buttons.YES, {
                text: 'Save'
            }),
            jQuery.extend({}, vex.dialog.buttons.NO, {
                text: 'Cancel'
            })
        ],
        callback: function (data) {
            if (!data) {} else {
                data.publicKey = (JSON.parse("\"" + data.publicKey + "\""));
                let m = encapsulator.encryptPGP('HelloWorld', data.publicKey)
                if (m) {
                    ipcRenderer.send('asynchronous-main-setOtherPublicKey', {
                        name: name,
                        key: data.publicKey
                    })
                } else {
                    displayOtherKey(name, publicKey);
                    vex.dialog.alert('Invalid RSA public key!!!');
                }
            }
        }
    })
}

/**
 * Timers that send the request to the server for a new message or update the UI if there is a new message.
 */
function timerFunction() {
    setInterval(() => {
        httpRequester.getMessage();
    }, 1000)

    setInterval(() => {
        if (target.value != '') {
            if (ipcRenderer.sendSync('synchronous-main-getConversationLength', target.value) != proxies.messages.length) {
                ipcRenderer.send('asynchronous-request-updateMessages', target.value);
            }
        }
    }, 250)
}

/**
 * Quick initalization of the application.
 */
function initialize() {
    let names = ipcRenderer.sendSync('synchronous-main-getConversationsName');
    while (names.length > 0) {
        proxies.users.push(names.pop());
    }

    if (proxies.users.length > 0) {
        document.getElementById('users-container').childNodes[0].click()
    }

    messageInput.addEventListener("keypress", function (event) {
        if (event.keyCode === 13 && !event.shiftKey) {
            event.preventDefault();
            sendButton.click();
        }
    });
}

/**
 * A request for adding a new conversation to the UI
 */
ipcRenderer.on('asynchronous-addNewConversation', (event, args) => {
    proxies.users.push(args);
})

/**
 * A request for showing RSA key pair.
 */
ipcRenderer.on('asynchronous-main-showKeys', (event, args) => {
    displayUserKeyPair(args.RSAPublicKey, args.RSAPrivateKey)
})

/**
 * A request for showing other people public key.
 */
ipcRenderer.on('asynchronous-main-showOthersPublicKey', (event, args) => {
    displayOtherKey(args.name, args.RSAPublicKey)
})

/**
 * A request for updating the messages UI.
 */
ipcRenderer.on('asynchronous-reply-updateMessages', (event, args) => {
    target.value = args.name;
    while (proxies.messages.length > 0) {
        proxies.messages.pop();
    }
    if (args.messages.length > 0) {
        args.messages.forEach(element => {
            if (element.type === 'To') {
                proxies.messages.push({
                    sender: 'You',
                    message: element.message
                });
            } else {
                proxies.messages.push({
                    sender: target.value,
                    message: element.message
                });
            }
        });
    }

})