// Pessoa 1: tela do coletor (iniciar e encerrar coleta, enviar posição)
import {exigirPapel , usuario} from './auth.js';


const Vlogin = exigirPapel('Coletor');

if (Vlogin){
   const usuarioLogado = usuario() ;
   if(usuarioLogado!== null){
     const span = document.getElementById('username') as HTMLSpanElement;
     span.textContent = `${usuarioLogado.username}`;
   }else{
        window.location.href = 'login.html';
   }
  

}
