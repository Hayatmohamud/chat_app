export function calculate(a: number, b: number, operation: string) {
  if (operation === "/" && b === 0) {
    return "Cannot divide by zero";
  }

  switch (operation) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      return a / b;
    default:
      return "Invalid operation";
  }
}
