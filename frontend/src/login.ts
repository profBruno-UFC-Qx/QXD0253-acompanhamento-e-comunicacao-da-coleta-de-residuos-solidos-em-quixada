import {chamarAPI} from './api.js';


const forms =  document.getElementById("login-forms") as HTMLFormElement;
const username = document.getElementById("username") as HTMLInputElement;
const password = document.getElementById("password") as HTMLInputElement;
const mensagem = document.getElementById("mensagem") as HTMLParagraphElement;



forms.addEventListener("submit", async (event) => {
    mensagem.textContent = "";
    localStorage.removeItem('jwt');
    event.preventDefault();
    const usernameValue = username.value;
    const passwordValue = password.value;

    try{
        const response = await chamarAPI('/auth/local', 'POST',{ identifier: usernameValue, password: passwordValue });
        localStorage.setItem('jwt', response.jwt);
       
        const usuario = await chamarAPI('/users/me?populate=role');
        localStorage.setItem('usuario', JSON.stringify(usuario));

        mensagem.textContent = "Login realizado com sucesso!";

        if (usuario.role.name === 'Administrador') {
            window.location.href = 'admin.html';
        } else if (usuario.role.name === 'Coletor') {
            window.location.href = 'coletor.html';
        } else {
            window.location.href = 'index.html';
        }

    } catch (error) {
        if (error instanceof Error){
            mensagem.textContent = `Erro: ${error.message}`;
        } else {
            mensagem.textContent = "Ocorreu um erro desconhecido.";
        }
    }
});