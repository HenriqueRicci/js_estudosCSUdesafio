const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');

let usuarioLogado = false;
let multiplicacao = false;

Given('que eu estou logado na plataforma', function () {
  usuarioLogado = true;
});

Given('acesso a função de efetuar multiplicação', function () {
  multiplicacao = true;
});

When('eu seleciono primeiro o número {int}', function (int) {
  this.numeroUm = int;
});

When('depois o número {int}', function (int) {
  this.numeroDois = int;
});

When('depois seleciono a opção de multiplicar', function () {
  this.multiplicar = this.numeroUm * this.numeroDois;
});

Then('a plataforma deve me retornar o resultado da multiplicação que é igual a {int}', function (resultadoEsperado) {
  assert.strictEqual(this.multiplicar, resultadoEsperado);
});
