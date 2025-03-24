/**
 * Modelo de dados (Clientes)
 */

//importação de bibliotecas
const { model, Schema } = require('mongoose')

//criação da estrutura de dados ("tabela") que será usada no banco
const clienteSchema = new Schema({
    nomeCliente: {
        type: String
    },
    cpfCliente: {
        type: String,
        unique: true,
        index: true
    },
    foneCliente: {
        type: String
    },
    emailCliente: {
        type: String
    },
    cepCliente: {
        type: String
    },
    cidadeCliente: {
        type: String
    },
    estadoCliente: {
        type: String
    },
    enderecoCliente: {
        type: String
    },
    numeroCliente: {
        type: String
    },
    complementoCliente: {
        type: String
    },
    bairroCliente: {
        type: String
    }
}, { versionKey: false })

// exportar para o main
// Para modificar o nome da coleção ("tabela"), basta modificar na linha abaixo o rótulo 'Clientes', sempre iniciando com letra maiúscula
module.exports = model('Clientes', clienteSchema)