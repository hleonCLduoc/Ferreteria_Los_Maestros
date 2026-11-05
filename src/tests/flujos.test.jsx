import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { webcrypto } from 'node:crypto';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ProveedorAut } from '../context/ContextoAutenticacion';
import { ProveedorCarrito, leerCarrito } from '../context/ContextoCarrito';
import { ContextoAut, useAut } from '../context/auth';
import { useCarrito } from '../context/carrito';
import { ContextoProductos } from '../context/productos';
import { RutaProtegida } from '../components/RutaProtegida';
import { ProductCard } from '../components/ProductCard';
import { Login } from '../pages/Login';
import { rutValido } from '../services/validaciones';

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  vi.stubGlobal('crypto', webcrypto);
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

const producto = {
  id: 'MC001',
  nombre: 'Cemento',
  precio: '$5.990',
  precioNumero: 5990,
  stock: 2,
  disponible: true,
  imagen: '/assets/img/cemento.jpg',
};
function Resumen() {
  const { totalProductos, precioTotal } = useCarrito();
  return (
    <output aria-label="Resumen">
      {totalProductos} unidades, total {precioTotal}
    </output>
  );
}

describe('Carrito persistente', () => {
  it('recupera un carrito corrupto sin bloquear la aplicación', () => {
    localStorage.setItem('prueba', '{no-es-json');
    expect(leerCarrito('prueba')).toEqual([]);
    localStorage.setItem('prueba', JSON.stringify({ cantidad: 1 }));
    expect(leerCarrito('prueba')).toEqual([]);
  });

  it('calcula totales y respeta la última unidad disponible', () => {
    render(
      <ProveedorCarrito>
        <ProductCard {...producto} />
        <Resumen />
      </ProveedorCarrito>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Agregar al carrito' }));
    expect(screen.getByLabelText('Resumen').textContent).toBe(
      '1 unidades, total 5990',
    );
    fireEvent.click(screen.getByRole('button', { name: 'Agregar al carrito' }));
    expect(screen.getByLabelText('Resumen').textContent).toBe(
      '2 unidades, total 11980',
    );
    expect(
      screen.getByRole('button', { name: 'Stock máximo en carrito' }).disabled,
    ).toBe(true);
  });

  it('actualiza el precio y limita cantidades al restaurar inventario', () => {
    localStorage.setItem(
      'carrito_ferreteria_cliente',
      JSON.stringify([
        { ...producto, precioNumero: 1000, stock: 10, cantidad: 7 },
      ]),
    );
    render(
      <ContextoProductos.Provider value={{ productos: [producto] }}>
        <ProveedorCarrito usuarioId="cliente">
          <Resumen />
        </ProveedorCarrito>
      </ContextoProductos.Provider>,
    );
    expect(screen.getByLabelText('Resumen').textContent).toBe(
      '2 unidades, total 11980',
    );
  });

  it('separa el carrito de cada cliente', () => {
    localStorage.setItem(
      'carrito_ferreteria_otro',
      JSON.stringify([{ ...producto, cantidad: 1 }]),
    );
    render(
      <ProveedorCarrito usuarioId="cliente">
        <Resumen />
      </ProveedorCarrito>,
    );
    expect(screen.getByLabelText('Resumen').textContent).toBe(
      '0 unidades, total 0',
    );
  });
});

describe('Acceso a las pantallas', () => {
  it('envía un visitante al login', () => {
    render(
      <ContextoAut.Provider value={{ usuario: null, cargando: false }}>
        <MemoryRouter initialEntries={['/admin']}>
          <Routes>
            <Route path="/cuentas" element={<p>Acceso de clientes</p>} />
            <Route element={<RutaProtegida />}>
              <Route path="/admin" element={<p>Panel privado</p>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </ContextoAut.Provider>,
    );
    expect(screen.getByText('Acceso de clientes')).toBeTruthy();
    expect(screen.queryByText('Panel privado')).toBeNull();
  });

  it('registra e inicia sesión en memoria sin hacer solicitudes HTTP', async () => {
    const fetch = vi.spyOn(globalThis, 'fetch');
    function PrepararRegistro() {
      const { registrarUsuario } = useAut();
      return (
        <button
          onClick={() =>
            registrarUsuario({
              razonSocial: 'Cliente de prueba',
              rut: '12345678-5',
              email: 'cliente@example.com',
              password: 'ClaveSegura123',
            })
          }
        >
          Registrar cliente de prueba
        </button>
      );
    }
    render(
      <ProveedorAut>
        <PrepararRegistro />
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/cuentas" element={<p>Sesión iniciada</p>} />
          </Routes>
        </MemoryRouter>
      </ProveedorAut>,
    );
    fireEvent.click(
      screen.getByRole('button', { name: 'Registrar cliente de prueba' }),
    );
    await waitFor(() =>
      expect(localStorage.getItem('clientes_los_maestros_v1')).not.toBeNull(),
    );
    fireEvent.change(screen.getByLabelText('Correo electrónico:'), {
      target: { value: 'cliente@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Contraseña:'), {
      target: { value: 'ClaveSegura123' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }));
    await waitFor(() =>
      expect(screen.getByText('Sesión iniciada')).toBeTruthy(),
    );
    expect(fetch).not.toHaveBeenCalled();
    expect(sessionStorage.getItem('sesion_ferreteria')).toBeNull();
  });
});

it('valida el dígito verificador del RUT', () => {
  expect(rutValido('12.345.678-5')).toBe(true);
  expect(rutValido('12.345.678-0')).toBe(false);
});
