const logoutbtn = document.querySelector(".btnsignout-popup");

function logout() {
    window.location.replace("Visitor.html");
};

logoutbtn.addEventListener("click", logout);