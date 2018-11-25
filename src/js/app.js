const messagesContainer = document.getElementById('messages-container');
const usersContainer = document.getElementById('users-container');
const messageInput = document.getElementById('message-input-box');
const userSearchInput = document.getElementById('search-user-field');
const searchResultContainer=document.getElementById('search-result-container');



function startSearch(){
    while (searchResultContainer.firstChild) {
        searchResultContainer.removeChild(searchResultContainer.firstChild);
    }
    let i =userSearchInput.value.length;
    while(i--){
        createResultedUserElement(userSearchInput.value.charAt(i))
    }
}

function sendMessage() {
    createMessageElement("JAKE", messageInput.value);
    messageInput.value = "";
    createUserElement(makeid());

}


function createMessageElement(name, message) {
    let button = document.createElement('button');
    let text = document.createElement('pre');
    let whitespace = "";
    for (let i = 0; i <= name.length; i++) {
        whitespace += ' ';
    }
    let temp = message.replace(/^/g, whitespace);
    text.innerHTML = name + ":\n" + temp;
    button.appendChild(text);
    messagesContainer.appendChild(button);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function createUserElement(name) {
    let button = document.createElement('button');
    button.appendChild(document.createTextNode(name));
    usersContainer.appendChild(button);
}

function createResultedUserElement(name) {
    let button = document.createElement('button');
    button.appendChild(document.createTextNode(name));
    searchResultContainer.appendChild(button);
}
