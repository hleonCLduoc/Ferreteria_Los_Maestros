import { createContext, useContext, useState, useEffect } from 'react';
import { productos as productosIniciales } from '../data/productos';

const ContextoCarrito = createContext();

export const useCarrito = () => useContext(ContextoCarrito);

export const ProveedorCarrito = ({ children }) => {
  const [productos, setProductos] = useState(() => {
    const guardado = localStorage.getItem('productos_ferreteria');
    return guardado ? JSON.parse(guardado) : productosIniciales;
  });

  const [carrito, setCarrito] = useState(() => {
    const guardado = localStorage.getItem('carrito_ferreteria');
    return guardado ? JSON.parse(guardado) : [];
  });

  useEffect(() => {
    localStorage.setItem('productos_ferreteria', JSON.stringify(productos));
  }, [productos]);

  useEffect(() => {
    localStorage.setItem('carrito_ferreteria', JSON.stringify(carrito));
  }, [carrito]);

  const agregarAlCarrito = (producto) => {
    const prodActual = productos.find((p) => p.id === producto.id);
    if (!prodActual || prodActual.stock <= 0) {
      alert('Producto agotado o sin stock disponible.');
      return false;
    }

    setProductos((prev) =>
      prev.map((item) =>
        item.id === producto.id
          ? { ...item, stock: item.stock - 1, disponible: item.stock - 1 > 0 }
          : item
      )
    );

    setCarrito((prev) => {
      const existe = prev.find((item) => item.id === producto.id);
      if (existe) {
        return prev.map((item) =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });

    return true;
  };

  const actualizarCantidad = (id, cambio) => {
    const prodStock = productos.find((p) => p.id === id);

    if (cambio > 0 && prodStock.stock <= 0) {
      alert('No hay más unidades disponibles en stock.');
      return;
    }

    setProductos((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, stock: item.stock - cambio, disponible: item.stock - cambio > 0 }
          : item
      )
    );

    setCarrito((prev) =>
      prev
        .map((item) => {
          if (item.id !== id) return item;
          const nuevaCant = item.cantidad + cambio;
          return nuevaCant > 0 ? { ...item, cantidad: nuevaCant } : null;
        })
        .filter(Boolean)
    );
  };

  const eliminarDelCarrito = (id) => {
    const itemCarrito = carrito.find((item) => item.id === id);
    if (itemCarrito) {
      setProductos((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, stock: item.stock + itemCarrito.cantidad, disponible: true }
            : item
        )
      );
    }
    setCarrito((prev) => prev.filter((item) => item.id !== id));
  };

  const vaciarCarrito = (devolverStock = false) => {
    if (devolverStock) {
      setProductos((prev) =>
        prev.map((prod) => {
          const itemInCart = carrito.find((c) => c.id === prod.id);
          if (itemInCart) {
            const stockRestaurado = prod.stock + itemInCart.cantidad;
            return { ...prod, stock: stockRestaurado, disponible: true };
          }
          return prod;
        })
      );
    }
    setCarrito([]);
  };

  const totalProductos = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  const precioTotal = carrito.reduce((acc, item) => acc + item.precioNumero * item.cantidad, 0);

  return (
    <ContextoCarrito.Provider
      value={{
        productos,
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