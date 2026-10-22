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
   UTILITÁRIOS
   ========================================================= */

function formatNumber(number) {

  if (!Number.isFinite(number)) {
    return "Erro";
  }

  const rounded = Number(number.toFixed(10));
  return Object.is(rounded, -0) ? "0" : rounded.toString();

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

/* Parser matemático: não usa eval/new Function e valida toda a expressão.
   Potência associativa à direita; menos unário após operadores e parênteses. */
function tokenizeExpression(expr) {
  const source = String(expr).replace(/\s+/g, "").replaceAll("−", "-");
  const tokens = [];
  let position = 0;
  while (position < source.length) {
    const part = source.slice(position);
    const number = part.match(/^(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?/);
    if (number) {
      const value = Number(number[0]);
      if (!Number.isFinite(value)) throw new Error("Número fora do intervalo permitido.");
      tokens.push(value);
      position += number[0].length;
      continue;
    }
    const name = part.match(/^[a-zA-Z]+/);
    if (name) {
      tokens.push(name[0].toLowerCase());
      position += name[0].length;
      continue;
    }
    const character = source[position];
    if ("+-*/^()".includes(character)) {
      tokens.push(character);
      position++;
      continue;
    }
    throw new Error("Caractere inválido na expressão.");
  }
  return tokens;
}

function evaluateMathExpression(expr, variables = {}) {
  const tokens = tokenizeExpression(expr);
  if (!tokens.length) throw new Error("Digite uma expressão.");
  let index = 0;
  const constants = { pi: Math.PI, e: Math.E };
  const functions = {
    sin: Math.sin, sen: Math.sin, cos: Math.cos, tan: Math.tan,
    sqrt: Math.sqrt, log: Math.log10, ln: Math.log, abs: Math.abs
  };
  const peek = () => tokens[index];
  const take = () => tokens[index++];
  function parse(minimum = 0) {
    let left;
    const token = take();
    if (typeof token === "number") {
      left = token;
    } else if (token === "+" || token === "-") {
      const value = parse(3);
      left = token === "-" ? -value : value;
    } else if (token === "(") {
      left = parse(0);
      if (take() !== ")") throw new Error("Parênteses não fechados.");
    } else if (typeof token === "string" && /^[a-z]+$/.test(token)) {
      if (Object.prototype.hasOwnProperty.call(variables, token)) {
        left = variables[token];
      } else if (Object.prototype.hasOwnProperty.call(constants, token)) {
        left = constants[token];
      } else if (Object.prototype.hasOwnProperty.call(functions, token)) {
        if (take() !== "(") throw new Error(`Use ${token}(valor).`);
        const argument = parse(0);
        if (take() !== ")") throw new Error("Parênteses não fechados.");
        left = functions[token](argument);
      } else {
        throw new Error(`Nome matemático desconhecido: ${token}.`);
      }
    } else {
      throw new Error("Expressão inválida ou incompleta.");
    }
    while (true) {
      const operator = peek();
      const precedence = { "+": 1, "-": 1, "*": 2, "/": 2, "^": 4 }[operator];
      if (precedence === undefined || precedence < minimum) break;
      take();
      const right = parse(operator === "^" ? precedence : precedence + 1);
      if (operator === "+") left += right;
      if (operator === "-") left -= right;
      if (operator === "*") left *= right;
      if (operator === "/") {
        if (right === 0) throw new Error("Não é possível dividir por zero.");
        left /= right;
      }
      if (operator === "^") left = Math.pow(left, right);
      if (!Number.isFinite(left)) throw new Error("Resultado fora do domínio real ou do intervalo permitido.");
    }
    return left;
  }
  const result = parse();
  if (index !== tokens.length) throw new Error("Expressão inválida: confira os operadores.");
  if (!Number.isFinite(result)) throw new Error("Resultado fora do domínio real.");
  return result;
}

function evaluateExpression(expr) {
  return evaluateMathExpression(expr);
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
  if (justCalculated) {
    expression = currentValue;
    justCalculated = false;
  }
  const wrapped = expression.match(/\(-((?:\d+(?:\.\d*)?|\.\d+))\)$/);
  if (wrapped) {
    expression = expression.slice(0, -wrapped[0].length) + wrapped[1];
    updateDisplay();
    return;
  }
  const match = expression.match(/(\d+(?:\.\d*)?|\.\d+)$/);
  if (!match) {
    if (!expression) expression = "-";
    else if (/[+*/(]$/.test(expression)) expression += "-";
    updateDisplay();
    return;
  }
  const prefix = expression.slice(0, match.index);
  const number = match[0];
  if (prefix.endsWith("-")) {
    const beforeMinus = prefix.slice(0, -1);
    if (!beforeMinus || /[+*/(\-]$/.test(beforeMinus)) {
      expression = beforeMinus + number;
    } else {
      expression = prefix + "(-" + number + ")";
    }
  } else {
    expression = prefix + "(-" + number + ")";
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


function clearCurrentEntry() {

  if (justCalculated) {
    expression = "";
    currentValue = "0";
    justCalculated = false;
    previousOperationDisplay.textContent = "";
    updateDisplay();
    return;
  }

  if (!expression) {
    currentValue = "0";
    updateDisplay();
    return;
  }

  const match = expression.match(/(-?\d*\.?\d+)$/);

  if (match) {
    expression = expression.slice(0, match.index);
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

        case "clear-entry":
          clearCurrentEntry();
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


function scientificClearEntry() {

  if (scientificJustCalculated) {
    scientificExpression = "";
    scientificValue = "0";
    scientificJustCalculated = false;
    scientificPrevious.textContent = "";
    updateScientificDisplay();
    return;
  }

  const value = scientificExpression || scientificValue;
  const match = value.match(/(-?\d*\.?\d+)$/);

  if (match) {
    scientificExpression = value.slice(0, match.index);
  }

  scientificValue = scientificExpression || "0";
  updateScientificDisplay();
}


function scientificToggleSign() {
  if (scientificJustCalculated) {
    scientificExpression = scientificValue;
    scientificJustCalculated = false;
  }
  const wrapped = scientificExpression.match(/\(-((?:\d+(?:\.\d*)?|\.\d+))\)$/);
  if (wrapped) {
    scientificExpression = scientificExpression.slice(0, -wrapped[0].length) + wrapped[1];
  } else {
    const match = scientificExpression.match(/(\d+(?:\.\d*)?|\.\d+)$/);
    if (!match) return;
    scientificExpression = scientificExpression.slice(0, match.index) + "(-" + match[0] + ")";
  }
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

  if (!Number.isSafeInteger(n) || n < 0 || n > 2000) {
    throw new Error("Fatorial exige inteiro entre 0 e 2000.");
  }

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
  const original = scientificExpression;
  const result = evaluateMathExpression(original);
  scientificPrevious.textContent = `${original} =`;
  scientificValue = formatNumber(result);
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

        case "clear-entry":
          scientificClearEntry();
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
  return String(expression).toLowerCase().replace(/\s+/g, "")
    .replaceAll("−", "-").replaceAll("²", "^2").replaceAll("³", "^3")
    .replaceAll("√", "sqrt").replace(/(\d|\))(?=x|\()/g, "$1*")
    .replace(/x(?=\()/g, "x*").replace(/\)(?=\()/g, ")*");
}

function evaluateFunction(expression, x) {
  const transformed = transformFunctionExpression(expression);
  try {
    return evaluateMathExpression(transformed, { x });
  } catch (error) {
    if (/dividir por zero|domínio real|intervalo permitido/.test(error.message)) {
      throw new Error(`Domínio inválido para x = ${x}.`);
    }
    throw error;
  }
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

      if (["functionStart", "functionEnd", "functionStep"].some(id =>
        document.getElementById(id).value.trim() === "")) {
        throw new Error("Preencha o intervalo e o passo.");
      }
      if (!Number.isFinite(start) || !Number.isFinite(end))
        throw new Error("Intervalo inválido.");

      if (!Number.isFinite(step) || step <= 0)
        throw new Error("O passo deve ser maior que zero.");

      if (start > end)
        throw new Error("O início deve ser menor ou igual ao fim.");

      const count = Math.floor((end - start) / step + 1e-9) + 1;
      if (!Number.isFinite(count) || count > 501) {
        throw new Error("Intervalo muito grande: limite de 501 pontos. Aumente o passo.");
      }
      // Valida a sintaxe mesmo que o primeiro ponto esteja fora do domínio.
      tokenizeExpression(transformFunctionExpression(expression));

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

      for (let i = 0; i < count; i++) {
        const rounded = Number((start + i * step).toFixed(10));

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

function matrixDimensions(name) {

  const rows = Number(
    document.getElementById(`matrix${name}Rows`).value
  );

  const cols = Number(
    document.getElementById(`matrix${name}Cols`).value
  );

  if (
    !Number.isInteger(rows) ||
    !Number.isInteger(cols) ||
    rows < 1 || cols < 1 ||
    rows > 6 || cols > 6
  ) {
    throw new Error("Use dimensões inteiras entre 1 e 6.");
  }

  return { rows, cols };

}


function createSingleMatrixInputs(name) {

  const { rows, cols } = matrixDimensions(name);

  const container = document.getElementById(
    name === "A" ? "matrixAInputs" : "matrixBInputs"
  );

  container.innerHTML = "";
  container.style.gridTemplateColumns = `repeat(${cols}, minmax(55px, 1fr))`;

  for (let i = 0; i < rows; i++) {

    for (let j = 0; j < cols; j++) {

      const input = document.createElement("input");

      input.type = "number";
      input.step = "any";
      input.value = "0";

      input.dataset.matrix = name;
      input.dataset.row = i;
      input.dataset.col = j;

      container.appendChild(input);

    }

  }

}


function createMatrixInputs() {

  createSingleMatrixInputs("A");
  createSingleMatrixInputs("B");

}


function getMatrix(name) {

  const { rows, cols } = matrixDimensions(name);
  const matrix = [];

  for (let i = 0; i < rows; i++) {

    const row = [];

    for (let j = 0; j < cols; j++) {

      const input = document.querySelector(
        `[data-matrix="${name}"][data-row="${i}"][data-col="${j}"]`
      );

      if (!input || input.value.trim() === "") {
        throw new Error(`Preencha todos os valores da matriz ${name}.`);
      }
      const value = Number(input.value);

      if (!Number.isFinite(value)) {
        throw new Error(`Valor inválido na matriz ${name}.`);
      }

      row.push(value);

    }

    matrix.push(row);

  }

  return matrix;

}


function sameMatrixDimensions(A, B) {

  return (
    A.length === B.length &&
    A[0].length === B[0].length
  );

}


function addMatrices(A, B) {

  if (!sameMatrixDimensions(A, B)) {
    throw new Error(
      "Para somar, as matrizes A e B devem ter as mesmas dimensões."
    );
  }

  return A.map((row, i) =>
    row.map((value, j) => value + B[i][j])
  );

}


function subtractMatrices(A, B) {

  if (!sameMatrixDimensions(A, B)) {
    throw new Error(
      "Para subtrair, as matrizes A e B devem ter as mesmas dimensões."
    );
  }

  return A.map((row, i) =>
    row.map((value, j) => value - B[i][j])
  );

}


function multiplyMatrixByScalar(A, k) {

  return A.map(row =>
    row.map(value => value * k)
  );

}


function multiplyMatrices(A, B) {

  const aCols = A[0].length;
  const bRows = B.length;

  if (aCols !== bRows) {
    throw new Error(
      "Para multiplicar A × B, o número de colunas de A deve ser igual ao número de linhas de B."
    );
  }

  const result = Array.from(
    { length: A.length },
    () => Array(B[0].length).fill(0)
  );

  for (let i = 0; i < A.length; i++) {

    for (let j = 0; j < B[0].length; j++) {

      for (let k = 0; k < aCols; k++) {

        result[i][j] += A[i][k] * B[k][j];

      }

    }

  }

  return result;

}


function determinant(matrix) {
  const n = matrix.length;
  if (n !== matrix[0].length) throw new Error("Determinante exige matriz quadrada.");
  const a = matrix.map(row => [...row]);
  let sign = 1;
  let result = 1;
  for (let col = 0; col < n; col++) {
    let pivot = col;
    for (let row = col + 1; row < n; row++) {
      if (Math.abs(a[row][col]) > Math.abs(a[pivot][col])) pivot = row;
    }
    if (Math.abs(a[pivot][col]) < 1e-12) return 0;
    if (pivot !== col) {
      [a[pivot], a[col]] = [a[col], a[pivot]];
      sign *= -1;
    }
    const value = a[col][col];
    result *= value;
    for (let row = col + 1; row < n; row++) {
      const factor = a[row][col] / value;
      for (let j = col + 1; j < n; j++) a[row][j] -= factor * a[col][j];
      a[row][col] = 0;
    }
  }
  return sign * result;
}

/* Inversa pelo método de Gauss-Jordan com pivoteamento parcial. */
function inverseMatrix(matrix) {
  const n = matrix.length;
  if (n !== matrix[0].length) throw new Error("Inversa exige matriz quadrada.");
  const augmented = matrix.map((row, i) => [
    ...row, ...Array.from({ length: n }, (_, j) => Number(i === j))
  ]);
  for (let col = 0; col < n; col++) {
    let pivot = col;
    for (let row = col + 1; row < n; row++) {
      if (Math.abs(augmented[row][col]) > Math.abs(augmented[pivot][col])) pivot = row;
    }
    if (Math.abs(augmented[pivot][col]) < 1e-12) {
      throw new Error("A matriz não possui inversa (determinante zero).");
    }
    [augmented[col], augmented[pivot]] = [augmented[pivot], augmented[col]];
    const divisor = augmented[col][col];
    for (let j = 0; j < 2 * n; j++) augmented[col][j] /= divisor;
    for (let row = 0; row < n; row++) {
      if (row === col) continue;
      const factor = augmented[row][col];
      for (let j = 0; j < 2 * n; j++) augmented[row][j] -= factor * augmented[col][j];
    }
  }
  return augmented.map(row => row.slice(n));
}


function transposeMatrix(matrix) {

  return matrix[0].map(
    (_, column) => matrix.map(row => row[column])
  );

}


function formatMatrix(matrix) {

  return matrix
    .map(row =>
      "[ " + row.map(formatNumber).join("   ") + " ]"
    )
    .join("\n");

}


[
  "matrixARows",
  "matrixACols",
  "matrixBRows",
  "matrixBCols"
].forEach(id => {

  document.getElementById(id).addEventListener("change", () => {

    try {
      createMatrixInputs();
      document.getElementById("matrixMessage").textContent = "";
    } catch (error) {
      showModuleMessage("matrixMessage", error.message);
    }

  });

});


document
  .getElementById("matrixOperation")
  .addEventListener("change", () => {

    const operation =
      document.getElementById("matrixOperation").value;

    document.getElementById("scalarContainer").style.display =
      operation === "scalar" ? "flex" : "none";

  });


document
  .getElementById("calculateMatrix")
  .addEventListener("click", () => {

    try {

      const operation = document.getElementById("matrixOperation").value;
      const A = getMatrix("A");
      const B = ["add", "subtract", "multiply", "detB", "transposeB", "inverseB"].includes(operation)
        ? getMatrix("B") : null;

      let result;
      let title;

      switch (operation) {

        case "add":
          result = addMatrices(A, B);
          title = "A + B";
          break;

        case "subtract":
          result = subtractMatrices(A, B);
          title = "A − B";
          break;

        case "multiply":
          result = multiplyMatrices(A, B);
          title = "A × B";
          break;

        case "scalar": {

          const k = Number(
            document.getElementById("matrixScalar").value
          );

          if (!Number.isFinite(k)) {
            throw new Error("Escalar inválido.");
          }

          result = multiplyMatrixByScalar(A, k);
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

        case "inverseA":
          result = inverseMatrix(A);
          title = "Inversa de A";
          break;

        case "inverseB":
          result = inverseMatrix(B);
          title = "Inversa de B";
          break;

        default:
          throw new Error("Operação inválida.");

      }

      document.getElementById("matrixResult").textContent =
        Array.isArray(result)
          ? `${title}\n\n${formatMatrix(result)}`
          : `${title} = ${formatNumber(result)}`;

    } catch (error) {

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

  if (!Number.isSafeInteger(n) || !Number.isSafeInteger(k) || n > 2000)
    throw new Error("n e k devem ser inteiros seguros, com n até 2000.");

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

  if(!Number.isSafeInteger(n) || n < 0 || n > 2000)
    throw new Error("n deve ser inteiro entre 0 e 2000.");

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
      const requiredIds = operation === "repeatedPermutation"
        ? ["repeatedN", "repeatedValues"]
        : operation === "factorial" ? ["combinatoricsN"] : ["combinatoricsN", "combinatoricsK"];
      if (requiredIds.some(id => !document.getElementById(id).value.trim())) {
        throw new Error("Preencha todos os campos da operação.");
      }

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


function randomInt(min,max) {
  return Math.floor(Math.random() * (max-min+1)) + min;
}


/* =========================================================
   PROBABILIDADE
   ========================================================= */

function validateProbability(value, name) {

  if (!Number.isFinite(value) || value < 0 || value > 1) {
    throw new Error(`${name} deve estar entre 0 e 1.`);
  }

}


function probabilityText(value) {
  return `${formatNumber(value)} (${formatNumber(value * 100)}%)`;
}


const probabilityTabs =
  document.querySelectorAll(".probability-tab");

probabilityTabs.forEach(tab => {

  tab.addEventListener("click", () => {

    probabilityTabs.forEach(item =>
      item.classList.remove("active")
    );

    tab.classList.add("active");

    document
      .querySelectorAll(".probability-section")
      .forEach(section => section.classList.add("hidden"));

    const target = tab.dataset.probabilitySection;

    const sectionIds = {
      simple: "probabilitySimple",
      union: "probabilityUnion",
      conditional: "probabilityConditional",
      binomial: "probabilityBinomial",
      simulation: "probabilitySimulation"
    };

    document
      .getElementById(sectionIds[target])
      .classList.remove("hidden");

  });

});


document
  .getElementById("calculateSimpleProbability")
  .addEventListener("click", () => {

    try {

      const favorable = Number(
        document.getElementById("probabilityFavorable").value
      );

      const possible = Number(
        document.getElementById("probabilityPossible").value
      );

      if (
        !Number.isInteger(favorable) ||
        !Number.isInteger(possible) ||
        favorable < 0 ||
        possible <= 0
      ) {
        throw new Error(
          "Casos favoráveis e possíveis devem ser números inteiros válidos."
        );
      }

      if (favorable > possible) {
        throw new Error(
          "Os casos favoráveis não podem ser maiores que os casos possíveis."
        );
      }

      const p = favorable / possible;
      const complement = 1 - p;

      document.getElementById("simpleProbabilityResult").innerHTML =
        `P(A) = ${probabilityText(p)}<br>` +
        `P(Aᶜ) = ${probabilityText(complement)}`;

    } catch (error) {
      showModuleMessage("probabilityMessage", error.message);
    }

  });


document
  .getElementById("calculateUnionProbability")
  .addEventListener("click", () => {

    try {

      const pA = Number(document.getElementById("probabilityA").value);
      const pB = Number(document.getElementById("probabilityB").value);
      const pIntersection = Number(
        document.getElementById("probabilityIntersection").value
      );

      validateProbability(pA, "P(A)");
      validateProbability(pB, "P(B)");
      validateProbability(pIntersection, "P(A ∩ B)");

      if (pIntersection > Math.min(pA, pB)) {
        throw new Error(
          "P(A ∩ B) não pode ser maior que P(A) nem que P(B)."
        );
      }

      const union = pA + pB - pIntersection;

      validateProbability(union, "P(A ∪ B)");

      document.getElementById("unionProbabilityResult").innerHTML =
        `P(A ∩ B) = ${probabilityText(pIntersection)}<br>` +
        `P(A ∪ B) = ${probabilityText(union)}`;

    } catch (error) {
      showModuleMessage("probabilityMessage", error.message);
    }

  });


document
  .getElementById("calculateConditionalProbability")
  .addEventListener("click", () => {

    try {

      const pIntersection = Number(
        document.getElementById("conditionalIntersection").value
      );

      const pB = Number(
        document.getElementById("conditionalB").value
      );

      validateProbability(pIntersection, "P(A ∩ B)");
      validateProbability(pB, "P(B)");

      if (pB === 0) {
        throw new Error(
          "P(B) deve ser maior que zero para calcular P(A|B)."
        );
      }

      if (pIntersection > pB) {
        throw new Error(
          "P(A ∩ B) não pode ser maior que P(B)."
        );
      }

      const conditional = pIntersection / pB;

      document.getElementById("conditionalProbabilityResult").textContent =
        `P(A|B) = ${probabilityText(conditional)}`;

    } catch (error) {
      showModuleMessage("probabilityMessage", error.message);
    }

  });


document
  .getElementById("calculateBinomialProbability")
  .addEventListener("click", () => {

    try {

      const n = Number(document.getElementById("binomialN").value);
      const k = Number(document.getElementById("binomialK").value);
      const p = Number(document.getElementById("binomialP").value);

      validateNK(n, k);
      validateProbability(p, "p");

      if (n > 1000) {
        throw new Error("Para esta calculadora, use n até 1000.");
      }

      const combinations = Number(combinationBigInt(n, k));

      const result =
        combinations *
        (p ** k) *
        ((1 - p) ** (n - k));

      document.getElementById("binomialProbabilityResult").textContent =
        `P(X = ${k}) = ${probabilityText(result)}`;

    } catch (error) {
      showModuleMessage("probabilityMessage", error.message);
    }

  });


function runSimulation(type, trials) {

  let successes = 0;
  let theoretical;
  let description;

  for (let i = 0; i < trials; i++) {

    if (type === "dice") {
      if (randomInt(1, 6) === 6) successes++;
      theoretical = 1 / 6;
      description = "resultado 6 no dado";
    }

    if (type === "coin") {
      if (randomInt(0, 1) === 1) successes++;
      theoretical = 1 / 2;
      description = "cara na moeda";
    }

    if (type === "card") {
      if (randomInt(1, 52) <= 4) successes++;
      theoretical = 4 / 52;
      description = "ás em uma carta retirada do baralho";
    }

  }

  return {
    successes,
    theoretical,
    description,
    relative: successes / trials
  };

}


document
  .getElementById("runProbabilitySimulation")
  .addEventListener("click", () => {

    try {

      const type =
        document.getElementById("simulationType").value;

      const trials = Number(
        document.getElementById("simulationTrials").value
      );

      if (
        !Number.isInteger(trials) ||
        trials < 1 ||
        trials > 100000
      ) {
        throw new Error(
          "A quantidade de tentativas deve ser um inteiro entre 1 e 100000."
        );
      }

      const data = runSimulation(type, trials);
      const difference = data.relative - data.theoretical;
      const width = Math.min(100, Math.max(0, data.relative * 100));

      document.getElementById("simulationProbabilityResult").innerHTML = `
        <strong>Evento observado:</strong> ${escapeHtml(data.description)}<br>
        <strong>Frequência observada:</strong> ${data.successes} de ${trials}<br>
        <strong>Frequência relativa:</strong> ${probabilityText(data.relative)}<br>
        <strong>Probabilidade teórica:</strong> ${probabilityText(data.theoretical)}<br>
        <strong>Diferença observado − teórico:</strong> ${formatNumber(difference * 100)} ponto(s) percentual(is)
        <div class="simulation-bar" aria-label="Frequência relativa observada">
          <div class="simulation-bar-fill" style="width:${width}%"></div>
        </div>
      `;

    } catch (error) {
      showModuleMessage("probabilityMessage", error.message);
    }

  });


/* =========================================================
   TECLADO FÍSICO
   ========================================================= */

function isEditableElement(element) {

  if (!element) return false;

  const tag = element.tagName;

  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    element.isContentEditable
  );

}


document.addEventListener("keydown", event => {

  if (isEditableElement(document.activeElement)) {
    return;
  }

  const activePage = document.querySelector(".page.active-page");

  if (!activePage) return;

  const page = activePage.id;
  const key = event.key;

  if (page === "calculator") {

    if (/^[0-9]$/.test(key)) {
      addNumber(key);
      event.preventDefault();
      return;
    }

    if (key === ".") {
      addDecimal();
      event.preventDefault();
      return;
    }

    if (["+", "-", "*", "/"].includes(key)) {
      chooseOperation(key);
      event.preventDefault();
      return;
    }

    if (key === "(" || key === ")") {

      if (key === "(") {
        if (
          expression === "" ||
          /[+\-*/(]$/.test(expression)
        ) {
          expression += "(";
        } else {
          expression += "*(";
        }
      } else {
        const open = (expression.match(/\(/g) || []).length;
        const close = (expression.match(/\)/g) || []).length;
        if (open > close && /[0-9)]$/.test(expression)) {
          expression += ")";
        }
      }

      updateDisplay();
      event.preventDefault();
      return;
    }

    if (key === "Enter") {
      calculate();
      event.preventDefault();
      return;
    }

    if (key === "Backspace") {
      deleteNumber();
      event.preventDefault();
      return;
    }

    if (key === "Escape") {
      expression = "";
      currentValue = "0";
      justCalculated = false;
      previousOperationDisplay.textContent = "";
      calculatorMessage.textContent = "";
      updateDisplay();
      event.preventDefault();
    }

  }

  if (page === "scientific") {

    if (/^[0-9]$/.test(key)) {
      scientificAddNumber(key);
      event.preventDefault();
      return;
    }

    if (key === ".") {
      scientificDecimal();
      event.preventDefault();
      return;
    }

    if (["+", "-", "*", "/"].includes(key)) {
      scientificChooseOperation(key);
      event.preventDefault();
      return;
    }

    if (key === "Enter") {
      document
        .querySelector('[data-scientific-action="calculate"]')
        .click();
      event.preventDefault();
      return;
    }

    if (key === "Backspace") {
      scientificDelete();
      event.preventDefault();
      return;
    }

    if (key === "Escape") {
      scientificExpression = "";
      scientificValue = "0";
      scientificJustCalculated = false;
      scientificPrevious.textContent = "";
      scientificMessage.textContent = "";
      updateScientificDisplay();
      event.preventDefault();
    }

  }

});


/* =========================================================
   INICIALIZAÇÃO
   ========================================================= */

createMatrixInputs();

document.getElementById("scalarContainer").style.display =
  "none";

updateCombinatoricsForm();

updateDisplay();

updateScientificDisplay();
