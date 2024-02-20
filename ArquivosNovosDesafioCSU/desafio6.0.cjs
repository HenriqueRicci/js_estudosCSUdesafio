const api = "https://run.mocky.io/v3/c1db645f-1e3e-4dce-add5-62f6657f1df6";
const { parseISO, isValid } = require("date-fns");
const EBCDIC = require("ebcdic-ascii").default
const converter = new EBCDIC("0037")

async function chamadaAPI() {
    try {
        const response = await fetch(api, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const dados = await response.json();
        const transacoes = dados.transacoes;

        transacoes.forEach(transacao => {
            validarTransacao(transacao);
            exibirTransacoes(transacao);
        });

    } catch {
        console.log("Erro ao chamar a api");
        return
    };


}

function validarDataHora(dataHora) {
    const converterDate = parseISO(dataHora);
    return isValid(converterDate);
}

function validarCartao(numeroCartao) {
    let finalCartao;

    try {
        const converterCartao = converter.toASCII(numeroCartao);
        finalCartao = converterCartao.slice(-2);
    } catch {
        return false;
    }

    const digitoUm = parseInt(finalCartao[0]);
    const digitoDois = parseInt(finalCartao[1]);
    const somaDigitos = digitoUm + digitoDois;
    return somaDigitos === 11;
}

function validarEnigma(enigmaEBCDIC, valorTransacao, nomePortador) {
    let converterEnigma;

    try {
        converterEnigma = converter.toASCII(enigmaEBCDIC);
    } catch {
        return false;
    }

    const valorString = valorTransacao.toFixed(2);
    const valorSemPonto = valorString.replace(".", "");

    const separarNome = nomePortador.split(" ");
    const primeiroNome = separarNome[0];

    const valorNomeEnigma = valorSemPonto + primeiroNome;
    return valorNomeEnigma == converterEnigma;

}

function validarTransacao(transacao) {
    const dataHoraValida = validarDataHora(transacao.dataHora);
    const cartaoValido = validarCartao(transacao.numeroCartao);
    const enigmaValido = validarEnigma(transacao.enigmaEBCDIC, transacao.valorTransacao, transacao.nomePortador);

    const motivoRecusa = [];

    if (!dataHoraValida) {
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
    console.log("statusTransacao: ", transacao.aprovada ? "APROVADA" : "REJEITADA");
    if (transacao.motivoRecusa) {
        console.log("motivoRecusa: ", transacao.motivoRecusa);
    }
    console.log("\n");
}

chamadaAPI()