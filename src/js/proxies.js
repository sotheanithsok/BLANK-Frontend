const messagesContainer = document.getElementById('messages-container');
const usersContainer = document.getElementById('users-container');
const searchResultContainer = document.getElementById('search-result-container');

class Proxies {
    constructor() {
        this.messages = new Proxy([], {

            /**
             * Override array set method to automatically create html message element when new item are added to array.
             * @param {*} target
             * @param {*} property 
             * @param {*} value 
             * @param {*} receiver 
             */
            set(target, property, value, receiver) {
                if (value.hasOwnProperty('sender') && value.hasOwnProperty('message') && value.sender.trim() && value.sender.trim()) {
                    value.timestamp = Date.now();
                    target[property] = value;
                    obj.createMessageElement(value.sender, value.message, value.timestamp);
                }
                return true;
            },

            /**
             * Override array set method to automatically delete html message element when an item are removed from arrray.
             * @param {*} target 
             * @param {*} property 
             */
            deleteProperty(target, property) {
                if (property in target) {
                    obj.removeMessageElement(target[property].sender, target[property].message, target[property].timestamp);
                    target.splice(property, 1);
                }
                return true;
            }
        });

        this.users = new Proxy([], {
            set(target, property, value, receiver) {
                if (property != 'length') {
                    target.forEach((v) => {
                        if (v === value) {
                            return true;
                        }
                    })
                    target[property] = value;
                    obj.createUserElement(value);
                }

                return true;
            },
            deleteProperty(target, property) {
                if (property in target) {
                    obj.removeUserElement(target[property]);
                    target.splice(property, 1);
                }
                return true;
            }
        });

        this.searchResult = new Proxy([], {
            set(target, property, value, receiver) {
                if (property != 'length') {
                    target.forEach((v) => {
                        if (v === value) {
                            return true;
                        }
                    })
                    target[property] = value;
                    obj.createResultedUserElement(value);
                }

                return true;
            },
            deleteProperty(target, property) {
                if (property in target) {
                    obj.removeResultedUserElement(target[property]);
                    target.splice(property, 1);
                }
                return true;
            }

        });
    }
    /**
    * A helper function uses to create html message element.
    * @param {*} sender 
    * @param {*} message 
    * @param {*} timestamp 
    */
    createMessageElement(sender, message, timestamp) {
        let button = document.createElement('button');
        let text = document.createElement('pre');
        let whitespace = "";
        for (let i = 0; i <= sender.length; i++) {
            whitespace += ' ';
        }
        let temp = message.replace(/^/g, whitespace);
        text.innerHTML = sender + ":\n" + temp;
        button.appendChild(text);
        button.setAttribute('tID', btoa(sender + message + timestamp));
        messagesContainer.appendChild(button);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        messageInput.value = ""
    }

    /**
     * A helper function uses to remove html message element.
     * @param {*} sender 
     * @param {*} message 
     * @param {*} timestamp 
     */
    removeMessageElement(sender, message, timestamp) {
        let tID = btoa(sender + message + timestamp);
        messagesContainer.childNodes.forEach((element) => {
            if (element.getAttribute('tID') === tID) {
                messagesContainer.removeChild(element);
            }
        });
    }

    /**
     * A helper function uses to create html user elements.
     * @param {*} name 
     */
    createUserElement(name) {
        let button = document.createElement('button');
        button.appendChild(document.createTextNode(name));
        button.setAttribute('tID', btoa(name));
        usersContainer.appendChild(button);
    }

    /**
     * A helper function uses to remove html user elements.
     * @param {*} name 
     */
    removeUserElement(name) {
        let tID = btoa(name);
        usersContainer.childNodes.forEach((element) => {
            if (element.getAttribute('tID') === tID) {
                usersContainer.removeChild(element);
            }
        });
    }

    /**
     * A helper function uses to create html resulted user elements.
     * @param {*} name 
     */
    createResultedUserElement(name) {
        let button = document.createElement('button');
        button.appendChild(document.createTextNode(name));
        button.setAttribute('tID', btoa(name));
        searchResultContainer.appendChild(button);
    }

    /**
     * A helper function uses to remove html resulted user elements.
     * @param {*} name 
     */
    removeResultedUserElement(name) {
        let tID = btoa(name);
        searchResultContainer.childNodes.forEach((element) => {
            if (element.getAttribute('tID') === tID) {
                searchResultContainer.removeChild(element);
            }
        });
    }
}
const obj = new Proxies();
