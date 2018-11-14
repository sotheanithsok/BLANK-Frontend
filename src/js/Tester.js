const User=require('./User').User;
const Encap=new (require('./encapsulator'));
const Decap=new (require('./decapsulator'));

let k = new User();
setTimeout(printUser,2000);

function printUser(){
  let j = Encap.encryptPGP('HelloWorld', k.RSAPublicKey );
  console.log(j);
  let result = Decap.decryptPGP(j,k.RSAPrivateKey);
  console.log(result);
}