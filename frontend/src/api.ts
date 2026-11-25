const API_URL = 'http://localhost:1337/api';

export async function chamarAPI( caminho: string , metodo: string = 'GET' , corpor?: object){

    const token = localStorage.getItem('jwt');
    const headers : Record <string , string > = {
        'Content-Type': 'application/json',
    };
    ;
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch (`${API_URL}${caminho}`, {
        method: metodo,
        headers: headers,
        body: corpor ? JSON.stringify(corpor) : null,
    });
    const data = await response.json().catch(() => (null));

    if (!response.ok) {
        const mensagemErro = data?.error?.message || 'Erro ${response.status}';
        throw new Error(mensagemErro);
    }
    return data;

}
