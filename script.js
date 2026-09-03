// ==========================================================
// BLOCO 1 — ESTADO E ELEMENTOS DA HOME
// Guarda os serviços carregados e conecta a única entrada de ajuda da interface.
// ==========================================================

let servicos = [];
let situacaoEmEsclarecimento = null;
let carregamentoConcluido = false;

const formularioOrientacao = document.getElementById("formularioOrientacao");
const campoConsulta = document.getElementById("consulta");
const resultadoOrientacao = document.getElementById("resultadoOrientacao");
const botaoTema = document.getElementById("botaoTema");
const botaoAcessibilidade = document.getElementById("botaoAcessibilidade");
const painelAcessibilidade = document.getElementById("painelAcessibilidade");
const botaoAumentarTexto = document.getElementById("botaoAumentarTexto");
const botaoReduzirMovimento = document.getElementById("botaoReduzirMovimento");
const botaoResetarAcessibilidade = document.getElementById("botaoResetarAcessibilidade");

// ==========================================================
// BLOCO 2 — SITUAÇÕES LOCAIS DO ASSISTENTE
// Regras transparentes continuam sendo a primeira camada e não dependem de IA.
// ==========================================================

const situacoes = [
    {
        id: "cnh-vencida",
        titulo: "CNH vencida ou próxima do vencimento",
        explicacao: "O serviço relacionado é a renovação da habilitação.",
        termos: ["cnh vencida", "cnh venceu", "minha cnh venceu", "cnh esta vencida", "carteira vencida", "habilitacao vencida", "renovar cnh", "renovacao cnh", "preciso renovar carteira"],
        servicos: ["Renovação da Habilitação"]
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
        servicos: ["Indicação / Troca de Real Infrator"]
    },
    {
        id: "licenciamento-nao-atualizado",
        titulo: "Licenciamento ou documento do veículo não atualizado",
        explicacao: "Consulte o licenciamento e a emissão do CRLV-e para verificar orientações e possíveis pendências.",
        termos: ["paguei licenciamento", "paguei o documento", "documento nao atualizou", "crlv nao atualizou", "crlv nao aparece", "licenciamento nao atualizou", "documento do carro nao aparece"],
        servicos: ["Licenciamento Anual (CRLV-e)"]
    },
    {
        id: "identidade-perdida",
        titulo: "Perda, roubo ou furto do documento de identidade",
        explicacao: "O serviço relacionado é a emissão de uma nova via da identidade.",
        termos: ["perdi identidade", "perdi minha identidade", "perdi meu rg", "identidade perdida", "rg perdido", "roubaram identidade", "roubaram meu rg", "fiquei sem identidade", "segunda via identidade"],
        servicos: ["2ª Via da Carteira de Identidade Nacional (CIN)"]
    },
    {
        id: "compra-veiculo-usado",
        titulo: "Compra de veículo usado",
        explicacao: "Confira a transferência e a situação cadastral do veículo.",
        termos: ["comprei carro", "comprei um carro", "comprei carro usado", "comprei um carro usado", "comprei veiculo", "comprei veiculo usado", "nao sei se ha multa", "quero saber se o carro tem multa", "carro tem multa", "carro tem pendencia", "veiculo tem debito", "consultar situacao do veiculo", "transferir carro para meu nome", "transferencia de propriedade"],
        servicos: ["Transferência de Propriedade", "Consulta de Cadastro do Veículo", "Consulta de Multas e Infrações"]
    }
];

// ==========================================================
// BLOCO 3 — API E FALLBACK
// Tenta a API PHP no XAMPP/hospedagem e usa servicos.json se ela não responder.
// ==========================================================

async function buscarJson(endereco, opcoes) {
    const resposta = await fetch(endereco, opcoes);
    if (!resposta.ok) throw new Error("Fonte indisponível");
    return resposta.json();
}

async function carregarServicos() {
    let fallback = [];
    let dadosApi = [];

    try {
        fallback = await buscarJson("servicos.json");
    } catch (erro) {
        console.warn("Fallback de serviços indisponível.");
    }

    if (!window.location.hostname.includes("github.io")) {
        try {
            dadosApi = await buscarJson("api/servicos.php");
        } catch (erro) {
            console.warn("API de serviços indisponível; usando fallback.");
        }
    }

    const combinados = new Map();
    fallback.forEach(function (servico) { combinados.set(normalizarTexto(servico.nome), servico); });
    dadosApi.forEach(function (servico) { combinados.set(normalizarTexto(servico.nome), servico); });
    servicos = corrigirLinksObrigatorios(Array.from(combinados.values()));
    carregamentoConcluido = true;
}

const carregamentoInicial = carregarServicos();

// ==========================================================
// BLOCO 4 — NORMALIZAÇÃO E SEGURANÇA
// Padroniza comparações e escapa dados antes de inseri-los em trechos HTML.
// ==========================================================

function normalizarTexto(texto) {
    return String(texto || "").toLowerCase().normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ").trim();
}

function corrigirLinksObrigatorios(lista) {
    const links = {
        "consultar pontos e situacao da cnh": "http://multas.detran.rj.gov.br/gaideweb2/consultaPontuacao",
        "andamento do pedido de identidade": "https://www.detran.rj.gov.br/consultas/consultas-dic/acompanhe-seu-pedido.html",
        "defesa previa": "http://multas.detran.rj.gov.br/gaideweb2/consultaAberturaMultaDefesaPrevia",
        "recurso de 1 instancia jari": "http://multas.detran.rj.gov.br/gaideweb2/consultaAberturaMultaPrimeiraInstancia"
    };

    return lista.map(function (servico) {
        const link = links[normalizarTexto(servico.nome)];
        return link ? Object.assign({}, servico, { link_oficial: link }) : servico;
    });
}

function escaparHtml(texto) {
    const elemento = document.createElement("div");
    elemento.textContent = String(texto || "");
    return elemento.innerHTML;
}

function dividirEtapas(texto) {
    return String(texto || "").split(/\s*\d+\.\s+/).map(function (item) { return item.trim(); }).filter(Boolean);
}

function encontrarServico(nome) {
    const procurado = normalizarTexto(nome);
    return servicos.find(function (servico) { return normalizarTexto(servico.nome) === procurado; });
}

// ==========================================================
// BLOCO 5 — CONTEÚDO CONTROLADO DOS RESULTADOS
// Renderiza somente dados da API/fallback; a interpretação nunca cria requisitos.
// ==========================================================

function criarConteudoServico(servico) {
    const etapas = dividirEtapas(servico.etapas);
    const requisitos = servico.requisitos ? `<section><h3>Requisitos</h3><p>${escaparHtml(servico.requisitos)}</p></section>` : "";
    const documentos = servico.documentos ? `<section><h3>Documentos</h3><p>${escaparHtml(servico.documentos)}</p></section>` : "";
    const listaEtapas = etapas.length ? `<section><h3>Etapas</h3><ol>${etapas.map(function (etapa) { return `<li>${escaparHtml(etapa)}</li>`; }).join("")}</ol></section>` : "";
    const orientacao = !requisitos && !documentos && !listaEtapas && servico.orientacao
        ? `<section><h3>Orientação</h3><p>${escaparHtml(servico.orientacao)}</p></section>` : "";
    const link = servico.link_oficial
        ? `<a class="link-oficial" href="${escaparHtml(servico.link_oficial)}" target="_blank" rel="noopener noreferrer">Acessar canal oficial ↗</a>` : "";
    return requisitos + documentos + listaEtapas + orientacao + link;
}

function criarCardResultado(servico) {
    return `<article class="servico-orientado"><p class="rotulo-resultado">Serviço relacionado</p><h3>${escaparHtml(servico.nome)}</h3><p>${escaparHtml(servico.mensagem)}</p><div class="detalhes-orientacao">${criarConteudoServico(servico)}</div></article>`;
}

function mostrarServicos(titulo, explicacao, lista) {
    if (!lista.length) {
        resultadoOrientacao.textContent = "Não encontramos uma orientação correspondente. Tente informar o documento, veículo, CNH ou multa envolvidos.";
        return;
    }

    resultadoOrientacao.innerHTML = `<div class="cabecalho-orientacao"><p class="rotulo-resultado">Orientação encontrada</p><h2>${escaparHtml(titulo)}</h2><p>${escaparHtml(explicacao)}</p></div>${lista.map(criarCardResultado).join("")}<p class="aviso-orientacao">Confirme as informações e conclua o procedimento somente no canal oficial.</p>`;
    resultadoOrientacao.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// ==========================================================
// BLOCO 6 — BUSCA E REGRAS UNIFICADAS
// Primeiro reconhece nomes claros de serviços; caso contrário aplica as situações locais.
// ==========================================================

function procurarServicoEstruturado(texto) {
    const termo = normalizarTexto(texto);
    const palavras = termo.split(" ").filter(function (palavra) { return palavra.length > 2; });

    return servicos.map(function (servico) {
        const nome = normalizarTexto(servico.nome);
        const palavrasChave = (servico.palavrasChave || []).map(normalizarTexto);
        let pontos = nome === termo ? 100 : 0;
        if (nome.includes(termo) && termo.length >= 5) pontos += 30;
        const presentesNoNome = palavras.filter(function (palavra) { return nome.includes(palavra); }).length;
        if (palavras.length && presentesNoNome === palavras.length) pontos += 20;
        palavrasChave.forEach(function (chave) {
            if (chave === termo) pontos += 25;
            else if (termo.includes(chave) && chave.length >= 5) pontos += 8;
        });
        return { servico: servico, pontos: pontos };
    }).filter(function (item) { return item.pontos >= 20; })
        .sort(function (a, b) { return b.pontos - a.pontos; });
}

function identificarSituacao(textoInformado) {
    const texto = normalizarTexto(textoInformado);
    let melhor = null;
    let maiorPontuacao = 0;

    situacoes.forEach(function (situacao) {
        let pontuacao = 0;
        situacao.termos.forEach(function (termo) {
            const normalizado = normalizarTexto(termo);
            if (texto.includes(normalizado)) pontuacao += normalizado.split(" ").length;
        });
        if (pontuacao > maiorPontuacao) {
            maiorPontuacao = pontuacao;
            melhor = situacao;
        }
    });
    return melhor;
}

function resolverNomes(nomes) {
    return nomes.map(encontrarServico).filter(Boolean);
}

function mostrarPergunta(situacao) {
    situacaoEmEsclarecimento = situacao;
    resultadoOrientacao.innerHTML = `<div class="cabecalho-orientacao"><p class="rotulo-resultado">Só mais uma informação</p><h2>${escaparHtml(situacao.titulo)}</h2><p>${escaparHtml(situacao.pergunta)}</p></div><div class="opcoes-pergunta" role="group" aria-label="Resposta à pergunta"><button type="button" data-resposta="sim">Sim</button><button type="button" data-resposta="nao">Não</button><button type="button" data-resposta="naoSei">Não sei</button></div>`;
}

// ==========================================================
// BLOCO 7 — CAMADA OPCIONAL DE INTENÇÃO POR IA
// Só é consultada após busca e regras locais. Sem configuração, falha silenciosamente.
// ==========================================================

async function tentarInterpretacaoOpcional(texto) {
    if (window.location.hostname.includes("github.io")) return [];
    try {
        const resposta = await buscarJson("api/assistente-ia.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ texto: texto })
        });
        if (!resposta.ativo || !Array.isArray(resposta.servicos)) return [];
        return resolverNomes(resposta.servicos);
    } catch (erro) {
        return [];
    }
}

async function buscarOrientacao(evento) {
    evento.preventDefault();
    const texto = campoConsulta.value.trim();
    if (texto.length < 3) {
        resultadoOrientacao.textContent = "Digite um serviço ou descreva brevemente o que aconteceu.";
        campoConsulta.focus();
        return;
    }

    if (!carregamentoConcluido) await carregamentoInicial;
    if (!servicos.length) {
        resultadoOrientacao.textContent = "Não foi possível carregar as orientações agora. Tente novamente mais tarde.";
        return;
    }

    const busca = procurarServicoEstruturado(texto);
    if (busca.length) {
        const melhores = busca.filter(function (item) { return item.pontos === busca[0].pontos; }).slice(0, 3).map(function (item) { return item.servico; });
        mostrarServicos("Resultado da busca", "Encontramos esta opção na base do VIA RJ.", melhores);
        return;
    }

    const situacao = identificarSituacao(texto);
    if (situacao) {
        if (situacao.pergunta) mostrarPergunta(situacao);
        else mostrarServicos(situacao.titulo, situacao.explicacao, resolverNomes(situacao.servicos));
        return;
    }

    const interpretados = await tentarInterpretacaoOpcional(texto);
    if (interpretados.length) {
        mostrarServicos("Possível caminho", "A intenção foi interpretada e associada aos dados controlados do VIA RJ.", interpretados);
        return;
    }

    resultadoOrientacao.textContent = "Ainda não reconhecemos essa situação. Tente mencionar o documento, veículo, CNH ou multa envolvidos.";
}

// ==========================================================
// BLOCO 8 — EVENTOS DA HOME
// Conecta formulário, respostas intermediárias e fallback visual das imagens ausentes.
// ==========================================================

formularioOrientacao.addEventListener("submit", buscarOrientacao);

campoConsulta.addEventListener("keydown", function (evento) {
    if (evento.key !== "Enter" || evento.shiftKey) return;
    evento.preventDefault();
    if (campoConsulta.value.trim()) formularioOrientacao.requestSubmit();
});

resultadoOrientacao.addEventListener("click", function (evento) {
    const botao = evento.target.closest("[data-resposta]");
    if (!botao || !situacaoEmEsclarecimento) return;
    const nomes = situacaoEmEsclarecimento.respostas[botao.dataset.resposta];
    mostrarServicos(situacaoEmEsclarecimento.titulo, "Veja os serviços relacionados à sua resposta.", resolverNomes(nomes));
    situacaoEmEsclarecimento = null;
});

document.querySelectorAll(".midia-acesso img").forEach(function (imagem) {
    function marcarAusente() { imagem.classList.add("imagem-ausente"); }
    imagem.addEventListener("error", marcarAusente);
    imagem.addEventListener("load", function () { imagem.classList.remove("imagem-ausente"); });
    if (imagem.complete && imagem.naturalWidth === 0) marcarAusente();
});

// ==========================================================
// BLOCO 9 — TEMA E ACESSIBILIDADE DA HOME
// Preferências locais são compartilhadas com as páginas internas.
// ==========================================================

function aplicarTema(tema) {
    document.documentElement.dataset.theme = tema;
    localStorage.setItem("tema", tema);
    botaoTema.setAttribute("aria-label", tema === "dark" ? "Ativar modo claro" : "Ativar modo escuro");
}

function aplicarAcessibilidade() {
    const textoAmpliado = localStorage.getItem("textoAmpliado") === "true";
    const reduzirMovimento = localStorage.getItem("reduzirMovimento") === "true";
    document.documentElement.classList.toggle("texto-ampliado", textoAmpliado);
    document.documentElement.classList.toggle("reduzir-movimento", reduzirMovimento);
    botaoReduzirMovimento.setAttribute("aria-pressed", String(reduzirMovimento));
}

botaoTema.addEventListener("click", function () { aplicarTema(document.documentElement.dataset.theme === "dark" ? "light" : "dark"); });
botaoAcessibilidade.addEventListener("click", function () {
    const abrir = painelAcessibilidade.hidden;
    painelAcessibilidade.hidden = !abrir;
    botaoAcessibilidade.setAttribute("aria-expanded", String(abrir));
});
botaoAumentarTexto.addEventListener("click", function () {
    localStorage.setItem("textoAmpliado", String(!document.documentElement.classList.contains("texto-ampliado")));
    aplicarAcessibilidade();
});
botaoReduzirMovimento.addEventListener("click", function () {
    localStorage.setItem("reduzirMovimento", String(!document.documentElement.classList.contains("reduzir-movimento")));
    aplicarAcessibilidade();
});
botaoResetarAcessibilidade.addEventListener("click", function () {
    localStorage.removeItem("textoAmpliado");
    localStorage.removeItem("reduzirMovimento");
    aplicarAcessibilidade();
});

aplicarTema(document.documentElement.dataset.theme === "dark" ? "dark" : "light");
aplicarAcessibilidade();
