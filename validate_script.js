window.onkeydown = (event) => { //preventing submit on enter click
    if( event.keyCode == 13 || event.keyCode == 'Enter' )
        event.preventDefault();
}


var valid_login = false;
var valid_password = false;
var valid_email = false;

window.onload = () => {

    document.getElementById("log").addEventListener("change", async () => {
        value = document.getElementById("log").value;
        
        login_not_empty = ( value.length > 0 );
        login_already_exists = false;

        if( login_not_empty ) {
            options  = {
                method : 'GET',
                headers : { "Content-Type": "application/json" }
            };

            response = await fetch(`/Auth/SignIn/Log/${value}`, options);
            response = await response.json();
            login_already_exists = response.value;
            console.log("Login exists: " + login_already_exists );
        }

        info = document.getElementById("log_validate_info");
        if( !login_already_exists && login_not_empty ) {
            info.style.backgroundColor = "#53bf19";
            info.innerHTML = "";
            valid_login = true;
            inputsValidationCheck();
        }
        else {
            info.style.backgroundColor = "red";
            if( login_already_exists )
                info.innerHTML = " # login exists";
            else
                info.innerHTML = " # login empty";
            valid_login = false;
        }
    });

    document.getElementById("pass").addEventListener("change", () => {
        value = document.getElementById("pass").value;

        length_gate = ( value.length >= 8 );
        digit_gate = value.match( /.*\d.*/ );
        upper_gate = value.match( /.*[A-Z].*/ );

        validation = (length_gate && digit_gate && upper_gate);

        info = document.getElementById("pass_validate_info");
        if( validation ) {
            info.style.backgroundColor = "#53bf19";
            info.innerHTML = "";
            valid_password = true;
            inputsValidationCheck();
        }
        else {
            info.style.backgroundColor = "red";
            info.innerHTML = " # password need to have at least 8 characters.<br/> One uppercase and one digit";
            valid_password = false;
        }
    });

    document.getElementById("mail").addEventListener("change", async () => {
        value = document.getElementById("mail").value;

        email_pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        validation = value.match(email_pattern);

        options  = {
            method : 'GET',
            headers : { "Content-Type": "application/json" }
        };
        response = await fetch(`/Auth/SignIn/Email/${value}`, options);
        response = await response.json();
        email_already_exists = response.value;
        console.log("Email exists: " + email_already_exists );

        info = document.getElementById("mail_validate_info");
        if( validation && !email_already_exists ) {
            info.style.backgroundColor = "#53bf19";
            info.innerHTML = "";
            valid_email = true;
            inputsValidationCheck();
        }
        else {
            info.style.backgroundColor = "red";
            
            if( email_already_exists )
                info.innerHTML = " # e-mail already exists ";
            else
                info.innerHTML = " # e-mail does not fit ";
            
            valid_email = false;
        }
    });
}

function inputsValidationCheck() {
    if ( valid_email && valid_password && valid_login ) {
        button = document.getElementById('send_button').disabled = false;
    }
}