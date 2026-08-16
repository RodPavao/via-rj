let servicos = [

    // HABILITAÇÃO
    {
        nome: "Primeira CNH",
        categoria: "Habilitação",
        palavrasChave: ["primeira cnh", "primeira habilitacao", "tirar carteira", "cnh"],
        mensagem: "Orientações sobre o processo de primeira habilitação"
    },
    {
        nome: "Segunda Via da CNH",
        categoria: "Habilitação",
        palavrasChave: ["segunda via cnh", "perdi cnh", "cnh perdida", "carteira perdida", "segunda via habilitacao"],
        mensagem: "Orientações para solicitar a segunda via da CNH"
    },
    {
        nome: "Renovação da CNH",
        categoria: "Habilitação",
        palavrasChave: ["renovacao", "renovar", "cnh", "carteira", "habilitacao"],
        mensagem: "Orientações sobre renovação da CNH",
        requisitos: "Conteúdo será levantado e validado posteriormente",
        documentos: "Conteúdo será levantado e validado posteriormente",
        etapas: "Conteúdo será levantado e validado posteriormente"
    },
    {
        nome: "Outros Serviços de Habilitação",
        categoria: "Habilitação",
        palavrasChave: ["outros habilitação", "outros serviços habilitação"],
        mensagem: "Acesso aos demais serviços de habilitação"
    },

    // VEÍCULOS
    {
        nome: "Licenciamento Anual",
        categoria: "Veículos",
        palavrasChave: ["licenciamento", "anual", "veículo", "licenciamento", "licenciar", "documento carro", "crlv"],
        mensagem: "Orientações sobre o licenciamento anual do veículo"
    },
    {
        nome: "Vistoria Veicular",
        categoria: "Veículos",
        palavrasChave: ["vistoria", "veiculo", "carro", "inspecao"],
        mensagem: "Orientações sobre vistoria veicular"
    },
    {
        nome: "Segunda Via do CRV",
        categoria: "Veículos",
        palavrasChave: ["segunda via crv", "crv", "recibo", "recibo do carro", "documento de propriedade", "segunda via documento veiculo"],
        mensagem: "Orientações para solicitar a segunda via do CRV"
    },
    {
        nome: "Outros Serviços de Veículos",
        categoria: "Veículos",
        palavrasChave: ["outros veículos", "outros serviços veículos"],
        mensagem: "Acesso aos demais serviços relacionados a veículos"
    },

    // IDENTIFICAÇÃO
    {
        nome: "Identificação Civil",
        categoria: "Identificação",
        palavrasChave: ["identidade", "carteira de identidade", "rg", "documento", "identificacao"],
        mensagem: "Orientações sobre serviços de identificação civil"
    },
    {
        nome: "Segunda Via da Identidade",
        categoria: "Identificação",
        palavrasChave: ["segunda via identidade", "segunda via rg", "perdi identidade", "perdi rg", "identidade perdida", "rg perdido", "novo rg"],
        mensagem: "Orientações para solicitar a segunda via da identidade"
    },
    {
        nome: "Outros Serviços de Identificação",
        categoria: "Identificação",
        palavrasChave: ["outros identificação", "outros serviços identificação"],
        mensagem: "Acesso aos demais serviços de identificação"
    },

    // INFRAÇÕES
    {
        nome: "Consultar Infração",
        categoria: "Infrações",
        palavrasChave: ["infracao", "multa", "pontos", "autuacao"],
        mensagem: "Orientações para consultar infrações"
    },
    {
        nome: "Defesa Prévia",
        categoria: "Infrações",
        palavrasChave: ["defesa previa", "recorrer multa", "recurso", "autuacao"],
        mensagem: "Orientações sobre apresentação de defesa prévia"
    },
    {
        nome: "Real Infrator",
        categoria: "Infrações",
        palavrasChave: ["real infrator", "indicar condutor", "indicacao de condutor", "transferir pontos", "transferencia de pontos", "multa de outra pessoa", "nao era eu dirigindo"],
        mensagem: "Orientações sobre o procedimento de identificação do real infrator"
    },
    {
        nome: "Outros Serviços de Infrações",
        categoria: "Infrações",
        palavrasChave: ["outros infrações", "outros serviços infrações"],
        mensagem: "Acesso aos demais serviços relacionados a infrações"
    }

];

let resultado = document.getElementById("resultado");

function normalizarTexto(texto) {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

function pesquisarServico() {


    // 1. PEGAR DADOS DA TELA
    let pesquisa = document.getElementById("pesquisa").value;
    

    // 2. LIMPAR RESULTADO ANTERIOR
    resultado.textContent = "";

    // 3. VALIDAR
    if (pesquisa === "") {
        resultado.textContent = "Digite o serviço que você procura";
        return;
    }


    // 4. PROCURAR SERVIÇO
let termo = normalizarTexto(pesquisa);

for (let servico of servicos) {

    let encontrouPalavra = false;

for (let palavra of servico.palavrasChave) {

    let palavraNormalizada = normalizarTexto(palavra);

if (
    termo.includes(palavraNormalizada) ||
    palavraNormalizada.includes(termo)
) {
        encontrouPalavra = true;
        break;
    }
}

    if (encontrouPalavra) {
        resultado.textContent = servico.mensagem;
        return;
    }
}

// 5. CASO NÃO ENCONTRE
resultado.textContent = "Serviço não encontrado.";
}

document
    .getElementById("botaoPesquisar")
    .addEventListener("click", pesquisarServico);
    let botoesCategoria = document.querySelectorAll(".categoria");

for (let botao of botoesCategoria) {

    botao.addEventListener("click", function () {

        let categoriaEscolhida = botao.dataset.categoria;

        resultado.innerHTML = "";

        for (let servico of servicos) {

            if (servico.categoria === categoriaEscolhida) {

                resultado.innerHTML += `
                    <div class="servico-item" data-servico="${servico.nome}">
                        <strong>${servico.nome}</strong>
                        <p>${servico.mensagem}</p>
                    </div>
                `;
            }
        }

    });
}

resultado.addEventListener("click", function (evento) {

    let cartao = evento.target.closest(".servico-item");

    if (!cartao) {
        return;
    }

    let nomeServico = cartao.dataset.servico;

    let servicoSelecionado = servicos.find(function (servico) {
    return servico.nome === nomeServico;

});

if (!servicoSelecionado) {
    return;
}

resultado.innerHTML = `
    <div class="detalhe-servico">
        <h3>${servicoSelecionado.nome}</h3>
        <p>${servicoSelecionado.mensagem}</p>
        <p><strong>Categoria:</strong> ${servicoSelecionado.categoria}</p>
        <button id="voltarServicos">Voltar</button>
    </div>
`;
document.getElementById("voltarServicos")
    .addEventListener("click", function () {

        resultado.innerHTML = "";

        for (let servico of servicos) {

            if (servico.categoria === servicoSelecionado.categoria) {

                resultado.innerHTML += `
                    <div class="servico-item" data-servico="${servico.nome}">
                        <strong>${servico.nome}</strong>
                        <p>${servico.mensagem}</p>
                    </div>
                `;
            }
        }
    });
});



document.getElementById("pesquisa")
    .addEventListener("keydown", function (evento) {

        if (evento.key === "Enter") {
            pesquisarServico();
        }
    });