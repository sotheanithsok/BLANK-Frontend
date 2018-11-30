function startLogin(){
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    httpRequester.login(username, password);
}