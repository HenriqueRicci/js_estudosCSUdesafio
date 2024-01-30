async function TransacaoAPI () {
    const chamadaAPI = await fetch ("https://desafiotecnico314159265.free.beeceptor.com/", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const transacoes = await chamadaAPI.json();

    console.log(transacoes)
}

TransacaoAPI ();

