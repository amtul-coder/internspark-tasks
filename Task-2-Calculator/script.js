const display = document.getElementById("display");
const expression = document.getElementById("expression");
const keys = document.querySelector(".keypad");

let current = "0";
let previous = "";
let operator = null;
let justCalculated = false;

const symbol = { "+": "+", "-": "−", "*": "×", "/": "÷" };

function updateDisplay() {
  display.textContent = current;
  expression.textContent = previous && operator
    ? `${previous} ${symbol[operator]}`
    : "Ready";
}

function inputNumber(value) {
  if (justCalculated) {
    current = "0";
    previous = "";
    operator = null;
    justCalculated = false;
  }

  if (value === "." && current.includes(".")) return;
  if (current === "0" && value !== ".") current = value;
  else current += value;

  updateDisplay();
}

function chooseOperator(nextOperator) {
  if (operator && previous !== "") calculate();

  previous = current;
  operator = nextOperator;
  current = "0";
  justCalculated = false;
  updateDisplay();
}

function calculate() {
  if (!operator || previous === "") return;

  const a = Number(previous);
  const b = Number(current);
  let result;

  if (operator === "/" && b === 0) {
    current = "Error";
    expression.textContent = "Cannot divide by zero";
    previous = "";
    operator = null;
    return;
  }

  switch (operator) {
    case "+": result = a + b; break;
    case "-": result = a - b; break;
    case "*": result = a * b; break;
    case "/": result = a / b; break;
  }

  result = Number.isInteger(result) ? result : Number(result.toFixed(10));
  expression.textContent = `${previous} ${symbol[operator]} ${current} =`;
  current = String(result);
  previous = "";
  operator = null;
  justCalculated = true;
  display.textContent = current;
}

function clearAll() {
  current = "0";
  previous = "";
  operator = null;
  justCalculated = false;
  updateDisplay();
}

function deleteLast() {
  if (justCalculated || current === "Error") return clearAll();
  current = current.length > 1 ? current.slice(0, -1) : "0";
  updateDisplay();
}

function percent() {
  if (current === "Error") return;
  current = String(Number(current) / 100);
  updateDisplay();
}

keys.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const value = button.dataset.value;
  const action = button.dataset.action;

  if (value !== undefined) {
    if (/[0-9.]/.test(value)) inputNumber(value);
    else chooseOperator(value);
  }

  if (action === "clear") clearAll();
  if (action === "delete") deleteLast();
  if (action === "percent") percent();
  if (action === "equals") calculate();
});

document.addEventListener("keydown", (event) => {
  const key = event.key;

  if (/^[0-9.]$/.test(key)) inputNumber(key);
  else if (["+", "-", "*", "/"].includes(key)) chooseOperator(key);
  else if (key === "Enter" || key === "=") calculate();
  else if (key === "Backspace") deleteLast();
  else if (key === "Escape") clearAll();
  else if (key === "%") percent();
});

updateDisplay();
