const userManager=require('./src/js/userManager');
userManager.loadUser('jake',"123");
userManager.getUser().jwtToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1NDMyMDE1NDYsImV4cCI6MTU0MzgwNjM0NiwiYXVkIjoid3d3LmNnZW5jcnlwdGVkY2hhdC5tZSIsImlzcyI6IkNydXNoIG5leHQgZG9vcnMiLCJzdWIiOiJ6eGN6Y3p4Y3pjeC00NDkwIn0.qleroZWTPA9oVfIoPqOX4CnNgLDCbUFl9uL3_pKMhc4";
userManager.saveUser('jake','123');

console.log(userManager.getUser().jwtToken)