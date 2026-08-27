<?php

header("Content-Type: application/json; charset=UTF-8");

require_once "conexao.php";

$metodo = $_SERVER["REQUEST_METHOD"];


// ======================================================
// GET
// Consultar serviços
// ======================================================

if ($metodo === "GET") {

    $id = isset($_GET["id"])
        ? intval($_GET["id"])
        : null;

    $categoria = isset($_GET["categoria"])
        ? trim($_GET["categoria"])
        : null;


    // --------------------------------------
    // CONSULTAR POR ID
    // --------------------------------------

    if ($id !== null) {

        $sql = "
            SELECT
                id,
                nome,
                categoria,
                mensagem,
                requisitos,
                documentos,
                etapas,
                link_oficial,
                ativo
            FROM servicos
            WHERE id = ?
            AND ativo = 1
        ";

        $stmt = $conexao->prepare($sql);

        $stmt->bind_param(
            "i",
            $id
        );

        $stmt->execute();

        $resultado =
            $stmt->get_result();

        $servico =
            $resultado->fetch_assoc();


        if (!$servico) {

            http_response_code(404);

            echo json_encode(
                [
                    "erro" =>
                        "Serviço não encontrado."
                ],
                JSON_UNESCAPED_UNICODE
            );

            exit;
        }


        echo json_encode(
            $servico,
            JSON_UNESCAPED_UNICODE
        );

        exit;
    }


    // --------------------------------------
    // CONSULTAR POR CATEGORIA
    // --------------------------------------

    if ($categoria !== null) {

        $sql = "
            SELECT
                id,
                nome,
                categoria,
                mensagem,
                requisitos,
                documentos,
                etapas,
                link_oficial,
                ativo
            FROM servicos
            WHERE categoria = ?
            AND ativo = 1
            ORDER BY ordem ASC, nome ASC
        ";

        $stmt = $conexao->prepare($sql);

        $stmt->bind_param(
            "s",
            $categoria
        );

        $stmt->execute();

        $resultado =
            $stmt->get_result();


    // --------------------------------------
    // CONSULTAR TODOS
    // --------------------------------------

    } else {

        $sql = "
            SELECT
                id,
                nome,
                categoria,
                mensagem,
                requisitos,
                documentos,
                etapas,
                link_oficial,
                ativo
            FROM servicos
            WHERE ativo = 1
            ORDER BY ordem ASC, nome ASC
        ";

        $resultado =
            $conexao->query($sql);
    }


    if (!$resultado) {

        http_response_code(500);

        echo json_encode(
            [
                "erro" =>
                    "Erro ao consultar os serviços."
            ],
            JSON_UNESCAPED_UNICODE
        );

        exit;
    }


    $servicos = [];

    while (
        $servico =
            $resultado->fetch_assoc()
    ) {

        $servicos[] = $servico;
    }


    echo json_encode(
        $servicos,
        JSON_UNESCAPED_UNICODE
    );

    exit;
}


// ======================================================
// POST
// Cadastrar serviço
// ======================================================

if ($metodo === "POST") {

    $corpo =
        file_get_contents("php://input");

    $dados =
        json_decode(
            $corpo,
            true
        );


    // --------------------------------------
    // VALIDAR JSON
    // --------------------------------------

    if (!is_array($dados)) {

        http_response_code(400);

        echo json_encode(
            [
                "erro" =>
                    "JSON inválido."
            ],
            JSON_UNESCAPED_UNICODE
        );

        exit;
    }


    // --------------------------------------
    // PEGAR CAMPOS
    // --------------------------------------

    $nome =
        trim($dados["nome"] ?? "");

    $categoria =
        trim($dados["categoria"] ?? "");

    $mensagem =
        trim($dados["mensagem"] ?? "");

    $requisitos =
        $dados["requisitos"] ?? null;

    $documentos =
        $dados["documentos"] ?? null;

    $etapas =
        $dados["etapas"] ?? null;

    $linkOficial =
        $dados["link_oficial"] ?? null;


    // --------------------------------------
    // VALIDAR CAMPOS OBRIGATÓRIOS
    // --------------------------------------

    if (
        $nome === "" ||
        $categoria === "" ||
        $mensagem === ""
    ) {

        http_response_code(400);

        echo json_encode(
            [
                "erro" =>
                    "Nome, categoria e mensagem são obrigatórios."
            ],
            JSON_UNESCAPED_UNICODE
        );

        exit;
    }


    // --------------------------------------
    // INSERT
    // --------------------------------------

    $sql = "
        INSERT INTO servicos
        (
            nome,
            categoria,
            mensagem,
            requisitos,
            documentos,
            etapas,
            link_oficial,
            ativo
        )
        VALUES
        (?, ?, ?, ?, ?, ?, ?, 1)
    ";

    $stmt =
        $conexao->prepare($sql);


    if (!$stmt) {

        http_response_code(500);

        echo json_encode(
            [
                "erro" =>
                    "Erro ao preparar cadastro."
            ],
            JSON_UNESCAPED_UNICODE
        );

        exit;
    }


    $stmt->bind_param(
        "sssssss",
        $nome,
        $categoria,
        $mensagem,
        $requisitos,
        $documentos,
        $etapas,
        $linkOficial
    );


    if (!$stmt->execute()) {

        http_response_code(500);

        echo json_encode(
            [
                "erro" =>
                    "Erro ao cadastrar serviço."
            ],
            JSON_UNESCAPED_UNICODE
        );

        exit;
    }


    $novoId =
        $conexao->insert_id;


    http_response_code(201);

    echo json_encode(
        [
            "mensagem" =>
                "Serviço cadastrado com sucesso.",

            "id" =>
                $novoId
        ],
        JSON_UNESCAPED_UNICODE
    );

    exit;
}

// ======================================================
// PATCH
// Atualizar parcialmente um serviço
// ======================================================

if ($metodo === "PATCH") {

    $id = isset($_GET["id"])
        ? intval($_GET["id"])
        : 0;


    // --------------------------------------
    // VALIDAR ID
    // --------------------------------------

    if ($id <= 0) {

        http_response_code(400);

        echo json_encode(
            [
                "erro" =>
                    "ID do serviço é obrigatório."
            ],
            JSON_UNESCAPED_UNICODE
        );

        exit;
    }


    // --------------------------------------
    // RECEBER JSON
    // --------------------------------------

    $corpo =
        file_get_contents("php://input");

    $dados =
        json_decode(
            $corpo,
            true
        );


    if (!is_array($dados)) {

        http_response_code(400);

        echo json_encode(
            [
                "erro" =>
                    "JSON inválido."
            ],
            JSON_UNESCAPED_UNICODE
        );

        exit;
    }


    // --------------------------------------
    // VERIFICAR SE SERVIÇO EXISTE
    // --------------------------------------

    $sql = "
        SELECT id
        FROM servicos
        WHERE id = ?
        AND ativo = 1
    ";

    $stmt =
        $conexao->prepare($sql);

    $stmt->bind_param(
        "i",
        $id
    );

    $stmt->execute();

    $resultado =
        $stmt->get_result();


    if (!$resultado->fetch_assoc()) {

        http_response_code(404);

        echo json_encode(
            [
                "erro" =>
                    "Serviço não encontrado."
            ],
            JSON_UNESCAPED_UNICODE
        );

        exit;
    }


    // --------------------------------------
    // PEGAR VALORES ENVIADOS
    // --------------------------------------

    $nome =
        isset($dados["nome"])
            ? trim($dados["nome"])
            : null;

    $categoria =
        isset($dados["categoria"])
            ? trim($dados["categoria"])
            : null;

    $mensagem =
        isset($dados["mensagem"])
            ? trim($dados["mensagem"])
            : null;

    $requisitos =
        $dados["requisitos"] ?? null;

    $documentos =
        $dados["documentos"] ?? null;

    $etapas =
        $dados["etapas"] ?? null;

    $linkOficial =
        $dados["link_oficial"] ?? null;


    // --------------------------------------
    // ATUALIZAR
    // COALESCE mantém o valor antigo
    // quando o campo não foi enviado
    // --------------------------------------

    $sql = "
        UPDATE servicos
        SET
            nome =
                COALESCE(?, nome),

            categoria =
                COALESCE(?, categoria),

            mensagem =
                COALESCE(?, mensagem),

            requisitos =
                COALESCE(?, requisitos),

            documentos =
                COALESCE(?, documentos),

            etapas =
                COALESCE(?, etapas),

            link_oficial =
                COALESCE(?, link_oficial)

        WHERE id = ?
        AND ativo = 1
    ";

    $stmt =
        $conexao->prepare($sql);


    if (!$stmt) {

        http_response_code(500);

        echo json_encode(
            [
                "erro" =>
                    "Erro ao preparar atualização."
            ],
            JSON_UNESCAPED_UNICODE
        );

        exit;
    }


    $stmt->bind_param(
        "sssssssi",
        $nome,
        $categoria,
        $mensagem,
        $requisitos,
        $documentos,
        $etapas,
        $linkOficial,
        $id
    );


    if (!$stmt->execute()) {

        http_response_code(500);

        echo json_encode(
            [
                "erro" =>
                    "Erro ao atualizar serviço."
            ],
            JSON_UNESCAPED_UNICODE
        );

        exit;
    }


    echo json_encode(
        [
            "mensagem" =>
                "Serviço atualizado com sucesso.",

            "id" =>
                $id
        ],
        JSON_UNESCAPED_UNICODE
    );

    exit;
}

// ======================================================
// DELETE
// Desativar um serviço
// ======================================================

if ($metodo === "DELETE") {

    $id = isset($_GET["id"])
        ? intval($_GET["id"])
        : 0;


    // --------------------------------------
    // VALIDAR ID
    // --------------------------------------

    if ($id <= 0) {

        http_response_code(400);

        echo json_encode(
            [
                "erro" =>
                    "ID do serviço é obrigatório."
            ],
            JSON_UNESCAPED_UNICODE
        );

        exit;
    }


    // --------------------------------------
    // VERIFICAR SE SERVIÇO EXISTE
    // --------------------------------------

    $sql = "
        SELECT id
        FROM servicos
        WHERE id = ?
        AND ativo = 1
    ";

    $stmt =
        $conexao->prepare($sql);

    $stmt->bind_param(
        "i",
        $id
    );

    $stmt->execute();

    $resultado =
        $stmt->get_result();


    if (!$resultado->fetch_assoc()) {

        http_response_code(404);

        echo json_encode(
            [
                "erro" =>
                    "Serviço não encontrado."
            ],
            JSON_UNESCAPED_UNICODE
        );

        exit;
    }


    // --------------------------------------
    // EXCLUSÃO LÓGICA
    // --------------------------------------

    $sql = "
        UPDATE servicos
        SET ativo = 0
        WHERE id = ?
    ";

    $stmt =
        $conexao->prepare($sql);

    $stmt->bind_param(
        "i",
        $id
    );


    if (!$stmt->execute()) {

        http_response_code(500);

        echo json_encode(
            [
                "erro" =>
                    "Erro ao remover serviço."
            ],
            JSON_UNESCAPED_UNICODE
        );

        exit;
    }


    echo json_encode(
        [
            "mensagem" =>
                "Serviço removido com sucesso.",

            "id" =>
                $id
        ],
        JSON_UNESCAPED_UNICODE
    );

    exit;
}

// ======================================================
// MÉTODO NÃO PERMITIDO
// ======================================================

http_response_code(405);

echo json_encode(
    [
        "erro" =>
            "Método HTTP não permitido."
    ],
    JSON_UNESCAPED_UNICODE
);