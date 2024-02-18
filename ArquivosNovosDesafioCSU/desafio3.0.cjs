api = "https://desafiotecnico314159265.free.beeceptor.com";
const { isValid, parseISO } = require("date-fns");
const EBCDIC = require("ebcdic-ascii").default;
const converter = new EBCDIC('0037');


async function callApi() {
    try {
    const response = await fetch(api, {
        method: 'GET',
        headers:{
            "Content-Type":"application.json" 
        }
    });
    const data = await response.json();
    const transactions = data.transacoes;

    transactions.forEach (transaction => {
        const dateTimeTransaction = validateDateTime(transaction.dataHora);
        const cardNumberTransaction = validateCardNumber(transaction.numeroCartao);
        const puzzleTransaction = validatePuzzleEBCDIC(transaction.enigmaEBCDIC, transaction.nomePortador, transaction.valorTransacao)
        let motivoRecusa = "";

        if (!dateTimeTransaction) {
            motivoRecusa += "A data da transação é inválida; "
        }
        if (!cardNumberTransaction){
            motivoRecusa += "A soma dos digitos finais do cartão não resulta em 11; "
        } 
        if (!puzzleTransaction){
            motivoRecusa += "Enigma EBCDIC inválido; "
        }

        transaction.aprovada = dateTimeTransaction && cardNumberTransaction && puzzleTransaction;
        transaction.motivoRecusa = motivoRecusa;
    });

    transactions.forEach (transaction => {
        console.log("numeroCartao: ", transaction.numeroCartao);
        console.log("nomePortador: ", transaction.nomePortador);
        console.log("valorTransacao: ", transaction.valorTransacao);
        console.log("dataHora: ", transaction.dataHora);
        console.log("enigmaEBCDIC: ", transaction.enigmaEBCDIC);
        console.log("StatusTransação: ", transaction.aprovada ? "APROVADA" : "REJEITADA");
        if (transaction.motivoRecusa) {
            console.log("Motivo recusa: ", transaction.motivoRecusa);
        }
        console.log("\n")
    });
    } catch {
        console.log("Erro ao chamar API")
    } 
};

function validateDateTime (dateTime) {
    const dateTimeFormart = parseISO(dateTime);
    return isValid(dateTimeFormart);
};

function validateCardNumber (cardNumber) {
    const cardFormart = converter.toASCII(cardNumber);
    const twoNumbers = cardFormart.slice(-2)
    const numberOne = parseInt(twoNumbers[0]);
    const numberTwo = parseInt(twoNumbers[1]);
    const addition = numberOne + numberTwo;
    return addition === 11;
};


function validatePuzzleEBCDIC (puzzleEBCDIC, nameBearer, valueTransaction) {
    let puzzleFormart;

    try {
        puzzleFormart = converter.toASCII(puzzleEBCDIC);
    } catch {
        puzzleFormart = "Inválido"
    }
    
    const separeteName = nameBearer.split(" ");
    const firstName = separeteName[0];
    const valueTransactionApi = valueTransaction.toFixed(2);
    const valueNoPoint = valueTransactionApi.replace(".", "").toString();
    const valueAndName = valueNoPoint + firstName;
    return puzzleFormart === valueAndName;   
}

callApi()