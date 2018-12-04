/**
 * On click of the submit button, start the login process.
 */
function startLogin(){
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    httpRequester.login(username, password);
}

/**
 * If login successful, call this function
 */
function switchToSignup(){
    ipcRenderer.send('asynchonous-main-switchToSignup');
}

/**
 * If login failed, alert user about it.
 */
function failToLogin(){
    vex.dialog.alert('Login failed. Please check your username or password and try again.');
}