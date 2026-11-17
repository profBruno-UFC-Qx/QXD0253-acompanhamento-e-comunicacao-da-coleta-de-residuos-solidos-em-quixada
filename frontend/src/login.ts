const forms =  document.getElementById("login-forms") as HTMLFormElement;
const username = document.getElementById("username") as HTMLInputElement;
const password = document.getElementById("password") as HTMLInputElement;


forms.addEventListener("submit" , (event) =>{
    event.preventDefault(); // não deixa a página recarregar
    console.log(username.value);
    console.log(password.value);

});