
Feature: Efetuar contas
    Como um usuário da plataforma de contas do Henrique
    Eu quero conseguir efetuar contas matematicas
    Para saber o resultado

Scenario: Efetuar conta de multiplicação
    Given que eu estou logado na plataforma
    And acesso a função de efetuar multiplicação
    When eu seleciono primeiro o número 2 
    And depois o número 3
    And depois seleciono a opção de multiplicar
    Then a plataforma deve me retornar o resultado da multiplicação que é igual a 6
