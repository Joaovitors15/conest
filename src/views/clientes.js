/**
 * Processo de renderização da tela de Clientes
 * clientes.html
 */

const foco = document.getElementById('searchClient')

// Mudar as propriedades do documento html ao iniciar a janela.
document.addEventListener('DOMContentLoaded', () => {
    btnUpdate.disabled = true
    btnDelete.disabled = true
    foco.focus()
    // Desativar o input das caixas de texto denro da div .bloqueio.
    /*
    document.querySelectorAll('.bloqueio input').forEach(input => {
        input.disabled = true
    })
        */
    // Aviso (pop-up)
    //api.avisoCliente()
})
// Função para manipular o evento da tecla Enter.
function teclaEnter(event) {
    if (event.key === "Enter") {
        event.preventDefault()
        buscarCliente()
    }
}

// Função para remover o manipulador do evento da tecla Enter.
function restaurarEnter() {
    document.getElementById('frmClient').removeEventListener('keydown', teclaEnter)
}

// Manipulando o evento (tecla Enter).
document.getElementById('frmClient').addEventListener('keydown', teclaEnter)

// Array usado nós métodos para manipulação da estrutura de dados.
let arrayCliente = []

// CRUD Create >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//Passo 1 - slide (capturar os dados dos inputs do form)
let formCliente = document.getElementById('frmClient')
let idCliente = document.getElementById('inputIdClient')
let nomeCliente = document.getElementById('inputNameClient')
let cpfCliente = document.getElementById('inputCpfClient')
let foneCliente = document.getElementById('inputPhoneClient')
let emailCliente = document.getElementById('inputEmailClient')
let cepCliente = document.getElementById('inputCepClient')
let cidadeCliente = document.getElementById('inputCityClient')
let estadoCliente = document.getElementById('inputStateClient')
let enderecoCliente = document.getElementById('inputStreetClient')
let numeroCliente = document.getElementById('inputNumberClient')
let complementoCliente = document.getElementById('inputComplementClient')
let bairroCliente = document.getElementById('inputNeighborhoodClient')

// CRUD Create/Update >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// Evento associado ao botão adicionar (quando o botão for pressionado).
formCliente.addEventListener('submit', async (event) => {
    // Evitar o comportamento padrão de envio em um form.
    event.preventDefault()
    // Teste importante! (fluxo dos dados).
    console.log(idCliente.value, nomeCliente.value, cpfCliente.value, foneCliente.value, emailCliente.value, cepCliente.value, cidadeCliente.value, estadoCliente.value, enderecoCliente.value, numeroCliente.value, complementoCliente.value, bairroCliente.value)

    // Passo 2 - slide (envio das informações para o main).
    // Estratégia para determinar se é um novo cadastro de clientes ou a edição de um cliente já existente.
    if (idCliente.value === "") {
        // Criar um objeto.
        const cliente = {
            nomeCli: nomeCliente.value,
            cpfCli: cpfCliente.value,
            foneCli: foneCliente.value,
            emailCli: emailCliente.value,
            cepCli: cepCliente.value,
            cidadeCli: cidadeCliente.value,
            estadoCli: estadoCliente.value,
            enderecoCli: enderecoCliente.value,
            numeroCli: numeroCliente.value,
            complementoCli: complementoCliente.value,
            bairroCli: bairroCliente.value
        }
        api.novoCliente(cliente)
    } else {
        // Criar um novo objeto com o ID do cliente.
        const cliente = {
            idCli: idCliente.value,
            nomeCli: nomeCliente.value,
            cpfCli: cpfCliente.value,
            foneCli: foneCliente.value,
            emailCli: emailCliente.value,
            cepCli: cepCliente.value,
            cidadeCli: cidadeCliente.value,
            estadoCli: estadoCliente.value,
            enderecoCli: enderecoCliente.value,
            numeroCli: numeroCliente.value,
            complementoCli: complementoCliente.value,
            bairroCli: bairroCliente.value
        }
        api.editarCliente(cliente)
    }
})
// Fim CRUD Create <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// CRUD Read >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
function buscarCliente() {
    // Passo 1 (slides).
    let cliNome = document.getElementById('searchClient').value
    // Validação.
    if (cliNome === "") {
        api.validarBusca() // Validação do campo obrigatório.
        foco.focus()
    } else {
        //console.log(cliNome) // Teste do passo 1.
        // Passo 2 (slide) - enviar o pedido de busca do cliente ao main.
        api.buscarCliente(cliNome)
        // Passo 5 - Recebimento dos dados do cliente.
        api.renderizarCliente((event, dadosCliente) => {
            // Teste de recebimento dos dados do cliente.
            console.log(dadosCliente)
            // Passo 6 (slide): renderização dos dados do cliente no formulário.
            const clienteRenderizado = JSON.parse(dadosCliente)
            arrayCliente = clienteRenderizado
            // Teste para entendimento da lógica.
            console.log(arrayCliente)
            // Percorrer o array de clientes, extrair os dados e setar (preencher) os campos do formulário.
            arrayCliente.forEach((c) => {
                document.getElementById('inputNameClient').value = c.nomeCliente
                document.getElementById('inputCpfClient').value = c.cpfCliente
                document.getElementById('inputPhoneClient').value = c.foneCliente
                document.getElementById('inputEmailClient').value = c.emailCliente
                document.getElementById('inputCepClient').value = c.cepCliente
                document.getElementById('inputCityClient').value = c.cidadeCliente
                document.getElementById('inputStateClient').value = c.estadoCliente
                document.getElementById('inputStreetClient').value = c.enderecoCliente
                document.getElementById('inputNumberClient').value = c.numeroCliente
                document.getElementById('inputComplementClient').value = c.complementoCliente
                document.getElementById('inputNeighborhoodClient').value = c.bairroCliente
                document.getElementById('inputIdClient').value = c._id
                // Limpar o campo de busca e remover o foco.
                foco.value = ""
                // Validação e correção de BUGs.
                foco.disabled = true
                btnRead.disabled = true
                // Desativar o botão adicionar.
                btnCreate.disabled = true
                //foco.blur()
                // Liberar os botões editar e excluir.
                document.getElementById('btnUpdate').disabled = false
                document.getElementById('btnDelete').disabled = false
                // Restaurar o padrão da tecla Enter.
                restaurarEnter()
                // Reativar os inputs das caixas de textos.
                /*
                document.querySelectorAll('.bloqueio input').forEach(input => {
                    input.disabled = false
                })
                    */
            })
        })
    }
    // Setar o nome do cliente e liberar o botão adicionar.
    api.setarNomeCliente(() => {
        // Setar o nome do cliente.     
        let campoNome = document.getElementById('searchClient').value
        document.getElementById('inputNameClient').focus()
        document.getElementById('inputNameClient').value = campoNome
        // Limpar o campo de busca e remover o foco.
        foco.value = ""
        foco.blur()
        // Restaurar o padrão da tecla Enter.
        restaurarEnter()
        // Reativar os inputs das caixas de textos.
        /*
        document.querySelectorAll('.bloqueio input').forEach(input => {
            input.disabled = false
            
        })
            */
    })
}

// Adicione este trecho no final do arquivo ou após alguma função relacionada ao CRUD:

api.clearCpf(() => {
    let campoCpf = document.getElementById('inputCpfClient')
    campoCpf.value = ""
    campoCpf.focus()
    campoCpf.style.borderColor = "red"
})
// Fim CRUD Read <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// Função para buscar o CEP
function buscarCep(cep) {
    // Verifica se o CEP possui 8 caracteres (ex: 12345678)
    if (cep.length === 8) {
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => response.json())
            .then(data => {
                if (data.erro) {
                    //alert("CEP não encontrado.")
                } else {
                    // Preenche os campos do formulário com os dados do CEP
                    document.getElementById('inputStreetClient').value = data.logradouro || ""
                    document.getElementById('inputNeighborhoodClient').value = data.bairro || ""
                    document.getElementById('inputCityClient').value = data.localidade || ""
                    document.getElementById('inputStateClient').value = data.uf || ""
                }
            })
            .catch(erro => {
                //alert("Erro ao buscar CEP.")
                console.error(erro);
            });
    } else {
        //alert("Por favor, insira um CEP válido.")
    }
}

// Formatar CEP
function formatarCEP(input) {
    let value = input.value.replace(/\D/g, '') // Remove caracteres não numéricos
    if (value.length > 5) {
        value = value.replace(/(\d{5})(\d)/, '$1-$2') // Adiciona o hífen
    }
    input.value = value
}

// Chamar a função de formatação do CEP no evento de input
document.getElementById('inputCepClient').addEventListener('input', function () {
    formatarCEP(this); // Chama a função de formatação do CEP
})


// Função chamada ao perder o foco ou ao digitar no campo CEP
document.getElementById('inputCepClient').addEventListener('blur', function () {
    const cep = this.value.replace(/\D/g, '') // Remove qualquer caractere não numérico
    if (cep) {
        buscarCep(cep)
    }
})

// Caso o usuário insira o CEP e pressione Enter, também podemos buscar
document.getElementById('inputCepClient').addEventListener('input', function () {
    const cep = this.value.replace(/\D/g, '') // Remove qualquer caractere não numérico
    if (cep.length === 8) {  // Se o CEP já tiver 8 caracteres
        buscarCep(cep)
    }
})

// Formatar celular
function formatarCelular(input) {
    let value = input.value.replace(/\D/g, '') // Remove caracteres não numéricos
    if (value.length > 10) {
        value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3') // Formato (XX) XXXXX-XXXX
    } else if (value.length > 6) {
        value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3') // Formato (XX) XXXX-XXXX
    } else if (value.length > 2) {
        value = value.replace(/(\d{2})(\d{0,4})/, '($1) $2') // Formato (XX) XXXX
    }
    input.value = value
}

// Chamar a função de formatação do celular no evento de input
document.getElementById('inputPhoneClient').addEventListener('input', function () {
    formatarCelular(this) // Chama a função de formatação do celular
})

// Função para validar CPF
function validarCPF(campo) {
    const cpf = campo.value.replace(/\D/g, ''); // Remove caracteres não numéricos
    const cpfError = document.getElementById('cpfError')

    if (cpf.length !== 11 || !validarDigitosCPF(cpf)) {
        cpfError.classList.remove('d-none');
        campo.setCustomValidity('CPF inválido.')
    } else {
        cpfError.classList.add('d-none')
        campo.setCustomValidity('')
    }
}

// Função para validar dígitos do CPF
function validarDigitosCPF(cpf) {
    if (/^(\d)\1{10}$/.test(cpf)) return false; // CPF com todos os dígitos iguais é inválido

    let soma = 0
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i)
    }
    let resto = (soma * 10) % 11
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false

    soma = 0
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i)
    }
    resto = (soma * 10) % 11
    if (resto === 10 || resto === 11) resto = 0
    if (resto !== parseInt(cpf.charAt(10))) return false

    return true
}

// Adicionar evento de validação ao campo de CPF
document.getElementById('inputCpfClient').addEventListener('blur', function () {
    validarCPF(this)
});

// Formatar CPF
function formatarCPF(input) {
    let value = input.value.replace(/\D/g, '') // Remove caracteres não numéricos
    if (value.length > 9) {
        value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4') // Adiciona pontos e o hífen
    }
    input.value = value
}

// Chamar a função de formatação do CPF no evento de input
document.getElementById('inputCpfClient').addEventListener('input', function () {
    formatarCPF(this) // Chama a função de formatação do CPF
})

// CRUD Delete >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
function excluirCliente() {
    api.deletarCliente(idCliente.value) // Passo 1 do slide
}
// Fim CRUD Delete <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// Reset Form >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
api.resetarFormulario((args) => {
    resetForm()
})

function resetForm() {
    // Recarregar a página.
    location.reload()
}
// Fim - reset form <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<