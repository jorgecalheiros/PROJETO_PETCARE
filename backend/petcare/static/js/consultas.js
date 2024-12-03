import {makeGetRequest, setAuthorizationTokenHeader, tratamentosDeErros, user_have_register} from "./utils/api-utils.js";
import {ROUTES_API, ROUTES_SITE} from "./utils/global.js";
import {formatCEP, formatarData} from "./utils/site-utils.js";

user_have_register(async(response) => {}, (response) => {
    tratamentosDeErros.owner.register.dont_have_register(response);
    tratamentosDeErros.accounts.unauthorized(response, ROUTES_SITE.bem_vindo);
});


document.addEventListener("DOMContentLoaded", async function(){ 
    const headers = setAuthorizationTokenHeader();

    const renderizarNota = (data) => {
        const agora = new Date();
        const dataAtualUTC = new Date(Date.UTC(agora.getUTCFullYear(), agora.getUTCMonth(), agora.getUTCDate()));

    
        const dataParametro = new Date(data);
        const dataParametroUTC = new Date(Date.UTC(dataParametro.getUTCFullYear(), dataParametro.getUTCMonth(), dataParametro.getUTCDate()));

        let textoBotao;
        let cor;
        if (dataAtualUTC > dataParametroUTC) {
            textoBotao = "Realizada";
            cor = "btn-success";
        } else if (dataAtualUTC < dataParametroUTC) {
            textoBotao = "Pendente";
            cor = "btn-primary";
        } else {
            textoBotao = "Marcada para hoje";
            cor = "btn-warning";
        }

        return `
            <button type="button" class="btn ${cor}" style="--bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: .75rem;">
                ${textoBotao}
            </button>
        `;
    }

    function ordenarConsultasPorProximidade(dados) {
        const hoje = new Date();

        const obterDiaMes = (data) => {
            const utcData = new Date(data);
            return `${utcData.getUTCDate()}-${utcData.getUTCMonth() + 1}`;
        };

        const hojeDiaMes = obterDiaMes(hoje);

        return dados.sort((a, b) => {
            const dataA = new Date(a.date);
            const dataB = new Date(b.date);

            const ehHojeA = obterDiaMes(dataA) === hojeDiaMes;
            const ehHojeB = obterDiaMes(dataB) === hojeDiaMes;

            // Priorizar datas do dia atual (mesmo dia e mês)
            if (ehHojeA && !ehHojeB) return -1;
            if (!ehHojeA && ehHojeB) return 1;

            // Ordenar datas futuras (mais próximas primeiro)
            if (dataA >= hoje && dataB >= hoje) return dataA - dataB;

            // Ordenar datas passadas (mais recentes primeiro)
            if (dataA < hoje && dataB < hoje) return dataB - dataA;

            // Se nenhum dos critérios acima for aplicado, manter a ordem original
            return 0;
        });
    }

    const renderizarListaDeConsultas = (consultas) => {
        const list = $("#list-consultas").empty();
        consultas = ordenarConsultasPorProximidade(consultas);


        if (consultas.length == 0){
            list.append( `
                <div class="alert alert-danger m-0" role="alert">
                    Não tem nenhuma consulta registrada.
                </div>
            `)
        }else{
            consultas.forEach((consulta) => {
                const item = `
                    <div class="card mb-3">
                        <h5 class="card-header">${consulta.reason}</h5>
                        <div class="card-body">
                        <h5 class="card-title">Na clinica <u>${consulta.clinic}</u> com <u>${consulta.vet}</u> </h5>
                        <p class="card-text">
                            <p>Local: ${formatCEP(consulta.address.cep)}, ${consulta.address.city}, ${consulta.address.state}</p>
                            <p>Data: ${formatarData(consulta.date)}</p>
                            <hr/>
                            <p class="mb-1">Pet</p>
                            <p class="m-0">Nome: ${consulta.pet.name}</p>
                            <p class="m-0">Especie: ${consulta.pet.species}</p>
                            <p class="m-0">Raça: ${consulta.pet.race}</p>
                            <p class="m-0">Idade: ${consulta.pet.age}</p>
                            <p class="m-0">Peso: ${consulta.pet.weight} kg</p>
                            <br/>
                            <div class="d-flex justify-content-end">
                                ${renderizarNota(consulta.date)}
                            </div>
                        </p>
                        </div>
                    </div>
                `;
                list.append(item);
            })
        }
    }


    await makeGetRequest(`${ROUTES_API.get_pets}/buscartodasconsultas/`, headers, async(response) => {
        const data = await response.json();
        renderizarListaDeConsultas(data);
      
    }, async (response) => {
        console.log(await response.json());
    });
});