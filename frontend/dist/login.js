"use strict";
const forms = document.getElementById("login-forms");
const username = document.getElementById("username");
const password = document.getElementById("password");
forms.addEventListener("submit", (event) => {
    event.preventDefault();
    console.log(username.value);
    console.log(password.value);
});
