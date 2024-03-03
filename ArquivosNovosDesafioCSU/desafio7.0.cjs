const api = "https://run.mocky.io/v3/c1db645f-1e3e-4dce-add5-62f6657f1df6";
const { parseISO, isValid } = require("date-fns");
const EBCDIC = require("ebcdic-ascii").default
const converter = new EBCDIC("0037")

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
        exibirTransacoes(transacao)
    })
}



// Função criada para validar se a data e a hora da transação retornada na api é valida
// Para isso, utilizei uma bibloteca que o javascript possui (DATE-FNS), essa bibloteca possui diversas formas de trabalhar com datas, sejam formata-las ou validar se são validas
function validarDataHora(dataEHora) {
    const dataTransacao = parseISO(dataEHora); // parseISO conforme a biblioteca date-fns, análise a string em formato ISO e a converte em um objetivo do tipo DATE
    return isValid(dataTransacao); // uma fez com a data em um objeto DATE, podemos utilizar o isValid da mesma bibiloteca para validar se o DATE é valido
}

// função criada para validar se os dois números finais do cartão da transação somados resultam em 11 (11 = cartão valido)
// Para isso, utilizei a bibloteca do JS ebcdic-ascii, pois o número do cartão retornado na API está em EBCDIC, e precisamos converter para ASCII para o cartão ficar no formato que conhecemos.
function validarFinalCartao(numeroCartao) {
    const cartaoConvertido = converter.toASCII(numeroCartao); // Usando a biblioteca ebcdic-ascii para converter para ASCII o número do cartão retornado da API, que hoje está em EBCDIC
    const finalCartao = cartaoConvertido.slice(-2); // Utilizei o slice para pegar os dois ultimos caracteres da string, ou seja os dois números finais do cartão
    const numero1 = parseInt(finalCartao[0]); // pegando a string que está na posição 0, ou seja, o penultimo número do cartão
    const numero2 = parseInt(finalCartao[1]); 
    const soma = numero1 + numero2;
    return soma === 11;
}

function validarEnigmaEBCDIC(enigmaEBCDIC, nomePortador, valorTransacao) {
    //
    const valorDecimal = valorTransacao.toFixed(2);
    const valorSemPonto = valorDecimal.replace(".", "")
    //
    const separarNome = nomePortador.split(" ");
    const primeiroNome = separarNome[0];
    const valorNome = valorSemPonto + primeiroNome;
    //
    let enigmaConvertido; 
    try {
        enigmaConvertido = converter.toASCII(enigmaEBCDIC);
    } catch {
        enigmaConvertido = "Inválido"
    }
    //
    return valorNome === enigmaConvertido;
}

function validarTransacoes(transacao) {
        const dataHoraValida = validarDataHora(transacao.dataHora);
        const validarCartao = validarFinalCartao(transacao.numeroCartao);
        const validarEnigma = validarEnigmaEBCDIC(transacao.enigmaEBCDIC, transacao.nomePortador, transacao.valorTransacao);
        const motivoRecusa = [];

        if (!dataHoraValida) {
            motivoRecusa.push("Data inválida");
        }
        if (!validarCartao) {
            motivoRecusa.push("Cartão inválido");
        }
        if (!validarEnigma) {
            motivoRecusa.push("EnigmaEBCDIC inválido");
        }
        

        transacao.aprovada = motivoRecusa.length === 0;
        transacao.motivoRecusa = motivoRecusa.join("; ");
}

function exibirTransacoes(transacao) {
        console.log("numeroCartao:", transacao.numeroCartao);
        console.log("nomePortador:", transacao.nomePortador);
        console.log("valorTransacao:", transacao.valorTransacao);
        console.log("dataHora:", transacao.dataHora);
        console.log("enigmaEBCDIC:", transacao.enigmaEBCDIC);
        console.log("statusTransacao:", transacao.aprovada ? "APROVADA" : "REJEITADA");
        if (transacao.motivoRecusa) {
            console.log("motivoRecusa:", transacao.motivoRecusa)
        }
        console.log("\n")
}


chamadaApi()