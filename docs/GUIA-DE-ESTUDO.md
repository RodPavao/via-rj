# Guia de estudo do VIA RJ

## 1. Visão geral da arquitetura

O VIA RJ usa uma arquitetura pequena, dividida em três partes:

```text
Navegador (HTML + CSS + JavaScript)
        ↓ requisição HTTP com fetch
API PHP (api/servicos.php)
        ↓ consulta SQL
MySQL/MariaDB (tabela servicos)
```

O navegador apresenta a página e recebe as ações do usuário. O JavaScript pede os serviços à API. A API PHP consulta o banco e devolve JSON. Se a API não estiver disponível, o JavaScript tenta `servicos.json`; isso permite manter uma demonstração estática.

## 2. Função dos arquivos importantes

- `index.html`: estrutura semântica da página. Contém assistente, pesquisa, categorias, acessos rápidos, resultados e controles de acessibilidade.
- `style.css`: identidade visual, layout, modo escuro, responsividade, foco visível e redução de movimento.
- `script.js`: carrega serviços, reconhece situações, exibe orientações, pesquisa serviços e controla tema/acessibilidade.
- `servicos.json`: versão reduzida dos dados usada como alternativa à API, principalmente em hospedagem estática.
- `api/conexao.php`: cria a conexão do PHP com o MySQL. Credenciais não devem ser publicadas.
- `api/servicos.php`: API que consulta e também possui operações de cadastro, atualização e desativação de serviços.
- `api/teste.php`: teste simples da conexão com o banco. Em produção, convém removê-lo ou restringi-lo porque revela se a conexão funciona.
- `via_rj_backup.sql`: cópia do schema e dos dados da tabela `servicos`. Não é uma migração não destrutiva: contém `DROP TABLE` e deve ser usado apenas numa instalação vazia ou descartável.

## 3. Fluxo desde a ação até a resposta

### Assistente

1. O usuário escreve no `textarea` com id `problema`.
2. O clique em “Receber orientação” executa `orientarUsuario()`.
3. `identificarSituacao()` normaliza a frase e compara termos conhecidos.
4. Se a situação exigir contexto, `mostrarPergunta()` exibe opções simples.
5. Os nomes de serviços associados são procurados na lista carregada da API ou do JSON.
6. `criarResultadoAssistente()` apresenta situação, explicação e dados verificados do serviço.

### Catálogo

1. A pesquisa executa `pesquisarServico()`; a categoria executa `obterServicosDaCategoria()`.
2. `mostrarServicos()` cria os cards.
3. Ao clicar num card, `mostrarDetalhes()` exibe requisitos, documentos, etapas e link oficial.

## 4. Como as tecnologias se relacionam

O HTML fornece elementos com identificadores, como `problema` e `resultadoAssistente`. O CSS seleciona classes e identificadores para definir a aparência. O JavaScript usa `document.getElementById()` e eventos para ler ou modificar esses elementos.

`fetch()` realiza uma requisição HTTP. `await` pausa somente aquela função assíncrona até a resposta chegar; a página não fica congelada. `resposta.json()` transforma o JSON recebido em arrays e objetos JavaScript.

No backend, PHP recebe a requisição. `api/servicos.php` usa a conexão criada em `conexao.php`, executa SQL e devolve JSON. Consultas com parâmetros usam prepared statements, que separam instrução SQL e valores e reduzem o risco de injeção de SQL.

## 5. Como funciona o assistente

O array `situacoes`, no Bloco 2 de `script.js`, é a base demonstrativa. Cada objeto tem:

- `id`: identificador técnico;
- `titulo`: nome apresentado ao usuário;
- `explicacao`: motivo da orientação;
- `termos`: frases e palavras comparadas;
- `servicos`: nomes de serviços relacionados; ou
- `pergunta` e `respostas`: ramificação simples quando falta uma informação.

A normalização remove diferenças de maiúsculas, acentos e pontuação. Depois, o código soma pontos quando encontra termos. Isso não compreende linguagem como uma IA; apenas aplica regras explícitas.

## 6. Frontend, backend e banco

- **Frontend:** todo o assistente baseado em regras, busca, categorias, renderização, modo escuro e acessibilidade.
- **Backend:** disponibilização dos serviços em JSON e operações existentes da API.
- **Banco:** fonte completa dos nomes, mensagens, requisitos, documentos, etapas e links oficiais.

O assistente ficou no frontend para manter o checkpoint simples. Em uma evolução com muitas regras, elas poderiam ser movidas para uma tabela ou endpoint, após avaliar a necessidade real.

## 7. Partes obrigatórias e decisões de projeto

São tecnicamente obrigatórios para esta versão: HTML carregando CSS e JavaScript, identificadores esperados pelo JavaScript, uma fonte de serviços válida e eventos conectados aos botões.

São decisões deste projeto: manter regras no JavaScript, usar nomes para relacionar situação e serviço, usar JSON como fallback e apresentar todos os detalhes numa única página. Outras soluções seriam possíveis, mas aumentariam a estrutura sem necessidade neste checkpoint.

## 8. Onde entraria uma IA futuramente

Somente a função de interpretação mudaria conceitualmente:

```text
texto do usuário
→ interpretação por IA
→ id da situação/intenção
→ consulta aos dados verificados do VIA RJ
→ resposta organizada
```

A IA não deve inventar requisitos ou prazos. A fonte da verdade deve continuar sendo a base revisada do VIA RJ. Chaves de API devem ficar no servidor, nunca em `script.js` ou no repositório.

## 9. O que estudar para explicar em entrevista

1. Explique por que `carregarServicos()` é `async` e como funciona o fallback.
2. Percorra um objeto de `situacoes` e mostre como uma frase chega a um serviço.
3. Compare `textContent` e `innerHTML`, e explique por que `escaparHtml()` protege dados renderizados.
4. Mostre event bubbling no listener de `resultado` e o uso de `closest()`.
5. Explique `filter()`, `map()`, `find()` e `sort()` com exemplos do arquivo.
6. Mostre como a API devolve JSON e onde usa prepared statements.
7. Explique a diferença entre frontend, API e banco.
8. Demonstre tema escuro e preferências salvas em `localStorage`.
9. Teste a navegação somente por teclado e o layout em tela pequena.

## 10. Próximo checkpoint didático recomendado

Comece adicionando uma única nova situação ao array `situacoes`. Verifique primeiro se o serviço existe no banco e no JSON. Depois crie testes manuais com três formas diferentes de escrever a mesma necessidade. Quando esse fluxo estiver claro, estude como mover as situações para uma fonte de dados própria — sem integrar IA ainda.

## 11. Pendências de curadoria

- Conferir periodicamente links e textos com fontes oficiais.
- Alinhar o conteúdo reduzido de `servicos.json` com os serviços completos do banco.
- Criar mais situações apenas depois de validar o procedimento correspondente.
- Antes de produção, revisar se os métodos de escrita da API precisam de autenticação e restringir/remover `api/teste.php`.
