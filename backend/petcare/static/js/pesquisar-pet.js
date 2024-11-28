import {deleteRequest, makeGetRequest, makePostRequest, putRequest, setAuthorizationTokenHeader, tratamentosDeErros, user_is_vet_registered} from "./utils/api-utils.js";
import {ROUTES_API, ROUTES_SITE} from "./utils/global.js";
import {registrarPrototypes, validarCampo} from "./utils/form-utils.js";
import {validarTexto} from "./utils/validations.js"; 
import { capturarUUID, redirectTo, showAlert, formatDateForInputDate } from "./utils/site-utils.js";
import {renderizarInformacoesBasicasDoPet, renderizarListaDoencas, renderizarListaMedicamentos, renderizarNotFound} from "./utils/medical_history_utils.js";

user_is_vet_registered(async(response) => {
}, (response) => {
    tratamentosDeErros.accounts.unauthorized(response, ROUTES_SITE.bem_vindo);
    tratamentosDeErros.vet.is_not_a_vet(response);
});

document.addEventListener("DOMContentLoaded", async function(){
    const form = document.getElementById("formSearch");
    const codigo = document.getElementById("codigo-input");
    const codigo_feedback = document.getElementById("invalid-feedback-codigo");

    registrarPrototypes();
        
    validarCampo(codigo, codigo_feedback, validarTexto);

    form.validarFormulario(() => {
        redirectTo(`${ROUTES_SITE.pesquisar_pet}/${codigo.value}`)
    })


    iniciar();

    async function iniciar(){
        const id = capturarUUID();
        if (id){
            preencherDadosDoPet(id);
            validarFormularioMedicamento(id);
            validarFormularioMedicamentoEdicao();

            validarFormularioDoenca(id);
        }else{
            $("#hm-container").empty();
        }
    }
    
    async function preencherDadosDoPet(id){
        const headers = setAuthorizationTokenHeader();
        const url = `${ROUTES_API.vet_pets}/${id}`;
        codigo.value = id;
            

        await makeGetRequest(url, headers, async(response) => {
            const data = await response.json();
            renderizarInformacoesBasicasDoPet(data);
            renderizarListaMedicamentos(data.medical_history.medicines);
            renderizarListaDoencas(data.medical_history.illnesses);
        }, (response) => {
            renderizarNotFound("hm-container");
        })
    }

    // Medicamentos
    function validarFormularioMedicamento(id){
        const form = document.getElementById("form-medicamento");
        const nome = document.getElementById("nome-medicamento-input");
        const nome_feedback = document.getElementById("invalid-feedback-nome-medicamento");
        const data_aplicacao = document.getElementById("data-aplicacao-medicamento");
        const data_aplicacao_feedback = document.getElementById("invalid-feedback-data-aplicacao-medicamento");
        const data_reforco = document.getElementById("data-reforco-medicamento");
        const data_reforco_feedback = document.getElementById("invalid-feedback-data-reforco-medicamento");
        const tipo_medicamento = document.getElementById("tipo-medicamento");
        const tipo_medicamento_feedback = document.getElementById("invalid-feedback-tipo-medicamento");
        const detalhes = document.getElementById("detalhes-medicamento");
        const placeholder = document.getElementById("placeholder-medicamento");

        validarCampo(nome, nome_feedback, validarTexto);
        validarCampo(data_aplicacao, data_aplicacao_feedback, validarTexto);
        validarCampo(data_reforco, data_reforco_feedback, validarTexto);
        validarCampo(tipo_medicamento, tipo_medicamento_feedback, validarTexto);

        form.validarFormulario(async () => {
            const headers = setAuthorizationTokenHeader();
            const url = `${ROUTES_API.vet_pets}/${id}/medicine/add/`;

            const formData = {
                name: nome.value,
                date_application: data_aplicacao.value,
                date_reinforcement: data_reforco.value,
                details: detalhes.value || "",
                medicine_type: tipo_medicamento.value
            }

            await makePostRequest(url, headers, formData, (response) => {
                if(response.ok){
                    showAlert("Medicamento cadastrado com sucesso!", "success", placeholder);
                    redirectTo(window.location, 3000);
                }
            }, async(response) => {
                const data = await response.json();
                console.log(data);
            })
        })
    }
    function validarFormularioMedicamentoEdicao(){
        const formEditarMedicamento = document.getElementById("form-editar-medicamento");

        const idInput = document.getElementById("medicamento-id-editar");

        const nomeMedicamento = document.getElementById("nome-medicamento-editar");
        const nomeMedicamentoFeedback = document.getElementById("invalid-feedback-nome-medicamento-editar");

        const dataAplicacao = document.getElementById("data-aplicacao-medicamento-editar");
        const dataAplicacaoFeedback = document.getElementById("invalid-feedback-data-aplicacao-medicamento-editar");

        const dataReforco = document.getElementById("data-reforco-medicamento-editar");
        const dataReforcoFeedback = document.getElementById("invalid-feedback-data-reforco-medicamento-editar");

        const tipoMedicamento = document.getElementById("tipo-medicamento-editar");
        const tipoMedicamentoFeedback = document.getElementById("invalid-feedback-tipo-medicamento-editar");

        const detalhesMedicamento = document.getElementById("detalhes-medicamento-editar");
        const placeholderMedicamento = document.getElementById("placeholder-medicamento-editar");

        validarCampo(nomeMedicamento, nomeMedicamentoFeedback, validarTexto);
        validarCampo(dataAplicacao, dataAplicacaoFeedback, validarTexto);
        validarCampo(dataReforco, dataReforcoFeedback, validarTexto);
        validarCampo(tipoMedicamento, tipoMedicamentoFeedback, validarTexto);

        formEditarMedicamento.validarFormulario(async() => {
            const headers = setAuthorizationTokenHeader();
            const url = `${ROUTES_API.vet_pets}/medicines/${idInput.value}/`;

            const formData = {
                name: nomeMedicamento.value,
                date_application: dataAplicacao.value,
                date_reinforcement: dataReforco.value,
                details: detalhesMedicamento.value || "",
                medicine_type: tipoMedicamento.value
            }

            await putRequest(url, headers, formData, (response) => {
                if(response.ok){
                    showAlert("Medicamento alterado com sucesso!", "success", placeholderMedicamento);
                    redirectTo(window.location, 3000);
                }
            }, async(response) => {
                const data = await response.json();
                console.log(data);
            })
        })

    }
    window.carregarDadosMedicamentoParaEdicao = function(buttonElement) {
        const data = JSON.parse(buttonElement.dataset.medicamento);

        document.getElementById("medicamento-id-editar").value = data.id;
        document.getElementById("nome-medicamento-editar").value = data.name;
        document.getElementById("data-aplicacao-medicamento-editar").value = formatDateForInputDate(data.date_application);
        document.getElementById("data-reforco-medicamento-editar").value = formatDateForInputDate(data.date_reinforcement);
        document.getElementById("tipo-medicamento-editar").value = data.medicine_type.id;
        document.getElementById("detalhes-medicamento-editar").value = data.details || "";
    };
    window.excluirMedicamento = async function(buttonElement) {
        const id = buttonElement.dataset.id;

        const headers = setAuthorizationTokenHeader();
        const url = `${ROUTES_API.vet_pets}/medicines/${id}/`;
        
        await deleteRequest(url, headers, (response) => {
            if(response.ok){
                redirectTo(window.location);
            }
        }, async(response) => {
            const data = await response.json();
            console.log(data);
        })
   
    };


    function validarFormularioDoenca(id){
        const formRegistrarDoenca = document.getElementById("form-doenca");

        const nomeDoenca = document.getElementById("nome-doenca");
        const nomeDoencaFeedback = document.getElementById("invalid-feedback-nome-doenca");

        const sintomasDoenca = document.getElementById("sintomas-doenca");
        const sintomasDoencaFeedback = document.getElementById("invalid-feedback-sintomas-doeca");

        const descricaoDoenca = document.getElementById("descricao-doenca");

        const dataDiagnosticoDoenca = document.getElementById("data-diagnostico-doenca");
        const dataDiagnosticoDoencaFeedback = document.getElementById("invalid-feedback-data-diagnostico-doenca");

        const statusDoenca = document.getElementById("status-doenca");
        const statusDoencaFeedback = document.getElementById("invalid-feedback-status-doenca");

        const placeholder = document.getElementById("placeholder-doenca");

        validarCampo(nomeDoenca, nomeDoencaFeedback, validarTexto);
        validarCampo(sintomasDoenca, sintomasDoencaFeedback, validarTexto);
        validarCampo(dataDiagnosticoDoenca, dataDiagnosticoDoencaFeedback, validarTexto);
        validarCampo(statusDoenca, statusDoencaFeedback, validarTexto);

        formRegistrarDoenca.validarFormulario(async() => {
            const headers = setAuthorizationTokenHeader();
            const url = `${ROUTES_API.vet_pets}/${id}/illness/add/`;

            const formData = {
                name: nomeDoenca.value,
                symptoms: sintomasDoenca.value,
                description: descricaoDoenca.value || "",
                date_diagnosis: dataDiagnosticoDoenca.value,
                illness_status: statusDoenca.value
            };
            
            await makePostRequest(url, headers, formData, (response) => {
                if(response.ok){
                    showAlert("Doença cadastrado com sucesso!", "success", placeholder);
                    redirectTo(window.location, 3000);
                }
            }, async(response) => {
                const data = await response.json();
                console.log(data);
            })

        })
    }
});