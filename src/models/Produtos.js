/**
 * Modelo de dados (Produtos)
 */

// Importação de bibliotecas
const { model, Schema } = require('mongoose')

// Criação da estrutura de dados ("tabela") que será usada no banco
const produtoSchema = new Schema({
    barcodeProduto: {
        type: String,
        unique: true,
        index: true
    },
    nomeProduto: {
        type: String
    },
    caminhoImagemProduto: {
        type: String
    },
    dataCadastro: {
        type: Date,
        default: Date.now
    },
    precoProduto: {
        type: String
    },
    fornecedorProduto: { // Novo campo: fornecedor
        type: String
    },
    quantidadeProduto: { // Novo campo: quantidade
        type: String,
        default: 0
    },
    unidadeProduto: {   // Novo campo: unidade (ex.: un, kg, litro)
        type: String
    },
    valorUnitarioProduto: { // Novo campo: valor unitário
        type: String,
        default: 0
    }
}, { versionKey: false })

// Exportar para o main.js
// Para modificar o nome da coleção ("tabela"), basta modificar na linha abaixo o rótulo 'Produtos', sempre iniciando com a letra maiuscula
module.exports = model('Produtos', produtoSchema)