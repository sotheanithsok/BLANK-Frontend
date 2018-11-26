
const messageInput = document.getElementById('message-input-box');
const userSearchInput = document.getElementById('search-user-field');
const httpRequester=require('../js/httpRequester.js');
const proxies=require('../js/Proxies');

function startFilterSearch() {
    if (userSearchInput.value.length > 0) {
       proxies.searchResult.push(userSearchInput.value);
    }
}

function endSearch() {
    while(proxies.searchResult.length>0){
        proxies.searchResult.pop();
    }
}

function sendMessage() {
    let found = false;
    for (let i = 0; i < users.length; i++) {
        if (users[i] === messageInput.value) {
            delete users[i];
            found = true;
            break;
        }
    }
    if (!found) {
        users.push(messageInput.value);
    }

}

