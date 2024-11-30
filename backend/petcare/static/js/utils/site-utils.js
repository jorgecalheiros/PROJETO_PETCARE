import {removeToken} from "./api-utils.js";

export function redirectTo(url, time = 0) {
    setTimeout(() => {
        window.location = url
    }, time)
}
export function recarregarPagina(time=0){
    setTimeout(() => {
        window.location.reload(true)
    }, time)
}

export function showAlert(message, type, placeholder){
    placeholder.innerHTML = "";
    var wrapper = document.createElement('div');
    wrapper.innerHTML = '<div class="alert alert-' + type + ' alert-dismissible" role="alert">' + message + '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';

    placeholder.append(wrapper)
}

export function logout(button){
    button.addEventListener("click", () => {
        removeToken();
        redirectTo(window.location);
    })
}

export function capturarUUID(){
    const pathname = window.location.pathname;

    // Define uma expressão regular para capturar o UUID
    const uuidRegex = /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/;

    // Executa a regex no caminho
    const match = pathname.match(uuidRegex);

    if (match !== null) {
        return match[0]
    }

    return false;
}

export function formatarData(value){
    const data = new Date(value);

    // Extrair partes da data
    const dia = String(data.getUTCDate()).padStart(2, '0');
    const mes = String(data.getUTCMonth() + 1).padStart(2, '0'); // Os meses são baseados em zero
    const ano = data.getUTCFullYear();
    const horas = String(data.getUTCHours()).padStart(2, '0');
    const minutos = String(data.getUTCMinutes()).padStart(2, '0');

    // Formatar no padrão desejado
    return `${dia}/${mes}/${ano} ${horas}:${minutos}`;
}


export function formatDateForInputDate(value){
    return value.split('T')[0];
}

export function formatarParaInputDatetimeLocal(dataISO) {
    const data = new Date(dataISO);

    const dia = String(data.getUTCDate()).padStart(2, '0');
    const mes = String(data.getUTCMonth() + 1).padStart(2, '0');
    const ano = data.getUTCFullYear();
    const horas = String(data.getUTCHours()).padStart(2, '0');
    const minutos = String(data.getUTCMinutes()).padStart(2, '0');

    return `${ano}-${mes}-${dia}T${horas}:${minutos}`;
}