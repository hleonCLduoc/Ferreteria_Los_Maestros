import { useEffect, useState } from 'react';
import { ContextoCarrito } from './carrito';
import { useProductos } from './productos';
const valido = (item) =>
  item &&
  typeof item.id === 'string' &&
  Number.isInteger(item.cantidad) &&
  item.cantidad > 0 &&
  Number.isFinite(item.precioNumero) &&
  item.precioNumero >= 0 &&
  Number.isInteger(item.stock) &&
  item.stock >= item.cantidad;
export function leerCarrito(clave) {
  try {
    const data = JSON.parse(localStorage.getItem(clave) || '[]');
    return Array.isArray(data)
      ? data
          .filter(valido)
          .filter((p, i, a) => a.findIndex((x) => x.id === p.id) === i)
      : [];
  } catch {
    return [];
  }
}
export const ProveedorCarrito = ({ children, usuarioId = 'invitado' }) => {
  const clave =
    usuarioId === 'invitado'
      ? 'carrito_ferreteria'
      : `carrito_ferreteria_${usuarioId}`;
  const [guardado, setCarrito] = useState(() => leerCarrito(clave));
  const { productos, listo = productos.length > 0 } = useProductos();
  const carrito = listo
    ? guardado
        .map((item) => {
          const actual = productos.find((p) => p.id === item.id);
          return actual
            ? { ...actual, cantidad: Math.min(item.cantidad, actual.stock) }
            : null;
        })
        .filter((p) => p && p.disponible && p.cantidad > 0)
    : guardado;
  useEffect(() => {
    try {
      localStorage.setItem(clave, JSON.stringify(guardado));
    } catch {
      /* El carrito permanece disponible durante esta sesión. */
    }
  }, [clave, guardado]);
  const agregarAlCarrito = (producto) => {
    if (!producto.disponible || producto.stock <= 0) return;
    setCarrito((prev) => {
      const existe = prev.find((p) => p.id === producto.id);
      return existe
        ? prev.map((p) =>
            p.id === producto.id
              ? {
                  ...producto,
                  cantidad: Math.min(p.cantidad + 1, producto.stock),
                }
              : p,
          )
        : [...prev, { ...producto, cantidad: 1 }];
    });
  };
  const actualizarCantidad = (id, cambio) =>
    setCarrito((prev) =>
      prev.map((item) => {
        const actual = productos.find((p) => p.id === id) || item;
        const cantidad = Math.min(item.cantidad, actual.stock) + cambio;
        return item.id === id && cantidad >= 1 && cantidad <= actual.stock
          ? { ...actual, cantidad }
          : item;
      }),
    );
  const eliminarDelCarrito = (id) =>
    setCarrito((prev) => prev.filter((p) => p.id !== id));
  const vaciarCarrito = () => setCarrito([]);
  const totalProductos = carrito.reduce((s, p) => s + p.cantidad, 0);
  const precioTotal = carrito.reduce(
    (s, p) => s + p.precioNumero * p.cantidad,
    0,
  );
  return (
    <ContextoCarrito.Provider
      value={{
        carrito,
        agregarAlCarrito,
        actualizarCantidad,
        eliminarDelCarrito,
        vaciarCarrito,
        totalProductos,
        precioTotal,
      }}
    >
      {children}
    </ContextoCarrito.Provider>
  );
};

export { useCarrito } from './carrito';
