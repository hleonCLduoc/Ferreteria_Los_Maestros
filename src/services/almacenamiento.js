export function leerJSON(clave, respaldo, storage = localStorage) {
  try {
    const valor = storage.getItem(clave);
    return valor ? JSON.parse(valor) : respaldo;
  } catch {
    return respaldo;
  }
}
export function guardarJSON(clave, valor, storage = localStorage) {
  try {
    storage.setItem(clave, JSON.stringify(valor));
  } catch {
    throw new Error(
      'No pudimos guardar los datos en este navegador. Revisa que el almacenamiento esté habilitado.',
    );
  }
}
export const moneda = (valor) =>
  new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(valor);
export const fechaHora = (fecha) =>
  new Date(fecha).toLocaleString('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
