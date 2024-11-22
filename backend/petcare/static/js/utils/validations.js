export function validarCEP(value){
    let msg = "";
    value = removeCarecteresNaoNumericos(value);

    if (value.length !== 8) {
        msg += "O Cep deve conter 8 carecteres";
    }
    return msg;
}
export function validarCpF(value){
    let msg = "";
    value = removeCarecteresNaoNumericos(value);

    if (value.length !== 11 || /^(\d)\1+$/.test(value)) {
        msg += "O CPF deve conter 11 caracteres.";
    }else{
        let soma = 0;
        for (let i = 0; i < 9; i++) {
            soma += parseInt(value[i]) * (10 - i);
        }
        let primeiroDigito = 11 - (soma % 11);
        primeiroDigito = primeiroDigito >= 10 ? 0 : primeiroDigito;

        if (parseInt(value[9]) !== primeiroDigito) {
            msg += "CPF invalido.";
        }else{
            soma = 0;
            for (let i = 0; i < 10; i++) {
                soma += parseInt(value[i]) * (11 - i);
            }
            let segundoDigito = 11 - (soma % 11);
            segundoDigito = segundoDigito >= 10 ? 0 : segundoDigito;
            if(!(parseInt(value[10]) === segundoDigito)) {
                msg += "CPF invalido.";
            } 
        }
    }
    return msg;
}
export function validarTelefone(value){
    let msg = "";
    value = removeCarecteresNaoNumericos(value);

    if (value.length === 12) {
        msg += "O telefone deve conter 12 carecteres";
    } 
    return msg;
}
export function validarSenha(value){
    let msg = "";
    if(value.length < 8 || value.length > 16 ) {
        msg += "A senha deve conter entre 8 a 16 carecteres";
    }
    return msg;
}
export function validarConfirmSenha(value, senha){
    let msg = "";
    if(value.trim().length === 0){
        msg += "O campo esta vazio.";
    }
    if(value !== senha){
        msg += "As senhas não são iguais.";
    }
    return msg;
}
export function validarTexto(value){
    let msg = "";
    value = value.trim();
    if (value == "") {
        msg += "O campo esta vazio.";
    }
    return msg;
}
export function removeCarecteresNaoNumericos(value){
    return value.replace(/[^\d]/g, '');
}