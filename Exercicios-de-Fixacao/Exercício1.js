function verificarVelocidade() {
    let velocidadeTexto = document.getElementById("velocidade").value;
    let velocidade = Number(velocidadeTexto);
    let resultado = document.getElementById("resultado");

    // validação simples
    if (velocidadeTexto === "") {
        resultado.textContent = "Digite a velocidade";
        return;
    }

    // SUA LÓGICA AQUI

    let mensagem;

if (velocidade <= 0) {
    mensagem = "velocidade inválida";
} else if (velocidade <= 60) {
    mensagem = "Velocidade OK";
} else if (velocidade <= 80) {
    mensagem = "Infração leve";
} else if (velocidade <= 100) {
    mensagem = "Infração grave";
}  else {
    mensagem = "Infração gravíssima";
}

resultado.textContent = mensagem;
}