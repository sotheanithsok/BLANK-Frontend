/**
 * On click of the submit button, start the signup process.
 */
function startSignup(){
    let name = document.getElementById("name").value;
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let email = document.getElementById("email").value;
    httpRequester.signup(username,email,name,password);

}

/**
 * Switch to the login screen
 */
function switchToLogin(){
    ipcRenderer.send('asynchonous-main-switchToLogin');
}

/**
 * Show that the signup has failed.
 */
function failToSignup(){
    vex.dialog.alert('Sign-up failed. Please check your information and try again.');
}

/**
 * Show user that the signup has succeded. Then it will redirect to login.
 */
function successfullToSignup(){
    vex.dialog.open({
        message: `You have successfully created an account. You will be redirect back to the login page. `,
        buttons: [
            jQuery.extend({}, vex.dialog.buttons.YES, {
                text: 'Okay'
            })
        ],
        callback: function (data) {
            switchToLogin()
        }
    })
}