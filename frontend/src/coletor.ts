// Pessoa 1: tela do coletor (iniciar e encerrar coleta, enviar posição)
import {exigirPapel , usuario} from './auth.js';
import {chamarAPI} from './api.js';
const main = document.querySelector('main');
const iniciarColetaBtn = document.getElementById('iniciar-coleta') as HTMLButtonElement;


const Vlogin = exigirPapel('Coletor');

if (Vlogin){

   const usuarioLogado = usuario() ;
   if(usuarioLogado!== null){
     const span = document.getElementById('username') as HTMLSpanElement;
     span.textContent = `${usuarioLogado.username}`;
     carregarRegioes();
   }else{
        window.location.href = 'login.html';
   }
  

}

async function carregarRegioes (): Promise<void>{
 
    try {
        const select = document.getElementById('bairros') as HTMLSelectElement;
        const regioes =  await chamarAPI('/regioes');
        for (const regiao of regioes.data){
            const option = document.createElement('option');
             option.textContent = regiao.nome;
             option.value = regiao.documentId;
             select.appendChild(option);

    }

    }
    catch (error){

        const mensagem = document.createElement('p') as HTMLParagraphElement;
        mensagem.textContent = ` ${error}`;
       if(main){
         main.appendChild(mensagem);
       }
       
    }

  
}

