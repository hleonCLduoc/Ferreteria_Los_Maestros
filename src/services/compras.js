import { productos } from '../data/productos';
export const CLAVE_COMPRAS = 'compras_los_maestros_v1';
export const vacio = () => ({ pedidos: [], reservas: [], abonos: [] });
const articuloValido = (p) =>
  p &&
  typeof p.id === 'string' &&
  typeof p.nombre === 'string' &&
  Number.isInteger(p.cantidad) &&
  p.cantidad > 0 &&
  Number.isFinite(p.precioNumero) &&
  p.precioNumero >= 0;
const registroValido = (p) =>
  p &&
  typeof p.id === 'string' &&
  typeof p.clienteId === 'string' &&
  Number.isFinite(p.total) &&
  typeof p.fecha === 'string' &&
  Array.isArray(p.productos) &&
  p.productos.every(articuloValido);
export function validarDatos(datos) {
  if (
    !datos ||
    !Array.isArray(datos.pedidos) ||
    !Array.isArray(datos.reservas) ||
    !Array.isArray(datos.abonos)
  )
    return vacio();
  return {
    pedidos: datos.pedidos.filter(registroValido),
    reservas: datos.reservas.filter(
      (r) => registroValido(r) && Number.isFinite(Date.parse(r.vence)),
    ),
    abonos: datos.abonos.filter(
      (a) =>
        a &&
        typeof a.id === 'string' &&
        typeof a.clienteId === 'string' &&
        Number.isInteger(a.monto) &&
        a.monto > 0 &&
        typeof a.fecha === 'string',
    ),
  };
}
export function estadoReserva(reserva, ahora = Date.now()) {
  return reserva.estado === 'ACTIVA' && Date.parse(reserva.vence) <= ahora
    ? 'VENCIDA'
    : reserva.estado;
}
export function stockDisponible(
  datos,
  id,
  excluirReserva = '',
  ahora = Date.now(),
) {
  const inicial = productos.find((p) => p.id === id)?.stock ?? 0;
  const ocupados = [
    ...datos.pedidos.filter((p) => p.estado !== 'CANCELADO'),
    ...datos.reservas.filter(
      (r) => r.id !== excluirReserva && estadoReserva(r, ahora) === 'ACTIVA',
    ),
  ];
  return Math.max(
    0,
    inicial -
      ocupados.reduce(
        (sum, r) =>
          sum +
          r.productos
            .filter((p) => p.id === id)
            .reduce((s, p) => s + p.cantidad, 0),
        0,
      ),
  );
}
function prepararLineas(datos, lineas, reservaId) {
  if (!Array.isArray(lineas) || !lineas.length)
    throw new Error('Agrega al menos un producto.');
  const ids = new Set();
  return lineas.map((linea) => {
    const p = productos.find((p) => p.id === linea.id);
    const cantidad = Number(linea.cantidad);
    if (
      !p ||
      !p.disponible ||
      ids.has(p.id) ||
      !Number.isInteger(cantidad) ||
      cantidad < 1
    )
      throw new Error('Revisa los productos y sus cantidades.');
    if (cantidad > stockDisponible(datos, p.id, reservaId))
      throw new Error(
        `Solo quedan ${stockDisponible(datos, p.id, reservaId)} unidades de ${p.nombre}.`,
      );
    ids.add(p.id);
    return {
      id: p.id,
      nombre: p.nombre,
      imagen: p.imagen,
      precioNumero: p.precioNumero,
      cantidad,
    };
  });
}
const totalDe = (lineas) =>
  lineas.reduce((s, p) => s + p.cantidad * p.precioNumero, 0);
function contacto(datos) {
  if (!/^[+0-9 ()-]{8,30}$/.test(datos.telefono || ''))
    throw new Error('Ingresa un teléfono de contacto válido.');
  if (!['RETIRO', 'DESPACHO'].includes(datos.entrega))
    throw new Error('Selecciona una forma de entrega.');
  if (
    datos.entrega === 'DESPACHO' &&
    (!datos.direccion?.trim() || !datos.comuna?.trim())
  )
    throw new Error('Completa la dirección y comuna de despacho.');
}
export function saldoCuenta(datos, clienteId) {
  return datos.pedidos
    .filter((p) => p.clienteId === clienteId && p.estado !== 'CANCELADO')
    .reduce((s, p) => s + (p.saldoPendiente || 0), 0);
}
export function crearReserva(datos, usuario, entrada) {
  if (!usuario) throw new Error('Inicia sesión para reservar.');
  contacto({ ...entrada, entrega: 'RETIRO' });
  const articulos = prepararLineas(datos, entrada.productos);
  const fecha = new Date();
  const reserva = {
    id: crypto.randomUUID(),
    numero: `RES-${String(datos.reservas.length + 1).padStart(4, '0')}`,
    clienteId: usuario.id,
    productos: articulos,
    total: totalDe(articulos),
    telefono: entrada.telefono.trim(),
    fecha: fecha.toISOString(),
    vence: new Date(fecha.getTime() + 86400000).toISOString(),
    estado: 'ACTIVA',
  };
  return {
    datos: { ...datos, reservas: [...datos.reservas, reserva] },
    registro: reserva,
  };
}
export function crearPedido(datos, usuario, entrada) {
  if (!usuario) throw new Error('Inicia sesión para completar la compra.');
  const anterior = datos.pedidos.find(
    (p) => p.clienteId === usuario.id && p.clave === entrada.clave,
  );
  if (anterior) return { datos, registro: anterior };
  contacto(entrada);
  const reserva = entrada.reservaId
    ? datos.reservas.find(
        (r) => r.id === entrada.reservaId && r.clienteId === usuario.id,
      )
    : null;
  if (entrada.reservaId && (!reserva || estadoReserva(reserva) !== 'ACTIVA'))
    throw new Error('Esta reserva ya no está disponible para pagar.');
  const articulos = prepararLineas(
    datos,
    reserva ? reserva.productos : entrada.productos,
    reserva?.id,
  );
  const total = totalDe(articulos);
  if (
    !['TARJETA', 'TRANSFERENCIA', 'CUENTA_CORRIENTE'].includes(entrada.metodo)
  )
    throw new Error('Selecciona una forma de pago.');
  const credito = entrada.metodo === 'CUENTA_CORRIENTE';
  if (credito && total > usuario.lineaCredito - saldoCuenta(datos, usuario.id))
    throw new Error('El crédito disponible no alcanza para esta compra.');
  const pedido = {
    id: crypto.randomUUID(),
    numero: `PED-${String(datos.pedidos.length + 1).padStart(4, '0')}`,
    clave: entrada.clave,
    clienteId: usuario.id,
    productos: articulos,
    total,
    entrega: entrada.entrega,
    direccion:
      entrada.entrega === 'DESPACHO'
        ? entrada.direccion.trim()
        : 'Retiro en tienda',
    comuna:
      entrada.entrega === 'DESPACHO' ? entrada.comuna.trim() : 'La Serena',
    telefono: entrada.telefono.trim(),
    metodo: entrada.metodo,
    estadoPago: entrada.metodo === 'TARJETA' ? 'PAGADO' : 'PENDIENTE',
    saldoPendiente: credito ? total : 0,
    fecha: new Date().toISOString(),
    estado: 'CONFIRMADO',
  };
  const reservas = reserva
    ? datos.reservas.map((r) =>
        r.id === reserva.id
          ? { ...r, estado: 'COMPRADA', pedidoId: pedido.id }
          : r,
      )
    : datos.reservas;
  return {
    datos: { ...datos, pedidos: [...datos.pedidos, pedido], reservas },
    registro: pedido,
  };
}
export function cancelarReserva(datos, usuario, id) {
  const reserva = datos.reservas.find(
    (r) => r.id === id && r.clienteId === usuario?.id,
  );
  if (!reserva || estadoReserva(reserva) !== 'ACTIVA')
    throw new Error('Solo puedes cancelar tus reservas activas.');
  return {
    ...datos,
    reservas: datos.reservas.map((r) =>
      r.id === id ? { ...r, estado: 'CANCELADA' } : r,
    ),
  };
}
export function pagarPedido(datos, usuario, id) {
  const pedido = datos.pedidos.find(
    (p) => p.id === id && p.clienteId === usuario?.id,
  );
  if (
    !pedido ||
    pedido.estado === 'CANCELADO' ||
    pedido.metodo !== 'TRANSFERENCIA' ||
    pedido.estadoPago !== 'PENDIENTE'
  )
    throw new Error('El pedido no tiene un pago por transferencia pendiente.');
  return {
    ...datos,
    pedidos: datos.pedidos.map((p) =>
      p.id === id
        ? { ...p, estadoPago: 'PAGADO', pagado: new Date().toISOString() }
        : p,
    ),
  };
}
export function cancelarPedido(datos, usuario, id) {
  const pedido = datos.pedidos.find(
    (p) => p.id === id && p.clienteId === usuario?.id,
  );
  if (
    !pedido ||
    pedido.estado !== 'CONFIRMADO' ||
    pedido.estadoPago !== 'PENDIENTE' ||
    (pedido.metodo === 'CUENTA_CORRIENTE' &&
      pedido.saldoPendiente !== pedido.total)
  )
    throw new Error('Este pedido ya no se puede cancelar.');
  return {
    ...datos,
    pedidos: datos.pedidos.map((p) =>
      p.id === id ? { ...p, estado: 'CANCELADO', saldoPendiente: 0 } : p,
    ),
  };
}
export function registrarAbono(datos, usuario, monto, clave) {
  if (!usuario) throw new Error('Inicia sesión para ver tu cuenta.');
  if (datos.abonos.some((a) => a.clave === clave && a.clienteId === usuario.id))
    return datos;
  const cantidad = Number(monto);
  if (
    !Number.isInteger(cantidad) ||
    cantidad <= 0 ||
    cantidad > saldoCuenta(datos, usuario.id)
  )
    throw new Error('El abono debe ser mayor que cero y no superar tu deuda.');
  let pendiente = cantidad;
  const pedidos = datos.pedidos.map((p) => {
    if (
      p.clienteId !== usuario.id ||
      p.estado === 'CANCELADO' ||
      !p.saldoPendiente ||
      !pendiente
    )
      return p;
    const aplicado = Math.min(p.saldoPendiente, pendiente);
    pendiente -= aplicado;
    const saldoPendiente = p.saldoPendiente - aplicado;
    return {
      ...p,
      saldoPendiente,
      estadoPago: saldoPendiente === 0 ? 'PAGADO' : 'PENDIENTE',
    };
  });
  return {
    ...datos,
    pedidos,
    abonos: [
      ...datos.abonos,
      {
        id: crypto.randomUUID(),
        clienteId: usuario.id,
        clave,
        monto: cantidad,
        fecha: new Date().toISOString(),
      },
    ],
  };
}
