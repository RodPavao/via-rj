// ==========================================================
// BLOCO 1 — CONFIGURAÇÃO DOS CARDS INTERNOS
// Esta estrutura é uma decisão didática: evita repetir os mesmos dados de navegação
// em vários HTMLs. Os textos oficiais detalhados continuam na API e no fallback.
// ==========================================================

const telas = {
    habilitacao: [
        { nome: "Primeira Habilitação", descricao: "Comece sua formação como condutor.", icone: "habilitacao" },
        { nome: "Renovação da Habilitação", descricao: "Renove a CNH vencida ou próxima do vencimento.", icone: "renovar" },
        { nome: "2ª Via da Habilitação", descricao: "Solicite uma nova via da CNH.", icone: "documento" },
        { nome: "Adição de Categoria", descricao: "Adicione uma categoria à habilitação.", icone: "adicionar" },
        { nome: "Mudança de Categoria", descricao: "Altere a categoria da sua CNH.", icone: "trocar" },
        { titulo: "Outros Serviços", descricao: "Veja outras opções de habilitação.", icone: "mais", externo: "https://www.detran.rj.gov.br/menu/menu-habilitacao" }
    ],
    veiculos: [
        { titulo: "Serviços de Vistoria", descricao: "Transferências, primeira licença e outros casos.", icone: "vistoria", href: "vistoria-veicular.html" },
        { nome: "Segunda Via do CRV", descricao: "Acesse a orientação e o canal oficial.", icone: "documento" },
        { nome: "Licenciamento Anual (CRLV-e)", titulo: "Licenciamento Anual", descricao: "Consulte o licenciamento e o documento digital.", icone: "veiculo" },
        { titulo: "Outros Serviços", descricao: "Veja outras opções para veículos.", icone: "mais", externo: "https://www.detran.rj.gov.br/todos-os-servicos" }
    ],
    identificacao: [
        { nome: "1ª Via da Carteira de Identidade Nacional (CIN)", titulo: "1ª Via da Identidade", descricao: "Emissão da primeira Carteira de Identidade Nacional.", icone: "identidade" },
        { nome: "2ª Via da Carteira de Identidade Nacional (CIN)", titulo: "2ª Via da Identidade", descricao: "Solicite uma nova via da CIN.", icone: "documento" },
        { nome: "Correção de Carteira de Identidade", titulo: "Correção de Dados", descricao: "Consulte a correção de dados do documento.", icone: "editar" },
        { nome: "Andamento do Pedido de Identidade", titulo: "Acompanhamento e Outros", descricao: "Acompanhe o requerimento e veja opções oficiais.", icone: "buscar" }
    ],
    infracoes: [
        { nome: "Consulta de Multas e Infrações", descricao: "Consulte multas e registros do veículo.", icone: "buscar" },
        { nome: "Cópia de Auto de Infração e Notificações", titulo: "Cópia do Auto / Notificações", descricao: "Consulte autos e notificações.", icone: "documento" },
        { nome: "Indicação / Troca de Real Infrator", titulo: "Troca de Real Infrator", descricao: "Indique o condutor responsável.", icone: "trocar" },
        { nome: "Defesa Prévia", descricao: "Consulte a abertura de defesa.", icone: "escudo" },
        { nome: "Recurso de 1ª Instância (JARI)", titulo: "Recurso em 1ª Instância", descricao: "Consulte a abertura de recurso à JARI.", icone: "recurso" },
        { titulo: "Outros Serviços", descricao: "Veja outras opções de infrações.", icone: "mais", externo: "https://www.detran.rj.gov.br/menu/menu-infracoes" }
    ],
    vistoria: [
        { nome: "Transferência de Propriedade", descricao: "Transferência para o novo proprietário.", icone: "trocar" },
        { nome: "Primeira Licença e Emplacamento", titulo: "Primeira Licença", descricao: "Primeiro registro e emplacamento.", icone: "adicionar" },
        { nome: "Transferência de Jurisdição", descricao: "Veículo vindo de outra jurisdição.", icone: "recurso" },
        { titulo: "Outros Serviços de Vistoria", descricao: "Veja outras opções oficiais para veículos.", icone: "mais", externo: "https://www.detran.rj.gov.br/todos-os-servicos/servicos-drv.html" }
    ]
};

// ==========================================================
// BLOCO 2 — TEMA E ACESSIBILIDADE COMPARTILHADOS
// Executa em todas as telas internas e preserva as preferências no mesmo navegador.
// ==========================================================

const botaoTema = document.getElementById("botaoTema");
const botaoAcessibilidade = document.getElementById("botaoAcessibilidade");
const painelAcessibilidade = document.getElementById("painelAcessibilidade");
const botaoAumentarTexto = document.getElementById("botaoAumentarTexto");
const botaoReduzirMovimento = document.getElementById("botaoReduzirMovimento");
const botaoResetarAcessibilidade = document.getElementById("botaoResetarAcessibilidade");
const botaoVoltarHistorico = document.getElementById("botaoVoltarHistorico");

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

botaoTema.addEventListener("click", function () {
    aplicarTema(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
});

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

if (botaoVoltarHistorico) {
    botaoVoltarHistorico.addEventListener("click", function () {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            window.location.href = "index.html";
        }
    });
}

aplicarTema(document.documentElement.dataset.theme === "dark" ? "dark" : "light");
aplicarAcessibilidade();

// ==========================================================
// BLOCO 3 — RENDERIZAÇÃO DAS GRADES
// Executa somente nas páginas de categoria e transforma cada item em um único link.
// ==========================================================

function desenharIcone(nome) {
    const desenhos = {
        habilitacao: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8" cy="11" r="2"/><path d="M13 10h5M13 14h5M6 16h4"/>',
        renovar: '<path d="M20 7v5h-5M4 17v-5h5"/><path d="M6.1 8.5A7 7 0 0 1 19 12M5 12a7 7 0 0 0 12.9 3.5"/>',
        documento: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v5h5M9 12h6M9 16h6"/>',
        adicionar: '<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>',
        trocar: '<path d="M7 7h12l-3-3M17 17H5l3 3"/><path d="M19 7l-3 3M5 17l3-3"/>',
        mais: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
        vistoria: '<path d="M4 13h16l-2-6H6l-2 6Z"/><circle cx="7" cy="16" r="2"/><circle cx="17" cy="16" r="2"/><path d="m9 10 2 2 4-4"/>',
        veiculo: '<path d="M5 16h14l-1.5-6h-11L5 16Z"/><path d="M3 16v3M21 16v3M8 10l1-3h6l1 3"/><circle cx="7" cy="16" r="1"/><circle cx="17" cy="16" r="1"/>',
        identidade: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2.5"/><path d="M5.5 17c.7-2.2 2-3.3 3.5-3.3s2.8 1.1 3.5 3.3M14 9h4M14 13h4"/>',
        editar: '<path d="m4 20 4.5-1 10-10-3.5-3.5-10 10L4 20Z"/><path d="m13.5 7 3.5 3.5"/>',
        buscar: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 4 4"/>',
        escudo: '<path d="M12 3 5 6v5c0 4.5 2.8 7.8 7 10 4.2-2.2 7-5.5 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-4"/>',
        recurso: '<path d="M5 19 19 5M11 5h8v8"/><path d="M19 16v3H5V5h3"/>'
    };
    return '<svg viewBox="0 0 24 24" focusable="false">' + (desenhos[nome] || desenhos.documento) + '</svg>';
}

function criarCard(item) {
    const link = document.createElement("a");
    const titulo = item.titulo || item.nome;
    link.className = "card-app";
    link.href = item.externo || item.href || "servico.html?nome=" + encodeURIComponent(item.nome);

    if (item.externo) {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.setAttribute("aria-label", titulo + ", abre site externo");
    }

    const icone = document.createElement("span");
    icone.className = "icone-card";
    icone.setAttribute("aria-hidden", "true");
    icone.innerHTML = desenharIcone(item.icone);

    const conteudo = document.createElement("span");
    conteudo.className = "conteudo-card";
    const forte = document.createElement("strong");
    forte.textContent = titulo;
    const descricao = document.createElement("small");
    descricao.textContent = item.descricao;
    conteudo.append(forte, descricao);

    const seta = document.createElement("span");
    seta.className = item.externo ? "selo-externo" : "seta-card";
    seta.setAttribute("aria-hidden", "true");
    seta.textContent = item.externo ? "↗" : "→";
    link.append(icone, conteudo, seta);
    return link;
}

const gradeServicos = document.getElementById("gradeServicos");
const telaAtual = document.body.dataset.tela;

if (gradeServicos && telas[telaAtual]) {
    telas[telaAtual].forEach(function (item) {
        gradeServicos.appendChild(criarCard(item));
    });
}

// ==========================================================
// BLOCO 4 — API COM FALLBACK JSON
// Na página de detalhe, tenta a API PHP e usa servicos.json quando ela falha.
// ==========================================================

function normalizar(texto) {
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
        const link = links[normalizar(servico.nome)];
        return link ? Object.assign({}, servico, { link_oficial: link }) : servico;
    });
}

async function carregarServicos() {
    let fallback = [];
    let dadosApi = [];

    try {
        const respostaFallback = await fetch("servicos.json");
        if (!respostaFallback.ok) throw new Error("Fallback indisponível");
        fallback = await respostaFallback.json();
    } catch (erro) {
        console.warn("Fallback de serviços indisponível.");
    }

    if (!window.location.hostname.includes("github.io")) {
        try {
            const respostaApi = await fetch("api/servicos.php");
            if (!respostaApi.ok) throw new Error("API indisponível");
            dadosApi = await respostaApi.json();
        } catch (erro) {
            console.warn("API de serviços indisponível; usando fallback.");
        }
    }

    const combinados = new Map();
    fallback.forEach(function (servico) { combinados.set(normalizar(servico.nome), servico); });
    dadosApi.forEach(function (servico) { combinados.set(normalizar(servico.nome), servico); });
    return corrigirLinksObrigatorios(Array.from(combinados.values()));
}

function dividirEtapas(texto) {
    return String(texto || "").split(/\s*\d+\.\s+/).map(function (item) { return item.trim(); }).filter(Boolean);
}

function criarSecao(titulo, texto, listaOrdenada) {
    if (!texto) return null;
    const secao = document.createElement("section");
    secao.className = "secao-detalhe";
    const h2 = document.createElement("h2");
    h2.textContent = titulo;
    secao.appendChild(h2);

    if (listaOrdenada) {
        const lista = document.createElement("ol");
        dividirEtapas(texto).forEach(function (etapa) {
            const item = document.createElement("li");
            item.textContent = etapa;
            lista.appendChild(item);
        });
        secao.appendChild(lista);
    } else {
        const paragrafo = document.createElement("p");
        paragrafo.textContent = texto;
        secao.appendChild(paragrafo);
    }
    return secao;
}

async function mostrarDetalhe() {
    const area = document.getElementById("detalheServico");
    if (!area) return;

    const nome = new URLSearchParams(window.location.search).get("nome");
    const servicos = await carregarServicos();
    const servico = servicos.find(function (item) { return normalizar(item.nome) === normalizar(nome); });

    if (!servico) {
        area.innerHTML = "";
        const aviso = document.createElement("p");
        aviso.className = "erro-amigavel";
        aviso.textContent = "Não encontramos esta orientação. Volte e escolha outra opção.";
        area.appendChild(aviso);
        return;
    }

    area.innerHTML = "";
    const categoria = document.createElement("p");
    categoria.className = "categoria-detalhe";
    categoria.textContent = servico.categoria;
    const titulo = document.createElement("h1");
    titulo.textContent = servico.nome;
    const resumo = document.createElement("p");
    resumo.className = "resumo-detalhe";
    resumo.textContent = servico.mensagem;
    area.append(categoria, titulo, resumo);

    const secoes = [
        criarSecao("Requisitos", servico.requisitos, false),
        criarSecao("Documentos", servico.documentos, false),
        criarSecao("Etapas", servico.etapas, true)
    ].filter(Boolean);

    if (secoes.length === 0 && servico.orientacao) {
        secoes.push(criarSecao("Orientação", servico.orientacao, false));
    }
    secoes.forEach(function (secao) { area.appendChild(secao); });

    if (servico.link_oficial) {
        const acao = document.createElement("div");
        acao.className = "acao-oficial";
        const aviso = document.createElement("span");
        aviso.textContent = "Você sairá do VIA RJ para concluir no canal responsável.";
        const link = document.createElement("a");
        link.className = "link-oficial";
        link.href = servico.link_oficial;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = "Acessar canal oficial ↗";
        acao.append(aviso, link);
        area.appendChild(acao);
    }
}

mostrarDetalhe();
