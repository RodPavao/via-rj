# Guia de estudo do VIA RJ

## 1. Arquitetura e navegação

O VIA RJ usa HTML, CSS e JavaScript no navegador, uma API PHP e MySQL. O frontend combina `api/servicos.php` com `servicos.json`: o banco prevalece nos nomes já cadastrados e o JSON completa os serviços ausentes. Se a API falhar, o fallback continua funcionando sozinho.

```text
Home → categoria → serviço → servico.html → canal oficial externo
                     ↘ Serviços de Vistoria → serviço
```

Links internos usam caminhos relativos e permanecem na mesma guia. Links externos usam URL completa, `target="_blank"` e `rel="noopener noreferrer"`.

## 2. Interface app-first

`style.css` começa pelas regras compartilhadas e preserva grades de duas colunas inclusive no mobile. Em vez de colocar um botão dentro de cada caixa, o próprio elemento `<a>` é o card. Isso amplia a área de toque, mantém navegação por teclado e simplifica a hierarquia.

As páginas de categoria contêm apenas título e uma grade vazia. O Bloco 1 de `paginas.js` descreve os cards em objetos simples; `criarCard()` monta a interface. Textos oficiais detalhados não são duplicados nesses objetos.

## 3. Busca e assistente unificados

A Home tem apenas `#consulta`. Ao enviar:

1. `procurarServicoEstruturado()` procura nome ou palavra-chave clara;
2. `identificarSituacao()` aplica as seis regras locais existentes;
3. somente se ambas falharem, `tentarInterpretacaoOpcional()` consulta o endpoint PHP;
4. a resposta final sempre recupera os serviços da API ou do JSON.

Assim, uma IA pode interpretar intenção, mas não escreve documentos, prazos, taxas ou procedimentos.

## 4. API, fallback e segurança

`carregarServicos()` tenta a API e depois o JSON. O endpoint `api/assistente-ia.php` lê a chave apenas de `GEMINI_API_KEY` no ambiente do servidor. Ele limita o tamanho da entrada, bloqueia sequências longas de números e filtra a resposta por uma lista de nomes permitidos.

A chave nunca deve ficar em HTML, JavaScript, JSON, Git ou em arquivo enviado ao navegador. Sem chave, cURL ou acesso externo, o endpoint responde como desativado e as regras locais continuam funcionando.

## 5. Tema e acessibilidade

O tema é aplicado no `<head>` para reduzir o clarão antes do modo escuro. `localStorage` mantém tema, texto ampliado e redução de movimento entre páginas. Cards e botões têm foco visível e tamanho de toque adequado.

## 6. Acessos públicos

Os três cards gráficos são links externos. A classe `.midia-acesso` cria um enquadramento comum; a imagem usa `object-fit: contain`, portanto não é esticada nem cortada. Se o arquivo ainda não existe, `script.js` oculta a imagem quebrada e mantém um identificador textual neutro.

## 7. Pontos para explicar em entrevista

1. Por que a grade continua em duas colunas em 320–375 px.
2. Como um card inteiro pode ser acessível via teclado.
3. Como `fetch()` alterna entre API e fallback.
4. Por que dados oficiais ficam fora da configuração visual dos cards.
5. Como a busca decide entre serviço, regra local e IA opcional.
6. Por que a chave Gemini precisa ficar no PHP.
7. Como URLs internas e externas têm comportamentos diferentes.
