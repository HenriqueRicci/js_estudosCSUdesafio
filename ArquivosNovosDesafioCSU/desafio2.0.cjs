const api =  "https://desafiotecnico314159265.free.beeceptor.com";
const EBCDIC = require("ebcdic-ascii").default;
const { isValid, parseISO } = require("date-fns");


async function callApi () {
    const response = await fetch(api, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        }
    });
    const data = await response.json();
    const transactions = data.transacoes;
    console.log(transactions)
}


function validateCard (cardNumber){
    const converter = new EBCDIC("0037");
    const cardFormat = converter.toASCII(cardNumber);
    const lastDigits = cardFormat.slice(-2);
    const numberOne = parseInt(lastDigits.charAt(0));
    const numberTwo = parseInt(lastDigits.charAt(1));
    const soma = numberOne + numberTwo;
    return soma === 11;
}

function validateDate (dateApi) {
    const date = parseISO(dateApi);
    return isValid(date);
}

function puzzleApi (enigmaEBCDIC, valueTransaction, nameBearer){
    const converter = new EBCDIC("0037");
    let enigmaASCII;
    
    try {
        enigmaASCII = converter.toASCII(enigmaEBCDIC);
    }   catch (error) {
        enigmaASCII = "invalido"
    }

    const name = nameBearer.split(" ");
    const firstName = name[0];
    const value = valueTransaction.toFixed(2);
    const valueFormart = value.replace(".", "");
    const transactionEBCDIC = valueFormart + firstName
    return transactionEBCDIC === enigmaASCII
}

