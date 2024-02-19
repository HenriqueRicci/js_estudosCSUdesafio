const apiCsu = 'https://run.mocky.io/v3/c1db645f-1e3e-4dce-add5-62f6657f1df6';
//import EBCDIC from "ebcdic-ascii"
const EBCDIC = require("ebcdic-ascii").default


async function dadosApi () {
    try {
    const response = await fetch(apiCsu, {
        method: 'GET',
        headers: {
            'Content-type': 'application.json'
        }
    });
    const date = await response.json();
    const transacoes = date.transacoes;

    await transacoes.forEach(transacao => {
            const dataTransacao = validateDate(transacao.dataHora);
            const cardTransacao = validateCardNumber(transacao.numeroCartao);
            const enigmaApiTransacao = enigmaApi(transacao.enigmaEBCDIC)
            const enigmaValorNome = enigmaValueName(transacao.nomePortador, transacao.valorTransacao)

            let motivoRecusa = "";

            if (!dataTransacao){
                motivoRecusa += "Data inválida: ";
            }
            if (!cardTransacao) {
                motivoRecusa += "Soma dos dígitos finais do cartão não resulta em 11; ";
            }
            if (enigmaApiTransacao === "Inválido") {
                motivoRecusa += "Erro na conversão EBCDIC para ASCII; ";
            }
            if (enigmaValorNome !== enigmaApiTransacao) {
                motivoRecusa += "Valores EBCDIC não correspondem; ";
            }
    
            transacao.aprovada = dataTransacao && cardTransacao && enigmaApiTransacao !== "Inválido" && enigmaValorNome === enigmaApiTransacao;
            transacao.motivoRecusa = motivoRecusa;

    });

    transacoes.forEach(transacao => {
        console.log("Número do cartão: ", transacao.numeroCartao);
        console.log("Nome do portador: ", transacao.nomePortador);
        console.log("Valor da transação: ", transacao.valorTransacao);
        console.log("Data da transação: ", transacao.dataHora);
        console.log("Transação aprovada: ", transacao.aprovada ? "Sim" : "Não");
        console.log("Motivo da recusa: ", transacao.motivoRecusa || "");
        console.log("\n");
    });
    } catch {
        console.log("Erro ao chamar API")
    }
}

function validateDate(dataApi) {
    
    // Formatando a data retornada da API para um Objeto de tipo DATE e trabalhando no mesmo para deixar no formato dd/mm/yyyy
    const data = new Date(dataApi);
    const dia = data.getDate().toString().padStart(2, '0');
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    const ano = data.getFullYear().toString().padStart(2, '0');
    const dataFormatada = `${dia}/${mes}/${ano}`;

    // Verificando se a string possui o formato correto de data (dd/mm/yyyy)
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dataFormatada)){
        return `A data de ${dataFormatada} é invalida`;
    }

    // Divide a string em partes
    const partesData = dataFormatada.split('/');
    const diaFormatado = parseInt(partesData[0]);
    const mesFormatado = parseInt(partesData[1]);
    const anoFormatado = parseInt(partesData[2]);

    // Dias de cada mês, incluindo ajuste para ano bissexto
    const diasNoMes = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    // Atualiza os dias do mês de fevereiro para ano bisexto
    if (anoFormatado % 400 === 0 || (anoFormatado % 4 === 0 && anoFormatado % 100 !== 0)) {
        diasNoMes[2] = 29;
    }

    // Regras de validação
    if (mesFormatado < 1 || mesFormatado > 12 || diaFormatado < 1) {
        return false //`A data de ${dataFormatada} é invalida`;
    } else if (diaFormatado > diasNoMes[mesFormatado]) {
        return false //`A data de ${dataFormatada} é invalida`;
    }

    // Passou nas validações
    return  true //`A data de ${dataFormatada} é valida`;
}

function validateCardNumber (cardNumber) {
    const converter = new EBCDIC("0037");
    let cardFormart = converter.toASCII(cardNumber);
    const twoNumbers = cardFormart.slice(-2);
    const digitOne = parseInt(twoNumbers.charAt(0));
    const digitTwo = parseInt(twoNumbers.charAt(1));
    const soma = digitOne + digitTwo;

    return soma === 11;
}

function enigmaValueName(nomeUsuario, valorTransacao) {
    const separarNome = nomeUsuario.split(" ");
    const primeiroNome = separarNome[0];
    const valorFormatado = valorTransacao.toFixed(2); 
    const valorSemPonto = valorFormatado.replace(".", "");
    const enigmaCompra = valorSemPonto + primeiroNome;
    return enigmaCompra;
} 

function enigmaApi (enigma) {
    const converter = new EBCDIC('0037');
    try {
        const enigmaConvertido = converter.toASCII(enigma);
        return enigmaConvertido;
    } catch {
        return "Inválido";
    }
}

dadosApi ()

