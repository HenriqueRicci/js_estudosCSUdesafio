const apiCsu = "https://desafiotecnico314159265.free.beeceptor.com/";
const { parseISO, isValid } = require("date-fns");
const EBCDIC = require("ebcdic-ascii").default
const converter = new EBCDIC("0037")


async function chamadaApi() {

    try {
        const response = await fetch(apiCsu, {
            method: 'GET',
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
    } catch (error) {
        console.log("Erro ao chamar e obter os dados da api devido erro: ", error)
    }
}

function validarData(dataTransacao) {
    const converterData = parseISO(dataTransacao);
    return isValid(converterData);
}

function validarCartao(numeroCartao) {
    const converterCartao = converter.toASCII(numeroCartao);
    const ultimosDigitos = converterCartao.slice(-2);
    const digitoUm = parseInt(ultimosDigitos[0]);
    const digitoDois = parseInt(ultimosDigitos[1]);
    const somaDigitos = digitoUm + digitoDois;
    return somaDigitos === 11;
}

function validarEnigma(enigmaEBCDIC, valorTransacao, nomePortador) {
    let enigmaAPI;
    try {
        enigmaAPI = converter.toASCII(enigmaEBCDIC);
    } catch {
        enigmaAPI = "Inválido"
    }

    const valorCompra = valorTransacao.toFixed(2);
    const valorSemPonto = valorCompra.replace(".", "");

    const separarNome = nomePortador.split(" ");
    const primeiroNome = separarNome[0];
    const enigmaTransacao = valorSemPonto + primeiroNome;
    return enigmaAPI === enigmaTransacao;
}

function validarTransacoes(transacao) {
    const dataValida = validarData(transacao.dataHora);
    const cartaoValido = validarCartao(transacao.numeroCartao);
    const enigmaValido = validarEnigma(transacao.enigmaEBCDIC, transacao.valorTransacao, transacao.nomePortador);
    const motivoRecusa = [];

    if (!dataValida) {
        motivoRecusa.push("Data inválida");
    }
    if (!cartaoValido) {
        motivoRecusa.push("Cartão inválido");
    }
    if (!enigmaValido) {
        motivoRecusa.push("EnigmaEBCDIC inválido");
    }

    transacao.aprovada = motivoRecusa.length === 0;
    transacao.motivoRecusa = motivoRecusa.join("; ");
}


function exibirTransacoes(transacao) {
    console.log("numeroCartao: ", transacao.numeroCartao);
    console.log("nomePortador: ", transacao.nomePortador);
    console.log("valorTransacao: ", transacao.valorTransacao);
    console.log("dataHora: ", transacao.dataHora);
    console.log("enigmaEBCDIC: ", transacao.enigmaEBCDIC);
    console.log("Aprovada: ", transacao.aprovada ? "APROVADA" : "REJEITADA")
    if (transacao.motivoRecusa) {
        console.log("MotivoRecusa: ", transacao.motivoRecusa);
    }
    console.log("\n");
}

chamadaApi()