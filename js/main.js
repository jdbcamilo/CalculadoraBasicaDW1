const pantalla = document.querySelector(".pantalla");
const botones = document.querySelectorAll(".btn");

let cursorPos = 0;
let resultadoAnterior = 0;

botones.forEach((boton) => {
  boton.addEventListener("click", () => {
    const b = boton.textContent;
    let textoActual = pantalla.textContent;

    switch (boton.id) {
      case "Izquierda":
        if (cursorPos > 0) cursorPos--;
        break;

      case "Derecha":
        if (cursorPos < textoActual.length) cursorPos++;
        break;

      case "AC":
        pantalla.textContent = "0";
        cursorPos = 1;
        break;

      case "DEL":
        if (cursorPos > 0 && textoActual.length > 0) {
          pantalla.textContent =
            textoActual.slice(0, cursorPos - 1) + textoActual.slice(cursorPos);
          cursorPos--;
          if (!pantalla.textContent) {
            pantalla.textContent = "0";
            cursorPos = 1;
          }
        }
        break;

      case "igual":
        try {
          textoActual = textoActual.replace(/ANS/g, resultadoAnterior);

          textoActual = textoActual.replace(/√\(([^)]+)\)/g, "Math.sqrt($1)");
          textoActual = textoActual.replace(/√([0-9.]+)/g, "Math.sqrt($1)");

          const resultado = eval(textoActual);
          resultadoAnterior = resultado;
          pantalla.textContent = String(resultado);
          cursorPos = pantalla.textContent.length;
        } catch {
          pantalla.textContent = "Error";
          cursorPos = 5;
        }
        break;

      case "fraccion":
        if (textoActual === "0") {
          textoActual = "";
          cursorPos = 0;
        }
        pantalla.textContent =
          textoActual.slice(0, cursorPos) +
          "(/)" +
          textoActual.slice(cursorPos);
        cursorPos += 1;
        break;

      case "porcentaje":
        if (textoActual === "0") {
          textoActual = "";
          cursorPos = 0;
        }
        pantalla.textContent =
          textoActual.slice(0, cursorPos) +
          "/100" +
          textoActual.slice(cursorPos);
        cursorPos += 4;
        break;

      case "conversion":
        try {
          if (textoActual.includes("/")) {
            const [numStr, denStr] = textoActual.split("/");
            const numerador = parseFloat(numStr);
            const denominador = parseFloat(denStr);
            if (!isNaN(numerador) && !isNaN(denominador) && denominador !== 0) {
              const decimal = numerador / denominador;
              pantalla.textContent = String(decimal);
              resultadoAnterior = decimal;
              cursorPos = pantalla.textContent.length;
            }
          } else {
            const numero = parseFloat(textoActual);
            if (!isNaN(numero)) {
              pantalla.textContent = decimalAFraccion(numero);
              cursorPos = pantalla.textContent.length;
            }
          }
        } catch {
          pantalla.textContent = "Error";
          cursorPos = 5;
        }

        function decimalAFraccion(decimal) {
          if (Number.isInteger(decimal)) return `${decimal}/1`;

          const mcd = (a, b) => (b === 0 ? a : mcd(b, a % b));
          const decimales = decimal.toString().split(".")[1]?.length || 0;
          const denominador = 10 ** decimales;
          const numerador = Math.round(decimal * denominador);
          const divisor = mcd(numerador, denominador);

          return `${numerador / divisor}/${denominador / divisor}`;
        }

        break;

      default:
        if (textoActual === "0") {
          textoActual = "";
          cursorPos = 0;
        }
        pantalla.textContent =
          textoActual.slice(0, cursorPos) + b + textoActual.slice(cursorPos);
        cursorPos++;
        break;
     }
    });
});