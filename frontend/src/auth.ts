// Pessoa 1: sessão do usuário (login, cadastro, sair, token, papel)
import {chamarAPI} from './api.js';
const mensagem = document.getElementById("mensagem") as HTMLParagraphElement;




export async  function login ( usernameValue?: string , passwordValue?: string){

    const response = await chamarAPI('/auth/local', 'POST',{ identifier: usernameValue, password: passwordValue });
    localStorage.setItem('jwt', response.jwt);
    const usuario = await chamarAPI('/users/me?populate=role');
    localStorage.setItem('usuario', JSON.stringify(usuario));
    return usuario;

}
