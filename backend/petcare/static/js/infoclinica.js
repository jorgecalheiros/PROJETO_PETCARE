import {tratamentosDeErros, user_is_vet_registered, makeGetRequest, setAuthorizationTokenHeader, makePostRequest} from './utils/api-utils.js';
import { registrarPrototypes, validarCampo, desativarBotaoEAtivarLoading } from './utils/form-utils.js';
import {ROUTES_API, ROUTES_SITE} from "./utils/global.js";
import { recarregarPagina, showAlert, formatCNPJ, formatCEP } from './utils/site-utils.js';
import { removeCarecteresNaoNumericos, validarConfirmSenha, validarSenha, validarTelefone, validarTexto } from './utils/validations.js';

document.addEventListener("DOMContentLoaded", async function(){
    registrarPrototypes();
    let me = {};
    const time = 2000;
    user_is_vet_registered(async(response) => {
        const data = await response.json();
        me = data;
        const clinica = await pegarInformacoesDaEmpresa(data.clinic);
        preencherInformacoesDaClinica(clinica);
    }, (response) => {
        tratamentosDeErros.accounts.unauthorized(response, ROUTES_SITE.bem_vindo);
        tratamentosDeErros.vet.is_not_a_vet(response);
    });

    const pegarInformacoesDaEmpresa = async(id) => {
        const headers = setAuthorizationTokenHeader();
        const url = `${ROUTES_API.vet_clinic}/${id}/`;

        return await makeGetRequest(url, headers, async(response) => {
            const data = await response.json();
            return data;
        })
    }

    const preencherInformacoesDaClinica = (data) => {
        $("#nome-clinica").empty().append(data.name)
        $("#cnpj").empty().append(formatCNPJ(data.cnpj))
        $("#cep").empty().append(formatCEP(data.address.cep))
        $("#cidade").empty().append(data.address.city)
        $("#estado").empty().append(data.address.state)

        renderizarListVet(data.vets);
        iniciarFormularios();
    }

    const renderizarListVet = (list) => {
        const element = $("#vet-list").empty();

        list.forEach((item) => {
            const isMe = me.id == item.id;
            const linha = `
                <tr class="${isMe ? "table-active": ""}">
                    <td>${item.name}</td>
                    <td>${item.account.email}</td>
                    <td>${item.phone}</td>
                    <td>${item.specialization}</td>
                </tr>
            `;

            element.append(linha);
        })
    }
    const iniciarFormularios = () => {
        adicionarVeterinarioFormulario();
    }
    const adicionarVeterinarioFormulario = () => {
        const form = document.getElementById("cadastrar-vet");
        const nome = document.getElementById("nome");
        const especializacao = document.getElementById("especializacao");
        const telefone = document.getElementById("telefone");
        const email = document.getElementById("email");
        const senha = document.getElementById("password");
        const confirmarSenha = document.getElementById("confirm-passowrd");

        const nomeFeedback = document.getElementById("invalid-feedback-nome");
        const especializacaoFeedback = document.getElementById("invalid-feedback-especilizacao");
        const telefoneFeedback = document.getElementById("invalid-feedback-telefone");
        const emailFeedback = document.getElementById("invalid-feedback-email");
        const senhaFeedback = document.getElementById("invalid-feedback-password");
        const confirmarSenhaFeedback = document.getElementById("invalid-feedback-confirm-password");

        validarCampo(nome, nomeFeedback, validarTexto);
        validarCampo(especializacao, especializacaoFeedback, validarTexto);
        validarCampo(telefone, telefoneFeedback, validarTelefone);
        validarCampo(email, emailFeedback, validarTexto);
        validarCampo(senha, senhaFeedback, validarSenha);
        validarCampo(confirmarSenha, confirmarSenhaFeedback, (value) => validarConfirmSenha(value, senha.value))



        form.validarFormulario( async() => {
            desativarBotaoEAtivarLoading("salvar-vet");

            const headers = setAuthorizationTokenHeader();
            const url = `${ROUTES_API.vet_clinic}/${me.clinic}/addvet/`;
            
            const formData = {
                account: {
                    email: email.value,
                    password: senha.value
                },
                name: nome.value,
                phone: removeCarecteresNaoNumericos(telefone.value),
                specialization: especializacao.value
            }

            await makePostRequest(url, headers, formData, async(response) => {
                if (response.ok){
                    const placeholder = document.getElementById("placeholder-vet");
                    showAlert("Cadastrado com sucesso", "success", placeholder);
                    recarregarPagina(time)
                }
            }, async(response) => {
                const data = await response.json();
                console.log(data);
            })
            
        })
        
    }
    
});