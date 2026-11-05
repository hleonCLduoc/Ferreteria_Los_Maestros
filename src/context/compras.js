import { createContext, useContext } from 'react';
export const ContextoCompras = createContext(null);
export const useCompras = () => useContext(ContextoCompras);
