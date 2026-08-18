<?php

header("Content-Type: application/json; charset=UTF-8");

$arquivo = "../servicos.json";

$dados = file_get_contents($arquivo);

echo $dados;