export function rutValido(valor) {
  const rut = valor.replace(/[.\s-]/g, '').toUpperCase();
  if (!/^\d{7,8}[\dK]$/.test(rut)) return false;
  let suma = 0,
    factor = 2;
  for (let i = rut.length - 2; i >= 0; i--) {
    suma += Number(rut[i]) * factor;
    factor = factor === 7 ? 2 : factor + 1;
  }
  const digito = 11 - (suma % 11);
  return (
    rut.at(-1) === (digito === 11 ? '0' : digito === 10 ? 'K' : String(digito))
  );
}
