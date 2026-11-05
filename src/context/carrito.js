import { createContext, useContext } from 'react';
export const ContextoCarrito = createContext();
export const useCarrito = () => useContext(ContextoCarrito);
