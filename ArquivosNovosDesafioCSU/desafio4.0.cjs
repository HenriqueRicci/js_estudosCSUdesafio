const api = "https://run.mocky.io/v3/c1db645f-1e3e-4dce-add5-62f6657f1df6";
const { parseISO, isValid } = require("date-fns");
const EBCDIC = require("ebcdic-ascii").default
const converter = new EBCDIC("0037")

async function chamadaApi () {
    resposta = await fetch (api, {
        method: "GET",
        headers: {
            "Content-Type": "Application/json"
        }
    });
    const dados = await resposta.json();
    const transacoes = dados.transacoes;

    transacoes.forEach(transacao => {
        const dataHoraValida = validarDataHora(transacao.dataHora);
        const cartaoValido = validarCartao(transacao.numeroCartao);
        const enigmaValido = validarEnigma(transacao.enigmaEBCDIC, transacao.nomePortador, transacao.valorTransacao);
        let motivoRecusa = "";

        if (!dataHoraValida) {
            motivoRecusa += "A data da transação é invalida;  ";
        }
        if (!cartaoValido) {
            motivoRecusa += "Cartão inválido;  ";
        }
        if (!enigmaValido) {
            motivoRecusa += "Enigma EBCDIC inválido;  ";
        }

        transacao.aprovada = dataHoraValida && cartaoValido && enigmaValido;
        transacao.motivoRecusa = motivoRecusa;
    })

    transacoes.forEach(transacao => {
        console.log("numeroCartão: ", transacao.numeroCartao);
        console.log("nomePortador: ", transacao.nomePortador);
        console.log("valorTransacao: ", transacao.valorTransacao);
        console.log("dataHora: ", transacao.dataHora);
        console.log("enigmaEBCDIC: ", transacao.enigmaEBCDIC);
        console.log("statusTransacao: ", transacao.aprovada ? "APROVADA" : "REJEITADA")
        if (transacao.motivoRecusa) {
            console.log("motivoRecusa: ", transacao.motivoRecusa);
        };
        console.log("\n");
    })


}


function validarDataHora (dataHora) {
    const dataFormartada = parseISO(dataHora);
    return isValid(dataFormartada);
}

function validarCartao (numeroCartao){
    const cartaoConvertido = converter.toASCII(numeroCartao);
    const finalCartao = cartaoConvertido.slice(-2);
    const numeroUm = parseInt(finalCartao[0]);
    const numeroDois = parseInt(finalCartao[1]);
    const soma = numeroUm + numeroDois;
    return soma === 11;
}

function validarEnigma (enigmaEBCDIC, nomePortador, valorTransacao) {
    let enigmaConvertido;

    try{
        enigmaConvertido = converter.toASCII(enigmaEBCDIC);
    } catch {
        enigmaConvertido = "Inválido"
    }

    const separarNome = nomePortador.split(" ");
    const primeiroNome = separarNome[0];
    const formatarValor = valorTransacao.toFixed(2);
    const valorSemPonto = formatarValor.replace(".", ""); 
    const valorNome = valorSemPonto + primeiroNome;
    return enigmaConvertido === valorNome;
}

chamadaApi()