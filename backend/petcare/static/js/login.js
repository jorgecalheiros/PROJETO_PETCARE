import {validarCampo, registrarPrototypes} from "./utils/form-utils.js";
import {validarTexto, validarSenha} from "./utils/validations.js";
import {makeLogin, tratamentosDeErros} from "./utils/api-utils.js";
import {showAlert, redirectTo} from "./utils/site-utils.js";
import {ROUTES_SITE} from "./utils/global.js";

document.addEventListener("DOMContentLoaded", function(){
    const form = document.getElementById("loginForm");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const email_feedback = document.getElementById("invalid-feedback-email");
    const password_feedback = document.getElementById("invalid-feedback-password");
    const alertPlaceholder = document.getElementById("liveAlertPlaceholder");

    registrarPrototypes();
    validarCampo(email, email_feedback, validarTexto);
    validarCampo(password, password_feedback, validarSenha);

    form.validarFormulario(async() => {
        let canRedirect = true;
        const responseCaseError = async(response) => {
            tratamentosDeErros.default_error(response, (message) => {
                showAlert(message, "danger", alertPlaceholder);
            });
            canRedirect = false;
        }
        const responseCaseOk = async(response) => {
            canRedirect = true;
        }
        await makeLogin(email.value, password.value, responseCaseError, responseCaseOk);
        if(canRedirect) redirectTo(ROUTES_SITE.pagina_inicial);
    })

});