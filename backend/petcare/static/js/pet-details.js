import {makeGetRequest, setAuthorizationTokenHeader, user_have_register, tratamentosDeErros} from "./utils/api-utils.js";
import {ROUTES_API, ROUTES_SITE} from "./utils/global.js";
import {capturarUUID, formatarData} from "./utils/site-utils.js";

user_have_register(() => {}, 
    (response) => {
        tratamentosDeErros.owner.register.dont_have_register(response);
        tratamentosDeErros.accounts.unauthorized(response, ROUTES_SITE.bem_vindo);
    }
)

document.addEventListener("DOMContentLoaded", async function(){
    const headers = setAuthorizationTokenHeader();
    const id = capturarUUID();

    await makeGetRequest(`${ROUTES_API.get_pets}/${id}`, headers, async(response) => {
        const data = await response.json();
        
        renderizarInformacoesBasicasDoPet(data);
        renderizarListaMedicamentos(data.medical_history.medicines);
        renderizarListaDoencas(data.medical_history.illnesses);
        renderizarListaCirurgias(data.medical_history.surgeries);
        renderizarListaConsultas(data.medical_history.queries);
    }, (response) => {
       renderizarNotFound("conteudo");
    }); 

    // Renderizers
    function renderizarInformacoesBasicasDoPet(data){
        $("#nome").empty().append(data.name);
        $("#codigo").empty().append(data.id);
        $("#raca").empty().append(data.race);
        $("#especie").empty().append(data.species);
        $("#idade").empty().append(data.age);
        $("#peso").empty().append(`${data.weight} kg`);
        $("#genero").empty().append(data.gender.description);
        $("#obs").empty().append(data.medical_history.obs);
    }

    function renderizarListaMedicamentos(data){
        const list = $("#list-medicamentos").empty();
    
        if (data.length == 0){
            list.append("<h5>Sem medicamentos.</h5>")
        }
        data.forEach((item) => {
            const linha = `
                   <div class="border-bottom mb-3">
                        <p>Nome: <strong>${item.name}</strong></p>
                        <p>Tipo: <strong>${item.medicine_type.type}</strong></p>
                        <p>Data da aplicação: <strong>${formatarData(item.date_application)}</strong></p>
                        <p>Data de reforço: <strong>${formatarData(item.date_reinforcement)}</strong></p>
                        <p>Detalhes: <strong>${item.details}</strong></p>
                    </div>
            `;
            list.append(linha);
        })
    }
    
    function renderizarListaDoencas(data){
        const list = $("#list-doencas").empty();
    
        if (data.length == 0){
            list.append("<h5>Sem doenças documentadas.</h5>")
        }
        data.forEach((item) => {
            const linha = `
                   <div class="border-bottom mb-3">
                        <p>Nome: <strong>${item.name}</strong></p>
                        <p>Status: <strong>${item.illness_status.status}</strong></p>
                        <p>Sintomas: <strong>${item.symptoms}</strong></p>
                        <p>Descrição: <strong>${item.description}</strong></p>
                        <p>Data do diagnostico: <strong>${formatarData(item.date_diagnosis)}</strong></p>
                    </div>
            `;
            list.append(linha);
        })
    }
    
    function renderizarListaCirurgias(data){
        const list = $("#list-cirurgias").empty();
    
        if (data.length == 0){
            list.append("<h5>Sem cirurgias cadastradas.</h5>")
        }
        data.forEach((item) => {
            const linha = `
                     <div class="border-bottom mb-3">
                        <p>Nome: <strong>${item.name}</strong></p>
                        <p>Status: <strong>${item.surgery_status.status}</strong></p>
                        <p>Detalhes: <strong>${item.details}</strong></p>
                        <p>Data: <strong>${formatarData(item.date)}</strong></p>
                    </div>
            `;
            list.append(linha);
        })
    }
    
    function renderizarListaConsultas(data){
        const list = $("#list-consultas").empty();
    
        if (data.length == 0){
            list.append("<h5>Sem consultas cadastradas.</h5>")
        }
        data.forEach((item) => {
            const linha = `
                    <div class="border-bottom">
                        <p>Razão: <strong>${item.reason}</strong></p>
                        <p>Veterinario: <strong>${item.vet.name}</strong></p>
                        <p>Clinica: <strong>${item.clinic.name}</strong></p>
                        <p>Data: <strong>${formatarData(item.date)}</strong></p>
                    </div>
            `;
            list.append(linha);
        })
    }
    function renderizarNotFound(id){
        $(`#${id}`).empty().append(
            `
                <div class="alert alert-danger m-0" role="alert">
                    Não foi encontrado!
                </div>
            `
        );
    }
    
});