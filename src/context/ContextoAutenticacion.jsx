import { useState } from 'react';
import { ContextoAut } from './auth';
import { rutValido } from '../services/validaciones';
export const ProveedorAut = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [usuariosRegistrados, setUsuariosRegistrados] = useState([]);
  const registrarUsuario = (nuevo) => {
    const email = nuevo.email.trim().toLowerCase();
    const rut = nuevo.rut.replace(/[.\s-]/g, '').toUpperCase();
    if (!nuevo.razonSocial.trim() || !rutValido(nuevo.rut))
      throw new Error('Revisa tu nombre y RUT.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      throw new Error('Ingresa un correo válido.');
    if (nuevo.password.length < 8)
      throw new Error('La contraseña debe tener al menos 8 caracteres.');
    if (
      usuariosRegistrados.some(
        (u) =>
          u.email === email ||
          u.rut.replace(/[.\s-]/g, '').toUpperCase() === rut,
      )
    )
      throw new Error(
        'El correo o RUT ya está registrado en esta demostración.',
      );
    setUsuariosRegistrados((prev) => [
      ...prev,
      { ...nuevo, razonSocial: nuevo.razonSocial.trim(), email },
    ]);
  };
  const iniciarSesion = (email, password) => {
    const encontrado = usuariosRegistrados.find(
      (u) => u.email === email.trim().toLowerCase() && u.password === password,
    );
    if (!encontrado)
      throw new Error('Usuario no registrado o credenciales incorrectas.');
    const fecha = new Date();
    const vencimiento = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0);
    setUsuario({
      razonSocial: encontrado.razonSocial,
      rut: encontrado.rut,
      email: encontrado.email,
      lineaCredito: 2500000,
      saldoUtilizado: 0,
      proximoVencimiento: vencimiento.toLocaleDateString('es-CL'),
    });
    return true;
  };
  const cerrarSesion = () => setUsuario(null);
  return (
    <ContextoAut.Provider
      value={{ usuario, iniciarSesion, registrarUsuario, cerrarSesion }}
    >
      {children}
    </ContextoAut.Provider>
  );
};
export { useAut } from './auth';
