import { beforeEach, describe, expect, it, vi } from 'vitest';
import { webcrypto } from 'node:crypto';
import { clienteDemo } from '../data/clienteDemo';
import {
  vacio,
  crearPedido,
  crearReserva,
  stockDisponible,
  saldoCuenta,
  cancelarReserva,
  cancelarPedido,
  pagarPedido,
  registrarAbono,
  validarDatos,
  estadoReserva,
} from '../services/compras';

beforeEach(() => {
  vi.stubGlobal('crypto', webcrypto);
});
const entrada = (metodo = 'TARJETA') => ({
  productos: [{ id: 'MC001', cantidad: 2 }],
  telefono: '+56912345678',
  entrega: 'RETIRO',
  metodo,
  clave: crypto.randomUUID(),
});

describe('Compra simulada', () => {
  it('calcula el precio desde el catálogo y guarda una compra pagada', () => {
    const { datos, registro } = crearPedido(vacio(), clienteDemo, entrada());
    expect(registro.total).toBe(11980);
    expect(registro.estadoPago).toBe('PAGADO');
    expect(stockDisponible(datos, 'MC001')).toBe(78);
    expect(saldoCuenta(datos, clienteDemo.id)).toBe(0);
  });
  it('un reintento no duplica la compra', () => {
    const solicitud = entrada();
    const uno = crearPedido(vacio(), clienteDemo, solicitud);
    const dos = crearPedido(uno.datos, clienteDemo, solicitud);
    expect(dos.registro.id).toBe(uno.registro.id);
    expect(dos.datos.pedidos).toHaveLength(1);
  });
  it('rechaza una cantidad mayor al stock disponible', () => {
    expect(() =>
      crearPedido(vacio(), clienteDemo, {
        ...entrada(),
        productos: [{ id: 'MC001', cantidad: 81 }],
      }),
    ).toThrow(/Solo quedan/);
  });
  it('exige dirección y comuna cuando se elige despacho', () => {
    expect(() =>
      crearPedido(vacio(), clienteDemo, { ...entrada(), entrega: 'DESPACHO' }),
    ).toThrow(/dirección/);
  });
  it('permite pagar una transferencia pendiente sin consumir stock otra vez', () => {
    const { datos, registro } = crearPedido(
      vacio(),
      clienteDemo,
      entrada('TRANSFERENCIA'),
    );
    expect(registro.estadoPago).toBe('PENDIENTE');
    const pagado = pagarPedido(datos, clienteDemo, registro.id);
    expect(pagado.pedidos[0].estadoPago).toBe('PAGADO');
    expect(stockDisponible(pagado, 'MC001')).toBe(78);
    expect(() => pagarPedido(pagado, clienteDemo, registro.id)).toThrow();
  });
  it('cancelar un pedido pendiente devuelve sus existencias', () => {
    const { datos, registro } = crearPedido(
      vacio(),
      clienteDemo,
      entrada('TRANSFERENCIA'),
    );
    const cancelado = cancelarPedido(datos, clienteDemo, registro.id);
    expect(stockDisponible(cancelado, 'MC001')).toBe(80);
    expect(() => cancelarPedido(cancelado, clienteDemo, registro.id)).toThrow();
  });
  it('otro cliente no puede pagar ni cancelar una compra ajena', () => {
    const { datos, registro } = crearPedido(
      vacio(),
      clienteDemo,
      entrada('TRANSFERENCIA'),
    );
    const otro = { ...clienteDemo, id: 'otro' };
    expect(() => pagarPedido(datos, otro, registro.id)).toThrow();
    expect(() => cancelarPedido(datos, otro, registro.id)).toThrow();
  });
});

describe('Reservas conectadas con compras', () => {
  it('una reserva activa ocupa stock y cancelarla lo libera', () => {
    const { datos, registro } = crearReserva(vacio(), clienteDemo, entrada());
    expect(stockDisponible(datos, 'MC001')).toBe(78);
    expect(
      stockDisponible(
        cancelarReserva(datos, clienteDemo, registro.id),
        'MC001',
      ),
    ).toBe(80);
  });
  it('una reserva vencida libera stock y no puede comprarse', () => {
    const { datos, registro } = crearReserva(vacio(), clienteDemo, entrada());
    const vencida = { ...registro, vence: '2020-01-01T00:00:00Z' };
    const expirado = { ...datos, reservas: [vencida] };
    expect(estadoReserva(vencida)).toBe('VENCIDA');
    expect(stockDisponible(expirado, 'MC001')).toBe(80);
    expect(() =>
      crearPedido(expirado, clienteDemo, {
        ...entrada(),
        reservaId: vencida.id,
      }),
    ).toThrow(/reserva/);
  });
  it('pagar la reserva la convierte en compra sin descontar el stock dos veces', () => {
    const reserva = crearReserva(vacio(), clienteDemo, entrada());
    const compra = crearPedido(reserva.datos, clienteDemo, {
      ...entrada(),
      reservaId: reserva.registro.id,
    });
    expect(compra.datos.reservas[0].estado).toBe('COMPRADA');
    expect(compra.datos.reservas[0].pedidoId).toBe(compra.registro.id);
    expect(stockDisponible(compra.datos, 'MC001')).toBe(78);
  });
});

describe('Cuenta corriente', () => {
  it('comprar a cuenta aumenta el saldo y abonar lo disminuye', () => {
    const compra = crearPedido(
      vacio(),
      clienteDemo,
      entrada('CUENTA_CORRIENTE'),
    );
    expect(saldoCuenta(compra.datos, clienteDemo.id)).toBe(11980);
    const abono = registrarAbono(compra.datos, clienteDemo, 1000, 'abono-1');
    expect(saldoCuenta(abono, clienteDemo.id)).toBe(10980);
    const reintento = registrarAbono(abono, clienteDemo, 1000, 'abono-1');
    expect(reintento.abonos).toHaveLength(1);
    const completo = registrarAbono(reintento, clienteDemo, 10980, 'abono-2');
    expect(saldoCuenta(completo, clienteDemo.id)).toBe(0);
    expect(completo.pedidos[0].estadoPago).toBe('PAGADO');
  });
  it('no acepta compras por encima del crédito ni abonos sobre la deuda', () => {
    expect(() =>
      crearPedido(
        vacio(),
        { ...clienteDemo, lineaCredito: 1000 },
        entrada('CUENTA_CORRIENTE'),
      ),
    ).toThrow(/crédito/);
    expect(() => registrarAbono(vacio(), clienteDemo, 1000, 'abono')).toThrow(
      /deuda/,
    );
  });
  it('un pedido parcialmente abonado no se puede cancelar', () => {
    const compra = crearPedido(
      vacio(),
      clienteDemo,
      entrada('CUENTA_CORRIENTE'),
    );
    const datos = registrarAbono(compra.datos, clienteDemo, 1000, 'abono');
    expect(() =>
      cancelarPedido(datos, clienteDemo, compra.registro.id),
    ).toThrow();
  });
  it('el saldo solo corresponde al cliente que realizó las compras', () => {
    const { datos } = crearPedido(
      vacio(),
      clienteDemo,
      entrada('CUENTA_CORRIENTE'),
    );
    expect(saldoCuenta(datos, 'otro-cliente')).toBe(0);
  });
  it('recupera un almacenamiento inválido sin romper las pantallas', () => {
    expect(validarDatos({ pedidos: {}, reservas: null })).toEqual(vacio());
  });
});
