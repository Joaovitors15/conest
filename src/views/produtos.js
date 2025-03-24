/**
 * Processo de renderização da tela de Produtos
 * produtos.html
 */

const foco = document.getElementById('searchProduct');
const focoNome = document.getElementById('searchProductName');

// Evento ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    btnUpdate.disabled = true;
    btnDelete.disabled = true;
    foco.focus();
    focoNome.disabled = false;
});

function teclaEnter(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        buscarProduto();
    }
}

function teclaEnterNome(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        buscarProdutoPorNome();
    }
}

function restaurarEnter() {
    foco.removeEventListener('keydown', teclaEnter);
}

function restaurarEnterNome() {
    focoNome.removeEventListener('keydown', teclaEnterNome);
}

foco.addEventListener('keydown', teclaEnter);
focoNome.addEventListener('keydown', teclaEnterNome);

let arrayProduto = [];

let formProduto = document.getElementById('frmProduct');
let idProduto = document.getElementById('inputIdProduct');
let barcodeProduto = document.getElementById('inputBarcodeProduct');
let nomeProduto = document.getElementById('inputNameProduct');
let caminhoImagemProduto = document.getElementById('pathImageProduct');
let imagem = document.getElementById('imageProductPreview');
let precoProduto = document.getElementById('inputPrecoProduct');
let fornecedorProduto = document.getElementById('inputFornecedorProduct');
let quantidadeProduto = document.getElementById('inputQuantidadeProduct');
let unidadeProduto = document.getElementById('inputUnidadeProduct');
let valorUnitarioProduto = document.getElementById('inputValorUnitarioProduct');

let caminhoImagem;

async function uploadImage() {
    caminhoImagem = await window.api.selecionarArquivo();
    console.log("Caminho da imagem selecionada: ", caminhoImagem);
    if (caminhoImagem) {
        imagem.src = `file://${caminhoImagem}`;
    }
    btnCreate.focus();
}

formProduto.addEventListener('submit', async (event) => {
    event.preventDefault();
    console.log("Dados do formulário: ", barcodeProduto.value, nomeProduto.value, caminhoImagem, precoProduto.value, fornecedorProduto.value, quantidadeProduto.value, unidadeProduto.value, valorUnitarioProduto.value);
    
    // Verificar se o código de barras já existe antes de cadastrar o produto
    const barcode = barcodeProduto.value.trim();
    
    if (barcode === "") {
        alert("Por favor, insira o código de barras.");
        return;
    }
    
    // Buscar um produto com o mesmo código de barras
    window.api.buscarProduto(barcode);
    window.api.renderizarProduto((event, dadosProduto) => {
        if (dadosProduto && dadosProduto !== "null" && dadosProduto !== "[]") {
            alert("Código de barras já existente, verificar código!");
            
            // Limpa o campo e destaca a borda com azul
            barcodeProduto.value = ""; // Limpa o campo de código de barras
            barcodeProduto.style.border = '2px solid blue'; // Destaca as bordas com azul
            
            // Dá o foco ao campo de código de barras
            foco.focus();
            
            return; // Não permite o cadastro de produto com o mesmo código de barras
        } else {
            // Caso não exista produto com o mesmo código de barras, continua o cadastro
            if (idProduto.value === "") {
                const produto = {
                    barcodePro: barcodeProduto.value,
                    nomePro: nomeProduto.value,
                    caminhoImagemPro: caminhoImagem ? caminhoImagem : "",
                    precoPro: precoProduto.value,
                    fornecedorPro: fornecedorProduto.value,
                    quantidadePro: quantidadeProduto.value,
                    unidadePro: unidadeProduto.value,
                    valorUnitarioPro: valorUnitarioProduto.value
                };
                window.api.novoProduto(produto);
            } else {
                const produto = {
                    idPro: idProduto.value,
                    barcodePro: barcodeProduto.value,
                    nomePro: nomeProduto.value,
                    caminhoImagemPro: caminhoImagem ? caminhoImagem : "",
                    precoPro: precoProduto.value,
                    fornecedorPro: fornecedorProduto.value,
                    quantidadePro: quantidadeProduto.value,
                    unidadePro: unidadeProduto.value,
                    valorUnitarioPro: valorUnitarioProduto.value
                };
                window.api.editarProduto(produto);
            }
        }
    });
});

function buscarProduto() {
    let barcode = foco.value.trim();
    console.log("Buscando por código de barras:", barcode);
    
    if (barcode === "") {
        window.api.validarBusca();
        foco.focus();
    } else {
        window.api.buscarProduto(barcode);
        window.api.renderizarProduto((event, dadosProduto) => {
            console.log("Dados recebidos do backend (barcode):", dadosProduto);
            
            if (!dadosProduto || dadosProduto === "null" || dadosProduto === "[]") {
                alert("Produto não cadastrado, deseja cadastrar?");
                foco.disabled = false; // Mantém o campo de código de barras liberado
                focoNome.disabled = true; // Desativa o campo de busca por nome
                nomeProduto.value = barcode; // Passa o valor do código de barras para o nomeProduto
                foco.value = ""; // Limpa o campo de código de barras
                nomeProduto.focus(); // Foca no campo de nome para o cadastro
                return;
            }
            
            const produtoRenderizado = JSON.parse(dadosProduto);
            arrayProduto = produtoRenderizado;
            
            if (arrayProduto.length > 0) {
                arrayProduto.forEach((p) => {
                    idProduto.value = p._id;
                    barcodeProduto.value = p.barcodeProduto;
                    nomeProduto.value = p.nomeProduto;
                    precoProduto.value = p.precoProduto;
                    fornecedorProduto.value = p.fornecedorProduto; // Preenche o campo fornecedor
                    quantidadeProduto.value = p.quantidadeProduto; // Preenche o campo quantidade
                    unidadeProduto.value = p.unidadeProduto; // Preenche o campo unidade
                    valorUnitarioProduto.value = p.valorUnitarioProduto; // Preenche o campo valor unitário
                    if (p.caminhoImagemProduto) {
                        imagem.src = p.caminhoImagemProduto;
                    }
                    foco.value = "";
                    foco.disabled = true;
                    focoNome.disabled = true;
                    btnUpdate.disabled = false;
                    btnDelete.disabled = false;
                    btnCreate.disabled = true;
                    restaurarEnter();
                });
            }
        });
    }
}

function buscarProdutoPorNome() {
    let nome = focoNome.value.trim();
    console.log("Buscando por nome:", nome);
    
    if (nome === "") {
        window.api.validarBusca();
        focoNome.focus();
    } else {
        window.api.buscarProdutoNome(nome);
        window.api.renderizarProdutoNome((event, dadosProduto) => {
            console.log("Dados recebidos do backend (nome):", dadosProduto);
            
            if (!dadosProduto || dadosProduto === "null" || dadosProduto === "[]") {
                alert("Produto não cadastrado, deseja cadastrar?");
                focoNome.disabled = true; // Desativa a busca por nome
                foco.disabled = false; // Mantém o campo de código de barras liberado
                nomeProduto.value = nome; // Passa o valor da busca para o nomeProduto
                focoNome.value = ""; // Limpa o campo de busca por nome
                nomeProduto.focus(); // Foca no campo de nome para o cadastro
                return;
            }
            
            const produtoRenderizado = JSON.parse(dadosProduto);
            arrayProduto = produtoRenderizado;
            
            if (arrayProduto.length > 0) {
                arrayProduto.forEach((p) => {
                    idProduto.value = p._id;
                    barcodeProduto.value = p.barcodeProduto;
                    nomeProduto.value = p.nomeProduto;
                    precoProduto.value = p.precoProduto;
                    fornecedorProduto.value = p.fornecedorProduto; // Preenche o campo fornecedor
                    quantidadeProduto.value = p.quantidadeProduto; // Preenche o campo quantidade
                    unidadeProduto.value = p.unidadeProduto; // Preenche o campo unidade
                    valorUnitarioProduto.value = p.valorUnitarioProduto; // Preenche o campo valor unitário
                    if (p.caminhoImagemProduto) {
                        imagem.src = p.caminhoImagemProduto;
                    }
                    focoNome.value = "";
                    focoNome.disabled = true;
                    foco.disabled = true;
                    btnUpdate.disabled = false;
                    btnDelete.disabled = false;
                    btnCreate.disabled = true;
                    restaurarEnter();
                    restaurarEnterNome();
                });
            }
        });
    }
}

function excluirProduto() {
    console.log("Excluindo produto com ID: ", idProduto.value);
    window.api.deletarProduto(idProduto.value);
}

function resetForm() {
    location.reload();
}
