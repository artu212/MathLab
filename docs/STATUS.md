# Status do Projeto — MathLab

## 1. Contexto do projeto

O MathLab é uma aplicação web voltada para cálculos e operações matemáticas.

O projeto foi iniciado com o conceito de uma calculadora científica, porém sua proposta foi ampliada ao longo do desenvolvimento para incluir diferentes módulos matemáticos. Por esse motivo, o projeto passou a utilizar o nome MathLab.

Atualmente, a aplicação possui uma interface organizada por módulos, permitindo o acesso a diferentes funcionalidades matemáticas por meio de abas.

---

## 2. Estado atual do projeto

O projeto encontra-se em fase de auditoria e validação.

As funcionalidades apresentadas neste documento foram identificadas por meio da análise do código-fonte atual. A presença de uma funcionalidade no código não significa, neste momento, que ela tenha sido completamente validada por meio de testes manuais.

Por esse motivo, as funcionalidades são classificadas entre:

- **Implementado** — existe implementação correspondente no código.
- **Implementado, mas ainda não validado** — existe implementação, porém ainda são necessários testes para confirmar o comportamento esperado.
- **Problema identificado** — existe algum comportamento ou limitação que precisa ser analisado ou corrigido.
- **Pendente** — funcionalidade ou melhoria ainda não implementada.

---

## 3. Funcionalidades atualmente implementadas

### 3.1 Calculadora básica

Implementada.

Possui:

- Operações de adição;
- Subtração;
- Multiplicação;
- Divisão;
- Números decimais;
- Porcentagem;
- Alteração de sinal;
- Parênteses;
- Botão C para limpar a calculadora;
- Botão CE para limpar a entrada atual;
- Backspace para apagar caracteres;
- Botão de igualdade;
- Histórico de cálculos;
- Validação de expressões;
- Tratamento de divisão por zero;
- Entrada por teclado físico para operações básicas.

**Situação:** Implementado, aguardando validação completa.

---

### 3.2 Calculadora científica

Implementada.

Possui:

- Seno;
- Cosseno;
- Tangente;
- Raiz quadrada;
- Quadrado;
- Potência;
- Logaritmo na base 10;
- Logaritmo natural;
- Constante π;
- Constante e;
- Fatorial;
- Geração de número aleatório;
- Porcentagem;
- Operações aritméticas;
- Números decimais;
- Alteração de sinal;
- Botão C;
- Botão CE;
- Backspace;
- Entrada por teclado físico para operações básicas.

O cálculo de fatoriais utiliza `BigInt` para permitir resultados inteiros maiores do que os suportados normalmente pelo tipo `Number`.

**Situação:** Implementado, aguardando validação completa.

---

### 3.3 Funções f(x)

Implementado.

Possui:

- Entrada de uma expressão matemática;
- Definição do valor inicial de x;
- Definição do valor final de x;
- Definição do passo;
- Cálculo de valores de f(x);
- Geração de tabela;
- Identificação de pontos fora do domínio;
- Tratamento de expressões inválidas.

**Situação:** Implementado, aguardando validação completa.

---

### 3.4 Matrizes

Implementado.

Possui suporte para:

- Definição independente das dimensões da matriz A;
- Definição independente das dimensões da matriz B;
- Matrizes de 1 até 6 linhas;
- Matrizes de 1 até 6 colunas;
- Adição;
- Subtração;
- Multiplicação de matrizes;
- Multiplicação por escalar;
- Determinante;
- Transposta.

O cálculo de determinante está implementado para matrizes quadradas de ordem 1, 2 e 3.

As operações de soma e subtração exigem dimensões iguais, enquanto a multiplicação exige que o número de colunas de A seja igual ao número de linhas de B.

**Situação:** Implementado, aguardando validação completa.

---

### 3.5 Análise combinatória

Implementado.

Possui:

- Combinação C(n,k);
- Permutação P(n,k);
- Arranjo A(n,k);
- Permutação com repetição;
- Fatorial;
- Validação de n e k;
- Utilização de `BigInt` nos cálculos inteiros.

**Situação:** Implementado, aguardando validação completa.

---

### 3.6 Probabilidade

Implementado.

O módulo possui diferentes categorias:

#### Probabilidade simples

- Cálculo da probabilidade de um evento;
- Cálculo da probabilidade complementar.

#### União e interseção

- P(A);
- P(B);
- P(A ∩ B);
- P(A ∪ B).

#### Probabilidade condicional

- Cálculo de P(A|B).

#### Distribuição binomial

- Valores de n;
- Valores de k;
- Probabilidade p;
- Cálculo de P(X = k).

#### Simulações

Possui simulações de:

- Resultado 6 em um dado;
- Cara em uma moeda;
- Ás em um baralho de 52 cartas.

As simulações apresentam a frequência observada, frequência relativa, probabilidade teórica e diferença entre os valores.

**Situação:** Implementado, aguardando validação completa.

---

## 4. Interface e apresentação

O projeto possui:

- Interface organizada por abas;
- Layout responsivo;
- Cabeçalho com identificação do MathLab;
- Logo do projeto;
- Cards para organização dos módulos;
- Mensagens de erro;
- Histórico da calculadora básica;
- Adaptação da interface para diferentes tamanhos de tela.

O projeto atualmente utiliza uma identidade visual baseada em tons claros e vermelho como cor principal.

**Situação:** Implementado, aguardando validação visual em diferentes tamanhos de tela.

---

## 5. Entrada por teclado físico

Foi implementado suporte ao teclado físico para os módulos de calculadora básica e científica.

Na calculadora básica, estão previstos:

- Números;
- Ponto decimal;
- Operadores `+`, `-`, `*` e `/`;
- Parênteses;
- Enter;
- Backspace;
- Escape.

Na calculadora científica, estão previstos:

- Números;
- Ponto decimal;
- Operadores `+`, `-`, `*` e `/`;
- Enter;
- Backspace;
- Escape.

O código também evita interferir na digitação quando o usuário está utilizando campos de entrada, listas de seleção ou outros elementos editáveis.

**Situação:** Implementado, aguardando testes específicos.

---

## 6. Alterações realizadas durante o desenvolvimento

Entre as alterações realizadas no projeto estão:

- Renomeação do projeto de Calculadora Científica para MathLab;
- Criação do README;
- Substituição do módulo de Lógica Booleana por Probabilidade;
- Remoção do módulo de Exercícios;
- Remoção do sistema de temas;
- Remoção do modo escuro;
- Inclusão do botão CE;
- Inclusão de suporte ao teclado físico;
- Implementação de dimensões independentes para as matrizes A e B;
- Implementação de operações adicionais de matrizes;
- Inclusão de funcionalidades de probabilidade;
- Inclusão de simulações probabilísticas;
- Organização dos módulos da aplicação.

---

## 7. Pontos que ainda precisam ser validados

A próxima etapa da auditoria deverá realizar testes manuais das funcionalidades implementadas.

Entre os principais pontos a verificar estão:

- Operações básicas com diferentes combinações de operadores;
- Uso de parênteses;
- Números decimais;
- Porcentagem;
- Alteração de sinal;
- Funcionamento de C e CE;
- Backspace;
- Histórico;
- Entrada pelo teclado físico;
- Operações científicas;
- Fatorial e resultados grandes;
- Potências;
- Funções f(x);
- Diferentes intervalos e passos;
- Matrizes com diferentes dimensões;
- Operações matriciais compatíveis e incompatíveis;
- Determinantes;
- Transpostas;
- Operações de análise combinatória;
- Probabilidade simples;
- União e interseção;
- Probabilidade condicional;
- Distribuição binomial;
- Simulações;
- Comportamento responsivo da interface.

---

## 8. Pontos de atenção identificados na análise do código

Alguns pontos deverão ser analisados durante a auditoria prática.

### Calculadora científica

A função de potência utiliza uma lógica própria baseada no caractere `^`, diferente do avaliador geral de expressões utilizado pelas operações básicas.

Será necessário validar situações como:

- Potências positivas;
- Potências negativas;
- Expoentes decimais;
- Expressões inválidas;
- Uso inadequado do operador de potência.

### Funções f(x)

O módulo utiliza uma expressão JavaScript criada dinamicamente para avaliar as funções informadas pelo usuário.

Embora exista uma validação dos caracteres permitidos, essa funcionalidade deverá ser testada cuidadosamente com diferentes expressões matemáticas e entradas inválidas.

### Matrizes

O código permite dimensões independentes para A e B, porém determinadas operações possuem requisitos matemáticos específicos.

Essas regras deverão ser verificadas por meio de testes.

### Probabilidade

As fórmulas implementadas deverão ser comparadas com exemplos matemáticos conhecidos para confirmar os resultados.

As simulações, por utilizarem geração aleatória, deverão ser avaliadas considerando que os resultados podem variar entre diferentes execuções.

---

## 9. Situação da documentação

A documentação técnica do projeto ainda está em desenvolvimento.

Este arquivo representa um registro do estado do projeto durante a etapa de auditoria.

A documentação deverá ser complementada posteriormente com:

- Casos de teste executados;
- Resultados dos testes;
- Problemas encontrados;
- Correções realizadas;
- Evolução do projeto;
- Decisões técnicas;
- Divisão de tarefas entre os integrantes;
- Informações necessárias para o relatório técnico final.

---

## 10. Próximas etapas

1. Validar as funcionalidades atuais por meio de testes manuais.
2. Registrar os casos de teste e seus resultados.
3. Identificar erros ou comportamentos inesperados.
4. Corrigir os problemas encontrados.
5. Repetir os testes após as correções.
6. Atualizar este documento com o novo estado do projeto.
7. Consolidar as informações para o relatório técnico final.
