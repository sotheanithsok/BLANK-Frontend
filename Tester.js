const encapsulator= require('./src/js/encapsulator');

let enc = new encapsulator();
let m = enc.encryptPGP('ass','123')
console.log(m)