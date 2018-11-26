let keypair=require('keypair');
let pair =keypair({
    bits:4096
});
console.log(pair)

let j =keypair();
console.log(j)