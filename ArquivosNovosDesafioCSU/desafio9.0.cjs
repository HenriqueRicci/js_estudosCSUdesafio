// Nessa parte estamos declarando as variveis globais que serão utilizadas para execução do código.

const api = "https://desafiotecnico314159265.free.beeceptor.comm/";
const { parseISO, isValid } = require("date-fns");
const EBCDIC = require("ebcdic-ascii").default
const converter = new EBCDIC("0037")


// Efetua requisão na API, guarda o valor do JSON e itera sobre todas as transações do JSON
async function chamadaApi () {
    try {
    const response = await fetch (api, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        }
    })

    const dados = await response.json()
    const transacoes = dados.transacoes;

    transacoes.forEach(transacao => {
        validarTransacoes(transacao);
        exibirTransacoes(transacao);
    })
    } catch (error) {
        console.log(`Não foi possivel validar as transações. (${error})`)
    }
}

// Transforma a data retornada da API em um object do tipo "Date" e depois valida se o DATE é valido
function validarDataHora (dataTransacao) {
    const formatarData =  parseISO(dataTransacao);
    return isValid(formatarData);
}

// Pega os ultimos números do cartão e verifica se a soma deles resulta em 11
function validarCartao (numeroCartao) {
    const formatarCartao = converter.toASCII(numeroCartao);
    const finalCartao = formatarCartao.slice(-2);
    const numeroUm = parseInt(finalCartao[0]);
    const numeroDois = parseInt(finalCartao[1]);
    const soma = numeroUm + numeroDois;
    return soma === 11;
}

// Converte o enigma EBCDIC retornado da API em ASCII;
// Pega o primeiro nome do usuário e o valor da transação;
// Compara o enigma convertido com o valor da transação + nome;
function validarEnigma (enigmaEBCDIC, valorTransacao, Nome) {

    let converterEnigma;
    try{
        converterEnigma = converter.toASCII(enigmaEBCDIC);
    } catch {
        converterEnigma = "Inválido";
    }
    
    const converterValor = valorTransacao.toFixed(2);
    const valorSemPonto = converterValor.replace(".", "");
    
    const separarNome = Nome.split(" ");
    const primeiroNome = separarNome[0];
    const transacaoEnigma = valorSemPonto + primeiroNome;

    return converterEnigma === transacaoEnigma;
}

// valida as regras para cada campo das transacoes da API;
// Cria dois novos elementos (aprovadas e motivoRecusa) ao array
function validarTransacoes (transacao) {
    const dataValida = validarDataHora(transacao.dataHora);
    const cartaoValido = validarCartao(transacao.numeroCartao);
    const enigmaValido = validarEnigma(transacao.enigmaEBCDIC, transacao.valorTransacao, transacao.nomePortador);

    const motivoRecusa = [];

    if (!dataValida) {
        motivoRecusa.push("Data inválida");
    }
    if (!cartaoValido) {
        motivoRecusa.push("Cartão Inválido");
    }
    if (!enigmaValido) {
        motivoRecusa.push("Enigma Inválido");
    }

    transacao.aprovada = motivoRecusa.length === 0;
    transacao.motivoRecusa = motivoRecusa.join("; ");
}

// Exibe todas as transações contidas na API com seu resultados após validação das regras
function exibirTransacoes (transacao){
    console.log("numeroCartao:", transacao.numeroCartao);
    console.log("nomePortador:", transacao.nomePortador);
    console.log("valorTransacao:", transacao.valorTransacao);
    console.log("dataHora:", transacao.dataHora);
    console.log("enigmaEBCDIC:", transacao.enigmaEBCDIC);
    console.log("StatusTransacao:", transacao.aprovada ? "APROVADA" : "REJEITADA")
    if (transacao.motivoRecusa){
        console.log("motivoRecusa:", transacao.motivoRecusa);
    }
    console.log("\n");
}

chamadaApi()

