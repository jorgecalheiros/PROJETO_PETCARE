import {makeGetRequest, setAuthorizationTokenHeader, userIsRegistered, tratamentosDeErros} from "./utils/api-utils.js";
import {ROUTES_API, ROUTES_SITE} from "./utils/global.js";
import {logout, capturarUUID } from "./utils/site-utils.js";

userIsRegistered((response) => {}, (response) => {
    tratamentosDeErros.owner.register.donthaveregister(response);
    tratamentosDeErros.accounts.unauthorized(response, ROUTES_SITE.bem_vindo);
});

document.addEventListener("DOMContentLoaded", async function(){
    const buttonLogout = document.getElementById("logout");
    const headers = setAuthorizationTokenHeader();
    const id = capturarUUID();

    const raca = document.getElementById("raca");
    const especie = document.getElementById("especie");
    const idade = document.getElementById("idade");
    const peso = document.getElementById("peso");
    const genero = document.getElementById("genero");
    const nome = document.getElementById("nome");
    const codigo = document.getElementById("codigo");

    logout(buttonLogout);

    await makeGetRequest(`${ROUTES_API.get_pets}/${id}`, headers, async(response) => {
        const data = await response.json();
        nome.innerHTML = data.name;
        raca.innerHTML = data.race;
        especie.innerHTML = data.species;
        idade.innerHTML = data.age;
        peso.innerHTML = `${data.weight} kg`;
        genero.innerHTML = data.gender.description;
        codigo.innerHTML = data.id;
    }); 
    
});