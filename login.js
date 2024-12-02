const wrapper = document.querySelector('.wrapper');
const registerLink = document.querySelector('.register-link');
const loginLink = document.querySelector('.login-link');
const btnPopup = document.querySelector('.btnLogin-popup');
const iconClose = document.querySelector('.icon-close');


registerLink.onclick = () => {
    wrapper.classList.add('active');
};

loginLink.onclick = () => {
    wrapper.classList.remove('active');
};

btnPopup.onclick = () => {
    wrapper.classList.add('active-popup');
};

iconClose.onclick = () => {
    wrapper.classList.remove('active-popup');
    wrapper.classList.remove('active');
};


document.getElementById("registrationForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form submission


    var username = document.getElementById("username").value;
    if (!isValidUsername(username)) {
        return;
    }

    window.location.href = "signupprofile.html";
});

function isValidUsername(username) {
    return username !== "1"; //placeholder, da isvalidusername defaultede til ikke at lave mig blive redirected
    //her skal vi checke om brugernavn allerede findes i databasen
}