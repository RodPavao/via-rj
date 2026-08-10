function verificarVeiculo() {
    let placa = document.getElementById("placa").value;
    let temMulta = document.getElementById("temMulta").checked;
    let resultado = document.getElementById("resultado");

    let mensagem = "";

    if (placa === "") {
        mensagem = "Digite a placa";
    } else if (placa.length < 7) {
        mensagem = "Placa inválida";
    } else if (temMulta) {
        mensagem = "Veículo com débitos";
    } else {
        mensagem = "Veículo regular";
    }

    resultado.textContent = mensagem;
}