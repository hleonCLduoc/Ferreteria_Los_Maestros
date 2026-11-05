import { productos } from '../data/productos';
import { ContextoProductos } from './productos';
export const ProveedorProductos = ({ children }) => (
  <ContextoProductos.Provider value={{ productos, listo: true }}>
    {children}
  </ContextoProductos.Provider>
);
