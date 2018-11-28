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
    target=args.name;
    while (proxies.messages.length > 0) {
        proxies.messages.pop();
    }
    if (args.messages.length > 0) {
        args.messages.forEach(element => {
            if (element.type === 'To') {
                proxies.messages.push({
                    sender: 'You',
                    message:  element.message
                });
            }else{
                proxies.messages.push({
                    sender: target,
                    message:  element.message
                });
            }
        });
    }

})