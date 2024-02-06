const apiUrl = 'https://run.mocky.io/v3/c1db645f-1e3e-4dce-add5-62f6657f1df6'

//import EBCDIC from "ebcdic-ascii"

//const converterEBCDIC = new EBCDIC("0037")

async function dadosApi () {
    const response = await fetch (apiUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })

    const data = await response.json();
    const transacoes = data.transacoes

    transacoes.forEach(transacao => {
        console.log('Enigma é =', transacao.enigmaEBCDIC)
    })
}

 dadosApi();

/* async function dadosAPI () {
    const chamadaAPI = await fetch (urlApi, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const response = await chamadaAPI.json();
    const transacoes = response.transacoes;
    console.log(typeof transacoes)  
} 


dadosAPI()
 */

