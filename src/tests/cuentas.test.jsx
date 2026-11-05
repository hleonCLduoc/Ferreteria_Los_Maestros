import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { webcrypto } from 'node:crypto';
import App from '../App';
import { clienteDemo } from '../data/clienteDemo';
import { CLAVE_COMPRAS, crearPedido, vacio } from '../services/compras';

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  vi.stubGlobal('crypto', webcrypto);
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  window.history.replaceState({}, '', '/cuentas');
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

function sesion(id) {
  sessionStorage.setItem('cliente_actual_los_maestros', JSON.stringify(id));
}
async function registrar() {
  fireEvent.click(screen.getByRole('button', { name: 'Crear cuenta', exact: true }));
  const panel = within(
    screen.getByRole('region', { name: 'Registrar una cuenta' }),
  );
  fireEvent.change(panel.getByLabelText('Razón social / Nombre completo'), {
    target: { value: 'Cliente Nuevo' },
  });
  fireEvent.change(panel.getByLabelText('RUT', { exact: true }), {
    target: { value: '12345678-5' },
  });
  fireEvent.change(
    panel.getByLabelText('Correo electrónico', { exact: true }),
    { target: { value: 'nuevo@example.cl' } },
  );
  fireEvent.change(panel.getByLabelText('Contraseña', { exact: true }), {
    target: { value: 'Prueba1234' },
  });
  fireEvent.change(panel.getByLabelText('Confirmar contraseña'), {
    target: { value: 'Prueba1234' },
  });
  fireEvent.click(panel.getByRole('button', { name: 'Crear mi cuenta' }));
  await waitFor(() =>
    expect(screen.getByRole('status').textContent).toMatch(
      /cuenta ya está creada/,
    ),
  );
}
async function ingresar(clave = 'Prueba1234') {
  fireEvent.change(
    screen.getByLabelText('Correo electrónico:', { exact: true }),
    { target: { value: 'nuevo@example.cl' } },
  );
  fireEvent.change(screen.getByLabelText('Contraseña:', { exact: true }), {
    target: { value: clave },
  });
  fireEvent.click(
    screen.getByRole('button', { name: 'Ingresar', exact: true }),
  );
  await waitFor(() =>
    expect(screen.getByRole('button', { name: 'Cerrar sesión' })).toBeTruthy(),
  );
}

it('el menú público solo muestra las cinco secciones y Mi cuenta reúne ingreso y registro', () => {
  render(<App />);
  expect(
    within(screen.getByRole('navigation', { name: 'Navegación principal' }))
      .getAllByRole('link')
      .map((a) => a.textContent),
  ).toEqual(['Inicio', 'Catálogo', 'Blog', 'Nosotros', 'Mi cuenta']);
  expect(screen.getByRole('heading', { name: 'Iniciar sesión' })).toBeTruthy();
  expect(screen.queryByRole('heading', { name: 'Registrar cuenta' })).toBeNull();
  const crear = screen.getByRole('button', { name: 'Crear cuenta', exact: true });
  expect(crear.getAttribute('aria-expanded')).toBe('false');
  fireEvent.click(crear);
  expect(screen.getByRole('heading', { name: 'Registrar cuenta' })).toBeTruthy();
  expect(screen.queryByRole('heading', { name: 'Iniciar sesión' })).toBeNull();
  fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión', exact: true }));
  expect(screen.getByRole('heading', { name: 'Iniciar sesión' })).toBeTruthy();
  expect(screen.queryByRole('heading', { name: 'Registrar cuenta' })).toBeNull();
});

it('registra, ingresa y conserva la sesión y el cupo de 100 mil al volver a montar la página', async () => {
  const vista = render(<App />);
  await registrar();
  expect(
    screen.getByLabelText('Correo electrónico:', { exact: true }).value,
  ).toBe('nuevo@example.cl');
  await ingresar();
  vista.unmount();
  render(<App />);
  expect(screen.getByRole('button', { name: 'Cerrar sesión' })).toBeTruthy();
  fireEvent.click(
    screen.getByRole('button', { name: 'Cuenta corriente', exact: true }),
  );
  expect(screen.getAllByText('$100.000').length).toBe(2);
  expect(
    JSON.parse(localStorage.getItem('clientes_los_maestros_v1'))[0].password,
  ).toBeUndefined();
});

it('un cliente no puede entrar a la administración por URL', () => {
  sesion('cliente-demo');
  window.history.replaceState({}, '', '/admin');
  render(<App />);
  expect(
    screen.getByRole('heading', { name: 'Acceso restringido' }),
  ).toBeTruthy();
});

it('el administrador cambia el cupo y el cliente recibe el nuevo valor al ingresar', async () => {
  sesion('admin-demo');
  const vista = render(<App />);
  fireEvent.click(
    screen.getByRole('button', { name: 'Gestionar cuenta de Juan Pérez' }),
  );
  fireEvent.change(screen.getByLabelText('Cupo de crédito (CLP)'), {
    target: { value: '250000' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }));
  expect(screen.getByRole('status').textContent).toMatch(/actualizada/);
  vista.unmount();
  sesion('cliente-demo');
  render(<App />);
  fireEvent.click(
    screen.getByRole('button', { name: 'Cuenta corriente', exact: true }),
  );
  expect(screen.getAllByText('$250.000').length).toBe(2);
});

it('el cupo no se puede reducir por debajo de la deuda', () => {
  const compra = crearPedido(vacio(), clienteDemo, {
    productos: [{ id: 'MC001', cantidad: 2 }],
    telefono: '+56912345678',
    entrega: 'RETIRO',
    metodo: 'CUENTA_CORRIENTE',
    clave: 'prueba-deuda',
  });
  localStorage.setItem(CLAVE_COMPRAS, JSON.stringify(compra.datos));
  sesion('admin-demo');
  render(<App />);
  fireEvent.click(
    screen.getByRole('button', { name: 'Gestionar cuenta de Juan Pérez' }),
  );
  fireEvent.change(screen.getByLabelText('Cupo de crédito (CLP)'), {
    target: { value: '1000' },
  });
  fireEvent.submit(
    screen.getByRole('button', { name: 'Guardar cambios' }).closest('form'),
  );
  expect(screen.getByRole('alert').textContent).toMatch(/saldo utilizado/);
  expect(localStorage.getItem('ajustes_cuentas_los_maestros_v1')).toBeNull();
});

it('una cuenta desactivada por el administrador no puede iniciar sesión', async () => {
  sesion('admin-demo');
  render(<App />);
  fireEvent.click(
    screen.getByRole('button', { name: 'Gestionar cuenta de Juan Pérez' }),
  );
  fireEvent.click(screen.getByLabelText('Cuenta activa'));
  fireEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }));
  fireEvent.click(screen.getByRole('button', { name: 'Cerrar sesión' }));
  fireEvent.change(screen.getByLabelText('Correo electrónico:', { exact: true }), {
    target: { value: clienteDemo.email },
  });
  fireEvent.change(screen.getByLabelText('Contraseña:', { exact: true }), {
    target: { value: 'Demo1234' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }));
  await waitFor(() =>
    expect(screen.getByRole('alert').textContent).toMatch(/desactivada/),
  );
});

it('recupera una contraseña local con correo y RUT y permite ingresar con la nueva clave', async () => {
  render(<App />);
  await registrar();
  fireEvent.click(
    screen.getByRole('button', { name: '¿Olvidaste tu contraseña?' }),
  );
  fireEvent.change(screen.getByLabelText('Correo de tu cuenta'), {
    target: { value: 'nuevo@example.cl' },
  });
  fireEvent.change(screen.getByLabelText('RUT de la cuenta'), {
    target: { value: '12345678-5' },
  });
  fireEvent.change(screen.getByLabelText('Nueva contraseña', { exact: true }), {
    target: { value: 'NuevaPrueba123' },
  });
  fireEvent.change(screen.getByLabelText('Confirmar nueva contraseña'), {
    target: { value: 'NuevaPrueba123' },
  });
  fireEvent.click(
    screen.getByRole('button', { name: 'Actualizar contraseña' }),
  );
  await waitFor(() =>
    expect(screen.getByRole('status').textContent).toMatch(
      /Contraseña actualizada/,
    ),
  );
  await ingresar('NuevaPrueba123');
});
