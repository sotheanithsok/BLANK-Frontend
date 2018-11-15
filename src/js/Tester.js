const User = require('./User').User;
const Encap = new(require('./encapsulator'));
const Decap = new(require('./decapsulator'));

let passphrase = 'adfjzc;vj;lajslefjjof;dasl';
let data = new User();
data.keysChain['1']='123';
data.keysChain['1']='12333';
data.keysChain['12']=['adfa','adfadsfa'];

console.log(data);

let stringData = Decap.decryptPassphrase(Encap.encryptPassphrase(JSON.stringify(data),passphrase),passphrase);
console.log(stringData)
let newData=JSON.parse(stringData)
console.log(newData)