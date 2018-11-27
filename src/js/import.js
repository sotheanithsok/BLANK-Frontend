const request = require('request').defaults({ baseUrl: 'http://localhost:3000/', json: true });
const {ipcRenderer}=require('electron');
const httpRequester = new (require('../js/httpRequester'));
const proxies = new (require('../js/proxies'));
const encapsulator=new (require('../js/encapsulator'));
const decapsulator = new (require('../js/decapsulator'));
