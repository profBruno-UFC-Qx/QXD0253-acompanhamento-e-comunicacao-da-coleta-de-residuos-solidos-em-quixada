import {login} from './auth.js';

const forms =  document.getElementById("login-forms") as HTMLFormElement;
const username = document.getElementById("username") as HTMLInputElement;
const password = document.getElementById("password") as HTMLInputElement;
const mensagem = document.getElementById("mensagem") as HTMLParagraphElement;



forms.addEventListener("submit", async (event) => {
    event.preventDefault();
    const usernameValue = username.value;
    const passwordValue = password.value;
    

    try {
        const usuario = await login(usernameValue, passwordValue);
        if (usuario.role.name === 'Administrador') {

            window.location.href = 'admin.html';
        } else if (usuario.role.name === 'Coletor') {
            window.location.href = 'coletor.html';
        } else {
            window.location.href = 'index.html';
        }

    } catch (error)
{
     if (error instanceof Error){
            mensagem.textContent = `Erro: ${error.message}`;
        } else {
            mensagem.textContent = "Ocorreu um erro desconhecido.";
        }
        setTimeout(() => {
            mensagem.textContent = "";
        }, 6000);

}





  
});

