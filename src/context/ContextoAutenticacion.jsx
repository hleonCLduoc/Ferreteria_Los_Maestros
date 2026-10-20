import { createContext, useState, useContext } from 'react';

const ContextoAut = createContext();

export const ProveedorAut = ({ children }) => {
  // Acá guardamos quién está conectado (si es null, no hay nadie)
  const [usuario, setUsuario] = useState(null);
  
  // Nuestra "base de datos" de mentirita para ir guardando a los que se registran
  const [usuariosRegistrados, setUsuariosRegistrados] = useState([]);

  // Función para meter a un nuevo  a la lista
  const registrarUsuario = (nuevoUsuario) => {
    setUsuariosRegistrados([...usuariosRegistrados, nuevoUsuario]);
  };
  // Función para ver si lo dejamos entrar o no
  const iniciarSesion = (email, password) => {
    // Buscamos si hay alguien en la lista con ese mismo correo y clave
    const usuarioEncontrado = usuariosRegistrados.find(
      (u) => u.email === email && u.password === password
    );

    if (usuarioEncontrado) {
      // Si existe, le armamos su perfil y le pasamos crédito)
      setUsuario({
        razonSocial: usuarioEncontrado.razonSocial,
        rut: usuarioEncontrado.rut,
        lineaCredito: 2500000,
        saldoUtilizado: 0, // Parte limpiecito, sin deudas
        proximoVencimiento: "30 de Octubre, 2026",
      });
      return true; 
    } else {
      return false; // Falla no existe o se equivocó de clave
    }
  };

  //  cuando quiera salir
  const cerrarSesion = () => {
    setUsuario(null);
  };

  return (
    <ContextoAut.Provider value={{ usuario, iniciarSesion, cerrarSesion, registrarUsuario }}>
      {children}
    </ContextoAut.Provider>
  );
};

export const useAut = () => useContext(ContextoAut);