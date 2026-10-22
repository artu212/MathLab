# MathLab — Histórico de desenvolvimento e alterações

**Projeto:** MathLab — Matemática Computacional  
**Início informado:** 01/10/2026  
**Prazo acadêmico:** 30/11/2026  
**Repositório:** https://github.com/artu212/MathLab  
**Última atualização deste documento:** 22/10/2026

## 1. Finalidade e critérios de registro

Este documento reúne a evolução conhecida do MathLab, as mudanças identificadas nos arquivos disponíveis e as próximas validações. A parte inicial é uma **reconstrução retrospectiva**, baseada no material do projeto e não em uma consulta ao histórico completo de commits. Por isso, **não atribui datas exatas nem hashes de commit às etapas que não têm comprovação**.

**Convenções:**
- **Identificado:** funcionalidade ou estrutura encontrada na versão anterior do código ou nos documentos do projeto.
- **Planejado:** requisito ou atividade definida, mas não necessariamente concluída.
- **Revisado em 22/10:** alteração preparada na revisão de código recebida nessa data; ainda depende de integração e testes completos.
- **Validado:** somente quando houver registro da execução de teste com versão, resultado e responsável.

## 2. Histórico retrospectivo — início do projeto (datas individuais não confirmadas)

### Etapa A — Definição da proposta e do escopo
**Situação: documentada retrospectivamente.**

- O projeto foi iniciado como uma calculadora científica e evoluiu para o **MathLab**, reunindo ferramentas matemáticas em uma aplicação web.
- Foram definidos seis módulos: **calculadora básica, calculadora científica, funções, matrizes, análise combinatória e probabilidade**.
- O módulo de **probabilidade** foi escolhido como diferencial, por permitir cálculos e simulações de eventos aleatórios.
- O escopo acadêmico foi delimitado: aplicação web em HTML, CSS e JavaScript, com interface responsiva e documentação; sem banco de dados, cadastro de usuários ou aplicativo nativo.
- Foram previstos Git/GitHub para controle de versão e documentação de entregas.

**Evidência disponível:** resumo do projeto e documento da primeira entrega. **Observação:** o cronograma do documento inicial contém anos inconsistentes; não deve ser utilizado como prova de datas históricas sem correção.

### Etapa B — Estrutura inicial e identidade visual
**Situação: identificada nos arquivos anteriores.**

- Estruturação da interface em HTML, com navegação por abas para os seis módulos.
- Definição de identidade visual baseada em cinza e vermelho e uso de logotipo próprio.
- Estilização em CSS, incluindo organização de cartões, formulários, botões e adaptação a diferentes larguras de tela.
- Implementação de controles de navegação e atualização de áreas de resultado em JavaScript.

**Evidência disponível:** arquivos anteriores de HTML, CSS e JavaScript; identidade visual descrita na primeira entrega. **Validação pendente:** conferir a responsividade em dispositivos reais.

### Etapa C — Implementação das calculadoras
**Situação: identificada na versão anterior do JavaScript.**

- Implementação da calculadora básica com operações aritméticas, interface de botões, limpeza, exclusão e recursos de entrada.
- Implementação de recursos da calculadora científica.
- Desenvolvimento de avaliador próprio de expressões matemáticas, com tokenização e regras de precedência.
- Inclusão de interação por teclado físico e histórico de cálculos na interface do projeto.

**Limitações anteriormente observadas:** tratamento de alguns sinais negativos e expressões exigia revisão; resultados anteriores precisam ser repetidos na versão atual.

### Etapa D — Implementação dos módulos matemáticos
**Situação: identificada na versão anterior do JavaScript.**

**Funções**
- Entrada e avaliação de expressões em função de `x`.
- Geração de tabela de valores.
- **Limitação identificada:** avaliação dinâmica por `new Function`, a ser substituída por interpretação controlada de expressões.

**Matrizes**
- Interface para informar dimensões e elementos.
- Operações de soma, subtração, multiplicação por escalar, multiplicação de matrizes e transposta.
- Determinantes anteriormente limitados a ordens pequenas (até 3, segundo levantamento anterior).
- **Pendência identificada:** matriz inversa não implementada na versão anterior.

**Análise combinatória**
- Cálculos de fatorial, permutações, arranjos e combinações, com uso de `BigInt` em cálculos inteiros.
- Necessidade de reforçar validações de entradas e limites de processamento.

**Probabilidade**
- Recursos de probabilidade simples, união, probabilidade condicional, distribuição binomial e simulações.
- Necessidade de conferir fórmulas, restrições de entrada e critérios de validação das simulações.

**Evidência disponível:** código JavaScript anterior. **Validação pendente:** execução sistemática dos casos de teste por módulo.

### Etapa E — Planejamento acadêmico e organização da equipe
**Situação: identificada na documentação e nas decisões da equipe.**

- Preparação da primeira entrega, com escopo, prioridades, cronograma, riscos, identidade visual e resumo para apresentação.
- Definição da organização de trabalho para a fase de validação:
  - **Arthur:** desenvolvimento, integração e acompanhamento do Git.
  - **Pedro:** documentação funcional e README.
  - **Rafael:** documentação técnica e relatório.
  - **Matheus:** testes da calculadora básica e científica.
  - **Gustavo:** testes de funções e matrizes.
  - **Vitor:** testes de combinatória e probabilidade.
- Preparação de guias individuais de documentação e testes.

**Importante:** atribuição de responsabilidades não comprova execução. As entregas individuais serão registradas conforme ocorrerem.

## 3. Revisão de código preparada em 22/10/2026

**Situação: revisão preparada; integração no IntelliJ e validação geral ainda não confirmadas.**

**Arquivos previstos:** `index.html`, `css/style.css`, `js/app.js`.

### 3.1. Avaliação de expressões
- Revisão do parser para tratar sinais negativos, parênteses, precedência, potências e funções matemáticas.
- Substituição da execução dinâmica de expressões (`new Function`) por interpretação controlada.
- Ajustes no comportamento do botão de inversão de sinal (`±`) nas calculadoras.

### 3.2. Funções
- Inclusão de validação para intervalos incompletos ou inválidos.
- Definição de limite de **501 pontos** na tabela para evitar geração excessiva.

### 3.3. Matrizes
- Ampliação do cálculo de determinantes para matrizes quadradas de ordens **1 a 6**.
- Inclusão de cálculo de inversa por **Gauss–Jordan**, com verificação de matriz singular.
- Revisão de campos obrigatórios e compatibilidade de operações.

### 3.4. Combinatória
- Reforço de validações de números inteiros, limites de entrada e campos obrigatórios.

### 3.5. Verificação informada na revisão
- Foi informada uma checagem de sintaxe do JavaScript e verificações pontuais de parser, funções, determinante e inversa.
- **Não há, neste documento, evidência anexada suficiente para classificar a interface ou os seis módulos como integralmente aprovados.**
- Permanecem pendentes a instalação da revisão no projeto local, a verificação de botões, os testes completos e a validação em celular.

## 4. Situação dos testes (informações históricas, não revalidadas)

- **Calculadora básica:** há relato anterior de aprovação dos casos CB-01 a CB-28; resultados e versão de execução devem ser conferidos.
- **Calculadora científica:** há relato anterior de aprovação de CS-01 a CS-10; CS-11 a CS-15 permaneciam pendentes no último levantamento.
- **Demais módulos:** execução formal das suítes e evidências ainda devem ser consolidadas.

Não transformar relatos anteriores em novos testes aprovados sem executar ou localizar as evidências correspondentes.

## 5. Pendências para considerar a versão pronta para testes da equipe

1. Integrar os arquivos revisados no IntelliJ e confirmar caminhos de CSS, JavaScript e imagem.
2. Abrir os seis módulos e verificar a navegação e a ausência de erros no console.
3. Executar casos de teste representativos para cada módulo, incluindo entradas inválidas.
4. Conferir determinantes e inversas de diferentes ordens, inclusive matrizes singulares.
5. Testar teclado, histórico e limpeza das calculadoras.
6. Validar interface em resoluções de celular e computador.
7. Registrar bugs encontrados, corrigir e repetir os testes afetados.
8. Conferir `git status` e preparar commit somente depois da validação local.

## 6. Próximas etapas previstas (ainda não concluídas)

- Estabilização da versão e revisão dos commits com Arthur.
- Clonagem do repositório no computador pessoal e demonstração de clonagem à equipe.
- Execução e registro das suítes por Matheus, Gustavo e Vitor.
- Atualização do README por Pedro e do relatório técnico por Rafael.
- Correção dos problemas identificados e retestes.
- Publicação da versão validada em hospedagem web e testes do endereço público.
- Preparação e ensaio da apresentação final.

## Atualização — 22/10/2026
### Melhorias de interface, usabilidade e interação

**Objetivo:** aprimorar a experiência de utilização do MathLab por meio de melhorias visuais, personalização da interface e suporte adicional à navegação por teclado.

### 1. Implementações realizadas

**1.1. Alternância entre temas claro e escuro**
- Implementado controle de alternância de tema no cabeçalho da aplicação.
- Definidas configurações visuais para os modos claro e escuro.
- Adicionado armazenamento da preferência de tema utilizando `localStorage`, permitindo sua manutenção após a atualização da página.

**1.2. Efeitos visuais nos botões**
- Implementados efeitos de contorno luminoso (neon) ao passar o cursor sobre os botões.
- Aplicadas cores de destaque correspondentes às funções e características visuais dos controles.
- Adicionadas transições para tornar a interação visual mais suave.
- Considerados estados de foco para navegação por teclado.

**1.3. Suporte à tecla Delete**
- Implementado o uso da tecla `Delete` para executar a função de limpeza (`C`) nas calculadoras básica e científica.
- Mantido o comportamento da tecla `Backspace` para remoção de caracteres.
- Preservada a edição de campos de entrada sem interferência indevida dos atalhos da calculadora.

**1.4. Ajustes de identidade visual**
- Corrigida a referência ao arquivo de imagem da logo do MathLab.
- Adicionada a imagem à pasta `img` do projeto.
- Ajustado o tamanho de exibição da logo no cabeçalho.

### 2. Arquivos envolvidos

- `index.html` — ajustes na estrutura da interface e controle de alternância de tema.
- `css/style.css` — estilos dos temas, efeitos neon e ajustes visuais.
- `js/app.js` — comportamento dos temas, armazenamento da preferência e suporte à tecla `Delete`.
- `img/mathlab-logo.jpg` — arquivo da identidade visual do projeto.

### 3. Validação realizada

Após a atualização dos arquivos, foi realizada uma verificação manual da aplicação no ambiente de desenvolvimento.

Foram relatados como funcionais:
- Alternância entre os temas claro e escuro.
- Efeitos neon nos botões.
- Atalho `Delete` para limpeza das calculadoras.
- Exibição da logo no cabeçalho.
- Funcionamento geral dos módulos após as alterações.

**Observação:** a validação manual não substitui a bateria formal de testes funcionais e de casos extremos prevista para o encerramento do projeto.

### 4. Próximas implementações previstas

- Histórico de cálculos na calculadora científica.
- Representação gráfica de funções utilizando HTML Canvas.
- Suporte a Progressive Web App (PWA), incluindo instalação e funcionamento offline.

Essas funcionalidades permanecem planejadas e não fazem parte desta atualização concluída.

### 5. Situação da atualização

**Implementação:** concluída.

**Verificação manual:** realizada.

**Registro no Git:** pendente de novo commit.

**Testes formais da equipe:** pendentes.

## Atualização 3 — Histórico científico, gráficos e PWA

**Data:** 22/10/2026

### 1. Funcionalidades implementadas

Nesta etapa, foram adicionadas três funcionalidades ao MathLab:

**Histórico da calculadora científica**
- Registro das operações e dos resultados.
- Possibilidade de reutilizar resultados anteriores.
- Opção para limpar o histórico.
- Armazenamento local para preservar os registros após atualizar a página.

**Gráficos de funções matemáticas**
- Implementação de gráficos utilizando HTML Canvas e JavaScript.
- Representação de funções no intervalo definido pelo usuário.
- Desenho de eixos cartesianos e grade.
- Ajuste automático da escala.
- Tratamento de pontos indefinidos e descontinuidades.

**Progressive Web App (PWA)**
- Criação do arquivo `manifest.json`.
- Implementação do `service-worker.js` para armazenamento em cache.
- Criação do arquivo `js/pwa.js` para registrar o Service Worker.
- Adição dos ícones de instalação.
- Suporte ao funcionamento offline após o carregamento inicial.

### 2. Testes realizados

Os seguintes testes foram executados manualmente no navegador:

| Teste | Resultado |
|---|---|
| Registro de operações no histórico científico | Aprovado |
| Persistência do histórico após atualizar a página | Aprovado |
| Gráfico da função quadrática `x^2 - 4` | Aprovado |
| Gráfico da função linear `2*x + 1` | Aprovado |
| Gráfico da função racional `1/x` | Aprovado |
| Ativação do Service Worker | Aprovado |
| Carregamento da aplicação em modo offline | Aprovado |
| Instalação do MathLab como aplicativo | Aprovado |

### 3. Observações

O MathLab foi executado utilizando o servidor local do IntelliJ IDEA (`localhost`).

O funcionamento offline foi verificado por meio da simulação de ausência de conexão no Chrome DevTools.

A instalação do PWA foi realizada com sucesso, abrindo o MathLab em uma janela independente.

Os testes foram manuais e ainda não substituem uma revisão completa de todos os módulos.

### 4. Melhorias previstas para a próxima atualização

- Adicionar o título **CALCULADORAS** acima das abas de navegação.
- Renomear a aba **Calculadora** para **Básica**.
- Preservar a última aba utilizada após atualizar a página.
- Ajustar o tamanho visual do ícone do PWA na barra de tarefas.

### 5. Situação da atualização

As três funcionalidades principais foram implementadas e passaram nos testes manuais realizados. A atualização está pronta para ser registrada no controle de versão, permanecendo pendente a revisão geral de regressão dos demais módulos.