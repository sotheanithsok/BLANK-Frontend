const request = require('request').defaults({ baseUrl: 'https://cgencryptedchat.me/', json: true });
const {ipcRenderer}=require('electron');
const p=require('path')
const httpRequester = new (require(p.join(__dirname,'../js/httpRequester')));
const proxies = new (require(p.join(__dirname,'../js/proxies')));
const encapsulator=new (require(p.join(__dirname,'../js/encapsulator')));
const decapsulator = new (require(p.join(__dirname,'../js/decapsulator')));
const jQuery=require('jquery');