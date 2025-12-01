// Validaciones para formularios
export function validateCategoria(text) {
  let error = "";
  if (!text || text.trim() === "") {
    error = "La categoría es requerida";
  } else if (text.length > 30) {
    error = "Máximo 30 caracteres";
  }
  return error;
}

export function validateMonto(text) {
  let error = "";
  if (!text || text.trim() === "") {
    error = "El monto es requerido";
  } else {
    const montoNum = parseFloat(text);
    if (isNaN(montoNum)) {
      error = "Ingresa un número válido";
    } else if (montoNum <= 0) {
      error = "El monto debe ser mayor a 0";
    }
  }
  return error;
}
