import { createContext, useContext, useState, useEffect } from 'react';

const ContextoCarrito = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useCarrito = () => useContext(ContextoCarrito);

export const ProveedorCarrito = ({ children }) => {
  const [carrito, setCarrito] = useState(() => {
    const guardado = localStorage.getItem('carrito_ferreteria');
    return guardado ? JSON.parse(guardado) : [];
  });

  useEffect(() => {
    localStorage.setItem('carrito_ferreteria', JSON.stringify(carrito));
  }, [carrito]);

  const agregarAlCarrito = (producto) => {
    setCarrito((prev) => {
      const existe = prev.find((item) => item.id === producto.id);
      if (existe) {
        return prev.map((item) =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  const actualizarCantidad = (id, cambio) => {
    setCarrito((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nuevaCantidad = item.cantidad + cambio;
          return nuevaCantidad > 0 ? { ...item, cantidad: nuevaCantidad } : item;
        }
        return item;
      })
    );
  };

  const eliminarDelCarrito = (id) => {
    setCarrito((prev) => prev.filter((item) => item.id !== id));
  };

  const vaciarCarrito = () => setCarrito([]);

  const totalProductos = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  const precioTotal = carrito.reduce((acc, item) => {
    const precioNumerico = parseInt(item.precio.replace(/[^0-9]/g, ''), 10) || 0;
    return acc + precioNumerico * item.cantidad;
  }, 0);

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