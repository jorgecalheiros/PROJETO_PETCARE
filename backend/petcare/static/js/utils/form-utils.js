export function validarCampo(input, feedback, validationMethod = (value) => {}){
    input.addEventListener("blur", () => {
        const validation = validationMethod(input.value);
        if(validation != ""){
            input.setCustomValidity(validation);
            setValidationFeedback(feedback, input.validationMessage);
            invalidClass(input);
        }else{
            input.setCustomValidity("");
            setValidationFeedback(feedback, input.validationMessage);
            validClass(input);
        }
    });
}
export function setValidationFeedback(feedback, message){
    feedback.innerText = message;
}
function invalidClass(input){
    input.classList.add('is-invalid');
    input.classList.remove('is-valid');
}
export function validClass(input){
    input.classList.add("is-valid");
    input.classList.remove("is-invalid");
}

export function registrarPrototypes(){
    HTMLFormElement.prototype.validarFormulario = function(callback = () => {}){
        this.addEventListener("submit", function(event) {
            event.preventDefault();
            if (!this.checkValidity()) {
                event.stopPropagation();
                this.classList.add('was-validated');
                return; 
            }
            callback();
        });
    }
}