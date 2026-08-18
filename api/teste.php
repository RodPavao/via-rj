<?php

$servicos = [
    "Primeira CNH",
    "Renovação da CNH",
    "Licenciamento"
];

function mostrarServicos($lista) {

    foreach ($lista as $servico) {
        echo "Serviço: " . $servico . "<br>";
    }
}

mostrarServicos($servicos);