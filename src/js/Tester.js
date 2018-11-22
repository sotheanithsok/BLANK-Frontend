const userManager = require('./UsersManager');
const userManager1 = require('./UsersManager');
const User = require('./User')
console.log(userManager)
console.log(userManager1)
userManager.setUser(new User())
console.log(userManager);
console.log(userManager1)



