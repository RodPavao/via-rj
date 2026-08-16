let servicoRenovacao = {
    nome: "Renovação da CNH",
    categoria: "Habilitação",
    palavraChave: "renovar",
    mensagem: "Você procura informações sobre renovação da CNH."
};

function pesquisarServico() {


    // 1. PEGAR DADOS DA TELA
    let pesquisa = document.getElementById("pesquisa").value;
    let resultado = document.getElementById("resultado");

    // 2. LIMPAR RESULTADO ANTERIOR
    resultado.textContent = "";

    // 3. VALIDAR
    if (pesquisa === "") {
        resultado.textContent = "Digite o serviço que você procura.";
        return;
    }

    // 4. DECIDIR
    if (pesquisa.toLowerCase().includes("renovar")) {
    resultado.textContent = servicoRenovacao.mensagem;
} else if (pesquisa.toLowerCase().includes("segunda via")) {
    resultado.textContent = "Você procura informações sobre segunda via da CNH.";
} else if (pesquisa.toLowerCase().includes("primeira habilitação")) {
    resultado.textContent = "Você procura informações sobre primeira habilitação.";
} else if (pesquisa.toLowerCase().includes("vistoria")) {
    resultado.textContent = "Você procura informações sobre vistoria de veículo.";
} else {
    resultado.textContent = "Serviço não encontrado.";
}
}

document
    .getElementById("botaoPesquisar")
    .addEventListener("click", pesquisarServico);