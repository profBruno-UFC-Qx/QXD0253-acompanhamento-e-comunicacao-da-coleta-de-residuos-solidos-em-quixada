import {chamarAPI} from './api.js';


const forms =  document.getElementById("login-forms") as HTMLFormElement;
const username = document.getElementById("username") as HTMLInputElement;
const password = document.getElementById("password") as HTMLInputElement;
const mensagem = document.getElementById("mensagem") as HTMLParagraphElement;



forms.addEventListener("submit", async (event) => {
    event.preventDefault();
    const usernameValue = username.value;
    const passwordValue = password.value;

    try{
        const response = await chamarAPI('/auth/local', 'POST',{ identifier: usernameValue, password: passwordValue });
        localStorage.setItem('jwt', response.jwt);
        mensagem.textContent = "Login realizado com sucesso!";

    } catch (error) {
        const mensagemErro = document.querySelector("#mensagem") as HTMLParagraphElement;
        if (error instanceof Error){
            mensagemErro.textContent = `Erro: ${error.message}`;
        }
    }

});