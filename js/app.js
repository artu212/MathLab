/* =========================================================
   NAVEGAÇÃO
   ========================================================= */

const tabs = document.querySelectorAll(".tab-button");
const pages = document.querySelectorAll(".page");

function openPage(pageName) {

  tabs.forEach(tab => {
    tab.classList.toggle(
      "active",
      tab.dataset.page === pageName
    );
  });

  pages.forEach(page => {
    page.classList.toggle(
      "active-page",
      page.id === pageName
    );
  });

}

tabs.forEach(tab => {

  tab.addEventListener("click", () => {
    openPage(tab.dataset.page);
  });

});


/* =========================================================
   TEMA
   ========================================================= */

const themeButton = document.getElementById("themeButton");
const themeSelect = document.getElementById("themeSelect");

themeButton.addEventListener("click", () => {

  document.body.classList.toggle("dark");

  themeButton.textContent =
    document.body.classList.contains("dark")
      ? "☀"
      : "☾";

});

themeSelect.addEventListener("change", () => {

  const themes = [
    "lego",
    "dragonball",
    "superman",
    "batman",
    "spiderman",
    "ironman"
  ];

  document.body.classList.remove(...themes);

  if (themeSelect.value !== "default") {
    document.body.classList.add(themeSelect.value);
  }

});


/* =========================================================
   UTILITÁRIOS
   ========================================================= */

function formatNumber(number) {

  if (!Number.isFinite(number)) {
    return "Erro";
  }

  return Number(number.toFixed(10)).toString();

}

function escapeHtml(text) {

  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


/* =========================================================
   CALCULADORA BÁSICA
   ========================================================= */

let expression = "";
let currentValue = "0";
let justCalculated = false;

const currentOperationDisplay =
  document.getElementById("currentOperation");

const previousOperationDisplay =
  document.getElementById("previousOperation");

const calculatorMessage =
  document.getElementById("calculatorMessage");


function showCalculatorError(message) {

  calculatorMessage.textContent = message;

  setTimeout(() => {
    calculatorMessage.textContent = "";
  }, 3000);

}


function updateDisplay() {

  currentOperationDisplay.textContent =
    expression || currentValue || "0";

}


function getLastNumber(expr) {

  const match =
    expr.match(/(-?\d*\.?\d+)$/);

  return match ? match[1] : "";

}


/* =========================================================
   AVALIADOR DE EXPRESSÕES
   ========================================================= */

function tokenizeExpression(expr) {

  const tokens = [];
  let number = "";

  for (let i = 0; i < expr.length; i++) {

    const char = expr[i];

    if (/[0-9.]/.test(char)) {

      number += char;
      continue;

    }

    if ("+-*/()".includes(char)) {

      if (number !== "") {

        if ((number.match(/\./g) || []).length > 1) {
          throw new Error("Número decimal inválido.");
        }

        tokens.push(Number(number));
        number = "";

      }

      tokens.push(char);
      continue;

    }

    throw new Error("Expressão inválida.");

  }

  if (number !== "") {

    if ((number.match(/\./g) || []).length > 1) {
      throw new Error("Número decimal inválido.");
    }

    tokens.push(Number(number));

  }

  return tokens;

}


function evaluateExpression(expr) {

  if (!expr) {
    throw new Error("Digite uma expressão.");
  }

  let tokens = tokenizeExpression(expr);

  if (!tokens.length) {
    throw new Error("Expressão vazia.");
  }

  if (tokens[0] === "-") {

    if (
      tokens.length > 1 &&
      typeof tokens[1] === "number"
    ) {

      tokens[1] = -tokens[1];
      tokens.shift();

    } else {

      throw new Error("Expressão inválida.");

    }

  }

  const values = [];
  const operators = [];

  const precedence = {
    "+":1,
    "-":1,
    "*":2,
    "/":2
  };


  function applyOperation() {

    const operator = operators.pop();

    const b = values.pop();
    const a = values.pop();

    if (
      typeof a !== "number" ||
      typeof b !== "number"
    ) {
      throw new Error("Expressão inválida.");
    }

    let result;

    if (operator === "+") result = a + b;
    if (operator === "-") result = a - b;
    if (operator === "*") result = a * b;

    if (operator === "/") {

      if (b === 0) {
        throw new Error("Não é possível dividir por zero.");
      }

      result = a / b;

    }

    values.push(result);

  }


  let previousToken = null;

  for (const token of tokens) {

    if (typeof token === "number") {

      values.push(token);
      previousToken = token;
      continue;

    }

    if (token === "(") {

      operators.push(token);
      previousToken = token;
      continue;

    }

    if (token === ")") {

      if (previousToken === "(") {
        throw new Error("Parênteses vazios.");
      }

      while (
        operators.length &&
        operators[operators.length - 1] !== "("
        ) {
        applyOperation();
      }

      if (
        !operators.length ||
        operators[operators.length - 1] !== "("
      ) {
        throw new Error("Parênteses inválidos.");
      }

      operators.pop();
      previousToken = token;
      continue;

    }

    if (
      typeof previousToken !== "number" &&
      previousToken !== ")"
    ) {

      throw new Error("Operadores consecutivos.");

    }

    while (
      operators.length &&
      operators[operators.length - 1] !== "(" &&
      precedence[operators[operators.length - 1]] >= precedence[token]
      ) {
      applyOperation();
    }

    operators.push(token);
    previousToken = token;

  }

  if (
    typeof previousToken !== "number" &&
    previousToken !== ")"
  ) {
    throw new Error("Expressão incompleta.");
  }

  while (operators.length) {

    if (operators[operators.length - 1] === "(") {
      throw new Error("Parênteses não fechados.");
    }

    applyOperation();

  }

  if (values.length !== 1) {
    throw new Error("Expressão inválida.");
  }

  const result = values[0];

  if (!Number.isFinite(result)) {
    throw new Error("Resultado inválido.");
  }

  return result;

}


/* =========================================================
   BASIC INPUT
   ========================================================= */

function addNumber(number) {

  if (justCalculated) {

    expression = "";
    currentValue = "0";
    justCalculated = false;
    previousOperationDisplay.textContent = "";

  }

  if (
    expression === "" ||
    /[+\-*/(]$/.test(expression)
  ) {

    expression += number;

  } else {

    const lastNumber = getLastNumber(expression);

    if (
      lastNumber === "0" &&
      !lastNumber.includes(".")
    ) {

      expression =
        expression.slice(0, -1) + number;

    } else {

      expression += number;

    }

  }

  currentValue =
    getLastNumber(expression) || number;

  updateDisplay();

}


function addDecimal() {

  if (justCalculated) {

    expression = "";
    currentValue = "0";
    justCalculated = false;
    previousOperationDisplay.textContent = "";

  }

  const lastNumber = getLastNumber(expression);

  if (lastNumber.includes(".")) return;

  if (
    expression === "" ||
    /[+\-*/(]$/.test(expression)
  ) {
    expression += "0.";
  } else {
    expression += ".";
  }

  updateDisplay();

}


function chooseOperation(operation) {

  if (justCalculated) {

    expression = currentValue;
    justCalculated = false;

  }

  if (expression === "") {

    if (operation === "-") {
      expression = "-";
    } else {
      return;
    }

  } else if (/[+\-*/]$/.test(expression)) {

    expression =
      expression.slice(0,-1) + operation;

  } else {

    expression += operation;

  }

  updateDisplay();

}


function addParenthesis() {

  if (justCalculated) {

    expression = "";
    currentValue = "0";
    justCalculated = false;

  }

  const open =
    (expression.match(/\(/g) || []).length;

  const close =
    (expression.match(/\)/g) || []).length;

  if (
    expression === "" ||
    /[+\-*/(]$/.test(expression)
  ) {

    expression += "(";

  } else if (open > close) {

    expression += ")";

  } else {

    expression += "*(";

  }

  updateDisplay();

}


function toggleSign() {

  if (!expression) {

    currentValue =
      currentValue.startsWith("-")
        ? currentValue.slice(1)
        : "-" + currentValue;

    expression = currentValue;
    updateDisplay();
    return;

  }

  const match =
    expression.match(/(\d*\.?\d+)$/);

  if (!match) return;

  const number = match[1];
  const index = match.index;
  const before = expression.slice(0,index);

  if (before.endsWith("-")) {

    expression =
      before.slice(0,-1) + number;

  } else {

    expression =
      before + "-" + number;

  }

  updateDisplay();

}


function percentage() {

  const value =
    parseFloat(
      getLastNumber(expression) || currentValue
    );

  if (!Number.isFinite(value)) return;

  const result = value / 100;

  if (expression) {

    const match =
      expression.match(/(\d*\.?\d+)$/);

    if (match) {

      expression =
        expression.slice(0,match.index) +
        formatNumber(result);

    }

  } else {

    currentValue =
      formatNumber(result);

  }

  updateDisplay();

}


function deleteNumber() {

  if (justCalculated) {

    expression = currentValue;
    justCalculated = false;
    previousOperationDisplay.textContent = "";

  }

  expression =
    expression.slice(0,-1);

  if (!expression) {
    currentValue = "0";
  }

  updateDisplay();

}


function calculate() {

  if (!expression) return;

  let finalExpression = expression;

  if (/[+\-*/]$/.test(finalExpression)) {
    finalExpression =
      finalExpression.slice(0,-1);
  }

  try {

    const result =
      evaluateExpression(finalExpression);

    const formatted =
      formatNumber(result);

    previousOperationDisplay.textContent =
      finalExpression + " =";

    currentValue = formatted;
    expression = "";
    justCalculated = true;

    updateDisplay();

    addHistory(finalExpression,formatted);

  } catch (error) {

    showCalculatorError(error.message);

  }

}


function addHistory(expressionText,result) {

  const list =
    document.getElementById("historyList");

  const empty =
    list.querySelector(".empty-message");

  if (empty) empty.remove();

  const item =
    document.createElement("div");

  item.className = "history-item";

  item.innerHTML = `
    <div class="history-expression">
      ${escapeHtml(expressionText)}
    </div>

    <div class="history-result">
      = ${escapeHtml(result)}
    </div>
  `;

  list.prepend(item);

}


document
  .getElementById("clearHistory")
  .addEventListener("click",() => {

    document.getElementById("historyList").innerHTML =
      `<p class="empty-message">Nenhum cálculo ainda.</p>`;

  });


document
  .querySelectorAll("[data-number]")
  .forEach(button => {

    button.addEventListener("click",() => {

      const value = button.dataset.number;

      value === "."
        ? addDecimal()
        : addNumber(value);

    });

  });


document
  .querySelectorAll("[data-operation]")
  .forEach(button => {

    button.addEventListener("click",() => {

      chooseOperation(
        button.dataset.operation
      );

    });

  });


document
  .querySelectorAll("[data-action]")
  .forEach(button => {

    button.addEventListener("click",() => {

      switch(button.dataset.action) {

        case "clear":
          expression = "";
          currentValue = "0";
          justCalculated = false;
          previousOperationDisplay.textContent = "";
          calculatorMessage.textContent = "";
          updateDisplay();
          break;

        case "delete":
          deleteNumber();
          break;

        case "percentage":
          percentage();
          break;

        case "sign":
          toggleSign();
          break;

        case "parenthesis":
          addParenthesis();
          break;

        case "calculate":
          calculate();
          break;

      }

    });

  });


/* =========================================================
   CIENTÍFICA
   ========================================================= */

let scientificExpression = "";
let scientificValue = "0";
let scientificJustCalculated = false;

const scientificCurrent =
  document.getElementById("scientificCurrent");

const scientificPrevious =
  document.getElementById("scientificPrevious");

const scientificMessage =
  document.getElementById("scientificMessage");


function showScientificError(message) {

  scientificMessage.textContent = message;

  setTimeout(() => {
    scientificMessage.textContent = "";
  },3500);

}


function updateScientificDisplay() {

  scientificCurrent.textContent =
    scientificExpression ||
    scientificValue ||
    "0";

}


function scientificAddNumber(number) {

  if (scientificJustCalculated) {

    scientificExpression = "";
    scientificValue = "0";
    scientificJustCalculated = false;
    scientificPrevious.textContent = "";

  }

  scientificExpression += number;
  scientificValue = scientificExpression;

  updateScientificDisplay();

}


function scientificDecimal() {

  const match =
    scientificExpression.match(/(\d*\.?\d+)$/);

  if (match && match[1].includes(".")) return;

  if (
    !scientificExpression ||
    /[+\-*/]$/.test(scientificExpression)
  ) {

    scientificExpression += "0.";

  } else {

    scientificExpression += ".";

  }

  updateScientificDisplay();

}


function scientificChooseOperation(operation) {

  if (scientificJustCalculated) {

    scientificExpression = scientificValue;
    scientificJustCalculated = false;

  }

  if (!scientificExpression) {

    if (operation === "-") {
      scientificExpression = "-";
    } else {
      return;
    }

  } else if (/[+\-*/]$/.test(scientificExpression)) {

    scientificExpression =
      scientificExpression.slice(0,-1) +
      operation;

  } else {

    scientificExpression += operation;

  }

  updateScientificDisplay();

}


function scientificDelete() {

  scientificExpression =
    scientificExpression.slice(0,-1);

  if (!scientificExpression) {
    scientificValue = "0";
  }

  updateScientificDisplay();

}


function scientificToggleSign() {

  const value =
    scientificExpression || scientificValue;

  const match =
    value.match(/(\d*\.?\d+)$/);

  if (!match) return;

  const index = match.index;
  const number = match[1];
  const before = value.slice(0,index);

  scientificExpression =
    before.endsWith("-")
      ? before.slice(0,-1) + number
      : before + "-" + number;

  scientificValue = scientificExpression;

  updateScientificDisplay();

}


function getScientificNumericValue() {

  const value =
    scientificExpression || scientificValue;

  return evaluateExpression(value);

}


function setScientificResult(value) {

  scientificPrevious.textContent =
    scientificExpression || scientificValue;

  scientificValue =
    formatNumber(value);

  scientificExpression = "";
  scientificJustCalculated = true;

  updateScientificDisplay();

}


function factorialBigInt(n) {

  if (!Number.isInteger(n) || n < 0) {
    throw new Error("Fatorial exige n ≥ 0.");
  }

  let result = 1n;

  for (let i = 2n; i <= BigInt(n); i++) {
    result *= i;
  }

  return result;

}


function setScientificBigIntResult(value) {

  scientificValue = value.toString();
  scientificExpression = "";
  scientificJustCalculated = true;

  updateScientificDisplay();

}


function scientificOperation(operation) {

  try {

    let value;

    switch(operation) {

      case "sin":
        value = Math.sin(
          getScientificNumericValue() *
          Math.PI / 180
        );
        setScientificResult(value);
        break;

      case "cos":
        value = Math.cos(
          getScientificNumericValue() *
          Math.PI / 180
        );
        setScientificResult(value);
        break;

      case "tan":
        value = Math.tan(
          getScientificNumericValue() *
          Math.PI / 180
        );
        setScientificResult(value);
        break;

      case "sqrt":

        value = getScientificNumericValue();

        if (value < 0) {
          throw new Error(
            "Raiz de número negativo não é real."
          );
        }

        setScientificResult(Math.sqrt(value));
        break;

      case "square":

        value = getScientificNumericValue();
        setScientificResult(value ** 2);
        break;

      case "power":

        scientificExpression =
          scientificExpression || scientificValue;

        scientificExpression += "^";

        updateScientificDisplay();
        break;

      case "log":

        value = getScientificNumericValue();

        if (value <= 0) {
          throw new Error(
            "log exige número maior que zero."
          );
        }

        setScientificResult(Math.log10(value));
        break;

      case "ln":

        value = getScientificNumericValue();

        if (value <= 0) {
          throw new Error(
            "ln exige número maior que zero."
          );
        }

        setScientificResult(Math.log(value));
        break;

      case "pi":
        setScientificResult(Math.PI);
        break;

      case "e":
        setScientificResult(Math.E);
        break;

      case "factorial":

        value = getScientificNumericValue();

        if (!Number.isInteger(value)) {
          throw new Error(
            "Fatorial exige número inteiro."
          );
        }

        scientificPrevious.textContent =
          `${value}!`;

        setScientificBigIntResult(
          factorialBigInt(value)
        );

        break;

      case "random":
        setScientificResult(Math.random());
        break;

      case "percentage":

        value = getScientificNumericValue();
        setScientificResult(value / 100);
        break;

    }

  } catch(error) {

    showScientificError(error.message);

  }

}


function calculateScientificPower() {

  const parts =
    scientificExpression.split("^");

  if (parts.length !== 2) {
    throw new Error("Potência inválida.");
  }

  const base = Number(parts[0]);
  const exponent = Number(parts[1]);

  if (
    !Number.isFinite(base) ||
    !Number.isFinite(exponent)
  ) {
    throw new Error("Potência inválida.");
  }

  scientificPrevious.textContent =
    `${base}^${exponent} =`;

  scientificValue =
    formatNumber(base ** exponent);

  scientificExpression = "";
  scientificJustCalculated = true;

  updateScientificDisplay();

}


document
  .querySelectorAll("[data-scientific-number]")
  .forEach(button => {

    button.addEventListener("click",() => {

      const value =
        button.dataset.scientificNumber;

      value === "."
        ? scientificDecimal()
        : scientificAddNumber(value);

    });

  });


document
  .querySelectorAll("[data-scientific-operation]")
  .forEach(button => {

    button.addEventListener("click",() => {

      scientificChooseOperation(
        button.dataset.scientificOperation
      );

    });

  });


document
  .querySelectorAll("[data-scientific]")
  .forEach(button => {

    button.addEventListener("click",() => {

      scientificOperation(
        button.dataset.scientific
      );

    });

  });


document
  .querySelectorAll("[data-scientific-action]")
  .forEach(button => {

    button.addEventListener("click",() => {

      switch(button.dataset.scientificAction) {

        case "clear":
          scientificExpression = "";
          scientificValue = "0";
          scientificJustCalculated = false;
          scientificPrevious.textContent = "";
          scientificMessage.textContent = "";
          updateScientificDisplay();
          break;

        case "delete":
          scientificDelete();
          break;

        case "sign":
          scientificToggleSign();
          break;

        case "calculate":

          try {

            if (scientificExpression.includes("^")) {
              calculateScientificPower();
            } else {
              const result =
                evaluateExpression(
                  scientificExpression
                );

              scientificPrevious.textContent =
                scientificExpression + " =";

              scientificValue =
                formatNumber(result);

              scientificExpression = "";
              scientificJustCalculated = true;

              updateScientificDisplay();
            }

          } catch(error) {
            showScientificError(error.message);
          }

          break;

      }

    });

  });


/* =========================================================
   FUNÇÕES
   ========================================================= */

function transformFunctionExpression(expression) {

  let result =
    expression
      .toLowerCase()
      .replaceAll(" ","")
      .replaceAll("−","-")
      .replaceAll("²","^2")
      .replaceAll("³","^3");

  result =
    result.replace(
      /(\d|\))x/g,
      "$1*x"
    );

  result =
    result.replaceAll("^","**");

  result =
    result.replaceAll("sen","sin");

  result =
    result.replaceAll("√","sqrt");

  result =
    result.replaceAll("pi","PI");

  result =
    result.replace(
      /(\d|\))(?=x|\()/g,
      "$1*"
    );

  result =
    result.replace(
      /x(?=\()/g,
      "x*"
    );

  return result;

}


function evaluateFunction(expression,x) {

  const transformed =
    transformFunctionExpression(expression);

  if (
    !/^[0-9x+\-*/().a-zA-Z_*]+$/.test(transformed)
  ) {
    throw new Error("Expressão da função inválida.");
  }

  const fn =
    new Function(
      "x",
      `
        const sin=Math.sin;
        const cos=Math.cos;
        const tan=Math.tan;
        const sqrt=Math.sqrt;
        const log=Math.log10;
        const ln=Math.log;
        const abs=Math.abs;
        const PI=Math.PI;
        const E=Math.E;

        return (${transformed});
      `
    );

  const result = fn(x);

  if (
    typeof result !== "number" ||
    !Number.isFinite(result)
  ) {
    throw new Error(
      `Domínio inválido para x = ${x}.`
    );
  }

  return result;

}


function showModuleMessage(id,message) {

  const element =
    document.getElementById(id);

  element.textContent = message;

  setTimeout(() => {
    element.textContent = "";
  },3500);

}


document
  .getElementById("calculateFunction")
  .addEventListener("click",() => {

    try {

      const expression =
        document.getElementById("functionInput").value.trim();

      const start =
        Number(document.getElementById("functionStart").value);

      const end =
        Number(document.getElementById("functionEnd").value);

      const step =
        Number(document.getElementById("functionStep").value);

      if (!expression)
        throw new Error("Digite uma expressão para f(x).");

      if (!Number.isFinite(start) || !Number.isFinite(end))
        throw new Error("Intervalo inválido.");

      if (!Number.isFinite(step) || step <= 0)
        throw new Error("O passo deve ser maior que zero.");

      if (start > end)
        throw new Error("O início deve ser menor ou igual ao fim.");

      let html = `
        <table>
          <thead>
            <tr>
              <th>x</th>
              <th>f(x)</th>
            </tr>
          </thead>
          <tbody>
      `;

      let invalid = 0;

      for (
        let x = start;
        x <= end + step / 1000;
        x += step
      ) {

        const rounded =
          Number(x.toFixed(10));

        try {

          const result =
            evaluateFunction(expression,rounded);

          html += `
            <tr>
              <td>${rounded}</td>
              <td>${formatNumber(result)}</td>
            </tr>
          `;

        } catch {

          invalid++;

          html += `
            <tr>
              <td>${rounded}</td>
              <td>Domínio inválido</td>
            </tr>
          `;

        }

      }

      html += `
          </tbody>
        </table>
      `;

      if (invalid) {

        html += `
          <p>
            ${invalid} ponto(s) fora do domínio da função.
          </p>
        `;

      }

      document.getElementById("functionTable").innerHTML =
        html;

    } catch(error) {

      showModuleMessage(
        "functionMessage",
        error.message
      );

    }

  });


/* =========================================================
   MATRIZES
   ========================================================= */

function createMatrixInputs() {

  const size =
    Number(document.getElementById("matrixSize").value);

  ["A","B"].forEach(matrixName => {

    const container =
      document.getElementById(
        matrixName === "A"
          ? "matrixAInputs"
          : "matrixBInputs"
      );

    container.innerHTML = "";

    for(let i=0;i<size;i++) {

      for(let j=0;j<size;j++) {

        const input =
          document.createElement("input");

        input.type = "number";
        input.step = "any";
        input.value = "0";

        input.dataset.matrix = matrixName;
        input.dataset.row = i;
        input.dataset.col = j;

        container.appendChild(input);

      }

    }

  });

}


function getMatrix(name) {

  const size =
    Number(document.getElementById("matrixSize").value);

  const matrix = [];

  for(let i=0;i<size;i++) {

    const row = [];

    for(let j=0;j<size;j++) {

      const input =
        document.querySelector(
          `[data-matrix="${name}"][data-row="${i}"][data-col="${j}"]`
        );

      row.push(Number(input.value));

    }

    matrix.push(row);

  }

  return matrix;

}


function addMatrices(A,B) {

  return A.map((row,i) =>
    row.map((value,j) =>
      value + B[i][j]
    )
  );

}


function subtractMatrices(A,B) {

  return A.map((row,i) =>
    row.map((value,j) =>
      value - B[i][j]
    )
  );

}


function multiplyMatrixByScalar(A,k) {

  return A.map(row =>
    row.map(value =>
      value * k
    )
  );

}


function multiplyMatrices(A,B) {

  const size = A.length;

  const result =
    Array.from(
      {length:size},
      () => Array(size).fill(0)
    );

  for(let i=0;i<size;i++) {

    for(let j=0;j<size;j++) {

      for(let k=0;k<size;k++) {

        result[i][j] +=
          A[i][k] * B[k][j];

      }

    }

  }

  return result;

}


function determinant(matrix) {

  const n = matrix.length;

  if(n === 2) {

    return (
      matrix[0][0] * matrix[1][1] -
      matrix[0][1] * matrix[1][0]
    );

  }

  if(n === 3) {

    return (
      matrix[0][0] *
      (
        matrix[1][1] * matrix[2][2] -
        matrix[1][2] * matrix[2][1]
      )

      -

      matrix[0][1] *
      (
        matrix[1][0] * matrix[2][2] -
        matrix[1][2] * matrix[2][0]
      )

      +

      matrix[0][2] *
      (
        matrix[1][0] * matrix[2][1] -
        matrix[1][1] * matrix[2][0]
      )
    );

  }

  throw new Error(
    "Determinante disponível para 2×2 e 3×3."
  );

}


function transposeMatrix(matrix) {

  return matrix[0].map(
    (_,column) =>
      matrix.map(
        row => row[column]
      )
  );

}


function formatMatrix(matrix) {

  return matrix
    .map(row =>
      "[ " +
      row
        .map(formatNumber)
        .join("   ") +
      " ]"
    )
    .join("\n");

}


document
  .getElementById("matrixSize")
  .addEventListener("change",createMatrixInputs);


document
  .getElementById("matrixOperation")
  .addEventListener("change",() => {

    const operation =
      document.getElementById("matrixOperation").value;

    document.getElementById("scalarContainer").style.display =
      operation === "scalar"
        ? "flex"
        : "none";

  });


document
  .getElementById("calculateMatrix")
  .addEventListener("click",() => {

    try {

      const A = getMatrix("A");
      const B = getMatrix("B");

      const operation =
        document.getElementById("matrixOperation").value;

      let result;
      let title;

      switch(operation) {

        case "add":
          result = addMatrices(A,B);
          title = "A + B";
          break;

        case "subtract":
          result = subtractMatrices(A,B);
          title = "A − B";
          break;

        case "multiply":
          result = multiplyMatrices(A,B);
          title = "A × B";
          break;

        case "scalar": {

          const k =
            Number(document.getElementById("matrixScalar").value);

          if (!Number.isFinite(k))
            throw new Error("Escalar inválido.");

          result = multiplyMatrixByScalar(A,k);
          title = `${k} × A`;
          break;

        }

        case "detA":
          result = determinant(A);
          title = "det(A)";
          break;

        case "detB":
          result = determinant(B);
          title = "det(B)";
          break;

        case "transposeA":
          result = transposeMatrix(A);
          title = "Transposta de A";
          break;

        case "transposeB":
          result = transposeMatrix(B);
          title = "Transposta de B";
          break;

        default:
          throw new Error("Operação inválida.");

      }

      document.getElementById("matrixResult").textContent =
        Array.isArray(result)
          ? `${title}\n\n${formatMatrix(result)}`
          : `${title} = ${formatNumber(result)}`;

    } catch(error) {

      showModuleMessage(
        "matrixMessage",
        error.message
      );

    }

  });


/* =========================================================
   COMBINATÓRIA
   ========================================================= */

function validateNK(n,k) {

  if (!Number.isInteger(n) || !Number.isInteger(k))
    throw new Error("n e k devem ser inteiros.");

  if(n < 0 || k < 0)
    throw new Error("n e k devem ser maiores ou iguais a zero.");

  if(k > n)
    throw new Error("k não pode ser maior que n.");

}


function combinationBigInt(n,k) {

  validateNK(n,k);

  k = Math.min(k,n-k);

  let result = 1n;

  for(let i=1;i<=k;i++) {

    result =
      result *
      BigInt(n-k+i) /
      BigInt(i);

  }

  return result;

}


function permutationBigInt(n,k) {

  validateNK(n,k);

  let result = 1n;

  for(let i=0;i<k;i++) {
    result *= BigInt(n-i);
  }

  return result;

}


function arrangementBigInt(n,k) {
  return permutationBigInt(n,k);
}


function repeatedPermutationBigInt(n,repetitions) {

  if(!Number.isInteger(n) || n < 0)
    throw new Error("n inválido.");

  const total =
    repetitions.reduce(
      (sum,value) => sum + value,
      0
    );

  if(total !== n)
    throw new Error(
      "A soma das repetições deve ser igual a n."
    );

  let denominator = 1n;

  repetitions.forEach(value => {

    if(!Number.isInteger(value) || value < 0)
      throw new Error("Repetições inválidas.");

    denominator *= factorialBigInt(value);

  });

  return factorialBigInt(n) / denominator;

}


function updateCombinatoricsForm() {

  const operation =
    document.getElementById("combinatoricsOperation").value;

  document
    .getElementById("normalCombinatoricsInputs")
    .classList.toggle(
    "hidden",
    operation === "repeatedPermutation"
  );

  document
    .getElementById("repeatedCombinatoricsInputs")
    .classList.toggle(
    "hidden",
    operation !== "repeatedPermutation"
  );

}


document
  .getElementById("combinatoricsOperation")
  .addEventListener(
    "change",
    updateCombinatoricsForm
  );


document
  .getElementById("calculateCombinatorics")
  .addEventListener("click",() => {

    try {

      const operation =
        document.getElementById("combinatoricsOperation").value;

      let result;
      let title;

      if(operation === "factorial") {

        const n =
          Number(
            document.getElementById("combinatoricsN").value
          );

        result = factorialBigInt(n);
        title = `${n}!`;

      }

      else if(operation === "combination") {

        const n =
          Number(document.getElementById("combinatoricsN").value);

        const k =
          Number(document.getElementById("combinatoricsK").value);

        result = combinationBigInt(n,k);
        title = `C(${n}, ${k})`;

      }

      else if(operation === "permutation") {

        const n =
          Number(document.getElementById("combinatoricsN").value);

        const k =
          Number(document.getElementById("combinatoricsK").value);

        result = permutationBigInt(n,k);
        title = `P(${n}, ${k})`;

      }

      else if(operation === "arrangement") {

        const n =
          Number(document.getElementById("combinatoricsN").value);

        const k =
          Number(document.getElementById("combinatoricsK").value);

        result = arrangementBigInt(n,k);
        title = `A(${n}, ${k})`;

      }

      else {

        const n =
          Number(document.getElementById("repeatedN").value);

        const text =
          document.getElementById("repeatedValues").value.trim();

        if(!text)
          throw new Error("Digite as repetições.");

        const repetitions =
          text
            .split(",")
            .map(value => Number(value.trim()));

        result =
          repeatedPermutationBigInt(
            n,
            repetitions
          );

        title = `P repetição (${n})`;

      }

      document.getElementById("combinatoricsResult").textContent =
        `${title} = ${result.toString()}`;

    } catch(error) {

      showModuleMessage(
        "combinatoricsMessage",
        error.message
      );

    }

  });


/* =========================================================
   LÓGICA BOOLEANA
   ========================================================= */

const booleanTabs =
  document.querySelectorAll(".boolean-tab");

booleanTabs.forEach(tab => {

  tab.addEventListener("click",() => {

    booleanTabs.forEach(
      item => item.classList.remove("active")
    );

    tab.classList.add("active");

    document
      .querySelectorAll(".boolean-section")
      .forEach(section =>
        section.classList.add("hidden")
      );

    const target =
      tab.dataset.booleanSection;

    document
      .getElementById(
        target === "truth"
          ? "booleanTruth"
          : target === "simplify"
            ? "booleanSimplify"
            : "booleanCircuit"
      )
      .classList.remove("hidden");

  });

});


function normalizeBooleanExpression(expression) {

  return expression
    .toUpperCase()
    .replaceAll("¬"," NOT ")
    .replaceAll("∧"," AND ")
    .replaceAll("∨"," OR ")
    .replaceAll("⊕"," XOR ")
    .replace(/\bNÃO\b/g,"NOT")
    .replace(/\bE\b/g,"AND")
    .replace(/\bOU\b/g,"OR")
    .replace(/\s+/g," ")
    .trim();

}


function booleanVariables(expression) {

  const matches =
    expression.match(/\b[A-D]\b/g) || [];

  return [...new Set(matches)].sort();

}


function tokenizeBoolean(expression) {

  const normalized =
    normalizeBooleanExpression(expression);

  const regex =
    /\b(?:AND|OR|NOT|XOR|NAND|NOR)\b|[A-D()]|0|1/g;

  return normalized.match(regex) || [];

}


function parseBooleanExpression(expression) {

  const tokens =
    tokenizeBoolean(expression);

  if(!tokens.length)
    throw new Error("Expressão booleana inválida.");

  let index = 0;


  function primary() {

    const token = tokens[index];

    if(token === "NOT") {

      index++;

      return {
        type:"not",
        value:primary()
      };

    }

    if(token === "(") {

      index++;

      const value =
        orExpression();

      if(tokens[index] !== ")")
        throw new Error("Parênteses inválidos.");

      index++;

      return value;

    }

    if(
      /^[A-D]$/.test(token) ||
      token === "0" ||
      token === "1"
    ) {

      index++;

      return {
        type:"value",
        value:token
      };

    }

    throw new Error("Expressão booleana inválida.");

  }


  function andExpression() {

    let left = primary();

    while(
      ["AND","NAND"].includes(tokens[index])
      ) {

      const op = tokens[index++];

      left = {
        type:op.toLowerCase(),
        left,
        right:primary()
      };

    }

    return left;

  }


  function xorExpression() {

    let left = andExpression();

    while(tokens[index] === "XOR") {

      index++;

      left = {
        type:"xor",
        left,
        right:andExpression()
      };

    }

    return left;

  }


  function orExpression() {

    let left = xorExpression();

    while(
      ["OR","NOR"].includes(tokens[index])
      ) {

      const op = tokens[index++];

      left = {
        type:op.toLowerCase(),
        left,
        right:xorExpression()
      };

    }

    return left;

  }


  const tree =
    orExpression();

  if(index < tokens.length)
    throw new Error("Expressão inválida.");

  return tree;

}


function evaluateBooleanTree(node,values) {

  if(node.type === "value") {

    if(node.value === "0") return false;
    if(node.value === "1") return true;

    return Boolean(values[node.value]);

  }

  if(node.type === "not")
    return !evaluateBooleanTree(node.value,values);

  const a =
    evaluateBooleanTree(node.left,values);

  const b =
    evaluateBooleanTree(node.right,values);

  switch(node.type) {

    case "and":
      return a && b;

    case "or":
      return a || b;

    case "xor":
      return a !== b;

    case "nand":
      return !(a && b);

    case "nor":
      return !(a || b);

    default:
      throw new Error("Operador lógico inválido.");

  }

}


function booleanTruthRows(expression) {

  const tree =
    parseBooleanExpression(expression);

  const variables =
    booleanVariables(
      normalizeBooleanExpression(expression)
    );

  if(variables.length > 4)
    throw new Error(
      "Use no máximo 4 variáveis."
    );

  const rows = [];

  const combinations =
    2 ** variables.length;

  for(let n=0;n<combinations;n++) {

    const values = {};

    variables.forEach((variable,index) => {

      values[variable] =
        Boolean(
          (n >> (variables.length-index-1)) & 1
        );

    });

    rows.push({
      values,
      result:evaluateBooleanTree(tree,values)
    });

  }

  return {
    variables,
    rows
  };

}


document
  .getElementById("generateTruthTable")
  .addEventListener("click",() => {

    try {

      const expression =
        document
          .getElementById("booleanExpression")
          .value
          .trim();

      const data =
        booleanTruthRows(expression);

      let html = `
        <div class="boolean-expression">
          ${escapeHtml(expression)}
        </div>

        <table>
          <thead>
            <tr>
      `;

      data.variables.forEach(variable => {
        html += `<th>${variable}</th>`;
      });

      html += `<th>Resultado</th></tr></thead><tbody>`;

      data.rows.forEach(row => {

        html += "<tr>";

        data.variables.forEach(variable => {

          html += `
            <td>
              ${row.values[variable] ? "1" : "0"}
            </td>
          `;

        });

        html += `
          <td class="${row.result ? "truth-one" : "truth-zero"}">
            ${row.result ? "1" : "0"}
          </td>
        `;

        html += "</tr>";

      });

      html += "</tbody></table>";

      document.getElementById("truthTableResult").innerHTML =
        html;

    } catch(error) {

      document.getElementById("truthTableResult").innerHTML =
        `<p>${escapeHtml(error.message)}</p>`;

    }

  });


/* =========================================================
   SIMPLIFICAÇÃO BOOLEANA
   ========================================================= */

function expressionFromMinterms(variables,minterms) {

  if(minterms.length === 0)
    return "0";

  if(minterms.length === 2 ** variables.length)
    return "1";

  return minterms.map(number => {

    const bits =
      number
        .toString(2)
        .padStart(variables.length,"0");

    return variables.map((variable,index) => {

      return bits[index] === "1"
        ? variable
        : `NOT ${variable}`;

    }).join(" AND ");

  }).join(" OR ");

}


document
  .getElementById("simplifyBoolean")
  .addEventListener("click",() => {

    try {

      const expression =
        document
          .getElementById("simplifyExpression")
          .value
          .trim();

      const data =
        booleanTruthRows(expression);

      const minterms = [];

      data.rows.forEach((row,index) => {

        if(row.result)
          minterms.push(index);

      });

      const canonical =
        expressionFromMinterms(
          data.variables,
          minterms
        );

      document.getElementById("simplifyResult").innerHTML = `
        <div class="boolean-expression">
          Expressão original:<br>
          ${escapeHtml(expression)}
        </div>

        <div class="boolean-expression">
          Forma equivalente:<br>
          ${escapeHtml(canonical)}
        </div>

        <p>
          A tabela-verdade foi utilizada para encontrar uma
          forma equivalente da expressão.
        </p>
      `;

    } catch(error) {

      document.getElementById("simplifyResult").innerHTML =
        `<p>${escapeHtml(error.message)}</p>`;

    }

  });


/* =========================================================
   CIRCUITOS
   ========================================================= */

function calculateGate(a,b,operation) {

  a = Boolean(Number(a));
  b = Boolean(Number(b));

  switch(operation) {

    case "AND":
      return a && b;

    case "OR":
      return a || b;

    case "XOR":
      return a !== b;

    case "NAND":
      return !(a && b);

    case "NOR":
      return !(a || b);

  }

}


function updateCircuit() {

  const a =
    document.getElementById("circuitA").value;

  const b =
    document.getElementById("circuitB").value;

  const operation =
    document.getElementById("circuitOperation").value;

  const result =
    calculateGate(a,b,operation);

  document.getElementById("circuitAValue").textContent =
    a;

  document.getElementById("gateName").textContent =
    operation;

  document.getElementById("circuitOutput").textContent =
    result ? "1" : "0";

}


document
  .getElementById("calculateCircuit")
  .addEventListener("click",updateCircuit);


/* =========================================================
   EXERCÍCIOS
   ========================================================= */

function randomInt(min,max) {

  return Math.floor(
    Math.random() * (max-min+1)
  ) + min;

}


function randomChoice(array) {

  return array[
    randomInt(0,array.length-1)
    ];

}


function makeExercise(category,title,text,answer) {

  return {
    category,
    title,
    text,
    answer
  };

}


function generateExercises() {

  const list = [];


  /* ---------- BÁSICO ---------- */

  for(let i=0;i<15;i++) {

    const a = randomInt(10,100);
    const b = randomInt(5,80);

    list.push(
      makeExercise(
        "basic",
        "Adição",
        `Calcule ${a} + ${b}.`,
        `${a+b}`
      )
    );

  }


  for(let i=0;i<15;i++) {

    const a = randomInt(30,150);
    const b = randomInt(5,a);

    list.push(
      makeExercise(
        "basic",
        "Subtração",
        `Calcule ${a} − ${b}.`,
        `${a-b}`
      )
    );

  }


  for(let i=0;i<10;i++) {

    const a = randomInt(2,15);
    const b = randomInt(2,12);

    list.push(
      makeExercise(
        "basic",
        "Multiplicação",
        `Calcule ${a} × ${b}.`,
        `${a*b}`
      )
    );

  }


  for(let i=0;i<10;i++) {

    const b = randomInt(2,15);
    const result = randomInt(2,15);
    const a = b * result;

    list.push(
      makeExercise(
        "basic",
        "Divisão",
        `Calcule ${a} ÷ ${b}.`,
        `${result}`
      )
    );

  }


  /* ---------- ÁLGEBRA ---------- */

  for(let i=0;i<15;i++) {

    const a = randomInt(2,10);
    const x = randomInt(1,10);
    const b = randomInt(1,20);
    const c = a*x+b;

    list.push(
      makeExercise(
        "algebra",
        "Equação do 1º grau",
        `Resolva: ${a}x + ${b} = ${c}.`,
        `x = ${x}`
      )
    );

  }


  for(let i=0;i<15;i++) {

    const x = randomInt(-5,5);
    const b = randomInt(-8,8);
    const result = x*x+b;

    list.push(
      makeExercise(
        "algebra",
        "Função quadrática",
        `Para f(x) = x² ${b >= 0 ? "+" : "−"} ${Math.abs(b)}, calcule f(${x}).`,
        `f(${x}) = ${result}`
      )
    );

  }


  /* ---------- PORCENTAGEM ---------- */

  for(let i=0;i<15;i++) {

    const percentage =
      randomChoice([10,15,20,25,30,40,50]);

    const value =
      randomInt(2,20) * 10;

    const result =
      value * percentage / 100;

    list.push(
      makeExercise(
        "percentage",
        "Porcentagem",
        `Quanto é ${percentage}% de ${value}?`,
        `${result}`
      )
    );

  }


  for(let i=0;i<10;i++) {

    const value =
      randomInt(5,50) * 10;

    const discount =
      randomChoice([10,15,20,25,30]);

    const result =
      value - value*discount/100;

    list.push(
      makeExercise(
        "percentage",
        "Desconto",
        `Um produto custa R$ ${value}. Com desconto de ${discount}%, qual será o preço final?`,
        `R$ ${result.toFixed(2).replace(".",",")}`
      )
    );

  }


  /* ---------- TRIGONOMETRIA ---------- */

  const angles = [0,30,45,60,90];

  angles.forEach(angle => {

    let value;

    if(angle === 0) value = "0";
    if(angle === 30) value = "0,5";
    if(angle === 45) value = "√2/2";
    if(angle === 60) value = "√3/2";
    if(angle === 90) value = "1";

    list.push(
      makeExercise(
        "trigonometry",
        "Seno",
        `Calcule sen(${angle}°).`,
        value
      )
    );

  });


  angles.forEach(angle => {

    let value;

    if(angle === 0) value = "1";
    if(angle === 30) value = "√3/2";
    if(angle === 45) value = "√2/2";
    if(angle === 60) value = "0,5";
    if(angle === 90) value = "0";

    list.push(
      makeExercise(
        "trigonometry",
        "Cosseno",
        `Calcule cos(${angle}°).`,
        value
      )
    );

  });


  return list;

}


const exercises =
  generateExercises();


function renderExercises(category="all") {

  const viewer =
    document.getElementById("exerciseViewer");

  const filtered =
    category === "all"
      ? exercises
      : exercises.filter(
        exercise =>
          exercise.category === category
      );

  viewer.innerHTML =
    filtered.map(
      (exercise,index) => `

        <div class="exercise-card">

          <h3>
            ${index+1}. ${escapeHtml(exercise.title)}
          </h3>

          <p>
            ${escapeHtml(exercise.text)}
          </p>

          <details>

            <summary>Mostrar resposta</summary>

            <div class="exercise-answer">
              ${escapeHtml(exercise.answer)}
            </div>

          </details>

        </div>

      `
    ).join("");

}


document
  .querySelectorAll(".exercise-category-title")
  .forEach(button => {

    button.addEventListener("click",() => {

      if(button.id === "randomExercise") {

        const random =
          randomChoice(exercises);

        document
          .querySelectorAll(".exercise-category-title")
          .forEach(
            item => item.classList.remove("active")
          );

        button.classList.add("active");

        document.getElementById("exerciseViewer").innerHTML = `

          <div class="exercise-card">

            <h3>
              Exercício aleatório
            </h3>

            <p>
              ${escapeHtml(random.text)}
            </p>

            <details>

              <summary>Mostrar resposta</summary>

              <div class="exercise-answer">
                ${escapeHtml(random.answer)}
              </div>

            </details>

          </div>

        `;

        return;

      }

      document
        .querySelectorAll(".exercise-category-title")
        .forEach(
          item => item.classList.remove("active")
        );

      button.classList.add("active");

      renderExercises(
        button.dataset.category
      );

    });

  });


document
  .getElementById("openExercises")
  .addEventListener("click",() => {

    openPage("exercises");

  });


/* =========================================================
   INICIALIZAÇÃO
   ========================================================= */

createMatrixInputs();

document.getElementById("scalarContainer").style.display =
  "none";

updateCombinatoricsForm();

updateCircuit();

updateDisplay();

updateScientificDisplay();

renderExercises();
