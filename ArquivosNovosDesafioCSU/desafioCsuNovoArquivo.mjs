
const apiCsu = 'https://run.mocky.io/v3/c1db645f-1e3e-4dce-add5-62f6657f1df6';


async function apiData () {
    const response = await fetch (apiCsu, {
        method: 'GET',
        headers: {
            'Content-type': 'application.json'
        }
    })
    const data = await response.json();
    const transacoes = data.transacoes;

    transacoes.forEach(transacao => {
        const dataFormatada = formatarData(transacao.dataHora)
        const cartaoFormatada = formatarCartao(transacao.numeroCartao)
        console.log(dataFormatada)
        console.log(cartaoFormatada)
    })
 } 
    // função criada para validar a data
    function formatarData(dataHora) {
    const data = new Date(dataHora);
    const dia = data.getDate().toString().padStart(2, '0');
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
}   // Função criada para validar se a data é valida após formatação (Função pega pronta)
    function validaData (valor) {
    // Verifica se a entrada é uma string
    if (typeof valor !== 'string') {
      return false
    }
  
    // Verifica formado da data
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(valor)) {
      return false
    }
  
    // Divide a data para o objeto "data"
    const partesData = valor.split('/')
    const data = { 
      dia: partesData[0], 
      mes: partesData[1], 
      ano: partesData[2] 
    }
    
    // Converte strings em número
    const dia = parseInt(data.dia)
    const mes = parseInt(data.mes)
    const ano = parseInt(data.ano)
    
    // Dias de cada mês, incluindo ajuste para ano bissexto
    const diasNoMes = [ 0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ]
  
    // Atualiza os dias do mês de fevereiro para ano bisexto
    if (ano % 400 === 0 || ano % 4 === 0 && ano % 100 !== 0) {
      diasNoMes[2] = 29
    }
    
    // Regras de validação:
    // Mês deve estar entre 1 e 12, e o dia deve ser maior que zero
    if (mes < 1 || mes > 12 || dia < 1) {
      return false
    }
    // Valida número de dias do mês
    else if (dia > diasNoMes[mes]) {
      return false
    }
    
    // Passou nas validações
    return true
  } 
    // Etapa onde parei, tentando converter os dados da tabela hexadecimal
    function formatarCartao (cartao) {
        const asciiCartao = toASCII(cartao)
        return asciiCartao
    }

  apiData()