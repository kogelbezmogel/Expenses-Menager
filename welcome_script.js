
window.onload = () => {
    document.getElementById('login_button').addEventListener('click', loginClicked);
    document.getElementById('signin_button').addEventListener('click', signClicked);
};

function loginClicked() {
    window.location.href += 'LogIn/Form';
}

function signClicked() {
    window.location.href += 'SignIn/Form'
}
