const encapsulator=require('./encapsulator');
const decapsulator=require('./decapsulator');

const enc = new encapsulator('./public_key.pem');
const dec=new decapsulator('./private_key.pem')

let text = 'LOL \n Kappa';

let k = enc.encrypt(text);
console.log(k);
let d=dec.decrypt(k);
console.log(d);