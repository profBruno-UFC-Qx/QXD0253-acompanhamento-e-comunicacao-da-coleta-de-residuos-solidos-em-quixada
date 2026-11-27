// Pessoa 1: sessão do usuário (login, cadastro, sair, token, papel)
import {chamarAPI} from './api.js';





export async  function login ( usernameValue: string , passwordValue: string){

    const response = await chamarAPI('/auth/local', 'POST',{ identifier: usernameValue, password: passwordValue });
    localStorage.setItem('jwt', response.jwt);
    const usuario = await chamarAPI('/users/me?populate=role');
    localStorage.setItem('usuario', JSON.stringify(usuario));
    return usuario;

}


export function sair(): boolean {
    localStorage.removeItem('jwt');
    localStorage.removeItem('usuario');
    if (localStorage.getItem('jwt') === null && localStorage.getItem('usuario') === null) {
        return true;
    }
    return false;
}

export function logado (): boolean {

    if (localStorage.getItem('jwt') && localStorage.getItem('usuario')) {
        return true;
    }


    return false;
}


export function usuario(): any | null {
  const usuarioAtual = localStorage.getItem('usuario');
  if (usuarioAtual) {
    return JSON.parse(usuarioAtual);
  }
  return null;
}

export function Tempapel(papel: string): boolean {
    const usuarioLogado = usuario();
    if (usuarioLogado && usuarioLogado?.role?.name === papel) {
        return true;
    }
    return false;
}

