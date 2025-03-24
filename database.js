/**
 * Modulo de Conexão com o Banco de Dados
 * Uso do Mongoose
 */

const mongoose = require('mongoose')

// Definir a URL e autenticação do banco de dados (acrescentar ao final da URL um nome para o banco de dados)
const url = 'mongodb+srv://admin:123senac@clusterconest.vzemu.mongodb.net/dbconest'

// Status de Conexão (Icone de Conexão)
let conectado = false

const conectar = async () => {
    // Só estabelecer uma conexão se não estiver conectado.
    if (!conectado) {
        try {
            // A linha abaixo abre a conexão com o MongoDB.
            await mongoose.connect(url)
            conectado = true // Sinalizar que o banco está conectado
            console.log("MongoDB conectado")
        } catch (error) {
            console.log(`Erro ao conectar ao MongoDB: ${error}`)
        }
    }
}

// Desconectar
const desconectar = async () => {
    if (conectado) {
        try {
            // A linha abaixo encerra a conexão com o MongoDB.
            await mongoose.disconnect(url)
            conectado = false // Sinalizar que o banco não está conectado.
            console.log("MongoDB desconectado")
        } catch (error) {
            console.log(`Erro ao desconectar do MongoDB: ${error}`)
        }
    }
}

// Exportar para o main.js as funções desejadas.
module.exports = { conectar, desconectar }