module.exports = {
    testEnvironment: 'node', // O ambiente de teste (pode ser "jsdom" para testes no navegador)
    moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx', 'node'], // Extensões de arquivo que Jest deve reconhecer
    testMatch: ['**/__tests__/**/*.js?(x)', '**/?(*.)+(spec|test).js?(x)'], // Padrões de arquivo de teste que Jest deve procurar
  };