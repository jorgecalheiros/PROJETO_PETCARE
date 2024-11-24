import {makeGetRequest, setAuthorizationTokenHeader, userIsRegistered, tratamentosDeErros} from "./utils/api-utils.js";
import {ROUTES_API, ROUTES_SITE} from "./utils/global.js";
import { logout } from "./utils/site-utils.js";

userIsRegistered((response) => {}, (response) => {
    tratamentosDeErros.owner.register.donthaveregister(response);
    tratamentosDeErros.accounts.unauthorized(response, ROUTES_SITE.bem_vindo);
});

document.addEventListener("DOMContentLoaded", async function(){
    const headers = setAuthorizationTokenHeader();
    const totalpets = $("#total-pets").empty(); 
    const buttonLogout = document.getElementById("logout");

    logout(buttonLogout);

    await makeGetRequest(ROUTES_API.get_pets, headers, async(response) => {
        const data = await response.json();
        totalpets.append(data.length);
    });
    
});

//<img src="static/imgs/pluto.png" class="card-img-top align-self-center mt-2" alt="..." style="width: 50%;">