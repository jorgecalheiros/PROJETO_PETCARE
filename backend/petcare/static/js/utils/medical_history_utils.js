import {formatarData} from "./site-utils.js";

export function renderizarNotFound(id){
    $(`#${id}`).empty().append(
        `
            <div class="alert alert-danger m-0" role="alert">
                Não foi encontrado!
            </div>
        `
    );
}