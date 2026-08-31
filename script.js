// ==========================================================
// BLOCO 1 — ESTADO E ELEMENTOS DA PÁGINA
// Guarda os dados carregados e as referências aos elementos que o JavaScript altera.
// ==========================================================

let servicos = [];
let categoriaAberta = null;
let situacaoEmEsclarecimento = null;
let carregamentoServicosConcluido = false;

const resultado = document.getElementById("resultado");
const campoPesquisa = document.getElementById("pesquisa");
const sugestoes = document.getElementById("sugestoes");
const botaoPesquisar = document.getElementById("botaoPesquisar");
const botoesCategoria = document.querySelectorAll(".categoria");
const campoProblema = document.getElementById("problema");
const botaoOrientar = document.getElementById("botaoOrientar");
const botaoLimparAssistente = document.getElementById("botaoLimparAssistente");
const resultadoAssistente = document.getElementById("resultadoAssistente");


// ==========================================================
// BLOCO 2 — SITUAÇÕES CONHECIDAS PELO ASSISTENTE
// Cada objeto relaciona frases cotidianas a serviços existentes. Para incluir um novo
// caso, basta acrescentar outro objeto após verificar o conteúdo em uma fonte oficial.
// ==========================================================

const situacoes = [
    {
        id: "cnh-vencida",
        titulo: "CNH vencida ou próxima do vencimento",
        explicacao: "O serviço relacionado é a renovação da habilitação.",
        termos: ["cnh vencida", "cnh venceu", "minha cnh venceu", "cnh esta vencida", "carteira vencida", "habilitacao vencida", "renovar cnh", "renovacao cnh", "preciso renovar carteira"],
        servicos: ["Renovação da Habilitação", "Renovação da CNH"]
    },
    {
        id: "venda-nao-atualizada",
        titulo: "Veículo vendido ainda relacionado ao antigo proprietário",
        explicacao: "Precisamos confirmar uma informação antes de indicar o caminho mais útil.",
        termos: ["vendi meu carro", "vendi o carro", "vendi meu veiculo", "vendi veiculo", "ainda esta no meu nome", "carro continua no meu nome", "venda nao atualizada", "comprador nao transferiu"],
        pergunta: "Você já realizou a comunicação de venda?",
        respostas: {
            sim: ["Consulta de Cadastro do Veículo"],
            nao: ["Comunicação de Venda"],
            naoSei: ["Comunicação de Venda", "Consulta de Cadastro do Veículo"]
        }
    },
    {
        id: "multa-outro-condutor",
        titulo: "Multa recebida quando outra pessoa dirigia",
        explicacao: "O serviço relacionado é a indicação do condutor responsável pela infração.",
        termos: ["nao era eu", "eu nao estava dirigindo", "outra pessoa dirigia", "outra pessoa estava dirigindo", "multa de outra pessoa", "transferir pontos", "indicar condutor", "real infrator"],
        servicos: ["Indicação / Troca de Real Infrator", "Real Infrator"]
    },
    {
        id: "licenciamento-nao-atualizado",
        titulo: "Licenciamento ou documento do veículo não atualizado",
        explicacao: "Consulte o licenciamento e a emissão do CRLV-e para verificar orientações e possíveis pendências.",
        termos: ["paguei licenciamento", "paguei o documento", "documento nao atualizou", "crlv nao atualizou", "crlv nao aparece", "licenciamento nao atualizou", "documento do carro nao aparece"],
        servicos: ["Licenciamento Anual (CRLV-e)", "Licenciamento Anual"]
    },
    {
        id: "identidade-perdida",
        titulo: "Perda, roubo ou furto do documento de identidade",
        explicacao: "O serviço relacionado é a emissão de uma nova via da identidade.",
        termos: ["perdi identidade", "perdi minha identidade", "perdi meu rg", "identidade perdida", "rg perdido", "roubaram identidade", "roubaram meu rg", "fiquei sem identidade", "segunda via identidade"],
        servicos: ["2ª Via da Carteira de Identidade Nacional (CIN)", "Segunda Via da Identidade"]
    },
    {
        id: "compra-veiculo-usado",
        titulo: "Compra de veículo usado",
        explicacao: "O serviço relacionado é a transferência do veículo para o novo proprietário.",
        termos: ["comprei carro", "comprei um carro", "comprei carro usado", "comprei um carro usado", "comprei veiculo", "comprei veiculo usado", "nao sei se ha multa", "quero saber se o carro tem multa", "carro tem multa", "carro tem pendencia", "veiculo tem debito", "consultar situacao do veiculo", "transferir carro para meu nome", "transferencia de propriedade"],
        servicos: ["Transferência de Propriedade", "Consulta de Cadastro do Veículo", "Consulta de Multas e Infrações"]
    }
];


// ==========================================================
// BLOCO 3 — CARREGAMENTO DOS SERVIÇOS
// Usa a API PHP no XAMPP/hospedagem e o JSON no GitHub Pages ou como reserva local.
// ==========================================================

async function buscarJson(endereco) {
    const resposta = await fetch(endereco);

    if (!resposta.ok) {
        throw new Error("Erro HTTP: " + resposta.status);
    }

    const dados = await resposta.json();

    if (!Array.isArray(dados)) {
        throw new Error("A fonte de dados não devolveu uma lista de serviços.");
    }

    return dados;
}

async function carregarServicos() {
    const estaNoGitHubPages = window.location.hostname.includes("github.io");
    const fontes = estaNoGitHubPages
        ? ["servicos.json"]
        : ["api/servicos.php", "servicos.json"];

    for (const fonte of fontes) {
        try {
            servicos = await buscarJson(fonte);

            // A requisição é assíncrona: o usuário pode selecionar uma categoria
            // antes da API ou do fallback responder. Nesse caso, a categoria fica
            // guardada em categoriaAberta e precisa ser renderizada agora que os
            // dados realmente existem. Sem esta atualização, o botão permanecia
            // selecionado, mas os cards não apareciam.
            carregamentoServicosConcluido = true;

            if (categoriaAberta !== null) {
                mostrarServicos(obterServicosDaCategoria(categoriaAberta));
            }

            return;
        } catch (erro) {
            console.warn("Não foi possível carregar:", fonte, erro);
        }
    }

    carregamentoServicosConcluido = true;
    resultado.textContent = "Não foi possível carregar os serviços. Tente novamente mais tarde.";
}

carregarServicos();


// ==========================================================
// BLOCO 4 — FUNÇÕES AUXILIARES E SEGURANÇA
// Normaliza comparações e impede que textos vindos dos dados sejam interpretados como HTML.
// ==========================================================

function normalizarTexto(texto) {
    return String(texto || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function escaparHtml(texto) {
    const elementoTemporario = document.createElement("div");
    elementoTemporario.textContent = String(texto || "");
    return elementoTemporario.innerHTML;
}

function obterServicosDaCategoria(categoria) {
    return servicos.filter(function (servico) {
        return servico.categoria === categoria;
    });
}

function encontrarServico(nomesPossiveis) {
    const nomesNormalizados = nomesPossiveis.map(normalizarTexto);

    return servicos.find(function (servico) {
        return nomesNormalizados.includes(normalizarTexto(servico.nome));
    });
}

function dividirEtapas(texto) {
    if (!texto) {
        return [];
    }

    return String(texto)
        .split(/\s*\d+\.\s+/)
        .map(function (etapa) { return etapa.trim(); })
        .filter(Boolean);
}


// ==========================================================
// BLOCO 5 — CARDS E DETALHES DOS SERVIÇOS
// Estas funções atendem tanto ao catálogo tradicional quanto ao resultado do assistente.
// ==========================================================

function criarResumoServico(servico) {
    return `
        <article class="servico-item" data-servico="${escaparHtml(servico.nome)}" tabindex="0" role="button">
            <strong>${escaparHtml(servico.nome)}</strong>
            <p>${escaparHtml(servico.mensagem)}</p>
        </article>
    `;
}

function mostrarServicos(listaServicos) {
    resultado.innerHTML = "";

    if (listaServicos.length === 0) {
        resultado.textContent = "Nenhum serviço foi encontrado nesta categoria.";
        return;
    }

    resultado.innerHTML = listaServicos.map(criarResumoServico).join("");
}

function criarConteudoDetalhado(servico) {
    const etapas = dividirEtapas(servico.etapas);
    const etapasHtml = etapas.length > 0
        ? `<section><h3>Etapas</h3><ol>${etapas.map(function (etapa) { return `<li>${escaparHtml(etapa)}</li>`; }).join("")}</ol></section>`
        : "";
    const requisitosHtml = servico.requisitos
        ? `<section><h3>Requisitos</h3><p>${escaparHtml(servico.requisitos)}</p></section>`
        : "";
    const documentosHtml = servico.documentos
        ? `<section><h3>Documentos</h3><p>${escaparHtml(servico.documentos)}</p></section>`
        : "";
    const linkHtml = servico.link_oficial
        ? `<a href="${escaparHtml(servico.link_oficial)}" target="_blank" rel="noopener noreferrer" class="link-oficial">Acessar canal oficial</a>`
        : "";

    // Alguns registros do fallback não representam um serviço detalhado.
    // status_conteudo permite diferenciá-los sem inventar requisitos ou etapas:
    // "curadoria" informa a limitação atual e "porta-entrada" encaminha o usuário
    // para outros serviços oficiais da categoria.
    if (servico.status_conteudo === "curadoria") {
        return `
            <div class="pendencia-curadoria">
                <h3>Orientação em preparação</h3>
                <p>${escaparHtml(servico.orientacao)}</p>
            </div>
            ${linkHtml}
        `;
    }

    if (servico.status_conteudo === "porta-entrada") {
        return `
            <div class="pendencia-curadoria porta-entrada">
                <h3>Outros serviços oficiais</h3>
                <p>${escaparHtml(servico.orientacao)}</p>
            </div>
            ${linkHtml}
        `;
    }

    if (!requisitosHtml && !documentosHtml && !etapasHtml && !linkHtml) {
        return `<p>Os detalhes deste serviço aguardam curadoria e verificação em fonte oficial.</p>`;
    }

    return requisitosHtml + documentosHtml + etapasHtml + linkHtml;
}

function mostrarDetalhes(servicoSelecionado) {
    resultado.innerHTML = `
        <article class="detalhe-servico">
            <p class="categoria-detalhe">${escaparHtml(servicoSelecionado.categoria)}</p>
            <h2>${escaparHtml(servicoSelecionado.nome)}</h2>
            <p>${escaparHtml(servicoSelecionado.mensagem)}</p>
            <div class="conteudo-futuro">${criarConteudoDetalhado(servicoSelecionado)}</div>
            <p class="aviso-orientacao">O VIA RJ apenas orienta. Confira os dados e realize o procedimento no canal oficial.</p>
            <button id="voltarServicos" type="button">Voltar aos serviços</button>
        </article>
    `;

    document.getElementById("voltarServicos").addEventListener("click", function () {
        mostrarServicos(obterServicosDaCategoria(servicoSelecionado.categoria));
    });
}


// ==========================================================
// BLOCO 6 — IDENTIFICAÇÃO BASEADA EM REGRAS
// Calcula quantos termos de cada situação aparecem no texto; não utiliza IA nem serviço externo.
// ==========================================================

function identificarSituacao(textoInformado) {
    const texto = normalizarTexto(textoInformado);
    let melhorSituacao = null;
    let melhorPontuacao = 0;

    for (const situacao of situacoes) {
        let pontuacao = 0;

        for (const termo of situacao.termos) {
            const termoNormalizado = normalizarTexto(termo);

            if (texto.includes(termoNormalizado)) {
                pontuacao += termoNormalizado.split(" ").length;
            }
        }

        if (pontuacao > melhorPontuacao) {
            melhorPontuacao = pontuacao;
            melhorSituacao = situacao;
        }
    }

    return melhorSituacao;
}

function resolverServicosDaSituacao(nomes) {
    const encontrados = [];

    for (const nome of nomes) {
        const servico = encontrarServico([nome]);

        if (servico && !encontrados.includes(servico)) {
            encontrados.push(servico);
        }
    }

    return encontrados;
}

function criarResultadoAssistente(situacao, nomesServicos) {
    const relacionados = resolverServicosDaSituacao(nomesServicos);
    const cards = relacionados.length > 0
        ? relacionados.map(function (servico) {
            return `<article class="servico-orientado">
                <p class="rotulo-resultado">Serviço relacionado</p>
                <h3>${escaparHtml(servico.nome)}</h3>
                <p>${escaparHtml(servico.mensagem)}</p>
                <div class="detalhes-orientacao">${criarConteudoDetalhado(servico)}</div>
            </article>`;
        }).join("")
        : `<p class="pendencia-curadoria">A situação foi reconhecida, mas o serviço correspondente ainda não está disponível nesta fonte de dados. Consulte os acessos oficiais abaixo.</p>`;

    resultadoAssistente.innerHTML = `
        <div class="cabecalho-orientacao">
            <p class="rotulo-resultado">Situação identificada</p>
            <h2>${escaparHtml(situacao.titulo)}</h2>
            <p>${escaparHtml(situacao.explicacao)}</p>
        </div>
        ${cards}
        <p class="aviso-orientacao">Esta orientação é informativa. Confirme requisitos, documentos e etapas no canal oficial antes de iniciar o procedimento.</p>
    `;
}

function mostrarPergunta(situacao) {
    situacaoEmEsclarecimento = situacao;
    resultadoAssistente.innerHTML = `
        <div class="cabecalho-orientacao">
            <p class="rotulo-resultado">Situação identificada</p>
            <h2>${escaparHtml(situacao.titulo)}</h2>
            <p>${escaparHtml(situacao.pergunta)}</p>
        </div>
        <div class="opcoes-pergunta" role="group" aria-label="Resposta à pergunta">
            <button type="button" data-resposta="sim">Sim</button>
            <button type="button" data-resposta="nao">Não</button>
            <button type="button" data-resposta="naoSei">Não sei</button>
        </div>
    `;
}

function orientarUsuario() {
    const texto = campoProblema.value.trim();

    if (texto.length < 5) {
        resultadoAssistente.textContent = "Descreva a situação com um pouco mais de detalhe.";
        campoProblema.focus();
        return;
    }

    const situacao = identificarSituacao(texto);

    if (!situacao) {
        resultadoAssistente.innerHTML = `<p class="pendencia-curadoria">Ainda não reconhecemos essa situação. Tente mencionar o documento, veículo, CNH ou multa envolvida, ou use a busca por serviço abaixo.</p>`;
        return;
    }

    if (situacao.pergunta) {
        mostrarPergunta(situacao);
        return;
    }

    criarResultadoAssistente(situacao, situacao.servicos);
}

function limparAssistente() {
    campoProblema.value = "";
    resultadoAssistente.innerHTML = "";
    situacaoEmEsclarecimento = null;
    campoProblema.focus();
}


// ==========================================================
// BLOCO 7 — BUSCA TRADICIONAL E SUGESTÕES
// Pesquisa nome, categoria, mensagem e palavras-chave sem substituir o novo assistente.
// ==========================================================

function calcularPontuacaoPesquisa(servico, termo) {
    const textos = [servico.nome, servico.categoria, servico.mensagem]
        .concat(servico.palavrasChave || []);
    let pontuacao = 0;

    for (const texto of textos) {
        const normalizado = normalizarTexto(texto);

        if (normalizado === termo) {
            pontuacao += 10;
        } else if (normalizado.includes(termo) || termo.includes(normalizado)) {
            pontuacao += 3;
        }
    }

    return pontuacao;
}

function pesquisarServico() {
    const termo = normalizarTexto(campoPesquisa.value);
    fecharSugestoes();

    if (!termo) {
        resultado.textContent = "Digite o nome ou parte do nome de um serviço.";
        return;
    }

    const encontrados = servicos
        .map(function (servico) {
            return { servico: servico, pontuacao: calcularPontuacaoPesquisa(servico, termo) };
        })
        .filter(function (item) { return item.pontuacao > 0; })
        .sort(function (a, b) { return b.pontuacao - a.pontuacao; })
        .map(function (item) { return item.servico; });

    if (encontrados.length === 0) {
        resultado.textContent = "Serviço não encontrado. Tente outra palavra ou navegue pelas categorias.";
        return;
    }

    mostrarServicos(encontrados);
}

function mostrarSugestoes() {
    const texto = normalizarTexto(campoPesquisa.value);
    sugestoes.innerHTML = "";

    if (texto.length < 3) {
        return;
    }

    const encontrados = servicos.filter(function (servico) {
        return normalizarTexto(servico.nome).includes(texto);
    }).slice(0, 6);

    sugestoes.innerHTML = encontrados.map(function (servico) {
        return `<button class="sugestao-item" type="button" role="option">${escaparHtml(servico.nome)}</button>`;
    }).join("");
}

function fecharSugestoes() {
    sugestoes.innerHTML = "";
}


// ==========================================================
// BLOCO 8 — EVENTOS DO ASSISTENTE E DO CATÁLOGO
// Event listeners conectam cliques e teclado às funções definidas anteriormente.
// ==========================================================

botaoOrientar.addEventListener("click", orientarUsuario);
botaoLimparAssistente.addEventListener("click", limparAssistente);
campoProblema.addEventListener("keydown", function (evento) {
    if (evento.key === "Enter" && (evento.ctrlKey || evento.metaKey)) {
        orientarUsuario();
    }
});

resultadoAssistente.addEventListener("click", function (evento) {
    const botaoResposta = evento.target.closest("[data-resposta]");

    if (!botaoResposta || !situacaoEmEsclarecimento) {
        return;
    }

    const resposta = botaoResposta.dataset.resposta;
    const nomes = situacaoEmEsclarecimento.respostas[resposta];
    criarResultadoAssistente(situacaoEmEsclarecimento, nomes);
    situacaoEmEsclarecimento = null;
});

for (const botao of botoesCategoria) {
    botao.addEventListener("click", function () {
        const categoria = botao.dataset.categoria;

        if (categoriaAberta === categoria) {
            resultado.innerHTML = "";
            categoriaAberta = null;
            botao.classList.remove("ativa");
            return;
        }

        for (const outroBotao of botoesCategoria) {
            outroBotao.classList.remove("ativa");
        }

        categoriaAberta = categoria;
        botao.classList.add("ativa");

        // Enquanto fetch ainda aguarda a API ou o JSON, mostramos o estado real
        // da operação. carregarServicos() renderizará esta mesma categoria assim
        // que a fonte de dados responder.
        if (!carregamentoServicosConcluido) {
            resultado.textContent = "Carregando serviços desta categoria...";
            return;
        }

        mostrarServicos(obterServicosDaCategoria(categoria));
    });
}

resultado.addEventListener("click", function (evento) {
    const cartao = evento.target.closest(".servico-item");

    if (!cartao) {
        return;
    }

    const selecionado = servicos.find(function (servico) {
        return servico.nome === cartao.dataset.servico;
    });

    if (selecionado) {
        mostrarDetalhes(selecionado);
    }
});

resultado.addEventListener("keydown", function (evento) {
    const cartao = evento.target.closest(".servico-item");

    if (cartao && (evento.key === "Enter" || evento.key === " ")) {
        evento.preventDefault();
        cartao.click();
    }
});

botaoPesquisar.addEventListener("click", pesquisarServico);
campoPesquisa.addEventListener("input", mostrarSugestoes);
campoPesquisa.addEventListener("keydown", function (evento) {
    if (evento.key === "Enter") {
        pesquisarServico();
    }
});

sugestoes.addEventListener("click", function (evento) {
    const sugestao = evento.target.closest(".sugestao-item");

    if (sugestao) {
        campoPesquisa.value = sugestao.textContent.trim();
        pesquisarServico();
    }
});

document.addEventListener("click", function (evento) {
    if (!campoPesquisa.contains(evento.target) && !sugestoes.contains(evento.target)) {
        fecharSugestoes();
    }
});


// ==========================================================
// BLOCO 9 — TEMA CLARO E ESCURO
// localStorage preserva a preferência somente no navegador do usuário.
// ==========================================================

const botaoTema = document.getElementById("botaoTema");

function aplicarTema(tema) {
    document.documentElement.setAttribute("data-theme", tema);
    localStorage.setItem("tema", tema);
    botaoTema.setAttribute("aria-label", tema === "dark" ? "Ativar modo claro" : "Ativar modo escuro");
}

aplicarTema(localStorage.getItem("tema") === "dark" ? "dark" : "light");

botaoTema.addEventListener("click", function () {
    const temaAtual = document.documentElement.getAttribute("data-theme");
    aplicarTema(temaAtual === "dark" ? "light" : "dark");
});


// ==========================================================
// BLOCO 10 — PREFERÊNCIAS DE ACESSIBILIDADE
// Controla o painel, salva escolhas locais e permite restaurar o padrão.
// ==========================================================

const botaoAcessibilidade = document.getElementById("botaoAcessibilidade");
const painelAcessibilidade = document.getElementById("painelAcessibilidade");
const botaoAumentarTexto = document.getElementById("botaoAumentarTexto");
const botaoReduzirMovimento = document.getElementById("botaoReduzirMovimento");
const botaoResetarAcessibilidade = document.getElementById("botaoResetarAcessibilidade");

function aplicarPreferenciasAcessibilidade() {
    const textoAmpliado = localStorage.getItem("textoAmpliado") === "true";
    const movimentoReduzido = localStorage.getItem("reduzirMovimento") === "true";

    document.documentElement.classList.toggle("texto-ampliado", textoAmpliado);
    document.documentElement.classList.toggle("reduzir-movimento", movimentoReduzido);
    botaoReduzirMovimento.setAttribute("aria-pressed", String(movimentoReduzido));
}

botaoAcessibilidade.addEventListener("click", function () {
    const estavaAberto = !painelAcessibilidade.hidden;
    painelAcessibilidade.hidden = estavaAberto;
    botaoAcessibilidade.setAttribute("aria-expanded", String(!estavaAberto));
});

botaoAumentarTexto.addEventListener("click", function () {
    const ativo = !document.documentElement.classList.contains("texto-ampliado");
    localStorage.setItem("textoAmpliado", String(ativo));
    aplicarPreferenciasAcessibilidade();
});

botaoReduzirMovimento.addEventListener("click", function () {
    const ativo = !document.documentElement.classList.contains("reduzir-movimento");
    localStorage.setItem("reduzirMovimento", String(ativo));
    aplicarPreferenciasAcessibilidade();
});

botaoResetarAcessibilidade.addEventListener("click", function () {
    localStorage.removeItem("textoAmpliado");
    localStorage.removeItem("reduzirMovimento");
    aplicarPreferenciasAcessibilidade();
});

document.addEventListener("keydown", function (evento) {
    if (evento.key !== "Escape") {
        return;
    }

    fecharSugestoes();

    if (!painelAcessibilidade.hidden) {
        painelAcessibilidade.hidden = true;
        botaoAcessibilidade.setAttribute("aria-expanded", "false");
        botaoAcessibilidade.focus();
    }
});

aplicarPreferenciasAcessibilidade();
