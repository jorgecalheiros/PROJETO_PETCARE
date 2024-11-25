import {makeGetRequest, setAuthorizationTokenHeader, user_have_register, tratamentosDeErros} from "./utils/api-utils.js";
import {ROUTES_API, ROUTES_SITE} from "./utils/global.js";
import {capturarUUID } from "./utils/site-utils.js";

await user_have_register(() => {}, 
    (response) => {
        tratamentosDeErros.owner.register.dont_have_register(response);
        tratamentosDeErros.accounts.unauthorized(response, ROUTES_SITE.bem_vindo);
    }
)

document.addEventListener("DOMContentLoaded", async function(){
    const headers = setAuthorizationTokenHeader();
    const list_medicamento = $("#list-medicamentos");
    const id = capturarUUID();

    const raca = document.getElementById("raca");
    const especie = document.getElementById("especie");
    const idade = document.getElementById("idade");
    const peso = document.getElementById("peso");
    const genero = document.getElementById("genero");
    const nome = document.getElementById("nome");
    const codigo = document.getElementById("codigo");
    const obs = document.getElementById("obs");


    await makeGetRequest(`${ROUTES_API.get_pets}/${id}`, headers, async(response) => {
        const data = await response.json();
        const historico_medico = data.medical_history;
        const medicines = historico_medico.medicines;
        nome.innerHTML = data.name;
        raca.innerHTML = data.race;
        especie.innerHTML = data.species;
        idade.innerHTML = data.age;
        peso.innerHTML = `${data.weight} kg`;
        genero.innerHTML = data.gender.description;
        codigo.innerHTML = data.id;
        obs.innerHTML = historico_medico.obs;
        

        //appendOnMedicines(medicines);
        
    }); 
    
    function appendOnMedicines(medicines){
        appendData(medicines, "Sem medicamentos cadastrados.", list_medicamento, (medicine) => {
            console.log(medicine);
        });
    }

    function appendData(array, message, element , callback = (item) => {}){
        if(array.length == 0) {
            element.append(message);
        }else{
            array.forEach((item) => callback(item));
        }
    }

});