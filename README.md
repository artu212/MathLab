# MathLab — Calculadora Matemática

O **MathLab** é uma aplicação web de matemática que reúne seis módulos de cálculo em uma interface única. O projeto foi desenvolvido com **HTML, CSS e JavaScript**, com foco em praticidade, organização e acesso pelo navegador.

**Aplicação principal (Netlify):** https://mathlab-calculadora.netlify.app/

**Hospedagem alternativa (GitHub Pages):** https://artu212.github.io/MathLab/

**Código-fonte:** https://github.com/artu212/MathLab

## Funcionalidades

|       | Recursos principais |
|---|---|
| **Calculadora** | Operações aritméticas, porcentagem, parênteses, alteração de sinal, teclado e histórico reutilizável. |
| **Calculadora Científica** | Trigonometria, potências, raízes, logaritmos, constantes matemáticas, fatorial, números aleatórios e histórico. |
| **Funções** | Avaliação de expressões f(x), tabela de valores e gráfico cartesiano em HTML Canvas. |
| **Matrizes** | Soma, subtração, multiplicação, multiplicação por escalar, transposta, determinante e inversa, respeitando as condições matemáticas de cada operação. |
| **Análise Combinatória** | Fatorial, combinação, permutação, arranjo e permutação com repetição. |
| **Probabilidade** | Probabilidade simples e complementar, união e interseção, condicional, distribuição binomial e simulações de dado, moeda e cartas. |

O módulo de **Probabilidade** foi definido como diferencial do projeto.

## Recursos adicionais

- Alternância entre os temas claro e escuro.
- Interface responsiva, com navegação por abas.
- Suporte a atalhos de teclado nas calculadoras.
- Reutilização de resultados do histórico e repetição de operações com `=`.
- Persistência local de campos, resultados e históricos dos seis módulos após recarregar a página.
- Botões de restauração de padrões em Funções, Matrizes, Combinatória e Probabilidade.
- Separador decimal com vírgula nas calculadoras Básica e Científica.
- Controles separados para gerar tabela, desenhar e limpar gráficos em Funções.
- Prevenção de zoom por duplo toque nos botões em navegadores móveis compatíveis (`touch-action: manipulation`).
- Suporte a **Progressive Web App (PWA)**, com instalação e acesso offline após o armazenamento inicial dos arquivos.

## Tecnologias

- **HTML5:** estrutura da aplicação e Canvas para gráficos.
- **CSS3:** interface, temas e adaptação a diferentes tamanhos de tela.
- **JavaScript:** lógica matemática, validações e interações.
- **Git e GitHub:** versionamento do código.
- **GitHub Pages:** publicação da aplicação.
- **Service Worker e Web App Manifest:** recursos de PWA.

O processamento matemático ocorre no navegador; o projeto não exige cadastro nem banco de dados.

## Como utilizar

**Online:** acesse https://artu212.github.io/MathLab/, selecione um módulo, informe os valores solicitados e execute o cálculo.

**Localmente:**

1. Clone o repositório:
   ```bash
   git clone https://github.com/artu212/MathLab.git
   ```
2. Abra a pasta do projeto em um editor ou IDE.
3. Execute a aplicação por um servidor local para utilizar também os recursos de PWA. O `index.html` é a página inicial.

A instalação e o modo offline dependem de navegador compatível e do carregamento inicial da aplicação em ambiente seguro, como HTTPS ou localhost.

## Estrutura principal

```text
MathLab/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── app.js
│   └── pwa.js
├── img/
│   ├── mathlab-logo.jpg
│   ├── icon-192.png
│   └── icon-512.png
├── manifest.json
└── service-worker.js
```

## Hospedagem

O MathLab está publicado no Netlify, conectado ao repositório GitHub e à branch `master`. O GitHub Pages permanece como endereço alternativo. O novo endereço foi aberto e o funcionamento da aplicação foi confirmado após a publicação. O acesso público foi habilitado no painel do Netlify; recomenda-se confirmar o acesso em janela anônima.

## Atualizações recentes (23/10/2026)

- **7.3:** persistência entre recargas, ajustes nos teclados, vírgula decimal, restauração de padrões e controles independentes do gráfico. Alterações submetidas e testes internos relatados como aprovados. Commit confirmado: `d88d40c`.
- **Hospedagem no Netlify:** publicação em `mathlab-calculadora.netlify.app`, com integração ao GitHub.
- **7.4:** correção do zoom indesejado por duplo toque em botões no celular, com `touch-action: manipulation`. Funcionamento confirmado em teste no celular. Commit confirmado: `d21260d`.

## Estado do projeto e testes

Os seis módulos estão implementados e foram verificados internamente, inclusive na versão hospedada. **A bateria oficial de testes da equipe e seu registro de evidências ainda estão pendentes.** As verificações de desenvolvimento não são apresentadas como resultados oficiais.

Consulte [`STATUS.md`](docs/STATUS.md) para o andamento da entrega e [`MathLab - HISTORICO DE DESENVOLVIMENTO.md`](docs/MathLab%20-%20HISTORICO%20DE%20DESENVOLVIMENTO.md) para um resumo das etapas do projeto.

## Equipe e organização

As responsabilidades atuais para a etapa de encerramento são:

- **Arthur:** integração do código, versionamento e publicação; organização da apresentação.
- **Pedro e Rafael:** documentação e relatório técnico.
- **Matheus, Gustavo e Vitor:** execução e registro dos testes oficiais, conforme divisão da equipe.

As responsabilidades indicam o planejamento de trabalho, não uma declaração de entregas individuais já concluídas.

## Contexto acadêmico

Projeto acadêmico de Matemática Computacional, com início informado em **01/10/2026** e prazo previsto para **30/11/2026**.
