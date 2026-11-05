import { productos as catalogo } from '../data/productos';
import { ContextoProductos } from './productos';
import { useCompras } from './compras';
export const ProveedorProductos = ({ children }) => {
  const compras = useCompras();
  const productos = catalogo.map((p) => {
    const stock = compras ? compras.disponible(p.id) : p.stock;
    return { ...p, stock, disponible: p.disponible && stock > 0 };
  });
  return (
    <ContextoProductos.Provider value={{ productos, listo: true }}>
      {children}
    </ContextoProductos.Provider>
  );
};
