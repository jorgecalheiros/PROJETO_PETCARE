import {makeGetRequest, setAuthorizationTokenHeader, tratamentosDeErros, user_have_register} from "./utils/api-utils.js";
import {ROUTES_API, ROUTES_SITE} from "./utils/global.js";
import {formatCEP, formatCNPJ} from "./utils/site-utils.js";

document.addEventListener("DOMContentLoaded", async function(){ 
    const preencherInformacoesDeEndereco = (address) => {
        $("#cep").append(address.cep);
        $("#cidade").append(address.city);
        $("#estado").append(address.state);
    }

    user_have_register(async(response) => {
        const data = await response.json();
        preencherInformacoesDeEndereco(data.address);
    }, (response) => {
        tratamentosDeErros.owner.register.dont_have_register(response);
        tratamentosDeErros.accounts.unauthorized(response, ROUTES_SITE.bem_vindo);
    });

    const renderizarListaDeClinicas = (clinicas) => {
        const list = $("#list-clinicas").empty();

        if (clinicas.length == 0){
            list.append( `
                <div class="alert alert-danger m-0" role="alert">
                    Sem clinicas por perto!
                </div>
            `)
        }else{
            clinicas.forEach((clinica) => {
                const item = `
                    <div class="card mb-3">
                        <h5 class="card-header">${clinica.name}</h5>
                        <div class="card-body">
                        <h5 class="card-title">CNPJ: ${formatCNPJ(clinica.cnpj)}</h5>
                        <p class="card-text">
                            <p>Veterinarios(as): ${clinica.vets.length}</p>
                            <p>${formatCEP(clinica.address.cep)}, ${clinica.address.city}, ${clinica.address.state}</p>
                        </p>
                        <a href="/buscarclinicas/${clinica.id}" class="btn btn-orange">Detalhes</a>
                        </div>
                    </div>
                `;
                list.append(item);
            })
        }
    }

    
    const headers = setAuthorizationTokenHeader();

    await makeGetRequest(ROUTES_API.buscarclinicas, headers, async(response) => {
        const data = await response.json();
        renderizarListaDeClinicas(data);
    }, async(response) => {
        const list = $("#list-clinicas").empty();
        list.append(`                <div class="alert alert-danger m-0" role="alert">
                    Sem clinicas por perto!
                </div>`);
    });
});