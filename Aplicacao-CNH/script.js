function podeDirigir(idade, temCarteira) {

    // 1. MENOR DE IDADE
    if (idade < 18) {
        return "Menor de idade";
    }

    // 2. SEM CARTEIRA
    if (!temCarteira) {
        return "Falta CNH";
    }

    // 3. OK
    return "Pode dirigir";
}

function validarIdade(idadeTexto, idade) {

    // 1. CAMPO VAZIO
    if (idadeTexto === "") {
        return "Digite a idade";
    }

    // 2. NÃO É NÚMERO
    if (isNaN(idade)) {
        return "Use apenas números";
    }

    // 3. FORA DO INTERVALO
    if (idade < 0 || idade > 120) {
        return "Idade inválida";
    }

    // 4. TUDO OK
    return null;
}

function verificar() {

    // 1. PEGAR DADOS DA TELA
    let idadeTexto = document.getElementById("idade").value;
    let idade = Number(idadeTexto);
    let temCarteira = document.getElementById("temCarteira").checked;
    let resultado = document.getElementById("resultado");

    // 2. LIMPAR TELA
    resultado.textContent = "";

    // 3. VALIDAR DADOS
    let erro = validarIdade(idadeTexto, idade);

    if (erro !== null) {
        resultado.textContent = erro;
        resultado.style.color = "red";
        return;
    }

    // 4. DECIDIR REGRA
    let mensagem = podeDirigir(idade, temCarteira);

    // 5. MOSTRAR RESULTADO
    resultado.textContent = "Idade: " + idade + " - " + mensagem;
    resultado.style.color = "green";

    // 6. DEFINIR COR DO RESULTADO
// COR BASEADA NA MENSAGEM
if (mensagem === "Pode dirigir") {
    resultado.style.color = "green";
} else if (mensagem === "Menor de idade") {
    resultado.style.color = "orange";
} else {
    resultado.style.color = "red";
}

}

document.getElementById("botaoVerificar").addEventListener("click", verificar);