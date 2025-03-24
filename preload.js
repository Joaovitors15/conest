const { contextBridge, ipcRenderer } = require('electron')

ipcRenderer.send('db-connect')

contextBridge.exposeInMainWorld('api', {
    status: (message) => ipcRenderer.on('db-message', message),
    fecharJanela: () => ipcRenderer.send('close-about'),
    janelaClientes: () => ipcRenderer.send('open-client'),
    janelaFornecedores: () => ipcRenderer.send('open-supplier'),
    janelaProdutos: () => ipcRenderer.send('open-product'),
    janelaRelatorios: () => ipcRenderer.send('open-report'),
    resetarFormulario: (args) => ipcRenderer.on('reset-form', args),
    novoCliente: (cliente) => ipcRenderer.send('new-client', cliente),
    buscarCliente: (cliNome) => ipcRenderer.send('search-client', cliNome),
    renderizarCliente: (dadosCliente) => ipcRenderer.on('client-data', dadosCliente),
    deletarCliente: (idCliente) => ipcRenderer.send('delete-client', idCliente),
    editarCliente: (cliente) => ipcRenderer.send('update-client', cliente),
    setarNomeCliente: (args) => ipcRenderer.on('set-nameClient', args),
    avisoCliente: () => ipcRenderer.send('notice-client'),
    clearCpf: (args) => ipcRenderer.on('clear-cpf', args),
    novoFornecedor: (fornecedor) => ipcRenderer.send('new-supplier', fornecedor),
    buscarFornecedor: (forNome) => ipcRenderer.send('search-supplier', forNome),
    renderizarFornecedor: (dadosFornecedor) => ipcRenderer.on('supplier-data', dadosFornecedor),
    deletarFornecedor: (idFornecedor) => ipcRenderer.send('delete-supplier', idFornecedor),
    editarFornecedor: (fornecedor) => ipcRenderer.send('update-supplier', fornecedor),
    setarNomeFornecedor: (args) => ipcRenderer.on('set-nameSupplier', args),
    abrirSite: (urlsite) => ipcRenderer.send('url-site', urlsite),
    clearCnpj: (args) => ipcRenderer.on('clear-cnpj', args),
    novoProduto: (produto) => ipcRenderer.send('new-product', produto),
    buscarProduto: (barcode) => ipcRenderer.send('search-product', barcode),
    buscarProdutoNome: (proNome) => ipcRenderer.send('search-name', proNome),
    renderizarProduto: (dadosProduto) => ipcRenderer.on('product-data', dadosProduto),
    renderizarProdutoNome: (dadosProdutoNome) => ipcRenderer.on('product-data-name', dadosProdutoNome),
    deletarProduto: (idProduto) => ipcRenderer.send('delete-product', idProduto),
    editarProduto: (produto) => ipcRenderer.send('update-product', produto),
    setarNomeProduto: (args) => ipcRenderer.on('set-nameProduct', args),
    setarBarcode: (args) => ipcRenderer.on('set-barcode', args),
    validarBusca: () => ipcRenderer.send('dialog-search'),
    selecionarArquivo: () => ipcRenderer.invoke('open-file-dialog'),
    clearBarcode: (args) => ipcRenderer.on('clear-barcode', args)
})