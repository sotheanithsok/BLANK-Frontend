const userManager = require('./userManager')
const User = require('./user')

let username = "smith";
let passphrase = "123456789"


userManager.setUser(new User);
userManager.saveUser(username,passphrase)
let k  = userManager.loadUser(username,passphrase)
console.log(k)



