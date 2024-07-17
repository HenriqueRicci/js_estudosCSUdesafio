const { parseISO, isValid } = require("date-fns");
const EBCDIC = require("ebcdic-ascii").default
const converter = new EBCDIC("0037")

const api = "https://desafiotecnico314159265.free.beeceptor.com/";


async function chamadaApi() {
    const response = await fetch(api, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })

    const dados = await response.json();
    const transacoes = dados.transacoes;

    transacoes.forEach(transacao => {
        validarTransacoes(transacao);
        exibirTransacoes(transacao);
    })
}


function validarDataHora (dataHora) {
    const formatarData = parseISO(dataHora)
    return isValid(formatarData);
}

function validarFinalCartao (numeroCartao) {
    const formatarCartao = converter.toASCII(numeroCartao);
    const finalCartao = formatarCartao.slice(-2);
    const digitoUm = parseInt(finalCartao[0]);
    const digitoDois = parseInt(finalCartao[1]);
    const soma = digitoUm + digitoDois;
    return soma === 11;    
}

function validarEnigmaEBCDIC (nomePortador, valorTransacao, enigmaEBCDIC) {
    let converterEnigma; 
    try {
        converterEnigma = converter.toASCII(enigmaEBCDIC);
    } catch {
        converterEnigma = "Invalido";
    }

    const formatarvalor = valorTransacao.toFixed(2);
    const valorSemPonto = formatarvalor.replace(".", "")
    
    
    const separarNome = nomePortador.split(" ");
    const primeiroNome = separarNome[0];

    const enigmaTransacao = valorSemPonto + primeiroNome;
    return enigmaTransacao === converterEnigma;
}

function validarTransacoes (transacao) {
    const dataValida = validarDataHora(transacao.dataHora);
    const cartaoValido = validarFinalCartao(transacao.numeroCartao);
    const enigmaValido = validarEnigmaEBCDIC(transacao.nomePortador, transacao.valorTransacao, transacao.enigmaEBCDIC);

    const motivoRecusa = [];

    if (!dataValida) {
        motivoRecusa.push("Data inválida")
    };
    if (!cartaoValido){
        motivoRecusa.push("Cartão Inválido")
    };
    if (!enigmaValido){
        motivoRecusa.push("Enigma Inválido")
    };

    transacao.aprovada = motivoRecusa.length === 0;
    transacao.motivoRecusa = motivoRecusa.join(": ");
}

function exibirTransacoes (transacao) {
    console.log("numeroCartao: ", transacao.numeroCartao);
    console.log("nomePortador: ", transacao.nomePortador);
    console.log("valorTransacao: ", transacao.valorTransacao);
    console.log("dataHora: ", transacao.dataHora);
    console.log("enigmaEBCDIC: ", transacao.enigmaEBCDIC);
    console.log("StatusTransação: ", transacao.aprovada ? "Aprovada" : "Recusada")
    if (transacao.motivoRecusa){
        console.log("MotivoRecusa: ", transacao.motivoRecusa)
    }
    console.log("\n")
}

chamadaApi()