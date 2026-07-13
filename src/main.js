import "./style.css";

// Elementos principales del formulario.
const form = document.querySelector("form");
const inputs = document.querySelectorAll("[data-input]");
const results = document.querySelectorAll("[data-result]");

// El año máximo permitido será el año actual.
// Evita que el usuario introduzca un año futuro desde el input.
inputs[2].setAttribute("max", new Date().getFullYear());

/*
  Aplica el estilo de error al campo
  y muestra el mensaje correspondiente.
*/
function setError(input, message) {
  input.classList.replace("border-gray-200", "border-red-400");

  input.previousElementSibling.classList.replace(
    "text-gray-500",
    "text-red-400",
  );

  input.nextElementSibling.textContent = message;
}

form.addEventListener("submit", (e) => {
  // Evita que el formulario recargue la página.
  e.preventDefault();

  // Mensajes personalizados para cada tipo de error.
  const errorMessages = {
    day: "Must be a valid day",
    month: "Must be a valid month",
    year: "Must be a valid year",
  };

  let hasErrors = false;

  /*
    Restablece el estado inicial del formulario.
    Elimina los mensajes de error y devuelve los estilos originales
    antes de comenzar una nueva validación.
  */
  inputs.forEach((input) => {
    input.nextElementSibling.textContent = "";

    input.classList.replace("border-red-400", "border-gray-200");

    input.previousElementSibling.classList.replace(
      "text-red-400",
      "text-gray-500",
    );
  });

  /*
    Valida cada input individualmente:
    1. Que no esté vacío.
    2. Que cumpla las reglas HTML (min, max, etc.).
  */
  inputs.forEach((input) => {
    if (input.value === "") {
      setError(input, "This field is required");
      hasErrors = true;
    } else if (!input.validity.valid) {
      setError(input, errorMessages[input.id]);
      hasErrors = true;
    }
  });

  // Si hay errores, detiene la ejecución.
  if (hasErrors) return;

  /*
    Convierte los valores de los inputs en números
    y los almacena en un objeto:
    {
      day: 15,
      month: 7,
      year: 2000
    }
  */
  const dateValues = {};

  inputs.forEach((input) => {
    dateValues[input.id] = Number(input.value);
  });

  const { day, month, year } = dateValues;

  // JavaScript cuenta los meses desde 0:
  // Enero = 0, Febrero = 1... Por eso se resta 1.
  const birthDate = new Date(year, month - 1, day);
  const currentDate = new Date();

  /*
    JavaScript corrige automáticamente las fechas inválidas.

    Ejemplo:
    new Date(2026, 1, 31)
    podría convertirse en marzo.

    Por eso comprobamos que la fecha creada
    coincida exactamente con la fecha introducida.
  */
  const isValidDate =
    birthDate.getFullYear() === year &&
    birthDate.getMonth() === month - 1 &&
    birthDate.getDate() === day;

  if (!isValidDate) {
    setError(inputs[0], "Must be a valid date");
    return;
  }

  // Una fecha de nacimiento no puede estar en el futuro.
  if (birthDate > currentDate) {
    setError(inputs[0], "Must be in the past");
    return;
  }

  /*
    Calcula la diferencia inicial entre la fecha actual
    y la fecha de nacimiento.
  */
  let ageYears = currentDate.getFullYear() - birthDate.getFullYear();
  let ageMonths = currentDate.getMonth() - birthDate.getMonth();
  let ageDays = currentDate.getDate() - birthDate.getDate();

  /*
    Si los días son negativos significa que todavía no llegó
    el día del cumpleaños de este mes.

    Entonces pide prestado un mes.
  */
  if (ageDays < 0) {
    ageMonths--;

    // Obtiene cuántos días tuvo el mes anterior.
    const daysInPreviousMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      0,
    ).getDate();

    ageDays += daysInPreviousMonth;
  }

  /*
    Si los meses son negativos significa que todavía
    no llegó el cumpleaños de este año.

    Entonces pide prestado un año.
  */
  if (ageMonths < 0) {
    ageYears--;
    ageMonths += 12;
  }

  // Muestra los resultados calculados.
  results[0].textContent = ageYears;
  results[1].textContent = ageMonths;
  results[2].textContent = ageDays;

  /*
    Cambia automáticamente entre singular y plural:

    1 year
    2 years

    Evita agregar varias "s" si el usuario
    presiona el botón varias veces.
  */
  results.forEach((result) => {
    const label = result.nextElementSibling;
    const value = Number(result.textContent);

    if (value === 1) {
      label.textContent = label.textContent.replace(/s$/, "");
    } else if (!label.textContent.endsWith("s")) {
      label.textContent += "s";
    }
  });
});
