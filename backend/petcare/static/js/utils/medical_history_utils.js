import {formatarData} from "./site-utils.js";


export function renderizarInformacoesBasicasDoPet(data){
    $("#nome").empty().append(data.name);
    $("#codigo").empty().append(data.id);
    $("#raca").empty().append(data.race);
    $("#especie").empty().append(data.species);
    $("#idade").empty().append(data.age);
    $("#peso").empty().append(`${data.weight} kg`);
    $("#genero").empty().append(data.gender.description);
    $("#obs").empty().append(data.medical_history.obs);
}

export function renderizarListaMedicamentos(data){
    const list = $("#list-medicamentos").empty();

    if (data.length == 0){
        list.append("<h5>Sem medicamentos.</h5>")
    }
    data.forEach((item) => {
        const linha = `
               <div class="border-bottom mb-3">
                    <p>Nome: <strong>${item.name}</strong></p>
                    <p>Tipo: <strong>${item.medicine_type.type}</strong></p>
                    <p>Data da aplicação: <strong>${formatarData(item.date_application)}</strong></p>
                    <p>Data de reforço: <strong>${formatarData(item.date_reinforcement)}</strong></p>
                    <p>Detalhes: <strong>${item.details}</strong></p>
                    <div class="mb-2">
                        <button class="btn btn-primary" data-medicamento='${JSON.stringify(item)}' onclick="carregarDadosMedicamentoParaEdicao(this)" data-bs-toggle="modal" data-bs-target="#editar-medicamento-modal">
                            Editar
                        </button>
                        <button class="btn btn-danger" data-id='${item.id}' onclick="excluirMedicamento(this)" data-bs-toggle="modal" data-bs-target="#success-delete">
                            Excluir
                        </button>
                    </div>
                </div>
        `;
        list.append(linha);
    })
}

export function renderizarListaDoencas(data){
    const list = $("#list-doencas").empty();

    if (data.length == 0){
        list.append("<h5>Sem doenças documentadas.</h5>")
    }
    data.forEach((item) => {
        const linha = `
               <div class="border-bottom mb-3">
                    <p>Nome: <strong>${item.name}</strong></p>
                    <p>Status: <strong>${item.illness_status.status}</strong></p>
                    <p>Sintomas: <strong>${item.symptoms}</strong></p>
                    <p>Descrição: <strong>${item.description}</strong></p>
                    <p>Data do diagnostico: <strong>${formatarData(item.date_diagnosis)}</strong></p>
                    <div class="mb-2">
                        <button class="btn btn-primary" data-doenca='${JSON.stringify(item)}' onclick="carregarDadosDoencaParaEdicao(this)" data-bs-toggle="modal" data-bs-target="#editar-doenca-modal">
                            Editar
                        </button>
                        <button class="btn btn-danger" data-id='${item.id}' onclick="excluirDoenca(this)" data-bs-toggle="modal" data-bs-target="#success-delete">
                            Excluir
                        </button>
                    </div>
                </div>
        `;
        list.append(linha);
    })
}

export function renderizarListaCirurgias(data){
    const list = $("#list-cirurgias").empty();

    if (data.length == 0){
        list.append("<h5>Sem cirurgias cadastradas.</h5>")
    }
    data.forEach((item) => {
        const linha = `
                 <div class="border-bottom mb-3">
                    <p>Nome: <strong>${item.name}</strong></p>
                    <p>Status: <strong>${item.surgery_status.status}</strong></p>
                    <p>Detalhes: <strong>${item.details}</strong></p>
                    <p>Data: <strong>${formatarData(item.date)}</strong></p>
                     <div class="mb-2">
                        <button class="btn btn-primary" data-cirurgia='${JSON.stringify(item)}' onclick="carregarDadosCirurgiaParaEdicao(this)" data-bs-toggle="modal" data-bs-target="#editar-cirurgia-modal">
                            Editar
                        </button>
                        <button class="btn btn-danger" data-id='${item.id}' onclick="excluirCirurgia(this)" data-bs-toggle="modal" data-bs-target="#success-delete">
                            Excluir
                        </button>
                    </div>
                </div>
        `;
        list.append(linha);
    })
}

export function renderizarListaConsultas(data){
    const list = $("#list-consultas").empty();

    if (data.length == 0){
        list.append("<h5>Sem consultas cadastradas.</h5>")
    }
    data.forEach((item) => {
        const linha = `
                <div class="border-bottom">
                    <p>Razão: <strong>${item.reason}</strong></p>
                    <p>Veterinario: <strong>${item.vet.name}</strong></p>
                    <p>Clinica: <strong>${item.clinic.name}</strong></p>
                    <p>Data: <strong>${formatarData(item.date)}</strong></p>
                          <div class="mb-2">
                        <button class="btn btn-primary" data-consulta='${JSON.stringify(item)}' onclick="carregarDadosConsultaParaEdicao(this)" data-bs-toggle="modal" data-bs-target="#editar-consulta-modal">
                            Editar
                        </button>
                        <button class="btn btn-danger" data-id='${item.id}' onclick="excluirConsulta(this)" data-bs-toggle="modal" data-bs-target="#success-delete">
                            Excluir
                        </button>
                    </div>
                </div>
        `;
        list.append(linha);
    })
}

export function renderizarNotFound(id){
    $(`#${id}`).empty().append(
        `
            <div class="alert alert-danger m-0" role="alert">
                Não foi encontrado!
            </div>
        `
    );
}