const url = "https://desafiotecnico314159265.free.beeceptor.com/"

async function TransacaoAPI () {
    const chamadaAPI = await fetch (url);
    console.log (chamadaAPI);

    const transacoes = await chamadaAPI.json();

    console.log(transacoes)
}

TransacaoAPI ()
