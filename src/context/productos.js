import { createContext, useContext } from 'react';
export const ContextoProductos = createContext({ productos: [] });
export const useProductos = () => useContext(ContextoProductos);
