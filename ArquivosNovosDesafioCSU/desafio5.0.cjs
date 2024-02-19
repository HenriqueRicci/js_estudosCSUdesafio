const apiCsu = "https://desafiotecnico314159265.free.beeceptor.com";
const { parseISO, isValid } = require("date-fns");
const EBCDIC = require("ebcdic-ascii").default
const converter = new EBCDIC("0037")


async function chamadaApi() {
    try {
    resposta = await fetch(apiCsu, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    const dados = await resposta.json();
    const transacoes = dados.transacoes;

    transacoes.forEach(transacao => {
        const dataHoraTransacao = validarDataHora(transacao.dataHora);
        const cartaoTransacao = validarCartao(transacao.numeroCartao);
        const enigmaTransacao = validarEnigma(transacao.enigmaEBCDIC, transacao.valorTransacao, transacao.nomePortador);
        let motivoRecusa = "";

        if (!dataHoraTransacao) {
            motivoRecusa += "Data inválida; "
        };
        if (!cartaoTransacao) {
            motivoRecusa += "Cartão inválido; "
        };
        if (!enigmaTransacao) {
            motivoRecusa += "EnigmaEBCDIC inválido; "
        };

        transacao.aprovada = dataHoraTransacao && cartaoTransacao && enigmaTransacao;
        transacao.motivoRecusa = motivoRecusa;
    })

    transacoes.forEach(transacao => {
        console.log("numeroCartao:", transacao.numeroCartao);
        console.log("nomePortador:", transacao.nomePortador);
        console.log("valorTransacao:", transacao.valorTransacao);
        console.log("dataHora:", transacao.dataHora);
        console.log("enigmaEBCDIC", transacao.enigmaEBCDIC);
        console.log("statusTransacao:", transacao.aprovada ? "APROVADA" : "REJEITADA");
        if (transacao.motivoRecusa){
            console.log("motivoRecusa:", transacao.motivoRecusa);
        }
        console.log("\n");
    })
    } catch {
        console.log("Erro ao chamar a API");
    }
}

function validarDataHora(dataHora) {
    formatarData = parseISO(dataHora);
    return isValid(formatarData)
}

function validarCartao(numeroCartao) {
    const converterCartao = converter.toASCII(numeroCartao);
    const ultimosDigitos = converterCartao.slice(-2);
    const digitoUm = parseInt(ultimosDigitos[0]);
    const digitoDois = parseInt(ultimosDigitos[1]);
    const soma = digitoUm + digitoDois;
    return soma === 11;
}

function validarEnigma(enigmaApiEBCDIC, valorTransacao, nomePortador) {
    let enigma;
    try {
        enigma = converter.toASCII(enigmaApiEBCDIC);
    } catch {
        enigma = "invalido";
    }
    const valor = valorTransacao.toFixed(2);
    const valorSemPonto = valor.replace(".", "");
    const separarNome = nomePortador.split(" ");
    const primeiroNome = separarNome[0];
    const nomeValor = valorSemPonto + primeiroNome;
    return enigma === nomeValor
}



chamadaApi()