
const messageInput = document.getElementById('message-input-box');
const userSearchInput = document.getElementById('search-user-field');


function startFilterSearch() {
    if (userSearchInput.value.length > 0) {
       hr.searchUsersByName(userSearchInput.value);
    }
}

function endSearch() {
    while(obj.searchResult.length>0){
        obj.searchResult.pop();
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