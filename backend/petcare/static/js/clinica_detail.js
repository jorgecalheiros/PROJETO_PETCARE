import {makeGetRequest, setAuthorizationTokenHeader, tratamentosDeErros, user_have_register} from "./utils/api-utils.js";
import {ROUTES_API, ROUTES_SITE} from "./utils/global.js";
import {capturarUUID, formatCEP, formatCNPJ} from "./utils/site-utils.js";

user_have_register(async(response) => {}, (response) => {
    tratamentosDeErros.owner.register.dont_have_register(response);
    tratamentosDeErros.accounts.unauthorized(response, ROUTES_SITE.bem_vindo);
});


document.addEventListener("DOMContentLoaded", async function(){ 
    const preencherInformacoesDaClinica = (clinica) => {
        $("#nome").append(clinica.name);
        $("#cnpj").append(formatCNPJ(clinica.cnpj));
    }

    
    const headers = setAuthorizationTokenHeader();
    const uuid = capturarUUID();

    const renderizarListaDeVet = (vets) => {
        const list = $("#list-vet").empty();

        vets.forEach((vet) => {
            console.log(vet);
            const item = `
                <div class="card mb-3">
                    <h5 class="card-header">${vet.name}</h5>
                    <div class="card-body">
                    <h5 class="card-title">${vet.specialization}</h5>
                    <p class="card-text">
                        <p>Email: ${vet.account.email}</p>
                        <p>Telefone: ${vet.phone}</p>
                    </p>
                    </div>
                </div>
            `;
            list.append(item);
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


    await makeGetRequest(`${ROUTES_API.clinicas}/${uuid}/`, headers, async(response) => {
        const data = await response.json();
        preencherInformacoesDaClinica(data);
        renderizarListaDeVet(data.vets);
    }, async (response) => {
        renderizarNotFound("conteudo");
    });
});