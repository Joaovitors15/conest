/**
 * Processo de renderização da tela de Fornecedores
 * fornecedores.html
 */

const foco = document.getElementById('searchSupplier')

// Acessar site >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
function acessarSite() {
    let urlFornecedor = document.getElementById('inputSiteSupplier').value.trim()
    let siteErro = document.getElementById('siteErro')

    if (!siteErro) {
        siteErro = document.createElement('div')
        siteErro.id = 'siteErro'
        siteErro.style.color = 'red'
        siteErro.style.fontSize = '0.9em'
        siteErro.style.marginTop = '5px'
        document.getElementById('inputSiteSupplier').after(siteErro)
    }

    if (!urlFornecedor || urlFornecedor === "https://") {
        siteErro.textContent = "Por favor, insira um site válido antes de acessar."
        return
    }

    if (!/^https:\/\/.+/.test(urlFornecedor)) {
        siteErro.textContent = "URL inválida! O site deve começar com 'https://'."
        return
    }

    siteErro.textContent = ""

    try {
        api.abrirSite({ url: urlFornecedor })
    } catch (error) {
        siteErro.textContent = "Erro ao tentar acessar o site. Verifique a URL."
    }
}
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// Mudar as propriedades do documento html ao iniciar a janela
document.addEventListener('DOMContentLoaded', () => {
    btnUpdate.disabled = true
    btnDelete.disabled = true
    foco.focus()
})

// Função para manipular o evento da tecla Enter
function teclaEnter(event) {
    if (event.key === "Enter") {
        event.preventDefault()
        buscarFornecedor()
    }
}

// Função para remover o manipulador do evento da tecla Enter
function restaurarEnter() {
    document.getElementById('frmSupplier').removeEventListener('keydown', teclaEnter)
}

// Manipulando o evento (tecla Enter)
document.getElementById('frmSupplier').addEventListener('keydown', teclaEnter)

// Array usado nos métodos para manipulação da estrutura de dados
let arrayFornecedor = []

// CRUD Create >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// Passo 1 - slide (capturar os dados dos inputs form)
let formFornecedor = document.getElementById('frmSupplier')
let idFornecedor = document.getElementById('inputIdSupplier')
let nomeFornecedor = document.getElementById('inputNameSupplier')
let cnpjFornecedor = document.getElementById('inputCnpjSupplier')
let foneFornecedor = document.getElementById('inputPhoneSupplier')
let siteFornecedor = document.getElementById('inputSiteSupplier')
let cepFornecedor = document.getElementById('inputCepSupplier')
let cidadeFornecedor = document.getElementById('inputCitySupplier')
let estadoFornecedor = document.getElementById('inputStateSupplier')
let enderecoFornecedor = document.getElementById('inputStreetSupplier')
let numeroFornecedor = document.getElementById('inputNumberSupplier')
let complementoFornecedor = document.getElementById('inputComplementSupplier')
let bairroFornecedor = document.getElementById('inputNeighborhoodSupplier')

// CRUD Create/Update >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// Evento associado ao botão adicionar (quando o botão for pressionado)
formFornecedor.addEventListener('submit', async (event) => {
    event.preventDefault()
    const cnpjLimpo = cnpjFornecedor.value.replace(/\D/g, '')
    console.log("CNPJ limpo antes de enviar:", cnpjLimpo)

    if (!validarDigitosCNPJ(cnpjLimpo)) {
        api.validarBuscaCnpj(() => {
            cnpjFornecedor.focus()
        })
        return
    }

    if (idFornecedor.value === "") {
        const fornecedor = {
            nomeFor: nomeFornecedor.value,
            cnpjFor: cnpjLimpo,
            foneFor: foneFornecedor.value,
            siteFor: siteFornecedor.value,
            cepFor: cepFornecedor.value,
            cidadeFor: cidadeFornecedor.value,
            estadoFor: estadoFornecedor.value,
            enderecoFor: enderecoFornecedor.value,
            numeroFor: numeroFornecedor.value,
            complementoFor: complementoFornecedor.value,
            bairroFor: bairroFornecedor.value
        }
        api.novoFornecedor(fornecedor)
    } else {
        const fornecedor = {
            idFor: idFornecedor.value,
            nomeFor: nomeFornecedor.value,
            cnpjFor: cnpjLimpo,
            foneFor: foneFornecedor.value,
            siteFor: siteFornecedor.value,
            cepFor: cepFornecedor.value,
            cidadeFor: cidadeFornecedor.value,
            estadoFor: estadoFornecedor.value,
            enderecoFor: enderecoFornecedor.value,
            numeroFor: numeroFornecedor.value,
            complementoFor: complementoFornecedor.value,
            bairroFor: bairroFornecedor.value
        }
        api.editarFornecedor(fornecedor)
    }
})

// CRUD Read >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
function buscarFornecedor() {
    let forNome = document.getElementById('searchSupplier').value
    if (forNome === "") {
        api.validarBusca()
        foco.focus()
    } else {
        api.buscarFornecedor(forNome)
        api.renderizarFornecedor((event, dadosFornecedor) => {
            console.log(dadosFornecedor)
            const fornecedorRenderizado = JSON.parse(dadosFornecedor)
            arrayFornecedor = fornecedorRenderizado
            console.log(arrayFornecedor)
            arrayFornecedor.forEach((c) => {
                document.getElementById('inputNameSupplier').value = c.nomeFornecedor
                document.getElementById('inputCnpjSupplier').value = c.cnpjFornecedor
                document.getElementById('inputPhoneSupplier').value = c.foneFornecedor
                document.getElementById('inputSiteSupplier').value = c.siteFornecedor
                document.getElementById('inputCepSupplier').value = c.cepFornecedor
                document.getElementById('inputCitySupplier').value = c.cidadeFornecedor
                document.getElementById('inputStateSupplier').value = c.estadoFornecedor
                document.getElementById('inputStreetSupplier').value = c.enderecoFornecedor
                document.getElementById('inputNumberSupplier').value = c.numeroFornecedor
                document.getElementById('inputComplementSupplier').value = c.complementoFornecedor
                document.getElementById('inputNeighborhoodSupplier').value = c.bairroFornecedor
                document.getElementById('inputIdSupplier').value = c._id
                foco.value = ""
                foco.disabled = true
                btnRead.disabled = true
                btnCreate.disabled = true
                document.getElementById('btnUpdate').disabled = false
                document.getElementById('btnDelete').disabled = false
                restaurarEnter()
            })
        })
    }
    api.setarNomeFornecedor(() => {
        let campoNome = document.getElementById('searchSupplier').value
        document.getElementById('inputNameSupplier').focus()
        document.getElementById('inputNameSupplier').value = campoNome
        foco.value = ""
        foco.blur()
        restaurarEnter()
    })
}

api.clearCnpj(() => {
    let campoCnpj = document.getElementById('inputCnpjSupplier')
    campoCnpj.value = ""
    campoCnpj.focus()
    campoCnpj.style.borderColor = "red"
})

// Função para buscar o CEP
function buscarCep(cep) {
    if (cep.length === 8) {
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => response.json())
            .then(data => {
                if (data.erro) {
                    console.error("CEP não encontrado.")
                } else {
                    document.getElementById('inputStreetSupplier').value = data.logradouro || ""
                    document.getElementById('inputNeighborhoodSupplier').value = data.bairro || ""
                    document.getElementById('inputCitySupplier').value = data.localidade || ""
                    document.getElementById('inputStateSupplier').value = data.uf || ""
                }
            })
            .catch(erro => {
                console.error("Erro ao buscar CEP:", erro)
            })
    }
}

// Formatar CEP
function formatarCEP(input) {
    let value = input.value.replace(/\D/g, '')
    if (value.length > 5) {
        value = value.replace(/(\d{5})(\d)/, '$1-$2')
    }
    input.value = value
}

document.getElementById('inputCepSupplier').addEventListener('input', function () {
    formatarCEP(this)
    const cep = this.value.replace(/\D/g, '')
    if (cep.length === 8) {
        buscarCep(cep)
    }
})

document.getElementById('inputCepSupplier').addEventListener('blur', function () {
    const cep = this.value.replace(/\D/g, '')
    if (cep.length === 8) {
        buscarCep(cep)
    }
})

// Função para validar CNPJ
function validarCNPJ(campo) {
    const cnpj = campo.value.replace(/\D/g, '')
    const cnpjError = document.getElementById('cnpjError')

    if (cnpj.length !== 14 || !validarDigitosCNPJ(cnpj)) {
        cnpjError.classList.remove('d-none')
        campo.setCustomValidity('CNPJ inválido')
    } else {
        cnpjError.classList.add('d-none')
        campo.setCustomValidity('')
    }
}

// Função para validar dígitos do CNPJ
function validarDigitosCNPJ(cnpj) {
    if (/^(\d)\1{13}$/.test(cnpj)) return false

    let soma = 0
    const pesos1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    for (let i = 0; i < 12; i++) {
        soma += parseInt(cnpj.charAt(i)) * pesos1[i]
    }
    let resto = soma % 11
    if (resto < 2) resto = 0
    else resto = 11 - resto
    if (resto !== parseInt(cnpj.charAt(12))) return false

    soma = 0
    const pesos2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    for (let i = 0; i < 13; i++) {
        soma += parseInt(cnpj.charAt(i)) * pesos2[i]
    }
    resto = soma % 11
    if (resto < 2) resto = 0
    else resto = 11 - resto
    if (resto !== parseInt(cnpj.charAt(13))) return false

    return true
}

// Formatar CNPJ
function formatarCNPJ(input) {
    let value = input.value.replace(/\D/g, '')
    if (value.length > 12) {
        value = value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{1})/, '$1.$2.$3/$4-$5')
    } else if (value.length > 8) {
        value = value.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3/$4')
    } else if (value.length > 5) {
        value = value.replace(/(\d{2})(\d{3})(\d{1})/, '$1.$2.$3')
    } else if (value.length > 2) {
        value = value.replace(/(\d{2})(\d{1})/, '$1.$2')
    }
    input.value = value
}

// Eventos para CNPJ
document.getElementById('inputCnpjSupplier').addEventListener('input', function () {
    formatarCNPJ(this)
})

document.getElementById('inputCnpjSupplier').addEventListener('blur', function () {
    validarCNPJ(this)
})

// Formatar Telefone
function formatarTelefone(input) {
    let value = input.value.replace(/\D/g, '')
    if (value.length > 2) {
        value = value.replace(/(\d{2})(\d)/, '($1) $2')
    }
    if (value.length > 7) {
        value = value.replace(/(\d{5})(\d)/, '$1-$2')
    }
    input.value = value
}

document.getElementById('inputPhoneSupplier').addEventListener('input', function () {
    formatarTelefone(this)
})

// CRUD Delete >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
function excluirFornecedor() {
    api.deletarFornecedor(idFornecedor.value)
}

// Reset Form >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
api.resetarFormulario((args) => {
    resetForm()
})

function resetForm() {
    location.reload()
}