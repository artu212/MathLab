# MathLab — Histórico de desenvolvimento (resumo)

**Início informado:** 01/10/2026  
**Prazo acadêmico:** 30/11/2026  
**Atualização:** 22/10/2026  
**Repositório:** https://github.com/artu212/MathLab  
**Aplicação publicada:** https://artu212.github.io/MathLab/

## 1. Concepção e definição do escopo

O projeto começou com a ideia de uma **calculadora científica** e evoluiu para o **MathLab**, uma aplicação web de matemática com seis módulos: **Básica, Científica, Funções, Matrizes, Análise Combinatória e Probabilidade**. O módulo de Probabilidade foi escolhido como diferencial acadêmico. O escopo adotou HTML, CSS e JavaScript, sem necessidade de cadastro, banco de dados ou aplicativo nativo.

## 2. Estrutura e implementação dos módulos

Foi criada uma interface com navegação por abas, identidade visual em cinza e vermelho, formulários, botões, áreas de resultados e adaptação a diferentes tamanhos de tela. A lógica JavaScript passou a reunir:

- Calculadoras básica e científica, com avaliação de expressões, validação de entradas e atalhos de teclado.
- Funções matemáticas com tabela de valores e, posteriormente, gráficos.
- Matrizes com dimensões independentes, operações aritméticas, transpostas, determinantes e inversas.
- Combinatória com uso de `BigInt` em operações inteiras de grande porte.
- Probabilidade simples, união e interseção, condicional, binomial e simulações aleatórias.

Durante a revisão, a avaliação dinâmica de expressões foi substituída por interpretação controlada, e foram aprimoradas as regras de precedência e o tratamento de entradas inválidas.

## 3. Melhorias de interface e experiência de uso

Em 22/10/2026, foram registradas melhorias que incluíram:

- Alternância entre **modo claro e escuro**, com preferência armazenada localmente.
- Efeitos visuais e estados de foco dos botões.
- Atalhos `Delete` e `Backspace` nas calculadoras, respeitando campos editáveis.
- Ajustes de logotipo e identidade visual.
- Histórico reutilizável nas calculadoras e armazenamento local do histórico científico.
- Repetição da última operação com pressionamentos sucessivos de `=`.
- Histórico com altura fixa e rolagem.
- Título **CALCULADORAS**, aba **Básica** e restauração da última aba utilizada.

## 4. Gráficos e recursos de PWA

Foi incluída a representação gráfica de funções com **HTML Canvas**, eixos cartesianos, grade e ajuste de escala. Também foram implementados o `manifest.json`, o `service-worker.js`, o registro em `js/pwa.js` e os ícones necessários ao **PWA**.

O histórico anterior registra verificações manuais em ambiente local de gráficos, instalação e acesso offline. Esses registros representam testes internos de desenvolvimento, não a bateria oficial de testes da equipe.

## 5. Atualização 4 — Estabilização e validação interna

A Atualização 4 reuniu ajustes de navegação, históricos, repetição de operações e estratégia de cache. O registro do projeto informa que os seis módulos e recursos de PWA foram submetidos a verificações manuais internas.

**Commit confirmado:** `9631882` — *Atualizacao 4: melhorias nas calculadoras, PWA e testes finais*.

## 6. Atualização 5 — Correções finais e publicação

Na revisão final foram analisados `js/app.js`, `index.html`, `css/style.css`, `js/pwa.js`, `service-worker.js` e `manifest.json`. Entre os ajustes efetivamente integrados estão:

- Validação de preenchimento do escalar na operação `k × A`.
- Validação de campos numéricos obrigatórios em Probabilidade.
- Cálculo binomial mais estável para valores grandes, evitando problemas de estouro numérico na combinação.
- Correção da descrição do módulo Matrizes no HTML.
- Atualização da versão do cache do Service Worker de `v6` para `v7`.

Foram realizadas verificações internas das correções, incluindo o caso binomial `n = 1000`, `k = 500`, `p = 0.5`, com resultado aproximado de `0,025225`.

**Commit confirmado:** `293e23a` — *Atualizacao 5: correcoes finais e melhorias de estabilidade*.

O commit foi enviado à branch `master`, e o Git informou a árvore de trabalho limpa. Em seguida, o **GitHub Pages** foi configurado para publicar a partir de `master` / `/(root)`. A aplicação carregou no endereço público e houve confirmação de funcionamento dos seis módulos em verificações internas.

## 7. Estado atual e encerramento acadêmico

Em **22/10/2026**, o MathLab está **implementado, revisado, versionado e hospedado**. Isso não significa que a entrega acadêmica esteja encerrada.

Permanecem pendentes:

1. **Testes oficiais independentes** por Matheus (Básica e Científica), Gustavo (Funções e Matrizes) e Vitor (Combinatória e Probabilidade), com registro de resultados e evidências.
2. **Documentação e relatório técnico** por Pedro e Rafael, incluindo decisões, algoritmos, dificuldades, soluções, testes e divisão real das atividades.
3. **README e documentos de acompanhamento** no repositório (preparados para inclusão nesta atualização).
4. **Apresentação de 10 a 15 minutos**, com demonstração da aplicação.

**Nota sobre as evidências:** as etapas iniciais são uma reconstrução resumida a partir dos registros do projeto; não foram atribuídas datas individuais nem commits não confirmados. As verificações realizadas durante o desenvolvimento não devem ser apresentadas como testes oficiais da equipe.
