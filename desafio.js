async function TransacaoAPI () {
    const chamadaAPI = await fetch ("https://desafiotecnico314159265.free.beeceptor.com/");
    console.log (chamadaAPI);

    const transacoes = await chamadaAPI.json();

    console.log(transacoes)
}

TransacaoAPI ()
