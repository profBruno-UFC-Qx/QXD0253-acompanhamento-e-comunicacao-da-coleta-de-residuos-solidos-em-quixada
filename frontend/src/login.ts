const forms =  document.getElementById("login-forms") as HTMLFormElement;
const username = document.getElementById("username") as HTMLInputElement;
const password = document.getElementById("password") as HTMLInputElement;

const Myheaders = new Headers();
Myheaders.append('Content-Type', 'application/json');

forms.addEventListener("submit" , async (event) =>{ 
    event.preventDefault(); // não deixa a página recarregar 
    const response =  await fetch ( 'http://localhost:1337/api/auth/local', {
        method: 'POST',
        headers: Myheaders, 
        body: JSON.stringify({
            identifier: username.value,
            password: password.value
        })
        
    })
    const dados = await response.json();
    console.log(response.ok, dados);


}


);

