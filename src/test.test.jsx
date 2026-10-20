import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { ProductCard } from './components/ProductCard';
import { Navbar } from './components/Navbar';
import { Login } from './pages/Login';
import { ProveedorCarrito } from './context/ContextoCarrito';
import { ProveedorAut } from './context/ContextoAutenticacion';

afterEach(cleanup);

// MOCK DE DATOS
const productoDisponible = {
  id: 'MC001',
  nombre: 'Cemento Polpaico 25 kg',
  precio: '$5.990',
  stock: 80,
  disponible: true,
  imagen: '/assets/img/cemento.jpg',
};

const productoAgotado = {
  id: 'MC002',
  nombre: 'Martillo Carpintero',
  precio: '$7.990',
  stock: 0,
  disponible: false,
  imagen: '/assets/img/martillo.jpg',
};

// ==========================================
// 1. PRUEBAS DE RENDERIZADO (2 Tests)
// ==========================================
describe('Pruebas de Renderizado', () => {
  it('Test 1: Renderiza el nombre y precio del producto en ProductCard', () => {
    render(
      <ProveedorCarrito>
        <ProductCard {...productoDisponible} />
      </ProveedorCarrito>
    );

    expect(screen.getByText('Cemento Polpaico 25 kg')).toBeTruthy();
    expect(screen.getByText('$5.990')).toBeTruthy();
  });

  it('Test 2: Renderiza los enlaces principales de navegación en Navbar', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText('Inicio')).toBeTruthy();
    expect(screen.getByText(/cat/i)).toBeTruthy();
    expect(screen.getByText(/reservar/i)).toBeTruthy();
  });
});

// ==========================================
// 2. PRUEBAS DE RENDERIZADO CONDICIONAL (2 Tests)
// ==========================================
describe('Pruebas de Renderizado Condicional', () => {
  it('Test 3: Muestra el botón habilitado cuando hay stock disponible', () => {
    render(
      <ProveedorCarrito>
        <ProductCard {...productoDisponible} />
      </ProveedorCarrito>
    );

    const boton = screen.getByRole('button', { name: /agregar al carrito/i });
    expect(boton).toBeTruthy();
    expect(boton.disabled).toBe(false);
  });

  it('Test 4: Muestra el estado Agotado y deshabilita el botón cuando no hay stock', () => {
    render(
      <ProveedorCarrito>
        <ProductCard {...productoAgotado} />
      </ProveedorCarrito>
    );

    expect(screen.getByText(/agotado/i)).toBeTruthy();
    const botonAgotado = screen.getByRole('button', { name: /sin stock/i });
    expect(botonAgotado.disabled).toBe(true);
  });
});

// ==========================================
// 3. PRUEBAS DE PROPIEDADES / PROPS (2 Tests)
// ==========================================
describe('Pruebas de Propiedades (Props)', () => {
  it('Test 5: ProductCard recibe y muestra la cantidad de stock correcta vía props', () => {
    render(
      <ProveedorCarrito>
        <ProductCard {...productoDisponible} />
      </ProveedorCarrito>
    );

    expect(screen.getByText('Stock: 80 unidades')).toBeTruthy();
  });

  it('Test 6: ProductCard asigna la ruta e imagen pasadas por props', () => {
    render(
      <ProveedorCarrito>
        <ProductCard {...productoDisponible} />
      </ProveedorCarrito>
    );

    const imagen = screen.getByRole('img');
    expect(imagen.getAttribute('src')).toBe('/assets/img/cemento.jpg');
    expect(imagen.getAttribute('alt')).toBe('Cemento Polpaico 25 kg');
  });
});

// ==========================================
// 4. PRUEBAS DE ESTADO Y EVENTOS (4 Tests)
// ==========================================
describe('Pruebas de Estado y Eventos', () => {
  it('Test 7: Actualiza el estado del input de correo al escribir en el Login', () => {
    render(
      <ProveedorAut>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </ProveedorAut>
    );

    const inputCorreo = screen.getByLabelText(/correo/i);
    fireEvent.change(inputCorreo, { target: { value: 'cliente@ferreteria.cl' } });
    expect(inputCorreo.value).toBe('cliente@ferreteria.cl');
  });

  it('Test 8: Actualiza el estado del input de contraseña en el Login', () => {
    render(
      <ProveedorAut>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </ProveedorAut>
    );

    const inputClave = screen.getByLabelText(/contrase/i);
    fireEvent.change(inputClave, { target: { value: '123456' } });
    expect(inputClave.value).toBe('123456');
  });

  it('Test 9: Muestra mensaje de error al enviar formulario de Login vacío', () => {
    render(
      <ProveedorAut>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </ProveedorAut>
    );

    const botonIngresar = screen.getByRole('button', { name: /ingresar/i });
    fireEvent.click(botonIngresar);
    expect(screen.getByText(/correo.*obligatorio/i)).toBeTruthy();
  });

  it('Test 10: Ejecuta el evento de agregar al carrito al hacer clic en el botón', () => {
    render(
      <ProveedorCarrito>
        <ProductCard {...productoDisponible} />
      </ProveedorCarrito>
    );

    const boton = screen.getByRole('button', { name: /agregar al carrito/i });
    expect(() => fireEvent.click(boton)).not.toThrow();
  });
});
