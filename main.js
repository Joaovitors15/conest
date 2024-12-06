const { app, BrowserWindow, Menu, shell, ipcMain, dialog } = require('electron/main')
const path = require('node:path')

// Importação do módulo de conexão
const { dbConnect, desconectar } = require('./database.js')
// status de conexão com o banco. No MongoDB é mais eficiente manter uma única conexão aberta durante todo o tempo de vida do aplicativo e usá-la quando necessário. Fechar e reabrir constantemente a conexão aumenta a sobrecarga e reduz o desempenho do servidor.
// a variável abaixo é usada para garantir que o banco de dados inicie desconectado (evitar abrir outra instância)
let dbcon = null

//Importação do esquema clintes da camada model 
const clienteModel = require('./src/models/Clientes.js')

// Importação do schema Fornecedores da camada model
const fornecedorModel = require('./src/models/Fornecedores.js')

// Importação do schema Fornecedores da camada model
const produtosModel = require('./src/models/Produtos.js')


// janela principal
let win
function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    //Menu personaliazdo( comentar para debugar)
    //Menu.setApplicationMenu(Menu.buildFromTemplate(template))

    win.loadFile('./src/views/index.html')

    // botões
    ipcMain.on('open-client', () => {
        clientWindow()
    })

    ipcMain.on('open-supplier', () => {
        supplierWindow()
    })

    ipcMain.on('open-product', () => {
        productWindow()
    })

    ipcMain.on('open-report', () => {
        reportWindow()
    })
}

// Janela sobre
function aboutWindow() {
    const main = BrowserWindow.getFocusedWindow()
    let about
    if (main) {
        about = new BrowserWindow({
            width: 360,
            height: 215,
            autoHideMenuBar: true,
            resizable: false,
            minimizable: false,
            parent: main,
            modal: true,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js')
            }
        })
    }

    about.loadFile('./src/views/sobre.html')

    ipcMain.on('close-about', () => {
        if (about && !about.isDestroyed()) {
            about.close()
        }
    })
}

// Janela clientes
function clientWindow() {
    const main = BrowserWindow.getFocusedWindow()
    let client
    if (main) {
        client = new BrowserWindow({
            width: 800,
            height: 800,
            // autoHideMenuBar: true,
            parent: main,
            modal: true,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js')
            }
        })
    }
    client.loadFile('./src/views/clientes.html')
}

// Janela fornecedores
function supplierWindow() {
    const main = BrowserWindow.getFocusedWindow()
    let supplier
    if (main) {
        supplier = new BrowserWindow({
            width: 800,
            height: 800,
            autoHideMenuBar: true,
            parent: main,
            modal: true,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js')
            }
        })
    }
    supplier.loadFile('./src/views/fornecedores.html')
}

// Janela produtos
function productWindow() {
    const main = BrowserWindow.getFocusedWindow()
    let product
    if (main) {
        product = new BrowserWindow({
            width: 800,
            height: 800,
            autoHideMenuBar: true,
            parent: main,
            modal: true,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js')
            }
        })
    }
    product.loadFile('./src/views/produtos.html')
}

// Janela relatórios
function reportWindow() {
    const main = BrowserWindow.getFocusedWindow()
    let report
    if (main) {
        report = new BrowserWindow({
            width: 800,
            height: 800,
            autoHideMenuBar: true,
            parent: main,
            modal: true,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js')
            }
        })
    }
    report.loadFile('./src/views/relatorios.html')
}

app.whenReady().then(() => {
    createWindow()
    // Melhor local para estabelecer a conexão com o banco de dados
    // Importar antes o módulo de conexão no início do código

    // conexão com o banco
    ipcMain.on('db-connect', async (event, message) => {
        // a linha abaixo estabelece a conexão com o banco
        dbcon = await dbConnect()
        // enviar ao renderizador uma mensagem para trocar o ícone do status do banco de dados
        event.reply('db-message', "conectado")
    })

    // desconectar do banco ao encerrar a aplicação
    app.on('before-quit', async () => {
        await desconectar(dbcon)
    })

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

const template = [
    {
        label: 'Arquivo',
        submenu: [
            {
                type: 'separator'
            },
            {
                label: 'Sair',
                accelerator: 'Alt+F4',
                click: () => app.quit()
            }
        ]
    },

    {
        label: 'Zoom',
        submenu: [
            {
                label: 'Aplicar zoom',
                role: 'zoomIn'
            },
            {
                label: 'Reduzir',
                role: 'zoomOut'
            },
            {
                label: 'Restaurar o zoom padrão',
                role: 'resetZoom'
            }
        ]
    },
    {
        label: 'Ajuda',
        submenu: [
            {
                label: 'Repositório',
                click: () => shell.openExternal('https://github.com/volpini13/conest.git')
            },
            {
                label: 'Sobre',
                click: () => aboutWindow()
            }
        ]
    }
]
/****************************************/
/*************** Clientes ***************/
/****************************************/

//CRUD Create >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//Recebimento dos dados do formulário do cliente
ipcMain.on('new-client', async (event, cliente) => {
    //teste de recebimento dos dados  (Passo 2 - slide) Importante!
    console.log(cliente)

    //Passo 3 - slide (Cadastrar os dados no banco de dados)
    try {
        //Criar um novo objeto usando a classe modelo
        const novoCliente = new clienteModel({
            nomeCliente: cliente.nomeCli,
            foneCliente: cliente.foneCli,
            emailCliente: cliente.emailCli,
            cepCliente: cliente.cepCli,
            logradouroCliente: cliente.logradouroCli,
            bairroCliente: cliente.bairroCli,
            cidadeCliente: cliente.cidadeCli,
            ufCliente: cliente.ufCli,
            numeroCliente: cliente.numeroCli,
            complementoCliente: cliente.complementoCli

        })
        //A linha usa a biblioteca mogoose para salvar
        await novoCliente.save()

        //Confirmção de cliente adicionado no banco
        dialog.showMessageBox({
            type: 'info',
            title: "Aviso",
            message: "Cliente adicionado com sucesso",
            buttons: ['OK']
        })
        //Enviar uma resposta para o redenrizador resetar o form
        event.reply('reset-form')

    } catch (error) {
        console.log(error)
    }
})

// Fim do CRUD Create <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// CRUD Read >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
ipcMain.on('search-client', async(event, cliNome) => {
    // teste de recebimento do nome di cliente a ser pesquisado (passo 2)
    console.log(cliNome)
    // Passos 3 e 4 - Pesquisar no banco de dados o cliente pelo nome
    // find() -> Buscar no banco de dados (mongoose)
    // RegExp -> Filtro pelo nome do cliente 'i' insensitive (maiúsculo ou minúsculo)
    // Atenção: nomeCliente -> model | cliNome -> rendenizador
    try {
    const dadosCliente = await clienteModel.find({
        nomeCliente: new RegExp(cliNome, 'i')
    })  
    console.log(dadosCliente) // Teste dos passos 3 e 4 
    // Passo 5 - slide -> enviar os dados do  cliente para o rendenizador
    // Rendenizador (JSON.stringify converte para JSON)
    event.reply('client-data', JSON.stringify(dadosCliente))

    } catch (error) {
        console.log(error)
    }
})

// Fim do CRUD Read <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<



/********************************************/
/*************** Fornecedores ***************/
/********************************************/

//CRUD Create >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//Recebimento dos dados do formulário do fornecedor

ipcMain.on('new-supplier', async (event, fornecedores) => {
    //teste de recebimento dos dados  (Passo 2 - slide) Importante!
    console.log(fornecedores)

    //Passo 3 - slide (Cadastrar os dados no banco de dados)
    try {
        //Criar um novo objeto usando a classe modelo
        const novoFornecedores = new fornecedorModel({
            nomeFornecedores: fornecedores.nomeFor,
            foneFornecedores: fornecedores.foneFor,
            siteFornecedores: fornecedores.siteFor,
            cepFornecedores: fornecedores.cepFor,
            logradouroFornecedores: fornecedores.logradouroFor,
            bairroFornecedores: fornecedores.bairroFor,
            cidadeFornecedores: fornecedores.cidadeFor,
            ufFornecedores: fornecedores.ufFor,
            numeroFornecedores: fornecedores.numeroFor,
            complementoFornecedores: fornecedores.complementoFor

        })
        //A linha usa a biblioteca mogoose para salvar
        await novoFornecedores.save()

        //Confirmção de cliente adicionado no banco
        dialog.showMessageBox({
            type: 'info',
            title: "Aviso",
            message: "Fornecedores adicionado com sucesso",
            buttons: ['OK']
        })
        //Enviar uma resposta para o redenrizador resetar o form
        event.reply('reset-form')

    } catch (error) {
        console.log(error)
    }
})
// Fim do CRUD Create <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// CRUD Read >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
ipcMain.on('search-supplier', async(event, forNome) => {
    // teste de recebimento do nome di cliente a ser pesquisado (passo 2)
    console.log(forNome)
    // Passos 3 e 4 - Pesquisar no banco de dados o cliente pelo nome
    // find() -> Buscar no banco de dados (mongoose)
    // RegExp -> Filtro pelo nome do cliente 'i' insensitive (maiúsculo ou minúsculo)
    // Atenção: nomeCliente -> model | cliNome -> rendenizador
    try {
    const dadosFornecedores= await fornecedorModel.find({
        nomeFornecedores: new RegExp(forNome, 'i')
    })  
    console.log(dadosFornecedores) // Teste dos passos 3 e 4 
    // Passo 5 - slide -> enviar os dados do  cliente para o rendenizador
    // Rendenizador (JSON.stringify converte para JSON)
    event.reply('supplier-data', JSON.stringify(dadosFornecedores))

    } catch (error) {
        console.log(error)
    }
})

// Fim do CRUD Read <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

    */*******************************************/
    /*************** Produtos *******************/
    /********************************************/

    ipcMain.on('new-product', async (event, produtos) => {
        //teste de recebimento dos dados  (Passo 2 - slide) Importante!
        console.log(produtos)

        //Passo 3 - slide (Cadastrar os dados no banco de dados)
        try {
            //Criar um novo objeto usando a classe modelo
            const novoProdutos = new produtosModel({
                nomeProdutos: produtos.nomePro,
                precoProdutos: produtos.precoPro,
                codigoProdutos: produtos.codigoPro
            })
            //A linha usa a biblioteca mogoose para salvar
            await novoProdutos.save()

            //Confirmção de cliente adicionado no banco
            dialog.showMessageBox({
                type: 'info',
                title: "Aviso",
                message: "Produtos adicionado com sucesso",
                buttons: ['OK']
            })
            //Enviar uma resposta para o redenrizador resetar o form
            event.reply('reset-form')

        } catch (error) {
            console.log(error)
        }
    })

    ipcMain.on('new-product', async (event, produtos) => {
        //teste de recebimento dos dados  (Passo 2 - slide) Importante!
        console.log(produtos)

        //Passo 3 - slide (Cadastrar os dados no banco de dados)
        try {
            //Criar um novo objeto usando a classe modelo
            const novoProdutos = new produtosModel({
                nomeProdutos: produtos.nomePro,
                precoProdutos: produtos.precoPro,
                codigoProdutos: produtos.codigoPro
            })
            //A linha usa a biblioteca mogoose para salvar
            await novoProdutos.save()

            //Confirmção de cliente adicionado no banco
            dialog.showMessageBox({
                type: 'info',
                title: "Aviso",
                message: "Produtos adicionado com sucesso",
                buttons: ['OK']
            })
            //Enviar uma resposta para o redenrizador resetar o form
            event.reply('reset-form')

        } catch (error) {
            console.log(error)
        }
    })

// CRUD Read >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
ipcMain.on('search-product', async (event, proNome) => {
    // teste de recebimento do nome di cliente a ser pesquisado (passo 2)
    console.log(proNome)
    // Passos 3 e 4 - Pesquisar no banco de dados o cliente pelo nome
    // find() -> Buscar no banco de dados (mongoose)
    // RegExp -> Filtro pelo nome do cliente 'i' insensitive (maiúsculo ou minúsculo)
    // Atenção: nomeCliente -> model | cliNome -> rendenizador
    try {
        const dadosProdutos = await produtosModel.find({
            nomeProdutos: new RegExp(proNome, 'i')
        })
        console.log(dadosProdutos) // Teste dos passos 3 e 4 
        // Passo 5 - slide -> enviar os dados do  cliente para o rendenizador
        // Rendenizador (JSON.stringify converte para JSON)
        event.reply('product-data', JSON.stringify(dadosProdutos))

    } catch (error) {
        console.log(error)
    }
})
// CRUD Read >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
ipcMain.on('search-codigo', async (event, proCodigo) => {
    // teste de recebimento do nome di cliente a ser pesquisado (passo 2)
    console.log(proCodigo)
    // Passos 3 e 4 - Pesquisar no banco de dados o cliente pelo nome
    // find() -> Buscar no banco de dados (mongoose)
    // RegExp -> Filtro pelo nome do cliente 'i' insensitive (maiúsculo ou minúsculo)
    // Atenção: nomeCliente -> model | cliNome -> rendenizador
    try {
        const dadosProdutos = await produtosModel.find({
            codigoProdutos: new RegExp(proCodigo, 'i')
        })
        console.log(dadosProdutos) // Teste dos passos 3 e 4 
        // Passo 5 - slide -> enviar os dados do  cliente para o rendenizador
        // Rendenizador (JSON.stringify converte para JSON)
        event.reply('codigo-data', JSON.stringify(dadosProdutos))

    } catch (error) {
        console.log(error)
    }
})