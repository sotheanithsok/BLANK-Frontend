function startSignup(){
    let username = document.getElementById("name").value;
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let username = document.getElementById("email").value;
    httpRequester.signup(name,username,password,email);

}