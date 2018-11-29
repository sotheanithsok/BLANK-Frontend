const messageInput = document.getElementById('message-input-box');
const userSearchInput = document.getElementById('search-user-field');

function startFilterSearch() {
    if (userSearchInput.value.length > 0) {
        httpRequester.searchUsersByName(userSearchInput.value);
    } else {
        while (proxies.searchResult.length > 0) {
            proxies.searchResult.pop();
        }
    }
}

function endSearch() {
    setTimeout(function () {
        while (proxies.searchResult.length > 0) {
            proxies.searchResult.pop();
        }
    }, 150);
}

function sendMessage() {
    target.value = messageInput.value;
}

function checkForMessage() {

}

function updateMessages() {

}

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
                    sender: target,
                    message: element.message
                });
            }
        });
    }

})


function promptForPublicKey(message) {
    vex.dialog.buttons.YES.text = 'Save'
    vex.dialog.buttons.NO.text = 'Cancel'
    vex.dialog.prompt({
        message: `You do not have RSA public key of ${target.value}. In order to send a message, please enter in the space provided below.`,
        placeholder: message,
        callback: function (value) {
            if (value === false) {
            } else {
                let testResult = encapsulator.encryptPGP('Hello', value);
                if (testResult) {
                    ipcRenderer.send('asynchronous-main-setOtherPublicKey', {
                        name: target.value,
                        key: value
                    })
                } else {
                    promptForPublicKey('Invalid RSA public key');
                }
            }
        }
    })
}

function checkForPublicKey() {
    if (target.value != '') {
        let public = ipcRenderer.sendSync('synchronous-main-getOtherPublicKey', target.value);
        if (public === null) {
            promptForPublicKey('RSA public key');
        }
    }
}

ipcRenderer.on('asynchronous-main-showKeys', (event, args) => {
    displayUserKeyPair(args.RSAPublicKey, args.RSAPrivateKey)
})

ipcRenderer.on('asynchronous-main-showOthersPublicKey', (event, args) => {
    displayUserKeyPair(args.RSAPublicKey, args.RSAPrivateKey)
})

function displayUserKeyPair(publicKey, privateKey) {
    vex.dialog.open({
        message: 'Your RSA key pairs:',
        input: [
            `<input name="publicKey" type="text" placeholder="Public Key" value="${publicKey}" required />`,
            `<input name="privateKey" type="text" placeholder="Private Key" value="${privateKey}" required />`
        ].join(''),
        buttons: [
            jQuery.extend({}, vex.dialog.buttons.YES, { text: 'Save' }),
            jQuery.extend({}, vex.dialog.buttons.NO, { text: 'Cancel' })
        ],
        callback: function (data) {
            if (!data) {
            } else {
                let m = encapsulator.encryptPGP('HelloWorld', data.publicKey)
                let k = decapsulator.decryptPGP(m, data.privateKey)
                if (k === 'HelloWorld') {
                    ipcRenderer.send('asynchronous-main-setRSAKeyPair',
                        {
                            RSAPrivateKey: data.privateKey,
                            RSAPublicKey: data.publicKey
                        })
                } else {
                    displayUserKeyPair(publicKey, privateKey);
                    vex.dialog.alert('Invalid key pair');
                }
            }
        }
    })
}