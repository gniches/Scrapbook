// Criar um array para armazenar os recados
var listaDeRecados = [];
var objetoMensagem;
var objetoTitulo;

// Função para calcular o próximo indice
function proximoID(lista) {
    var maior = 0;

    for (var indice = 0; indice < lista.length; indice++) {
        maior = Math.max(maior, lista[indice].id);
    }

    return ++maior;
}

// Adicionar um recado a lista
function adicionaRecado() {
    var mensagem = objetoMensagem.value;
    var titulo = objetoTitulo.value;

    if (mensagem === "") {
        alert("Digite uma mensagem");
        return;
    }

    if (titulo === "") {
        alert("Digite um título");
        return;
    }

    // retiro caracteres invalidos
    mensagem = mensagem.replaceAll("'", ' ');

    listaDeRecados.push({
        texto: mensagem,
        titulo: titulo,
        id: proximoID(listaDeRecados)
    });

    // limpo o titulo
    objetoTitulo.value = "";
    // limpo o campo mensagem para uma nova mensagem
    objetoMensagem.value = "";
    // volto o foco pro campo mensagem
    objetoMensagem.focus();

    // mostar os itens na tela
    mostrarDados(listaDeRecados);

    // Salvar na localStorage
    salvarDados(listaDeRecados);

    // mostrar o alerta por 3 segundos
    var divAlerta = document.getElementById("alerta");
    divAlerta.style.display = "block";

    setTimeout(function () {
        divAlerta.style.display = "none";
    }, 3000);
}

// Salvar os dados no localStorage
function salvarDados(lista) {
    localStorage.setItem("salvo", JSON.stringify(lista));
}

// Escuto o Evento LOAD da página
window.addEventListener('load', function () {
    carregaRecadosSalvos();

    // preencho o objeto mensagem com o input mensagem do html
    objetoMensagem = document.getElementById("mensagem");
    // preencho o objeto botaoEnviar com o objeto Botão do html
    var botaoEnviar = document.getElementById("enviar");

    // preencho o objeto titulo com o objeto da tela
    objetoTitulo = document.getElementById("titulo");

    // escuto um clique no botão enviar
    botaoEnviar.addEventListener('click', function () {
        // chamo a função de adicionar o recado
        adicionaRecado();
    });

    var divAlerta = document.getElementById("alerta");
    divAlerta.style.display = "none";

    // escutar o enter no input da mensagem
    objetoMensagem.addEventListener('keypress', function (ev) {
        if (ev.key === "Enter") {
            // previno o enter indesejado
            ev.preventDefault();

            // chamo a função de adicionar o recado
            adicionaRecado();
        }
    });
});

function carregaRecadosSalvos() {
    // Busco os dados do local Storage
    var dadosSalvos = localStorage.getItem("salvo");

    // Se encontrou tarefas adiciona lista de Itens e mostra na tabela
    if (dadosSalvos !== null) {
        // Se houverem dados transformo o texto em uma Lista de objetos
        listaDeRecados = JSON.parse(dadosSalvos);
    } else {
        listaDeRecados = [];
    }

    // Mostro os dados iniciais na tela
    mostrarDados(listaDeRecados);
}

function mostrarDados(lista) {
    var divRecados = document.getElementById("recados");

    var novoHTML = "";

    var novalista = lista.slice(0, lista.length);

    novalista.reverse();

    for (var recado of novalista) {
        novoHTML += `
            <div class="col-md-4">
                <div class="card mb-3">
                    <div class="card-body">
                        <h5 class="card-title">${recado.titulo}</h5>
                        <h6 class="card-subtitle mb-2 text-muted"></h6>
                        <p class="card-text">${recado.texto}</p>
                        <a href="#" class="card-link" onclick="excluir(${recado.id})">Excluir</a>
                        <a href="#" onclick="editar(${recado.id})" class="card-link" data-toggle="modal" data-target="#staticBackdrop">Editar</a>
                    </div>
                </div>
            </div>
        `;
    }

    divRecados.innerHTML = novoHTML;
}

function editar(recado) {
    var indice = listaDeRecados.findIndex(f => f.id === recado);
    var objeto = listaDeRecados[indice];

    document.getElementById("codigo").value = objeto.id;
    document.getElementById("titulo2").value = objeto.titulo;
    document.getElementById("mensagem2").value = objeto.texto;
}

function salvarItem() {
    var id = document.getElementById("codigo").value;
    var indice = listaDeRecados.findIndex(f => f.id === parseInt(id));

    listaDeRecados[indice].titulo = document.getElementById("titulo2").value;
    listaDeRecados[indice].texto = document.getElementById("mensagem2").value;

    mostrarDados(listaDeRecados);
    salvarDados(listaDeRecados);
}

function excluir(texto) {
    var indice = listaDeRecados.findIndex(f => f.id === texto);
    if (indice < 0) {
        return;
    }

    if (!confirm("Confirma a exclusão")) {
        return;
    }

    listaDeRecados.splice(indice, 1);

    mostrarDados(listaDeRecados);
    salvarDados(listaDeRecados);
}