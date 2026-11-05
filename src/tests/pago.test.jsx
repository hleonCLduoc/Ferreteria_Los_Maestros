import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { webcrypto } from 'node:crypto';
import App from '../App';
import { CLAVE_COMPRAS } from '../services/compras';
import { productos } from '../data/productos';

beforeEach(() => {
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  localStorage.clear();
  sessionStorage.clear();
  vi.stubGlobal('crypto', webcrypto);
  localStorage.setItem(
    'cliente_actual_los_maestros',
    JSON.stringify('cliente-demo'),
  );
  localStorage.setItem(
    'carrito_ferreteria',
    JSON.stringify([{ ...productos[0], cantidad: 1 }]),
  );
  window.history.replaceState({}, '', '/pago');
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

it('un pago rechazado conserva el carrito y permite reintentar hasta obtener el comprobante', async () => {
  render(<App />);
  fireEvent.change(screen.getByLabelText('Teléfono de contacto'), {
    target: { value: '+56912345678' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Continuar al pago' }));
  fireEvent.click(screen.getByLabelText('Rechazar pago'));
  fireEvent.click(screen.getByRole('button', { name: /Pagar/ }));
  await waitFor(
    () => expect(screen.getByRole('alert').textContent).toMatch(/rechazado/),
    { timeout: 2500 },
  );
  expect(localStorage.getItem(CLAVE_COMPRAS)).toBeNull();
  expect(JSON.parse(localStorage.getItem('carrito_ferreteria'))).toHaveLength(
    1,
  );
  fireEvent.click(screen.getByLabelText('Aprobar pago'));
  fireEvent.click(screen.getByRole('button', { name: /Pagar/ }));
  await waitFor(
    () =>
      expect(
        screen.getByRole('heading', { name: '¡Compra completada!' }),
      ).toBeTruthy(),
    { timeout: 2500 },
  );
  const datos = JSON.parse(localStorage.getItem(CLAVE_COMPRAS));
  expect(datos.pedidos).toHaveLength(1);
  expect(datos.pedidos[0].estadoPago).toBe('PAGADO');
  expect(JSON.parse(localStorage.getItem('carrito_ferreteria'))).toEqual([]);
});
