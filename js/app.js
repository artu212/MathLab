/* =========================================================
   NAVEGAÇÃO
   ========================================================= */

const tabs = document.querySelectorAll(".tab-button");
const pages = document.querySelectorAll(".page");
const ACTIVE_PAGE_KEY = "mathlab-active-page-v1";
const availablePageNames = new Set(Array.from(pages, page => page.id));

function openPage(pageName) {
  // Ignora identificadores inválidos e preserva a navegação atual.
  if (!availablePageNames.has(pageName)) return;

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

  try {
    localStorage.setItem(ACTIVE_PAGE_KEY, pageName);
  } catch (_) {
    // O site continua navegável se o armazenamento estiver bloqueado.
  }
}

tabs.forEach(tab => {

  tab.addEventListener("click", () => {
    openPage(tab.dataset.page);
  });

});

// Recupera a última aba válida; para a primeira visita, abre a Básica.
let initialPage = "calculator";
try {
  const storedPage = localStorage.getItem(ACTIVE_PAGE_KEY);
  if (availablePageNames.has(storedPage)) initialPage = storedPage;
} catch (_) {
  // Armazenamento indisponível: mantém a página inicial padrão.
}
openPage(initialPage);

// Restaura a aba quando a página retorna do cache de navegação do navegador.
window.addEventListener("pageshow", event => {
  if (!event.persisted) return;
  try {
    const saved = localStorage.getItem(ACTIVE_PAGE_KEY);
    if (availablePageNames.has(saved)) openPage(saved);
  } catch (_) { /* armazenamento opcional */ }
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
let basicRepeatOperation = null;

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

// Identifica o último operador binário e seu operando para repetir o '='.
// Ex.: 1+1 => +1; 100/2 => /2; 2^3 => ^3.
function getRepeatOperation(expr) {
  const tokens = tokenizeExpression(expr);
  let lastOperator = -1;
  for (let i = 0; i < tokens.length; i++) {
    if (!["+", "-", "*", "/", "^"].includes(tokens[i])) continue;
    const previous = tokens[i - 1];
    // Ignora sinais unários, como o menos em 2*-3.
    if (i === 0 || (typeof previous === "string" && "(+-*/^".includes(previous))) continue;
    lastOperator = i;
  }
  if (lastOperator < 0 || lastOperator === tokens.length - 1) return null;
  const operator = tokens[lastOperator];
  const rightTokens = tokens.slice(lastOperator + 1);
  // Reconstrói o operando sem alterar o avaliador matemático original.
  const rightText = rightTokens.join("");
  try {
    const operand = evaluateMathExpression(rightText);
    return { operator, operand };
  } catch (_) {
    return null;
  }
}

function repeatMathOperation(left, repeat) {
  const { operator, operand } = repeat;
  if (operator === "+") return left + operand;
  if (operator === "-") return left - operand;
  if (operator === "*") return left * operand;
  if (operator === "/") {
    if (operand === 0) throw new Error("Não é possível dividir por zero.");
    return left / operand;
  }
  if (operator === "^") return left ** operand;
  throw new Error("Operação inválida.");
}

function repeatExpressionLabel(left, repeat) {
  return `${left} ${repeat.operator} ${formatNumber(repeat.operand)}`;
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

  if (!expression) {
    if (!justCalculated || !basicRepeatOperation) return;
    try {
      const original = currentValue;
      const value = repeatMathOperation(Number(original), basicRepeatOperation);
      const formatted = formatNumber(value);
      if (formatted === "Erro") throw new Error("Resultado fora do intervalo permitido.");
      const label = repeatExpressionLabel(original, basicRepeatOperation);
      previousOperationDisplay.textContent = label + " =";
      currentValue = formatted;
      updateDisplay();
      addHistory(label, formatted);
    } catch (error) { showCalculatorError(error.message); }
    return;
  }

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

    basicRepeatOperation = getRepeatOperation(finalExpression);
    addHistory(finalExpression,formatted);

  } catch (error) {

    showCalculatorError(error.message);

  }

}


function addHistory(expressionText, result) {

  const list = document.getElementById("historyList");
  const empty = list.querySelector(".empty-message");
  if (empty) empty.remove();

  // Cada item é um botão: ao clicar, reutiliza o resultado na calculadora básica.
  const item = document.createElement("button");
  item.type = "button";
  item.className = "history-item basic-history-button";
  item.title = "Reutilizar resultado: " + result;
  item.setAttribute("aria-label", "Reutilizar resultado " + result + " de " + expressionText);

  const expressionLine = document.createElement("span");
  expressionLine.className = "history-expression";
  expressionLine.textContent = expressionText;

  const resultLine = document.createElement("span");
  resultLine.className = "history-result";
  resultLine.textContent = "= " + result;

  item.append(expressionLine, resultLine);
  item.addEventListener("click", () => {
    expression = "";
    currentValue = result;
    justCalculated = true;
    basicRepeatOperation = null;
    previousOperationDisplay.textContent = expressionText + " =";
    updateDisplay();
  });

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
          basicRepeatOperation = null;
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
let scientificRepeatOperation = null;

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



/* =========================================================
   HISTÓRICO DA CALCULADORA CIENTÍFICA
   ========================================================= */
const SCIENTIFIC_HISTORY_KEY = "mathlab-scientific-history-v1";
const SCIENTIFIC_HISTORY_LIMIT = 40;
let scientificHistory = [];

function loadScientificHistory() {
  try {
    const parsed = JSON.parse(localStorage.getItem(SCIENTIFIC_HISTORY_KEY) || "[]");
    if (Array.isArray(parsed)) {
      scientificHistory = parsed.filter(entry =>
        entry && typeof entry.expression === "string" &&
        typeof entry.result === "string" && entry.expression.length <= 300 &&
        entry.result.length <= 300
      ).slice(0, SCIENTIFIC_HISTORY_LIMIT);
    }
  } catch (_) { scientificHistory = []; }
  renderScientificHistory();
}

function renderScientificHistory() {
  const list = document.getElementById("scientificHistoryList");
  if (!list) return;
  list.replaceChildren();
  if (!scientificHistory.length) {
    const empty = document.createElement("p");
    empty.className = "empty-message";
    empty.textContent = "Nenhum cálculo ainda.";
    list.appendChild(empty);
    return;
  }
  for (const entry of scientificHistory) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "scientific-history-entry";
    button.title = "Reutilizar resultado: " + entry.result;
    const expression = document.createElement("span");
    expression.className = "history-expression";
    expression.textContent = entry.expression;
    const result = document.createElement("span");
    result.className = "history-result";
    result.textContent = "= " + entry.result;
    button.append(expression, result);
    button.addEventListener("click", () => {
      scientificExpression = "";
      scientificValue = entry.result;
      scientificJustCalculated = true;
      scientificRepeatOperation = null;
      scientificPrevious.textContent = entry.expression + " =";
      scientificMessage.textContent = "";
      updateScientificDisplay();
    });
    list.appendChild(button);
  }
}

function addScientificHistory(expressionText, result) {
  if (!expressionText || !result) return;
  scientificHistory.unshift({
    expression: String(expressionText).slice(0, 300),
    result: String(result).slice(0, 300)
  });
  scientificHistory = scientificHistory.slice(0, SCIENTIFIC_HISTORY_LIMIT);
  try {
    localStorage.setItem(SCIENTIFIC_HISTORY_KEY, JSON.stringify(scientificHistory));
  } catch (_) { /* Histórico permanece disponível nesta sessão. */ }
  renderScientificHistory();
}

document.getElementById("clearScientificHistory").addEventListener("click", () => {
  scientificHistory = [];
  try { localStorage.removeItem(SCIENTIFIC_HISTORY_KEY); } catch (_) {}
  renderScientificHistory();
});
loadScientificHistory();

function setScientificResult(value, operationLabel = "") {
  scientificRepeatOperation = null;

  const original = scientificExpression || scientificValue;
  const historyExpression = operationLabel ? `${operationLabel}(${original})` : original;
  scientificPrevious.textContent = historyExpression;

  scientificValue =
    formatNumber(value);

  scientificExpression = "";
  scientificJustCalculated = true;

  updateScientificDisplay();
  addScientificHistory(historyExpression, scientificValue);

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
  scientificRepeatOperation = null;

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
        setScientificResult(value, "sin");
        break;

      case "cos":
        value = Math.cos(
          getScientificNumericValue() *
          Math.PI / 180
        );
        setScientificResult(value, "cos");
        break;

      case "tan":
        value = Math.tan(
          getScientificNumericValue() *
          Math.PI / 180
        );
        setScientificResult(value, "tan");
        break;

      case "sqrt":

        value = getScientificNumericValue();

        if (value < 0) {
          throw new Error(
            "Raiz de número negativo não é real."
          );
        }

        setScientificResult(Math.sqrt(value), "sqrt");
        break;

      case "square":

        value = getScientificNumericValue();
        setScientificResult(value ** 2, "quadrado");
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

        setScientificResult(Math.log10(value), "log");
        break;

      case "ln":

        value = getScientificNumericValue();

        if (value <= 0) {
          throw new Error(
            "ln exige número maior que zero."
          );
        }

        setScientificResult(Math.log(value), "ln");
        break;

      case "pi":
        setScientificResult(Math.PI, "π");
        break;

      case "e":
        setScientificResult(Math.E, "e");
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
        addScientificHistory(`${value}!`, scientificValue);

        break;

      case "random":
        setScientificResult(Math.random(), "RAND");
        break;

      case "percentage":

        value = getScientificNumericValue();
        setScientificResult(value / 100, "porcentagem");
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
  scientificRepeatOperation = getRepeatOperation(original);
  addScientificHistory(original, scientificValue);
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
          scientificRepeatOperation = null;
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
            if (!scientificExpression) {
              if (!scientificJustCalculated || !scientificRepeatOperation) break;
              const original = scientificValue;
              const result = repeatMathOperation(Number(original), scientificRepeatOperation);
              const formatted = formatNumber(result);
              if (formatted === "Erro") throw new Error("Resultado fora do intervalo permitido.");
              const label = repeatExpressionLabel(original, scientificRepeatOperation);
              scientificPrevious.textContent = label + " =";
              scientificValue = formatted;
              updateScientificDisplay();
              addScientificHistory(label, formatted);
              break;
            }

            if (scientificExpression.includes("^")) {
              calculateScientificPower();
            } else {
              const result =
                evaluateExpression(
                  scientificExpression
                );

              const originalExpression = scientificExpression;
              scientificPrevious.textContent =
                scientificExpression + " =";

              scientificValue =
                formatNumber(result);

              scientificExpression = "";
              scientificJustCalculated = true;

              updateScientificDisplay();
              scientificRepeatOperation = getRepeatOperation(originalExpression);
              addScientificHistory(originalExpression, scientificValue);
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
      currentFunctionGraph = { expression, start, end };
      refreshFunctionGraph();

    } catch(error) {

      graphStatus.textContent = "Não foi possível atualizar o gráfico: " + error.message;
      showModuleMessage(
        "functionMessage",
        error.message
      );

    }

  });



/* =========================================================
   GRÁFICO DE FUNÇÕES — CANVAS 2D
   ========================================================= */
let currentFunctionGraph = null;
const graphCanvas = document.getElementById("functionGraph");
const graphStatus = document.getElementById("functionGraphStatus");

function drawFunctionGraph(expression, start, end) {
  const canvas = graphCanvas;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    graphStatus.textContent = "Canvas não é suportado neste navegador.";
    return;
  }
  const bounds = canvas.getBoundingClientRect();
  const width = Math.max(200, Math.round(bounds.width));
  const height = Math.max(220, Math.round(bounds.height));
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const style = getComputedStyle(document.documentElement);
  const color = name => style.getPropertyValue(name).trim();
  const fg = color("--text") || "#222";
  const secondary = color("--text-secondary") || "#666";
  const accent = color("--primary") || "#f0171f";
  const surface = color("--surface") || "#fff";
  ctx.fillStyle = surface;
  ctx.fillRect(0, 0, width, height);

  const margin = { left: 53, right: 18, top: 20, bottom: 36 };
  const pw = width - margin.left - margin.right;
  const ph = height - margin.top - margin.bottom;
  const xmin = start === end ? start - 1 : start;
  const xmax = start === end ? end + 1 : end;
  const samples = Math.min(1200, Math.max(250, Math.round(pw * 1.5)));
  const points = [];
  let valid = 0;
  for (let i = 0; i <= samples; i++) {
    const x = xmin + (xmax - xmin) * i / samples;
    let y = null;
    try {
      const value = evaluateFunction(expression, x);
      if (Number.isFinite(value)) { y = value; valid++; }
    } catch (_) { /* Intervalo fora do domínio: quebra a curva. */ }
    points.push({ x, y });
  }
  if (!valid) {
    graphStatus.textContent = "Nenhum ponto real válido no intervalo informado.";
    return;
  }
  const ys = points.filter(p => p.y !== null).map(p => p.y).sort((a,b) => a-b);
  // Recorte robusto para evitar que assíntotas destruam a escala.
  const low = ys[Math.floor((ys.length - 1) * 0.02)];
  const high = ys[Math.floor((ys.length - 1) * 0.98)];
  let ymin = Math.min(low, 0), ymax = Math.max(high, 0);
  if (ymin === ymax) { ymin -= 1; ymax += 1; }
  const pad = (ymax - ymin) * 0.12;
  ymin -= pad; ymax += pad;
  const px = x => margin.left + (x - xmin) / (xmax - xmin) * pw;
  const py = y => margin.top + (ymax - y) / (ymax - ymin) * ph;

  ctx.font = "11px Arial, sans-serif";
  ctx.strokeStyle = secondary;
  ctx.fillStyle = secondary;
  ctx.lineWidth = 0.7;
  ctx.globalAlpha = 0.35;
  for (let i = 0; i <= 4; i++) {
    const gx = margin.left + pw * i / 4;
    const gy = margin.top + ph * i / 4;
    ctx.beginPath(); ctx.moveTo(gx, margin.top); ctx.lineTo(gx, margin.top + ph); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(margin.left, gy); ctx.lineTo(margin.left + pw, gy); ctx.stroke();
  }
  ctx.globalAlpha = 1;
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  for (let i = 0; i <= 4; i++) {
    const value = ymax - (ymax - ymin) * i / 4;
    ctx.fillText(Number(value.toPrecision(3)).toString(), margin.left - 7, margin.top + ph * i / 4);
  }
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  for (let i = 0; i <= 4; i++) {
    const value = xmin + (xmax - xmin) * i / 4;
    ctx.fillText(Number(value.toPrecision(3)).toString(), margin.left + pw * i / 4, margin.top + ph + 7);
  }
  ctx.save();
  ctx.beginPath(); ctx.rect(margin.left, margin.top, pw, ph); ctx.clip();
  ctx.strokeStyle = fg;
  ctx.globalAlpha = 0.65;
  ctx.lineWidth = 1.3;
  if (xmin <= 0 && xmax >= 0) {
    ctx.beginPath(); ctx.moveTo(px(0), margin.top); ctx.lineTo(px(0), margin.top + ph); ctx.stroke();
  }
  if (ymin <= 0 && ymax >= 0) {
    ctx.beginPath(); ctx.moveTo(margin.left, py(0)); ctx.lineTo(margin.left + pw, py(0)); ctx.stroke();
  }
  ctx.globalAlpha = 1;
  ctx.strokeStyle = accent;
  ctx.lineWidth = 2.2;
  ctx.lineJoin = "round";
  ctx.beginPath();
  let previous = null;
  let segments = 0;
  const jumpLimit = (ymax - ymin) * 0.65;
  for (const point of points) {
    if (point.y === null || point.y < ymin - (ymax-ymin) || point.y > ymax + (ymax-ymin)) {
      previous = null; continue;
    }
    const x = px(point.x), y = py(point.y);
    if (!previous || Math.abs(point.y - previous.y) > jumpLimit) {
      ctx.moveTo(x,y);
      segments++;
    } else {
      ctx.lineTo(x,y);
    }
    previous = point;
  }
  ctx.stroke();
  ctx.restore();
  graphStatus.textContent = `Gráfico de f(x) = ${expression} no intervalo [${start}, ${end}]. ${valid} amostras válidas.`;
}

function refreshFunctionGraph() {
  if (!currentFunctionGraph) return;
  drawFunctionGraph(currentFunctionGraph.expression,
    currentFunctionGraph.start, currentFunctionGraph.end);
}
document.getElementById("redrawFunctionGraph").addEventListener("click", () => {
  const expression = document.getElementById("functionInput").value.trim();
  const start = Number(document.getElementById("functionStart").value);
  const end = Number(document.getElementById("functionEnd").value);
  if (!expression || !Number.isFinite(start) || !Number.isFinite(end) ||
    start > end || ["functionStart","functionEnd"].some(id =>
      document.getElementById(id).value.trim() === "")) {
    graphStatus.textContent = "Informe uma função e um intervalo válido.";
    return;
  }
  try {
    tokenizeExpression(transformFunctionExpression(expression));
    currentFunctionGraph = { expression, start, end };
    refreshFunctionGraph();
  } catch (error) { graphStatus.textContent = error.message; }
});
window.addEventListener("resize", () => {
  if (document.getElementById("functions").classList.contains("active-page")) {
    refreshFunctionGraph();
  }
});
new MutationObserver(() => {
  if (document.getElementById("functions").classList.contains("active-page")) {
    requestAnimationFrame(refreshFunctionGraph);
  }
}).observe(document.getElementById("functions"), { attributes:true, attributeFilter:["class"] });
new MutationObserver(refreshFunctionGraph).observe(document.documentElement, {
  attributes:true, attributeFilter:["data-theme"]
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

          const scalarInput = document.getElementById("matrixScalar");
          if (!scalarInput.value.trim()) {
            throw new Error("Preencha o valor do escalar.");
          }
          const k = Number(scalarInput.value);

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

// Evita que Number("") transforme um campo obrigatório vazio em zero.
function readRequiredNumber(id, label) {
  const input = document.getElementById(id);
  if (!input.value.trim()) {
    throw new Error(`Preencha o campo ${label}.`);
  }
  const value = Number(input.value);
  if (!Number.isFinite(value)) {
    throw new Error(`${label} deve ser um número válido.`);
  }
  return value;
}


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

      const favorable = readRequiredNumber("probabilityFavorable", "casos favoráveis");

      const possible = readRequiredNumber("probabilityPossible", "casos possíveis");

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

      const pA = readRequiredNumber("probabilityA", "P(A)");
      const pB = readRequiredNumber("probabilityB", "P(B)");
      const pIntersection = readRequiredNumber("probabilityIntersection", "P(A ∩ B)");

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

      const pIntersection = readRequiredNumber("conditionalIntersection", "P(A ∩ B)");

      const pB = readRequiredNumber("conditionalB", "P(B)");

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

      const n = readRequiredNumber("binomialN", "n");
      const k = readRequiredNumber("binomialK", "k");
      const p = readRequiredNumber("binomialP", "p");

      validateNK(n, k);
      validateProbability(p, "p");

      if (n > 1000) {
        throw new Error("Para esta calculadora, use n até 1000.");
      }

      // Calcula no domínio logarítmico para evitar Infinity * 0
      // em coeficientes binomiais grandes (ex.: n=1000, k=500).
      let result;
      if (p === 0) {
        result = k === 0 ? 1 : 0;
      } else if (p === 1) {
        result = k === n ? 1 : 0;
      } else {
        const smallerK = Math.min(k, n - k);
        let logCombination = 0;
        for (let i = 1; i <= smallerK; i++) {
          logCombination += Math.log(n - smallerK + i) - Math.log(i);
        }
        const logProbability =
          logCombination + k * Math.log(p) + (n - k) * Math.log1p(-p);
        result = Math.min(1, Math.max(0, Math.exp(logProbability)));
      }

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

      const trials = readRequiredNumber("simulationTrials", "tentativas");

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

  // Delete limpa a calculadora inteira; Backspace continua apagando um caractere.
  if (key === "Delete" && (page === "calculator" || page === "scientific")) {
    event.preventDefault();
    const clearButton = page === "calculator"
      ? document.querySelector('#calculator [data-action="clear"]')
      : document.querySelector('#scientific [data-scientific-action="clear"]');
    if (clearButton) clearButton.click();
    return;
  }

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
      basicRepeatOperation = null;
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
      scientificRepeatOperation = null;
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


/* =========================================================
   TEMA CLARO/ESCURO
   ========================================================= */

(function initializeTheme() {
  const themeButton = document.getElementById("themeToggle");
  if (!themeButton) return;

  const storageKey = "mathlab-theme";
  let theme = "light"; // Mantém o visual atual como padrão.

  try {
    const savedTheme = localStorage.getItem(storageKey);
    if (savedTheme === "light" || savedTheme === "dark") theme = savedTheme;
  } catch (_) {
    // O alternador continua funcionando mesmo com armazenamento bloqueado.
  }

  function applyTheme(nextTheme) {
    theme = nextTheme;
    document.documentElement.dataset.theme = theme;
    const isDark = theme === "dark";
    themeButton.setAttribute("aria-pressed", String(isDark));
    themeButton.setAttribute("aria-label", isDark ? "Ativar modo claro" : "Ativar modo escuro");
    themeButton.querySelector(".theme-icon").textContent = isDark ? "☀" : "☾";
    themeButton.querySelector(".theme-label").textContent = isDark ? "Modo claro" : "Modo escuro";
  }

  applyTheme(theme);
  themeButton.addEventListener("click", () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    try { localStorage.setItem(storageKey, nextTheme); } catch (_) { /* opcional */ }
  });
})();


