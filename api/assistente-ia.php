<?php
// ==========================================================
// BLOCO 1 — RESPOSTA E REGRAS DE ENTRADA
// Este endpoint opcional aceita apenas POST curto e nunca recebe documentos completos.
// ==========================================================

header('Content-Type: application/json; charset=utf-8');

function responder(array $dados, int $status = 200): void
{
    http_response_code($status);
    echo json_encode($dados, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    responder(['ativo' => false, 'servicos' => []], 405);
}

$entrada = json_decode(file_get_contents('php://input'), true);
$texto = trim((string) ($entrada['texto'] ?? ''));

if (strlen($texto) < 3 || strlen($texto) > 1000 || preg_match('/\d{8,}/', $texto)) {
    responder(['ativo' => false, 'servicos' => []]);
}

// ==========================================================
// BLOCO 2 — CONFIGURAÇÃO SEGURA
// A integração só liga quando a chave existe no ambiente do servidor; nunca no frontend.
// ==========================================================

$chave = getenv('GEMINI_API_KEY');
$modelo = getenv('GEMINI_MODEL') ?: 'gemini-3.7-flash';

if (!$chave || !function_exists('curl_init')) {
    responder(['ativo' => false, 'servicos' => []]);
}

// ==========================================================
// BLOCO 3 — LISTA CONTROLADA DE INTENÇÕES
// O Gemini pode classificar a frase, mas só nomes desta lista chegam ao navegador.
// ==========================================================

$permitidos = [
    'Primeira Habilitação', 'Renovação da Habilitação', '2ª Via da Habilitação',
    'Adição de Categoria', 'Mudança de Categoria', 'Consultar Pontos e Situação da CNH',
    'Licenciamento Anual (CRLV-e)', 'Segunda Via do CRV', 'Transferência de Propriedade',
    'Primeira Licença e Emplacamento', 'Transferência de Jurisdição', 'Comunicação de Venda',
    'Consulta de Cadastro do Veículo', '1ª Via da Carteira de Identidade Nacional (CIN)',
    '2ª Via da Carteira de Identidade Nacional (CIN)', 'Correção de Carteira de Identidade',
    'Andamento do Pedido de Identidade', 'Consulta de Multas e Infrações', 'Defesa Prévia',
    'Recurso de 1ª Instância (JARI)', 'Indicação / Troca de Real Infrator',
    'Cópia de Auto de Infração e Notificações'
];

$instrucao = "Classifique a intenção do cidadão. Responda somente JSON no formato "
    . '{"servicos":["nome exato"]}. Use no máximo 3 nomes desta lista: '
    . implode(' | ', $permitidos)
    . ". Não forneça documentos, regras, taxas, prazos ou explicações. Texto: " . $texto;

$corpo = [
    'contents' => [['parts' => [['text' => $instrucao]]]],
    'generationConfig' => ['responseMimeType' => 'application/json', 'temperature' => 0.1]
];

// ==========================================================
// BLOCO 4 — CHAMADA REST E FILTRO FINAL
// Sem rede, cURL ou resposta válida, o frontend continua apenas com busca e regras locais.
// ==========================================================

$url = 'https://generativelanguage.googleapis.com/v1beta/models/' . rawurlencode($modelo) . ':generateContent';
$curl = curl_init($url);
curl_setopt_array($curl, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 12,
    CURLOPT_HTTPHEADER => ['Content-Type: application/json', 'x-goog-api-key: ' . $chave],
    CURLOPT_POSTFIELDS => json_encode($corpo, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)
]);

$resposta = curl_exec($curl);
$status = (int) curl_getinfo($curl, CURLINFO_HTTP_CODE);
curl_close($curl);

if (!$resposta || $status < 200 || $status >= 300) {
    responder(['ativo' => false, 'servicos' => []]);
}

$dados = json_decode($resposta, true);
$textoJson = $dados['candidates'][0]['content']['parts'][0]['text'] ?? '';
$classificacao = json_decode($textoJson, true);
$sugeridos = is_array($classificacao['servicos'] ?? null) ? $classificacao['servicos'] : [];
$filtrados = array_values(array_slice(array_intersect($sugeridos, $permitidos), 0, 3));

responder(['ativo' => true, 'servicos' => $filtrados]);
