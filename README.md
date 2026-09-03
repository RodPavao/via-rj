# VIA RJ 🚦

O VIA RJ é um projeto acadêmico e independente que orienta o cidadão a encontrar serviços de trânsito e documentação no Rio de Janeiro. Não é um sistema oficial e não executa procedimentos do DETRAN-RJ.

## Experiência atual

A interface segue um fluxo app-first:

```text
Home → categoria → serviço ou subcategoria → orientação → canal oficial
```

A Home possui uma única entrada: ela aceita tanto o nome de um serviço quanto uma descrição cotidiana. A busca estruturada e as regras locais são executadas primeiro. Uma camada opcional de interpretação por Gemini pode ser ativada no servidor, mas os requisitos, documentos e etapas continuam vindo exclusivamente da base controlada do VIA RJ.

## Tecnologias

- HTML5 e CSS3;
- JavaScript puro;
- PHP;
- MySQL/MariaDB;
- `servicos.json` como fallback da API.

## Estrutura principal

```text
VIA-RJ/
├── api/
│   ├── assistente-ia.php
│   ├── conexao.php
│   └── servicos.php
├── docs/GUIA-DE-ESTUDO.md
├── images/
│   └── acessos/                 # imagens públicas fornecidas pelo responsável
├── index.html
├── habilitacao.html
├── veiculos.html
├── vistoria-veicular.html
├── identificacao.html
├── infracoes.html
├── servico.html
├── script.js
├── paginas.js
├── servicos.json
└── style.css
```

## Como executar com XAMPP

1. Copie a pasta para `C:\xampp\htdocs\via-rj`.
2. Inicie Apache e MySQL.
3. Em uma instalação vazia, importe `via_rj_backup.sql` pelo phpMyAdmin.
4. Configure `api/config.local.php` somente no ambiente local.
5. Abra `http://localhost/via-rj/`.

O backup contém comandos destrutivos de recriação e não deve ser importado sobre dados que precisem ser preservados.

## Gemini opcional

Os serviços da API são combinados com o fallback: registros do banco prevalecem quando existem e `servicos.json` completa os itens ainda ausentes no banco.

`api/assistente-ia.php` só atua depois que busca e regras locais falham. Para habilitar, o servidor precisa oferecer cURL, saída HTTPS e as variáveis de ambiente `GEMINI_API_KEY` e, opcionalmente, `GEMINI_MODEL`. Sem isso, o sistema continua funcionando normalmente e nenhuma chave chega ao navegador ou ao repositório.

No InfinityFree, confirme previamente se o plano permite chamadas HTTPS de saída e configuração segura de variáveis. Se não permitir, mantenha a camada desativada.

## Assets dos acessos públicos

Os três arquivos fornecidos pelo responsável estão armazenados em:

- `images/acessos/bradesco-duda-grt.png`;
- `images/acessos/diario-oficial-rj.png`;
- `images/acessos/ipva-fazenda-rj.png`.

A Home exibe cada imagem inteira em um enquadramento padronizado, sem recorte ou deformação. A identificação textual neutra permanece apenas como fallback técnico se algum arquivo deixar de carregar.

## Autor

**Rodrigo Pavão** — estudante de Análise e Desenvolvimento de Sistemas.
