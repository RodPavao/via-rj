<?php

$configLocal = __DIR__ . '/config.local.php';

if (file_exists($configLocal)) {
    $config = require $configLocal;

    $host = $config['host'];
    $usuario = $config['usuario'];
    $senha = $config['senha'];
    $banco = $config['banco'];
} else {
    $host = "localhost";
    $usuario = "root";
    $senha = "";
    $banco = "via_rj";
}

$conexao = new mysqli(
    $host,
    $usuario,
    $senha,
    $banco
);

if ($conexao->connect_error) {
    die("Erro na conexão com o banco: " . $conexao->connect_error);
}

$conexao->set_charset("utf8mb4");