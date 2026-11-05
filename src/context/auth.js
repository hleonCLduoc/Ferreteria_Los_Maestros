import { createContext, useContext } from 'react';
export const ContextoAut = createContext({ usuario: null, cargando: false });
export const useAut = () => useContext(ContextoAut);
