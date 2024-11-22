export function redirectTo(url, time = 0) {
    setTimeout(() => {
        window.location = url
    }, time)
}

export function showAlert(message, type, placeholder){
    placeholder.innerHTML = "";
    var wrapper = document.createElement('div');
    wrapper.innerHTML = '<div class="alert alert-' + type + ' alert-dismissible" role="alert">' + message + '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';

    placeholder.append(wrapper)
}