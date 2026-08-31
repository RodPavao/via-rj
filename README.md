# VIA RJ 🚦

O VIA RJ é um projeto acadêmico que ajuda o cidadão a encontrar orientações sobre problemas de trânsito e documentação no Rio de Janeiro.

> **Aviso:** o VIA RJ é independente, não é um sistema oficial do DETRAN-RJ e não executa procedimentos. Requisitos e etapas devem ser confirmados nos canais oficiais indicados.

## Objetivo atual

A página oferece dois caminhos:

1. **Assistente de resolução:** o usuário descreve uma situação cotidiana e um conjunto simples de regras identifica uma situação provável.
2. **Catálogo tradicional:** o usuário pesquisa por nome ou navega pelas categorias e serviços existentes.

O assistente ainda não usa inteligência artificial. Nesta etapa, isso é proposital: as regras são gratuitas, transparentes e fáceis de estudar.

## Tecnologias

- HTML5 para estrutura e acessibilidade;
- CSS3 para layout, responsividade e temas claro/escuro;
- JavaScript puro para regras, busca e manipulação da página;
- PHP para a API de serviços;
- MySQL/MariaDB para armazenar os serviços na instalação completa.

## Estrutura

```text
VIA-RJ/
├── api/
│   ├── conexao.php
│   ├── servicos.php
│   └── teste.php
├── docs/
│   └── GUIA-DE-ESTUDO.md
├── images/
├── index.html
├── script.js
├── servicos.json
├── style.css
└── via_rj_backup.sql
```

O arquivo `servicos.json` funciona como alternativa para uma hospedagem estática. No XAMPP ou em uma hospedagem PHP, `script.js` tenta primeiro `api/servicos.php` e usa o JSON caso a API não esteja disponível.

## Como executar com XAMPP

1. Copie a pasta do projeto para `C:\xampp\htdocs\via-rj`.
2. Inicie **Apache** e **MySQL** no painel do XAMPP.
3. No phpMyAdmin, crie o banco `via_rj` e importe `via_rj_backup.sql` somente em uma instalação vazia.
4. Confira localmente, sem publicar credenciais, se `api/conexao.php` corresponde ao seu ambiente.
5. Abra `http://localhost/via-rj/`.

O backup SQL existente contém comandos de recriação e não deve ser importado sobre um banco com dados que precisem ser preservados.

## Situações demonstradas

- CNH vencida;
- veículo vendido ainda no nome do antigo proprietário;
- multa recebida quando outra pessoa dirigia;
- licenciamento/CRLV-e não atualizado;
- identidade perdida;
- compra de veículo usado.

Consulte [docs/GUIA-DE-ESTUDO.md](docs/GUIA-DE-ESTUDO.md) para entender o fluxo completo e os pontos recomendados para continuar estudando.

## Autor

**Rodrigo Pavão** — estudante de Análise e Desenvolvimento de Sistemas.
