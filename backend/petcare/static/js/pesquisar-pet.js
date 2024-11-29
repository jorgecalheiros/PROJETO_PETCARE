import {deleteRequest, makeGetRequest, makePostRequest, putRequest, setAuthorizationTokenHeader, tratamentosDeErros, user_is_vet_registered} from "./utils/api-utils.js";
import {ROUTES_API, ROUTES_SITE} from "./utils/global.js";
import {registrarPrototypes, validarCampo} from "./utils/form-utils.js";
import {validarTexto} from "./utils/validations.js"; 
import { capturarUUID, redirectTo, showAlert, formatDateForInputDate, recarregarPagina, formatarParaInputDatetimeLocal } from "./utils/site-utils.js";
import {renderizarInformacoesBasicasDoPet, renderizarListaCirurgias, renderizarListaConsultas, renderizarListaDoencas, renderizarListaMedicamentos, renderizarNotFound} from "./utils/medical_history_utils.js";

user_is_vet_registered(async(response) => {
}, (response) => {
    tratamentosDeErros.accounts.unauthorized(response, ROUTES_SITE.bem_vindo);
    tratamentosDeErros.vet.is_not_a_vet(response);
});

const time_wait = 3000;

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
            iniciarFormularios(id);
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
            renderizarListaCirurgias(data.medical_history.surgeries);
            renderizarListaConsultas(data.medical_history.queries);
        }, (response) => {
            renderizarNotFound("hm-container");
        })
    }
    function iniciarFormularios(id){
        initFormulariosMedicamentos(id)
        initFormulariosDoencas(id)
        initFormulariosCirurgia(id)
        initFormulariosConsulta(id)
    }

    function initFormulariosMedicamentos(id){
        const headers = setAuthorizationTokenHeader();
        validarFormularioMedicamento("", async(dataValidated) => {
            const url = `${ROUTES_API.vet_pets}/${id}/medicine/add/`;
            await makePostRequest(url, headers, dataValidated, (response) => {
                if(response.ok){
                    const placeholder = document.getElementById("placeholder-medicamento");
                    showAlert("Medicamento cadastrado com sucesso!", "success", placeholder);
                    recarregarPagina(time_wait);
                }
            }, async(response) => {
                const data = await response.json();
                console.log(data);
            })
        });

        validarFormularioMedicamento("-editar", async(data) => {
            const idInput = document.getElementById("id-medicamento-editar");
            const url = `${ROUTES_API.vet_pets}/medicines/${idInput.value}/`;

            await putRequest(url, headers, data, (response) => {
                if(response.ok){
                    const placeholder = document.getElementById("placeholder-medicamento-editar");
                    showAlert("Medicamento alterado com sucesso!", "success", placeholder);
                    recarregarPagina(time_wait);
                }
            }, async(response) => {
                const data = await response.json();
                console.log(data);
            })
        })
    }
    function initFormulariosDoencas(id){
        const headers = setAuthorizationTokenHeader();
        validarFormularioDoenca("", async(data) => {
            const url = `${ROUTES_API.vet_pets}/${id}/illness/add/`;

            await makePostRequest(url, headers, data, (response) => {
                if(response.ok){
                    const placeholder = document.getElementById("placeholder-doenca");
                    showAlert("Doença cadastrado com sucesso!", "success", placeholder);
                    recarregarPagina(time_wait);
                }
            }, async(response) => {
                const data = await response.json();
                console.log(data);
            })
        });
        
        validarFormularioDoenca("-editar", async(data) => {
            const idInput = document.getElementById("id-doenca-editar")
            const url = `${ROUTES_API.vet_pets}/illness/${idInput.value}/`;

            await putRequest(url, headers, data, (response) => {
                if(response.ok){
                    const placeholder = document.getElementById("placeholder-doenca-editar");
                    showAlert("Doença alterada com sucesso!", "success", placeholder);
                    recarregarPagina(time_wait);
                }
            }, async(response) => {
                const data = await response.json();
                console.log(data);
            })
        })
    }
    function initFormulariosCirurgia(id){
        const headers = setAuthorizationTokenHeader();
        validarFormularioCirurgia("", async(data) => {
            const url = `${ROUTES_API.vet_pets}/${id}/surgery/add/`;

            await makePostRequest(url, headers, data, (response) => {
                if(response.ok){
                    const placeholder = document.getElementById("placeholder-cirurgia");
                    showAlert("Cirurgia cadastrada com sucesso!", "success", placeholder);
                    recarregarPagina(time_wait);
                }
            }, async(response) => {
                const data = await response.json();
                console.log(data);
            })
        });

        validarFormularioCirurgia("-editar", async(data) => {
            const idInput = document.getElementById("id-cirurgia-editar")
            const url = `${ROUTES_API.vet_pets}/surgery/${idInput.value}/`;

            await putRequest(url, headers, data, (response) => {
                if(response.ok){
                    const placeholder = document.getElementById("placeholder-cirurgia-editar");
                    showAlert("Cirurgia alterada com sucesso!", "success", placeholder);
                    recarregarPagina(time_wait);
                }
            }, async(response) => {
                const data = await response.json();
                console.log(data);
            })
        });
    }
    function initFormulariosConsulta(id){
        const headers = setAuthorizationTokenHeader();
        validarFormularioConsulta("", async(data) => {
            const url = `${ROUTES_API.vet_pets}/${id}/consultation/add/`;

            await makePostRequest(url, headers, data, (response) => {
                if(response.ok){
                    const placeholder = document.getElementById("placeholder-consulta");
                    showAlert("Consulta cadastrada com sucesso!", "success", placeholder);
                    recarregarPagina(time_wait);
                }
            }, async(response) => {
                const data = await response.json();
                console.log(data);
            })
        });

        validarFormularioConsulta("-editar", async(data) => {
            const idInput = document.getElementById("id-consulta-editar")
            const url = `${ROUTES_API.vet_pets}/consultation/${idInput.value}/`;

            await putRequest(url, headers, data, (response) => {
                if(response.ok){
                    const placeholder = document.getElementById("placeholder-consulta-editar");
                    showAlert("Consulta alterada com sucesso!", "success", placeholder);
                    recarregarPagina(time_wait);
                }
            }, async(response) => {
                const data = await response.json();
                console.log(data);
            })
        });
    }

    // Medicamentos
    function validarFormularioMedicamento(prefix_id = "", callback = (dataValidated) => {}){
        const form = document.getElementById("form-medicamento" + prefix_id);
        const nome = document.getElementById("nome-medicamento" + prefix_id);
        const nome_feedback = document.getElementById("invalid-feedback-nome-medicamento" + prefix_id);
        const data_aplicacao = document.getElementById("data-aplicacao-medicamento" + prefix_id);
        const data_aplicacao_feedback = document.getElementById("invalid-feedback-data-aplicacao-medicamento" + prefix_id);
        const data_reforco = document.getElementById("data-reforco-medicamento" + prefix_id);
        const data_reforco_feedback = document.getElementById("invalid-feedback-data-reforco-medicamento" + prefix_id);
        const tipo_medicamento = document.getElementById("tipo-medicamento" + prefix_id);
        const tipo_medicamento_feedback = document.getElementById("invalid-feedback-tipo-medicamento" + prefix_id);
        const detalhes = document.getElementById("detalhes-medicamento" + prefix_id);

        validarCampo(nome, nome_feedback, validarTexto);
        validarCampo(data_aplicacao, data_aplicacao_feedback, validarTexto);
        validarCampo(data_reforco, data_reforco_feedback, validarTexto);
        validarCampo(tipo_medicamento, tipo_medicamento_feedback, validarTexto);

        form.validarFormulario(async () => {
            const formData = {
                name: nome.value,
                date_application: data_aplicacao.value,
                date_reinforcement: data_reforco.value,
                details: detalhes.value || "",
                medicine_type: tipo_medicamento.value
            }

            console.log(nome)

            callback(formData);
        })
    }
    window.carregarDadosMedicamentoParaEdicao = function(buttonElement) {
        const data = JSON.parse(buttonElement.dataset.medicamento);

        document.getElementById("id-medicamento-editar").value = data.id;
        document.getElementById("nome-medicamento-editar").value = data.name;
        document.getElementById("data-aplicacao-medicamento-editar").value = formatDateForInputDate(data.date_application);
        document.getElementById("data-reforco-medicamento-editar").value = formatDateForInputDate(data.date_reinforcement);
        document.getElementById("tipo-medicamento-editar").value = data.medicine_type.id;
        document.getElementById("detalhes-medicamento-editar").value = data.details || "";
    };
    window.excluirMedicamento = async function(buttonElement) {
        const id = buttonElement.dataset.id;
        const url = `${ROUTES_API.vet_pets}/medicines/${id}/`;
        excluirRegistros(url)
    };

    // Doencas
    function validarFormularioDoenca(prefix_id = "", callback = (dataValidated) => {}){
        const formRegistrarDoenca = document.getElementById("form-doenca" + prefix_id);

        const nomeDoenca = document.getElementById("nome-doenca" + prefix_id);
        const nomeDoencaFeedback = document.getElementById("invalid-feedback-nome-doenca" + prefix_id);

        const sintomasDoenca = document.getElementById("sintomas-doenca" + prefix_id);
        const sintomasDoencaFeedback = document.getElementById("invalid-feedback-sintomas-doeca" + prefix_id);

        const descricaoDoenca = document.getElementById("descricao-doenca" + prefix_id);

        const dataDiagnosticoDoenca = document.getElementById("data-diagnostico-doenca" + prefix_id);
        const dataDiagnosticoDoencaFeedback = document.getElementById("invalid-feedback-data-diagnostico-doenca" + prefix_id);

        const statusDoenca = document.getElementById("status-doenca" + prefix_id);
        const statusDoencaFeedback = document.getElementById("invalid-feedback-status-doenca" + prefix_id);

        validarCampo(nomeDoenca, nomeDoencaFeedback, validarTexto);
        validarCampo(sintomasDoenca, sintomasDoencaFeedback, validarTexto);
        validarCampo(dataDiagnosticoDoenca, dataDiagnosticoDoencaFeedback, validarTexto);
        validarCampo(statusDoenca, statusDoencaFeedback, validarTexto);

        formRegistrarDoenca.validarFormulario(() => {
            const formData = {
                name: nomeDoenca.value,
                symptoms: sintomasDoenca.value,
                description: descricaoDoenca.value || "",
                date_diagnosis: dataDiagnosticoDoenca.value,
                illness_status: statusDoenca.value
            };

            callback(formData);
        })
    }
    window.carregarDadosDoencaParaEdicao = function(buttonElement) {
        const data = JSON.parse(buttonElement.dataset.doenca);

        document.getElementById("id-doenca-editar").value = data.id;
        document.getElementById("nome-doenca-editar").value = data.name; 
        document.getElementById("sintomas-doenca-editar").value = data.symptoms; 
        document.getElementById("descricao-doenca-editar").value = data.description || ""; 
        document.getElementById("data-diagnostico-doenca-editar").value = formatDateForInputDate(data.date_diagnosis); 
        document.getElementById("status-doenca-editar").value = data.illness_status.id; 
    };
    window.excluirDoenca = async function(buttonElement) {
        const id = buttonElement.dataset.id;
        const url = `${ROUTES_API.vet_pets}/illness/${id}/`;
        excluirRegistros(url)
    };

    // Cirurgias
    function validarFormularioCirurgia(prefix_id = "", callback = (dataValidated) => {}) {
        const form = document.getElementById("form-cirurgia" + prefix_id);
        const nomeCirurgia = document.getElementById("nome-cirurgia" + prefix_id);
        const nomeCirurgiaFeedback = document.getElementById("invalid-feedback-nome-cirurgia" + prefix_id);
        const descricaoCirurgia = document.getElementById("descricao-cirurgia" + prefix_id);
        const dataCirurgia = document.getElementById("data-cirurgia" + prefix_id);
        const dataCirurgiaFeedback = document.getElementById("invalid-feedback-data-cirurgia" + prefix_id);
        const statusCirurgia = document.getElementById("status-cirurgia" + prefix_id);
        const statusCirurgiaFeedback = document.getElementById("invalid-feedback-status-cirurgia" + prefix_id);
    
     
        validarCampo(nomeCirurgia, nomeCirurgiaFeedback, validarTexto);
        validarCampo(dataCirurgia, dataCirurgiaFeedback, validarTexto);
        validarCampo(statusCirurgia, statusCirurgiaFeedback, validarTexto);

        form.validarFormulario(() => {
            const formData = {
                name: nomeCirurgia.value,
                details: descricaoCirurgia.value || "",
                date: dataCirurgia.value,
                surgery_status: statusCirurgia.value,
            };

            callback(formData);
        })
    }
    window.carregarDadosCirurgiaParaEdicao = function(buttonElement) {
        const data = JSON.parse(buttonElement.dataset.cirurgia);

        document.getElementById("id-cirurgia-editar").value = data.id;
        document.getElementById("nome-cirurgia-editar").value = data.name; 
        document.getElementById("descricao-cirurgia-editar").value = data.details || ""; 
        document.getElementById("data-cirurgia-editar").value = formatarParaInputDatetimeLocal(data.date); 
        document.getElementById("status-cirurgia-editar").value = data.surgery_status.id; 
    }
    window.excluirCirurgia = async function (buttonElement) {
        const id = buttonElement.dataset.id;
        const url = `${ROUTES_API.vet_pets}/surgery/${id}/`;
        excluirRegistros(url)
    }

    // Consultas
    function validarFormularioConsulta(prefix_id = "", callback = (data) => {}){
        const form = document.getElementById("form-consulta"+ prefix_id);
        const razaoConsulta = document.getElementById("razao-consulta" + prefix_id);
        const razaoConsultaFeedback = document.getElementById("invalid-feedback-razao-consulta" + prefix_id);
        const dataConsulta = document.getElementById("data-consulta" + prefix_id);
        const dataConsultaFeedback = document.getElementById("invalid-feedback-data-consulta" + prefix_id);

    
        validarCampo(razaoConsulta, razaoConsultaFeedback, validarTexto);
        validarCampo(dataConsulta, dataConsultaFeedback, validarTexto);

        form.validarFormulario(() => {
            const formData = {
                reason: razaoConsulta.value,
                date: dataConsulta.value,
            };

            callback(formData);
        })
    }
    window.carregarDadosConsultaParaEdicao = function (buttonElement) {
        const data = JSON.parse(buttonElement.dataset.consulta);

        document.getElementById("id-consulta-editar").value = data.id;
        document.getElementById("razao-consulta-editar").value = data.reason; 
        document.getElementById("data-consulta-editar").value = formatarParaInputDatetimeLocal(data.date); 
    }
    window.excluirConsulta = async function (buttonElement) {
        const id = buttonElement.dataset.id;

        const url = `${ROUTES_API.vet_pets}/consultation/${id}/`;
        excluirRegistros(url);
    }

    window.excluirRegistros = async function(url) {
        const button = document.getElementById("confirm-delete");
        const reject = document.getElementById("reject-delete");
        const close = document.getElementById("close");
        const result = document.getElementById("result");
    
        const deleteRegister = async () => {
            const headers = setAuthorizationTokenHeader();
            result.innerHTML = '<p class="text-info">Excluindo...</p>';
            await deleteRequest(
                url,
                headers,
                (response) => {
                    if (response.ok) {
                        result.innerHTML = '<p class="text-success">Excluido</p>';
                        recarregarPagina(3000);
                    }
                },
                async (response) => {
                    const data = await response.json();
                    console.error("Erro ao excluir registro:", data);
                }
            );
        };
    
        button.addEventListener("click", deleteRegister);
    
        reject.addEventListener("click", () => {
            button.removeEventListener("click", deleteRegister);
        });
        close.addEventListener("click", () => {
            button.removeEventListener("click", deleteRegister);
        })
    }
});