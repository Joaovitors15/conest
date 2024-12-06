const { contextBridge, ipcRenderer } = require('electron')

// Estabelecer a conexão com o banco (envio de pedido para o main abrir a conexão com o banco de dados)
ipcRenderer.send('db-connect')

contextBridge.exposeInMainWorld('api', {
    dbMensagem: (message) => ipcRenderer.on('db-message', message),
    fecharJanela: () => ipcRenderer.send('close-about'),
    janelaClientes: () => ipcRenderer.send('open-client'),
    janelaFornecedores: () => ipcRenderer.send('open-supplier'),
    janelaProdutos: () => ipcRenderer.send('open-product'),
    janelaRelatorios: () => ipcRenderer.send('open-report'),
    resetarFormulario: (args) => ipcRenderer.on('reset-form', args),
    novoCliente: (cliente) => ipcRenderer.send('new-client', cliente),
    novoFornecedores: (fornecedores) => ipcRenderer.send('new-supplier', fornecedores),
    buscarCliente: (cliNome) => ipcRenderer.send("search-client", cliNome),
    buscarFornecedores: (forNome) => ipcRenderer.send("search-supplier", forNome),
    buscarProdutos: (proNome) => ipcRenderer.send("search-product", proNome),
    buscarCodigo: (proCodigo) => ipcRenderer.send("search-codigo", proCodigo),
    novoProdutos: (produtos) => ipcRenderer.send('new-product', produtos),
    rendenizarCliente: (dadosCliente) => ipcRenderer.on('client-data', dadosCliente),
    rendenizarFornecedores: (dadosFornededores) => ipcRenderer.on('supplier-data', dadosFornededores),
    rendenizarProdutos: (dadosProdutos) => ipcRenderer.on('product-data', dadosProdutos),
    rendenizarCodigos: (dadosCodigos) => ipcRenderer.on('codigo-data', dadosCodigos)
})