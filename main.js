/**
 * Processo principal
 */

const { app, BrowserWindow, nativeTheme, Menu, shell, ipcMain, dialog, globalShortcut } = require('electron/main')
const path = require('node:path')

// Importação do módulo de conexão.
const { conectar, desconectar } = require('./database.js')

// Importação do Schema Clientes da camada model.
const clienteModel = require('./src/models/Clientes.js')

// Importação do Schema Fornecedores da camada model.
const fornecedorModel = require('./src/models/Fornecedores.js')

// Importação do Schema Produtos da camada model.
const produtoModel = require('./src/models/Produtos')

// Importar biblioteca nativa do JS para manipular arquivos.
const fs = require('fs')

// Importar a biblioteca jspdf (instalar antes usando o npm i jspdf).
const { jspdf, default: jsPDF } = require('jspdf')

// Janela principal
let win
function createWindow() {
    nativeTheme.themeSource = 'dark'
    win = new BrowserWindow({
        width: 1280,
        height: 720,
        resizable: false, // Impede redimensionamento
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })
    // Menu personalizado
    Menu.setApplicationMenu(Menu.buildFromTemplate(template))

    win.loadFile('./src/views/index.html')

    // Botões
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
    let about
    nativeTheme.themeSource = 'dark'
    const main = BrowserWindow.getFocusedWindow()
    if (main) {
        about = new BrowserWindow({
            width: 854,  // Largura
            height: 480,  // Altura
            autoHideMenuBar: true,
            resizable: false, // Impede redimensionamento
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
        console.log("Recebi a mensagem close-about")
        if (about && !about.isDestroyed()) {
            about.close()
        }
    })
}

// Janela clientes
let client
function clientWindow() {
    nativeTheme.themeSource = 'dark'
    const main = BrowserWindow.getFocusedWindow()
    if (main) {
        client = new BrowserWindow({
            width: 1280,
            height: 720,
            resizable: false, // Impede redimensionamento.
            autoHideMenuBar: true,
            parent: main,
            modal: true,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js')
            }
        })
    }
    client.maximize() // Tela cheia.

    client.loadFile('./src/views/clientes.html')
}

// Janela fornecedores
let supplier
function supplierWindow() {
    nativeTheme.themeSource = 'dark'
    const main = BrowserWindow.getFocusedWindow()
    if (main) {
        supplier = new BrowserWindow({
            width: 1280,
            height: 720,
            resizable: false, // Impede redimensionamento.
            autoHideMenuBar: true,
            parent: main,
            modal: true,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js')
            }
        })
    }
    supplier.maximize() // Tela cheia.

    supplier.loadFile('./src/views/fornecedores.html')
}

// Janela produtos
let product
function productWindow() {
    nativeTheme.themeSource = 'dark'
    const main = BrowserWindow.getFocusedWindow()
    if (main) {
        product = new BrowserWindow({
            width: 1280,
            height: 720,
            resizable: false, // Impede redimensionamento.
            autoHideMenuBar: true,
            parent: main,
            modal: true,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js')
            }
        })
    }
    product.maximize() // Tela cheia.

    product.loadFile('./src/views/produtos.html')
}

// Janela relatórios
let report
function reportWindow() {
    nativeTheme.themeSource = 'dark'
    const main = BrowserWindow.getFocusedWindow()
    if (main) {
        report = new BrowserWindow({
            width: 1280,
            height: 720,
            resizable: false, // Impede redimensionamento.
            autoHideMenuBar: true,
            parent: main,
            modal: true,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js')
            }
        })
    }
    report.maximize() // Tela cheia.

    report.loadFile('./src/views/relatorios.html')
}

app.whenReady().then(() => {
    //Registrar atalho global para devtools em qualquer janela ativa
    globalShortcut.register('Ctrl+Shift+I', () => {
        const tools = BrowserWindow.getFocusedWindow()
        if (tools) {
            tools.webContents.openDevTools()
        }
    })

    // Desregistrar atalho globais antes de sair
    app.on('will-quit', () => {
        globalShortcut.unregisterAll()
    })

    createWindow()
    // Melhor local para estabelecer a conexão com o banco de dados
    // Importar antes o módulo de conexão no início do código
    // No MongoDB é mais eficiente manter uma única conexão aberta durante todo o tempo de vida do aplicativo e usá-la quando necessário. Fechar e reabrir constantemente a conexão aumenta a sobrecarga e reduz o desempenho do servidor.
    // Conexão com o banco ao iniciar a aplicação
    ipcMain.on('db-connect', async (event) => {
        // A linha abaixo estabelece a conexão com o banco de dados
        await conectar()
        // Enviar ao renderizador uma mensagem para trocar o ícone status do banco de dados (delay de 0.5s para sincronizar).
        setTimeout(() => {
            event.reply('db-message', "conectado")
        }, 500) // 1000ms = 1s
    })

    // Desconectar do banco de dados ao encerrar a aplicação
    app.on('before-quit', async () => {
        await desconectar()
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

// Reduzir logs não críticos (mensagens no console quando executar Devtools).
app.commandLine.appendSwitch('log-level', '3')

const template = [
    {
        label: 'Cadastro',
        submenu: [
            {
                label: 'Clientes',
                click: () => clientWindow()
            },
            {
                label: 'Fornecedores',
                click: () => supplierWindow()
            },
            {
                label: 'Produtos',
                click: () => productWindow()
            },
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
        label: 'Relatórios',
        submenu: [
            {
                label: 'Clientes',
                click: () => gerarRelatorioClientes()
            },
            {
                label: 'Fornecedores',
                click: () => gerarRelatorioFornecedores()
            },
            {
                label: 'Produtos',
                click: () => gerarRelatorioProdutos()
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
            },
        ]
    },
    {
        label: 'Ajuda',
        submenu: [
            {
                label: 'Repositório',
                click: () => shell.openExternal('https://github.com/emmanuel-lacerd4/conest')
            },
            {
                label: 'Sobre',
                click: () => aboutWindow()
            }
        ]
    }
]
/***********************************************/
/****************** Validações *****************/
/***********************************************/

// Aviso para buscas em campo vazio.
ipcMain.on('dialog-search', () => {
    dialog.showMessageBox({
        type: 'warning',
        title: 'Atenção!',
        message: 'Preencha o campo de busca.',
        buttons: ['OK']
    })
})

/***********************************************/
/****************** Clientes *******************/
/***********************************************/

// Informação (pop-up) ao abrir a janela.
ipcMain.on('notice-client', () => {
    dialog.showMessageBox({
        type: 'info',
        title: "Atenção!",
        message: "Pesquise um cliente antes de continuar.",
        buttons: ['OK']
    })
})

// CRUD Create >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// Recebimento dos dados de formulário clientes.
ipcMain.on('new-client', async (event, cliente) => {
    console.log(cliente)
    try {
        const novoCliente = new clienteModel({
            nomeCliente: cliente.nomeCli,
            cpfCliente: cliente.cpfCli,
            foneCliente: cliente.foneCli,
            emailCliente: cliente.emailCli,
            cepCliente: cliente.cepCli,
            cidadeCliente: cliente.cidadeCli,
            estadoCliente: cliente.estadoCli,
            enderecoCliente: cliente.enderecoCli,
            numeroCliente: cliente.numeroCli,
            complementoCliente: cliente.complementoCli,
            bairroCliente: cliente.bairroCli
        })
        await novoCliente.save()
        dialog.showMessageBox({
            type: 'info',
            title: "Aviso",
            message: "Cliente cadastrado com sucesso!",
            buttons: ['OK']
        }).then((result) => {
            if (result.response === 0) {
                event.reply('reset-form')
            }
        })
    } catch (error) {
        if (error.code === 11000) {
            dialog.showMessageBox({
                type: 'error',
                title: "Atenção!",
                message: "O CPF já está cadastrado.\nVerifique se digitou corretamente.",
                buttons: ['OK']
            }).then((result) => {
                if (result.response === 0) {
                    event.reply('clear-cpf') // Novo evento para limpar e focar o CPF
                }
            })
        } else {
            console.log(error)
        }
    }
})
// Fim do CRUD Create <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// CRUD Read >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
ipcMain.on('search-client', async (event, cliNome) => {
    // Teste de recebimento do nome do cliente a ser pesquisado(passo 2).
    console.log(cliNome)
    //Passos 3 e 4 - Pesquisar no banco de dados o cliente pelo nome.
    // find() -> buscar no banco de dados (mongoose).
    // RegExp -> filtro pelo nome do cliente 'i' insensitive (maiúsculo ou minúsculo).
    // Atenção: nomeCliente -> model | cliNome -> renderizador.
    try {
        const dadosCliente = await clienteModel.find({
            nomeCliente: new RegExp(cliNome, 'i')
        })
        console.log(dadosCliente) // Teste dos passos 3 e 4.
        // Passo 5 - slide -> enviar os dados do cliente para o renderizador (JSON.stringfy converte para JSON).

        // Melhoria na experiência do usuário (se não existir o cliente cadstrado, enviar mensagem e questionar se o usuário deseja cadastrar um novo cliente).
        if (dadosCliente.length === 0) {
            dialog.showMessageBox({
                type: 'warning',
                title: 'Clientes',
                message: 'Cliente não cadastrado.\nDeseja cadastrar este cliente?',
                defaultId: 0,
                buttons: ['Sim', 'Não']
            }).then((result) => {
                console.log(result)
                if (result.response === 0) {
                    // Enviar ao renderizador um pedido para setar o nome do cliente (trazendo do campo de busca) e liberar o botão adicionar.
                    event.reply('set-nameClient')
                } else {
                    // Enviar ao renderizador um pedido para limpar os campos do formulário.
                    event.reply('reset-form')
                }
            })
        }
        event.reply('client-data', JSON.stringify(dadosCliente))
    } catch (error) {
        console.log(error)
    }
})
// Fim do CRUD Read <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// CRUD Delete >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
ipcMain.on('delete-client', async (event, idCliente) => {
    // Teste de recebimento do id do cliente (passo 2 - slide)
    console.log(idCliente)
    // Confirmação antes de excluir o cliente (IMPORTANTE!)
    // Client é a variável ref a janela de clientes.
    const { response } = await dialog.showMessageBox(client, {
        type: 'warning',
        buttons: ['Cancelar', 'Excluir'], //[0,1]
        title: 'Atenção!',
        message: 'Tem certeza que deseja excluir este cliente?'
    })
    // Apoio a lógica.
    console.log(response)
    if (response === 1) {
        // Passo 3 slide.
        try {
            const clienteExcluido = await clienteModel.findByIdAndDelete(idCliente)
            dialog.showMessageBox({
                type: 'info',
                title: 'Aviso',
                message: 'Cliente excluído com sucesso!',
                buttons: ['OK']
            })
            event.reply('reset-form')
        } catch (error) {
            console.log(error)
        }
    }
})
// Fim do CRUD Delete <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// CRUD Update >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
ipcMain.on('update-client', async (event, cliente) => {
    console.log("Dados recebidos para atualização (cliente):", cliente)
    try {
        // Verificar se o CPF já existe em outro registro, exceto no cliente sendo editado
        const clienteExistente = await clienteModel.findOne({
            cpfCliente: cliente.cpfCli,
            _id: { $ne: cliente.idCli } // Exclui o cliente atual da busca
        })
        if (clienteExistente) {
            dialog.showMessageBox(client, {
                type: 'error',
                title: "Atenção!",
                message: "O CPF informado já está cadastrado para outro cliente.\nVerifique se digitou corretamente.",
                buttons: ['OK']
            }).then((result) => {
                if (result.response === 0) {
                    event.reply('clear-cpf')
                }
            })
            return
        }
        // Se não houver duplicidade, prosseguir com a atualização
        const clienteEditado = await clienteModel.findByIdAndUpdate(
            cliente.idCli, {
            nomeCliente: cliente.nomeCli,
            cpfCliente: cliente.cpfCli,
            foneCliente: cliente.foneCli,
            emailCliente: cliente.emailCli,
            cepCliente: cliente.cepCli,
            cidadeCliente: cliente.cidadeCli,
            estadoCliente: cliente.estadoCli,
            enderecoCliente: cliente.enderecoCli,
            numeroCliente: cliente.numeroCli,
            complementoCliente: cliente.complementoCli,
            bairroCliente: cliente.bairroCli
        },
            { new: true }
        )
        console.log("Cliente atualizado:", clienteEditado)
        dialog.showMessageBox(client, {
            type: 'info',
            message: 'Dados do cliente alterados com sucesso!',
            buttons: ['OK']
        }).then((result) => {
            if (result.response === 0) {
                event.reply('reset-form')
            }
        })
    } catch (error) {
        console.log("Erro ao atualizar cliente:", error)
        dialog.showMessageBox(client, {
            type: 'error',
            title: "Erro",
            message: "Erro ao atualizar cliente: " + error.message,
            buttons: ['OK']
        })
    }
})
// Fim do CRUD Update <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<


// Fim do CRUD Create <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

/***********************************************/
/**************** Fornecedores ****************/
/*********************************************/

// Acessar site externo
ipcMain.on('url-site', (event, site) => {
    let url = site.url
    shell.openExternal(url)
})

// CRUD Create >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
ipcMain.on('new-supplier', async (event, fornecedor) => {
    console.log("Dados recebidos do frontend:", fornecedor)
    try {
        const fornecedorExistente = await fornecedorModel.findOne({ cnpjFornecedor: fornecedor.cnpjFor })
        if (fornecedorExistente) {
            dialog.showMessageBox({
                type: 'error',
                title: "Atenção!",
                message: "CNPJ já está cadastrado.\nVerifique se digitou corretamente.",
                buttons: ['OK']
            }).then((result) => {
                if (result.response === 0) {
                    event.reply('clear-cnpj')
                }
            })
            return
        }
        const novoFornecedor = new fornecedorModel({
            nomeFornecedor: fornecedor.nomeFor,
            cnpjFornecedor: fornecedor.cnpjFor,
            foneFornecedor: fornecedor.foneFor,
            siteFornecedor: fornecedor.siteFor,
            cepFornecedor: fornecedor.cepFor,
            cidadeFornecedor: fornecedor.cidadeFor,
            estadoFornecedor: fornecedor.estadoFor,
            enderecoFornecedor: fornecedor.enderecoFor,
            numeroFornecedor: fornecedor.numeroFor,
            complementoFornecedor: fornecedor.complementoFor,
            bairroFornecedor: fornecedor.bairroFor
        })
        await novoFornecedor.save()
        dialog.showMessageBox({
            type: 'info',
            title: "Aviso",
            message: "Fornecedor cadastrado com sucesso!",
            buttons: ['OK']
        }).then((result) => {
            if (result.response === 0) {
                event.reply('reset-form')
            }
        })
    } catch (error) {
        console.log("Erro ao cadastrar fornecedor:", error)
        dialog.showMessageBox({
            type: 'error',
            title: "Erro",
            message: "Erro ao cadastrar fornecedor: " + error.message,
            buttons: ['OK']
        })
    }
})

// CRUD Read >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
ipcMain.on('search-supplier', async (event, forNome) => {
    console.log(forNome)
    try {
        const dadosFornecedor = await fornecedorModel.find({
            nomeFornecedor: new RegExp(forNome, 'i')
        })
        console.log(dadosFornecedor)
        if (dadosFornecedor.length === 0) {
            dialog.showMessageBox({
                type: 'warning',
                title: 'Fornecedor',
                message: 'Fornecedor não cadastrado.\nDeseja cadastrar este fornecedor?',
                defaultId: 0,
                buttons: ['Sim', 'Não']
            }).then((result) => {
                console.log(result)
                if (result.response === 0) {
                    event.reply('set-nameSupplier')
                } else {
                    event.reply('reset-form')
                }
            })
        }
        event.reply('supplier-data', JSON.stringify(dadosFornecedor))
    } catch (error) {
        console.log(error)
    }
})

// CRUD Delete >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
ipcMain.on('delete-supplier', async (event, idFornecedor) => {
    console.log(idFornecedor)
    const { response } = await dialog.showMessageBox(supplier, {
        type: 'warning',
        buttons: ['Cancelar', 'Excluir'],
        title: 'Atenção!',
        message: 'Tem certeza que deseja excluir este fornecedor?'
    })
    console.log(response)
    if (response === 1) {
        try {
            const fornecedorExcluido = await fornecedorModel.findByIdAndDelete(idFornecedor)
            dialog.showMessageBox({
                type: 'info',
                title: 'Aviso',
                message: 'Fornecedor excluído com sucesso!',
                buttons: ['OK']
            })
            event.reply('reset-form')
        } catch (error) {
            console.log(error)
        }
    }
})

// CRUD Update >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
ipcMain.on('update-supplier', async (event, fornecedor) => {
    console.log("Dados recebidos para atualização (fornecedor):", fornecedor)
    try {
        // Verificar se o CNPJ já existe em outro registro, exceto no fornecedor sendo editado
        const fornecedorExistente = await fornecedorModel.findOne({
            cnpjFornecedor: fornecedor.cnpjFor,
            _id: { $ne: fornecedor.idFor } // Exclui o fornecedor atual da busca
        })
        if (fornecedorExistente) {
            dialog.showMessageBox(supplier, {
                type: 'error',
                title: "Atenção!",
                message: "O CNPJ informado já está cadastrado para outro fornecedor.\nVerifique se digitou corretamente.",
                buttons: ['OK']
            }).then((result) => {
                if (result.response === 0) {
                    event.reply('clear-cnpj')
                }
            })
            return
        }
        // Se não houver duplicidade, prosseguir com a atualização
        const fornecedorEditado = await fornecedorModel.findByIdAndUpdate(
            fornecedor.idFor, {
            nomeFornecedor: fornecedor.nomeFor,
            cnpjFornecedor: fornecedor.cnpjFor,
            foneFornecedor: fornecedor.foneFor,
            siteFornecedor: fornecedor.siteFor,
            cepFornecedor: fornecedor.cepFor,
            cidadeFornecedor: fornecedor.cidadeFor,
            estadoFornecedor: fornecedor.estadoFor,
            enderecoFornecedor: fornecedor.enderecoFor,
            numeroFornecedor: fornecedor.numeroFor,
            complementoFornecedor: fornecedor.complementoFor,
            bairroFornecedor: fornecedor.bairroFor
        },
            { new: true }
        )
        console.log("Fornecedor atualizado:", fornecedorEditado)
        dialog.showMessageBox(supplier, {
            type: 'info',
            message: 'Dados do fornecedor alterados com sucesso!',
            buttons: ['OK']
        }).then((result) => {
            if (result.response === 0) {
                event.reply('reset-form')
            }
        })
    } catch (error) {
        console.log("Erro ao atualizar fornecedor:", error)
        dialog.showMessageBox(supplier, {
            type: 'error',
            title: "Erro",
            message: "Erro ao atualizar fornecedor: " + error.message,
            buttons: ['OK']
        })
    }
})
// Fim CRUD Update <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

/********************************************/
/**************** Produtos  *****************/
/********************************************/

// CRUD Create
ipcMain.handle('open-file-dialog', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
        title: "Selecionar imagem",
        properties: ['openFile'],
        filters: [
            {
                name: 'Imagens',
                extensions: ['png', 'jpg', 'jpeg', 'jfif']
            }
        ]
    })

    if (canceled === true || filePaths.length === 0) {
        return null
    } else {
        return filePaths[0]
    }
})

ipcMain.on('new-product', async (event, produto) => {
    console.log("Dados recebidos do frontend (produto):", produto)
    let caminhoImagemSalvo = ""

    try {
        if (produto.caminhoImagemPro) {
            const uploadDir = path.join(__dirname, 'uploads')
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir)
            }
            const fileName = `${Date.now()}_${path.basename(produto.caminhoImagemPro)}`
            const uploads = path.join(uploadDir, fileName)
            fs.copyFileSync(produto.caminhoImagemPro, uploads)
            caminhoImagemSalvo = uploads
        }
        const novoProduto = new produtoModel({
            barcodeProduto: produto.barcodePro,
            nomeProduto: produto.nomePro,
            caminhoImagemProduto: caminhoImagemSalvo,
            precoProduto: produto.precoPro,
            fornecedorProduto: produto.fornecedorPro,
            quantidadeProduto: produto.quantidadePro,
            unidadeProduto: produto.unidadePro,
            valorUnitarioProduto: produto.valorUnitarioPro
        })
        console.log("Novo produto a ser salvo:", novoProduto)
        await novoProduto.save()
        dialog.showMessageBox({
            type: 'info',
            title: 'Aviso',
            message: 'Produto cadastrado com sucesso.',
            buttons: ['OK']
        }).then((result) => {
            if (result.response === 0) {
                event.reply('reset-form')
            }
        })
    } catch (error) {
        console.log("Erro completo ao cadastrar produto:", error)
        if (error.code === 11000) {
            dialog.showMessageBox({
                type: 'error',
                title: "Atenção!",
                message: "O Código de Barras já está cadastrado.\nVerifique se escaneou o código corretamente.",
                buttons: ['OK']
            }).then((result) => {
                if (result.response === 0) {
                    event.reply('clear-barcode')
                }
            })
        } else {
            console.log("Outro erro ao cadastrar produto:", error.message)
            dialog.showMessageBox({
                type: 'error',
                title: "Erro",
                message: "Erro ao cadastrar produto: " + error.message,
                buttons: ['OK']
            })
        }
    }
})

// CRUD Read
ipcMain.on('search-product', async (event, barcode) => {
    console.log("Recebido pedido de busca por código de barras:", barcode)
    try {
        const dadosProduto = await produtoModel.find({
            barcodeProduto: barcode
        })
        console.log("Resultado da busca por código de barras:", dadosProduto)
        event.reply('product-data', JSON.stringify(dadosProduto))
    } catch (error) {
        console.log("Erro ao buscar produto por código de barras:", error)
        event.reply('product-data', JSON.stringify([])) // Retorna array vazio em caso de erro
    }
})

ipcMain.on('search-name', async (event, proNome) => {
    console.log("Recebido pedido de busca por nome:", proNome)
    try {
        const dadosProduto = await produtoModel.find({
            nomeProduto: new RegExp(proNome, 'i')
        })
        console.log("Resultado da busca por nome:", dadosProduto)
        event.reply('product-data-name', JSON.stringify(dadosProduto))
    } catch (error) {
        console.log("Erro ao buscar produto por nome:", error)
        event.reply('product-data-name', JSON.stringify([])) // Retorna array vazio em caso de erro
    }
})

// CRUD Update
ipcMain.on('update-product', async (event, produto) => {
    console.log("Dados recebidos para atualização (produto):", produto)
    try {
        // Verificar se o código de barras já existe em outro registro, exceto no produto sendo editado
        const produtoExistente = await produtoModel.findOne({
            barcodeProduto: produto.barcodePro,
            _id: { $ne: produto.idPro } // Exclui o produto atual da busca
        })
        if (produtoExistente) {
            dialog.showMessageBox(product, {
                type: 'error',
                title: "Atenção!",
                message: "O Código de Barras informado já está cadastrado para outro produto.\nVerifique se digitou corretamente.",
                buttons: ['OK']
            }).then((result) => {
                if (result.response === 0) {
                    event.reply('clear-barcode')
                }
            })
            return
        }

        // Se não houver duplicidade, prosseguir com a atualização
        let produtoEditado
        if (produto.caminhoImagemPro === "") {
            produtoEditado = await produtoModel.findByIdAndUpdate(
                produto.idPro, {
                barcodeProduto: produto.barcodePro,
                nomeProduto: produto.nomePro,
                precoProduto: produto.precoPro,
                fornecedorProduto: produto.fornecedorPro,
                quantidadeProduto: produto.quantidadePro,
                unidadeProduto: produto.unidadePro,
                valorUnitarioProduto: produto.valorUnitarioPro
            },
                { new: true }
            )
            console.log("Produto atualizado (sem nova imagem):", produtoEditado)
        } else {
            produtoEditado = await produtoModel.findByIdAndUpdate(
                produto.idPro, {
                barcodeProduto: produto.barcodePro,
                nomeProduto: produto.nomePro,
                caminhoImagemProduto: produto.caminhoImagemPro,
                precoProduto: produto.precoPro,
                fornecedorProduto: produto.fornecedorPro,
                quantidadeProduto: produto.quantidadePro,
                unidadeProduto: produto.unidadePro,
                valorUnitarioProduto: produto.valorUnitarioPro
            },
                { new: true }
            )
            console.log("Produto atualizado (com nova imagem):", produtoEditado)
        }

        dialog.showMessageBox(product, {
            type: 'info',
            message: 'Dados do produto alterados com sucesso.',
            buttons: ['OK']
        }).then((result) => {
            if (result.response === 0) {
                event.reply('reset-form')
            }
        })
    } catch (error) {
        console.log("Erro ao atualizar produto:", error)
        dialog.showMessageBox(product, {
            type: 'error',
            title: "Erro",
            message: "Erro ao atualizar produto: " + error.message,
            buttons: ['OK']
        })
    }
})

// CRUD Delete
ipcMain.on('delete-product', async (event, idProduto) => {
    console.log("ID do produto a ser deletado:", idProduto)
    const { response } = await dialog.showMessageBox(product, {
        type: 'warning',
        buttons: ['Cancelar', 'Excluir'],
        title: 'Atenção!',
        message: 'Tem certeza que deseja excluir este produto?'
    })
    console.log("Resposta do usuário:", response)
    if (response === 1) {
        try {
            const produtoExcluido = await produtoModel.findByIdAndDelete(idProduto)
            console.log("Produto excluído:", produtoExcluido)
            dialog.showMessageBox({
                type: 'info',
                title: 'Aviso',
                message: 'Produto excluído com sucesso',
                buttons: ['OK']
            })
            event.reply('reset-form')
        } catch (error) {
            console.log("Erro ao excluir produto:", error)
        }
    }
})

/********************************************/
/**************** Relatórios ****************/
/********************************************/

// Relatório de Clientes
async function gerarRelatorioClientes() {
    try {
        // Listar os clientes por ordem alfabética.
        const clientes = await clienteModel.find().sort({ nomeCliente: 1 })
        console.log(clientes)
        // Formatação do documento.
        const doc = new jsPDF('p', 'mm', 'a4') //p portrait | l landscape.
        // Tamanho da fonte (título).
        doc.setFontSize(16)
        // Escrever um texto (título).
        doc.text("Relatório de Clientes", 16, 10) // X, Y (mm).
        // Data
        const dataAtual = new Date().toLocaleDateString('pt-BR')
        doc.setFontSize(12)
        doc.text(`Data: ${dataAtual}`, 160, 10)
        // Variável de apoio para formatação da altura do conteúdo.
        let y = 45
        doc.text("Nome", 14, y)
        doc.text("Celular", 80, y)
        doc.text("E-mail", 130, y)
        y += 5
        // Desenhar uma linha.
        doc.setLineWidth(0.5) // Expessura da linha.
        doc.line(10, y, 200, y) // Inicio, fim.
        y += 10
        // Renderizar os clientes (vetor)
        clientes.forEach((c) => {
            // Se ultrapassar o limite da folha (A4 = 270mm) adicionar outra página.
            if (y > 250) {
                doc.addPage()
                y = 20 // Cabeçalho da outra pagina.
            }
            doc.text(c.nomeCliente, 14, y)
            doc.text(c.foneCliente, 80, y)
            doc.text(c.emailCliente || "N/A", 130, y)
            y += 10 // Quebra de linha
        })
        // Setar o caminho do arquivo temporário.
        const tempDir = app.getPath('temp')
        const filePath = path.join(tempDir, 'clientes.pdf') // Nome do arquivo.
        // Salvar temporariamente o arquivo.
        doc.save(filePath)
        // Abrir o arquivo no navegador padrão.
        shell.openPath(filePath)
    } catch (error) {
        console.log(error)
    }
}

// Relatório de Fornecedores
async function gerarRelatorioFornecedores() {
    try {
        // Listar os fornecedores por ordem alfabética.
        const fornecedores = await fornecedorModel.find().sort({ nomeFornecedor: 1 })
        console.log(fornecedores)
        // Formatação do documento.
        const doc = new jsPDF('p', 'mm', 'a4') //p portrait | l landscape.
        // Tamanho da fonte (título).
        doc.setFontSize(16)
        // Escrever um texto (título).
        doc.text("Relatório de Fornecedores", 16, 10) // X, Y (mm).
        // Data
        const dataAtual = new Date().toLocaleDateString('pt-BR')
        doc.setFontSize(12)
        doc.text(`Data: ${dataAtual}`, 160, 10)
        // Variável de apoio para formatação da altura do conteúdo.
        let y = 45
        doc.text("Nome", 14, y)
        doc.text("Celular", 80, y)
        doc.text("Site", 130, y)
        y += 5
        // Desenhar uma linha.
        doc.setLineWidth(0.5) // Expessura da linha.
        doc.line(10, y, 200, y) // Inicio, fim.
        y += 10
        // Renderizar os fornecedores (vetor)
        fornecedores.forEach((c) => {
            // Se ultrapassar o limite da folha (A4 = 270mm) adicionar outra página.
            if (y > 250) {
                doc.addPage()
                y = 20 // Cabeçalho da outra pagina.
            }
            doc.text(c.nomeFornecedor, 14, y)
            doc.text(c.foneFornecedor, 80, y)
            doc.text(c.siteFornecedor || "N/A", 130, y)
            y += 10 // Quebra de linha
        })
        // Setar o caminho do arquivo temporário.
        const tempDir = app.getPath('temp')
        const filePath = path.join(tempDir, 'fornecedores.pdf') // Nome do arquivo.
        // Salvar temporariamente o arquivo.
        doc.save(filePath)
        // Abrir o arquivo no navegador padrão.
        shell.openPath(filePath)
    } catch (error) {
        console.log(error)
    }
}

// Relatório de Produtos
async function gerarRelatorioProdutos() {
    try {
        // Listar os produtos por ordem alfabética.
        const produtos = await produtoModel.find().sort({ nomeProduto: 1 })
        console.log(produtos)
        // Formatação do documento.
        const doc = new jsPDF('p', 'mm', 'a4') //p portrait | l landscape.
        // Tamanho da fonte (título).
        doc.setFontSize(16)
        // Escrever um texto (título).
        doc.text("Relatório de Produtos", 16, 10) // X, Y (mm).
        // Data
        const dataAtual = new Date().toLocaleDateString('pt-BR')
        doc.setFontSize(12)
        doc.text(`Data: ${dataAtual}`, 160, 10)
        // Variável de apoio para formatação da altura do conteúdo.
        let y = 45
        doc.text("Código de Barras", 14, y)
        doc.text("Produto", 80, y)
        doc.text("Valor", 160, y)
        y += 5
        // Desenhar uma linha.
        doc.setLineWidth(0.5) // Expessura da linha.
        doc.line(10, y, 200, y) // Inicio, fim.
        y += 10
        // Renderizar os produtos (vetor)
        produtos.forEach((c) => {
            // Se ultrapassar o limite da folha (A4 = 270mm) adicionar outra página.
            if (y > 250) {
                doc.addPage()
                y = 20 // Cabeçalho da outra pagina.
            }
            doc.text(c.barcodeProduto, 14, y)
            doc.text(c.nomeProduto, 80, y)
            doc.text(c.precoProduto || "N/A", 160, y)
            y += 10 // Quebra de linha
        })
        // Setar o caminho do arquivo temporário.
        const tempDir = app.getPath('temp')
        const filePath = path.join(tempDir, 'produtos.pdf') // Nome do arquivo.
        // Salvar temporariamente o arquivo.
        doc.save(filePath)
        // Abrir o arquivo no navegador padrão.
        shell.openPath(filePath)
    } catch (error) {
        console.log(error)
    }
}