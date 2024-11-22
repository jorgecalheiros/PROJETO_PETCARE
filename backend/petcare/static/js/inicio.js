import {removeToken, makeGetRequest, setAuthorizationTokenHeader, userIsRegistered, tratamentosDeErros} from "./utils/api-utils.js";
import {ROUTES_API, ROUTES_SITE} from "./utils/global.js";
import { redirectTo } from "./utils/site-utils.js";

userIsRegistered((response) => {}, (response) => {
    tratamentosDeErros.owner.register.donthaveregister(response);
    tratamentosDeErros.accounts.unauthorized(response, ROUTES_SITE.bem_vindo);
});

document.addEventListener("DOMContentLoaded", async function(){
    const headers = setAuthorizationTokenHeader();
    const listaPets = $("#lista-pets").empty(); 
    const buttonLogout = document.getElementById("logout");

    await makeGetRequest(ROUTES_API.get_pets, headers, async(response) => {
        const data = await response.json();
        if(data.length == 0){
            listaPets.append(`
                <h3 class="col-lg-6">Sem pets cadastrados.</h3>
                `);
        }
        data.forEach(function(item){
            const linha = `

                <div class="col">
                    <div class="card">
                        <div class="card-body text-center">
                          <h5 class="card-title">${item.name}</h5>
                          <p class="card-text text-muted">
                            Raça: ${item.race} <br/>
                            Especie: ${item.species} <br/>
                            Peso: ${item.weight} kg<br/>
                          </p>
                          <div class="d-flex justify-content-center">
                            <a href="#" class="btn btn-default">Historico Medico</a>
                          </div>
                        </div>
                    </div>
                </div>
            
            `;
            listaPets.append(linha);
        })
    });
    buttonLogout.addEventListener("click", () => {
        removeToken();
        redirectTo(window.location);
    })
    
});

//<img src="static/imgs/pluto.png" class="card-img-top align-self-center mt-2" alt="..." style="width: 50%;">