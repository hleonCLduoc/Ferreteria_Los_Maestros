import { useEffect, useRef, useState } from 'react';
import { ContextoCompras } from './compras';
import { useAut } from './auth';
import { leerJSON, guardarJSON } from '../services/almacenamiento';
import * as operaciones from '../services/compras';
export const ProveedorCompras = ({ children }) => {
  const { usuario } = useAut();
  const [datos, setDatos] = useState(() =>
    operaciones.validarDatos(
      leerJSON(operaciones.CLAVE_COMPRAS, operaciones.vacio()),
    ),
  );
  const actual = useRef(datos);
  const [ahora, setAhora] = useState(Date.now);
  useEffect(() => {
    const reloj = setInterval(() => setAhora(Date.now()), 60000);
    return () => clearInterval(reloj);
  }, []);
  const guardar = (siguiente) => {
    guardarJSON(operaciones.CLAVE_COMPRAS, siguiente);
    actual.current = siguiente;
    setDatos(siguiente);
  };
  const crearPedido = (entrada) => {
    const resultado = operaciones.crearPedido(actual.current, usuario, entrada);
    guardar(resultado.datos);
    return resultado.registro;
  };
  const crearReserva = (entrada) => {
    const resultado = operaciones.crearReserva(
      actual.current,
      usuario,
      entrada,
    );
    guardar(resultado.datos);
    return resultado.registro;
  };
  const cancelarReserva = (id) =>
    guardar(operaciones.cancelarReserva(actual.current, usuario, id));
  const cancelarPedido = (id) =>
    guardar(operaciones.cancelarPedido(actual.current, usuario, id));
  const pagarPedido = (id) =>
    guardar(operaciones.pagarPedido(actual.current, usuario, id));
  const abonar = (monto, clave) =>
    guardar(operaciones.registrarAbono(actual.current, usuario, monto, clave));
  const pedidos = datos.pedidos
    .filter((p) => p.clienteId === usuario?.id)
    .toReversed();
  const reservas = datos.reservas
    .filter((r) => r.clienteId === usuario?.id)
    .map((r) => ({ ...r, estado: operaciones.estadoReserva(r, ahora) }))
    .toReversed();
  const abonos = datos.abonos
    .filter((a) => a.clienteId === usuario?.id)
    .toReversed();
  const saldo = operaciones.saldoCuenta(datos, usuario?.id);
  const disponible = (id, reservaId) =>
    operaciones.stockDisponible(datos, id, reservaId, ahora);
  const consultarCliente = (id) => {
    if (usuario?.rol !== 'ADMIN')
      throw new Error('Acceso reservado al administrador.');
    return {
      pedidos: datos.pedidos.filter((p) => p.clienteId === id).toReversed(),
      reservas: datos.reservas
        .filter((r) => r.clienteId === id)
        .map((r) => ({ ...r, estado: operaciones.estadoReserva(r, ahora) }))
        .toReversed(),
      saldo: operaciones.saldoCuenta(datos, id),
    };
  };
  return (
    <ContextoCompras.Provider
      value={{
        pedidos,
        reservas,
        abonos,
        saldo,
        disponible,
        crearPedido,
        crearReserva,
        cancelarReserva,
        cancelarPedido,
        pagarPedido,
        abonar,
        consultarCliente,
      }}
    >
      {children}
    </ContextoCompras.Provider>
  );
};
