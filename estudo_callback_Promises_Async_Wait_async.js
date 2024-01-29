// Um código é considerado assincrono quando leva um tempo para ser executado e poder ter a sua chamada bem sucedida ou não, exemplo: Requisições em API's e interações com banco de dados.

// Um código é considerado síncrono quando as operações são executadas em sequência, aguardando cada operação ser concluída antes de iniciar a próxima.

/* Temos 3 formas de lidar com códigos assincronos, são eles: 

// No javascript não necessáriamente um trecho do código será executado na sequencia, pois um trecho pode ter um tempo de resposta maior (ASSINCRONO), então o Javascript executará os passos seguintes e depois retornar no trecho que precisou de um tempo especifico de execução 

Callback: é uma função que é passada não para ser executada de imediato, más sim após um tempo estabelecido, ou seja, a função só é executada após a conclusão de uma operação assincrona ou após um determinado evento ocorrer. */

//Promises:

//Async/await:

//Vamos utilizar o filesystem para exemplicar como funciona esse caso. (File System) é usado para interagir com o sistema de arquivos do computador. Ele fornece métodos para ler e escrever arquivos, manipular diretórios, alterar permissões de arquivos e realizar outras operações relacionadas ao sistema de arquivos (De forma assincrona)

// Sintaxe do fs: const fs = require('fs'); (Para importa-lo.)

const { isUtf8 } = require('buffer');
const fs = require('fs')

function callback (erro, dados){
    if (erro) {
        console.error('Não conseguimos ler o arquivo, retornou o seguinte erro: ', erro)
    } else {
        console.log ('O conteúdo do arquivo é: ', String(dados))
    }
}

console.log(1); // execuções sincronas

fs.readFile('./arquivo1.txt', callback)

console.log(2);

console.log(3);

console.log(4);

// Como é possivel verificar, o código é executado e as funções sincronas console.log(1) 2 e 3 são executadas normalmente em sequencia, já a leitura do arquivo através do filesystem (fs.readfile) é execultado no final do processo, devido callback utilizado, o callback faz com que aquele trecho do código tenha somente sua execução concluida após a função receber o retorno da chamada. 
