// Utilidades de formato
export function formatCurrency(value) {
  try {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "MXN",
      maximumFractionDigits: 2,
    }).format(value);
  } catch (e) {
    return `$${Number(value).toFixed(2)}`;
  }
}
