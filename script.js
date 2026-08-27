// ======================================================
// 1. DADOS E ELEMENTOS DA PÁGINA
// ======================================================

let servicos = [];
let categoriaAberta = null;

let resultado = document.getElementById("resultado");
let campoPesquisa = document.getElementById("pesquisa");
let sugestoes = document.getElementById("sugestoes");
let botaoPesquisar = document.getElementById("botaoPesquisar");
let botoesCategoria = document.querySelectorAll(".categoria");


// ======================================================
// 2. CARREGAR SERVIÇOS DO JSON
// ======================================================

function carregarServicos() {

    let enderecoDados;

    if (window.location.hostname.includes("github.io")) {
        enderecoDados = "servicos.json";
    } else {
        enderecoDados = "api/servicos.php";
    }

    fetch(enderecoDados)
        .then(function (resposta) {

            if (!resposta.ok) {
                throw new Error("Erro HTTP: " + resposta.status);
            }

            return resposta.json();
        })
        .then(function (dados) {
            servicos = dados;
        })
        .catch(function (erro) {

            console.error("Erro ao carregar os serviços:", erro);

            resultado.textContent =
                "Não foi possível carregar os serviços. Tente novamente mais tarde.";
        });
}

carregarServicos();


// ======================================================
// 3. FUNÇÕES AUXILIARES
// ======================================================

function normalizarTexto(texto) {

    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}


function calcularDistancia(a, b) {

    let matriz = [];

    for (let i = 0; i <= b.length; i++) {
        matriz[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
        matriz[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {

        for (let j = 1; j <= a.length; j++) {

            if (b.charAt(i - 1) === a.charAt(j - 1)) {

                matriz[i][j] = matriz[i - 1][j - 1];

            } else {

                matriz[i][j] = Math.min(
                    matriz[i - 1][j - 1] + 1,
                    matriz[i][j - 1] + 1,
                    matriz[i - 1][j] + 1
                );
            }
        }
    }

    return matriz[b.length][a.length];
}


function obterServicosDaCategoria(categoria) {

    let servicosDaCategoria = [];

    for (let servico of servicos) {

        if (servico.categoria === categoria) {
            servicosDaCategoria.push(servico);
        }
    }

    return servicosDaCategoria;
}


// ======================================================
// 4. EXIBIÇÃO DOS SERVIÇOS
// ======================================================

function mostrarServicos(listaServicos) {

    resultado.innerHTML = "";

    for (let servico of listaServicos) {

        resultado.innerHTML += `
            <div
                class="servico-item"
                data-servico="${servico.nome}"
                tabindex="0"
            >
                <strong>${servico.nome}</strong>
                <p>${servico.mensagem}</p>
            </div>
        `;
    }
}


function mostrarDetalhes(servicoSelecionado) {

    resultado.innerHTML = `
        <div class="detalhe-servico">

            <h2>${servicoSelecionado.nome}</h2>

            <p class="categoria-detalhe">
                ${servicoSelecionado.categoria}
            </p>

            <p>${servicoSelecionado.mensagem}</p>

            <div class="conteudo-futuro">
                <p>
                    As orientações detalhadas deste serviço
                    serão adicionadas após validação das informações.
                </p>
            </div>

            <button id="voltarServicos">Voltar</button>

        </div>
    `;

    let botaoVoltar = document.getElementById("voltarServicos");

    botaoVoltar.addEventListener("click", function () {

        let servicosDaCategoria =
            obterServicosDaCategoria(servicoSelecionado.categoria);

        mostrarServicos(servicosDaCategoria);
    });
}


// ======================================================
// 5. PESQUISA
// ======================================================

function pesquisarServico() {

    let pesquisa = campoPesquisa.value.trim();

    resultado.textContent = "";

    if (pesquisa === "") {

        resultado.textContent =
            "Digite o serviço que você procura";

        return;
    }

    let termo = normalizarTexto(pesquisa);

    let servicosEncontrados = [];

    for (let servico of servicos) {

        let pontuacao = 0;

        let nomeNormalizado =
            normalizarTexto(servico.nome);

        if (nomeNormalizado === termo) {

            pontuacao += 10;

        } else if (nomeNormalizado.includes(termo)) {

            pontuacao += 5;
        }

        for (let palavra of servico.palavrasChave) {

            let palavraNormalizada =
                normalizarTexto(palavra);

            if (palavraNormalizada === termo) {

                pontuacao += 4;

            } else if (
                termo.includes(palavraNormalizada) ||
                palavraNormalizada.includes(termo)
            ) {

                pontuacao += 2;

            } else {

                let distancia =
                    calcularDistancia(
                        termo,
                        palavraNormalizada
                    );

                if (distancia <= 2) {
                    pontuacao += 1;
                }
            }
        }

        if (pontuacao > 0) {

            servicosEncontrados.push({
                servico: servico,
                pontuacao: pontuacao
            });
        }
    }

    servicosEncontrados.sort(function (a, b) {
        return b.pontuacao - a.pontuacao;
    });

    if (servicosEncontrados.length === 0) {

        resultado.textContent =
            "Serviço não encontrado.";

        return;
    }

    let servicosOrdenados = [];

    for (let item of servicosEncontrados) {
        servicosOrdenados.push(item.servico);
    }

    mostrarServicos(servicosOrdenados);
}


// ======================================================
// 6. SUGESTÕES DE PESQUISA
// ======================================================

function mostrarSugestoes() {

    let texto =
        normalizarTexto(campoPesquisa.value.trim());

    sugestoes.innerHTML = "";

    if (texto.length < 3) {
        return;
    }

    for (let servico of servicos) {

        let nome =
            normalizarTexto(servico.nome);

        if (nome.includes(texto)) {

            sugestoes.innerHTML += `
                <div class="sugestao-item">
                    ${servico.nome}
                </div>
            `;
        }
    }
}


function fecharSugestoes() {
    sugestoes.innerHTML = "";
}


// ======================================================
// 7. EVENTOS DAS CATEGORIAS
// ======================================================

for (let botao of botoesCategoria) {

    botao.addEventListener("click", function () {

        let categoriaEscolhida =
            botao.dataset.categoria;


        // Se clicou novamente na categoria aberta,
        // fecha os resultados.
        if (categoriaAberta === categoriaEscolhida) {

            resultado.innerHTML = "";

            categoriaAberta = null;

            botao.classList.remove("ativa");

            return;
        }


        // Remove o estado visual dos outros botões.
        for (let outroBotao of botoesCategoria) {

            outroBotao.classList.remove("ativa");
        }


        // Marca a nova categoria como aberta.
        categoriaAberta = categoriaEscolhida;

        botao.classList.add("ativa");


        // Busca os serviços da categoria.
        let servicosDaCategoria =
            obterServicosDaCategoria(categoriaEscolhida);


        // Mostra os serviços.
        mostrarServicos(servicosDaCategoria);
    });
}


// ======================================================
// 8. EVENTOS DOS CARTÕES
// ======================================================

resultado.addEventListener("click", function (evento) {

    let cartao =
        evento.target.closest(".servico-item");

    if (!cartao) {
        return;
    }

    let nomeServico =
        cartao.dataset.servico;

    let servicoSelecionado =
        servicos.find(function (servico) {

            return servico.nome === nomeServico;
        });

    if (!servicoSelecionado) {
        return;
    }

    mostrarDetalhes(servicoSelecionado);
});


resultado.addEventListener("keydown", function (evento) {

    let cartao =
        evento.target.closest(".servico-item");

    if (!cartao) {
        return;
    }

    if (
        evento.key === "Enter" ||
        evento.key === " "
    ) {

        evento.preventDefault();
        cartao.click();
    }
});


// ======================================================
// 9. EVENTOS DA PESQUISA
// ======================================================

botaoPesquisar.addEventListener(
    "click",
    pesquisarServico
);


campoPesquisa.addEventListener(
    "keydown",
    function (evento) {

        if (evento.key === "Enter") {
            pesquisarServico();
        }
    }
);


campoPesquisa.addEventListener(
    "input",
    mostrarSugestoes
);


// ======================================================
// 10. EVENTOS DAS SUGESTÕES
// ======================================================

sugestoes.addEventListener(
    "click",
    function (evento) {

        let sugestao =
            evento.target.closest(".sugestao-item");

        if (!sugestao) {
            return;
        }

        campoPesquisa.value =
            sugestao.textContent.trim();

        fecharSugestoes();

        pesquisarServico();
    }
);


// ======================================================
// 11. EVENTOS GERAIS DA PÁGINA
// ======================================================

document.addEventListener(
    "click",
    function (evento) {

        if (
            !campoPesquisa.contains(evento.target) &&
            !sugestoes.contains(evento.target)
        ) {
            fecharSugestoes();
        }
    }
);


document.addEventListener(
    "keydown",
    function (evento) {

        if (evento.key === "Escape") {
            fecharSugestoes();
        }
    }
);

// ======================================================
// 12. TEMA CLARO / ESCURO
// ======================================================

let botaoTema = document.getElementById("botaoTema");


// --------------------------------------
// APLICAR TEMA
// --------------------------------------

function aplicarTema(tema) {

    document.documentElement
        .setAttribute("data-theme", tema);

    localStorage.setItem("tema", tema);

    if (tema === "dark") {

        botaoTema.setAttribute(
            "aria-label",
            "Ativar modo claro"
        );

    } else {

        botaoTema.setAttribute(
            "aria-label",
            "Ativar modo escuro"
        );
    }
}


// --------------------------------------
// CARREGAR TEMA SALVO
// --------------------------------------

let temaSalvo = localStorage.getItem("tema");

if (temaSalvo === "dark") {

    aplicarTema("dark");

} else {

    aplicarTema("light");
}


// --------------------------------------
// TROCAR TEMA AO CLICAR
// --------------------------------------

botaoTema.addEventListener("click", function () {

    let temaAtual =
        document.documentElement
            .getAttribute("data-theme");

    if (temaAtual === "dark") {

        aplicarTema("light");

    } else {

        aplicarTema("dark");
    }
});

