import {getMessageOrDefault} from './tradutor.js';
import {redirectTo} from './site-utils.js';
import {variables, HTTP_STATUS, ROUTES_SITE, ROUTES_API} from './global.js';

export async function makePostRequest(url, headers = {}, formData = {}, responseCaseOk = (response) => {}, responseCaseError = (response) => {}, responseCaseErrorCatch = () => {}){
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            ...headers
            },
            body: JSON.stringify(formData)
        });
        if (response.ok) {
            return responseCaseOk(response);
        } else {
            return responseCaseError(response);
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        return responseCaseErrorCatch()
    }
}
export async function makeGetRequest(url, headers = {}, responseCaseOk = (response) => {}, responseCaseError = (response) => {}, responseCaseErrorCatch = () => {}) {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            ...headers
            }
        });
        if (response.ok) {
            return responseCaseOk(response);
        } else {
            return responseCaseError(response);
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        return responseCaseErrorCatch()
    }
}

export const tratamentosDeErros = {
    accounts: {
        register : {
            tratarErroDeEmail : async(response, callback) => {
                const data = await response.json();
                if (data.email && data.email.length > 0) {
                    const message = data.email[0]; 
                    const messageTraduzida = getMessageOrDefault(message);
                    
                    callback(messageTraduzida.message);
    
                    if (messageTraduzida.id == 1 ) {
                        redirectTo(ROUTES_SITE.login, 3000);
                    }
                }
            }
        },
        unauthorized: (response) => {
            if(response.status == HTTP_STATUS.not_authorized) {
                redirectTo(ROUTES_SITE.login)
            }
        },
    },
    owner : {
        register : {
            already_registered: (response, callback = (message) => {}) => {
                if(response.status == HTTP_STATUS.not_acceptable){
                    callback("Usuário já está cadastrado. Você será redirecionado para a página de login.");
                    redirectTo(ROUTES_SITE.login, 3000);
                }
            },
            donthaveregister: (response) => {
                if(response.status == HTTP_STATUS.bad_request){
                    redirectTo(ROUTES_SITE.cadastrar_informacoes);
                }
                if(response.status == HTTP_STATUS.not_authorized){
                    redirectTo(ROUTES_SITE.bem_vindo);
                }
            }
        }
    },
    default_error: async(response, callback = (message) => {}) => {
        const data = await response.json();
        const message = data.error || "";
        callback(getMessageOrDefault(message).message);
    }
}

export async function userIsAuthenticated(){
    const headers = setAuthorizationTokenHeader();
    const responseCaseError = (response) => {
        tratamentosDeErros.accounts.unauthorized(response);
    }
    const responseCaseOk = async(response) => {
        const data = await response.json();
    }
    await makeGetRequest(ROUTES_API.account_me, headers, responseCaseOk, responseCaseError)
}

export async function userHasRegister() {
    const headers = setAuthorizationTokenHeader();
    const responseCaseError = async(response) => {
       tratamentosDeErros.owner.register.donthaveregister(response);
    }
    const responseCaseOk = async(response) => {
        const data = await response.json();
        return data;
    }
    return await makeGetRequest(ROUTES_API.owner_me, headers, responseCaseOk, responseCaseError);
}

export async function makeLogin(email, password, callbackResponseCaseError = (response) => {}, callbackResponseCaseOk = (response) => {}) {
    const data = {
        email,
        password
    };
    const responseCaseOk = async(response) => {
        const data = await response.json();
        const token = data.token;
        setToken(token);
        return callbackResponseCaseOk();
    }
    return await makePostRequest(ROUTES_API.login, {}, data, responseCaseOk, callbackResponseCaseError);
}

export function getToken() {
    return localStorage.getItem(variables.localStorageKeyAccessToken);
}

export function setToken(token) {
    localStorage.setItem(variables.localStorageKeyAccessToken, token);
}
export function removeToken(){
    localStorage.removeItem(variables.localStorageKeyAccessToken);
}

export function setAuthorizationTokenHeader(){
    return {"Authorization": `Token ${getToken()}`};
}