import { useEffect, useRef, useState } from 'react';
import { ContextoAut } from './auth';
import {
  clienteDemo,
  claveDemo,
  adminDemo,
  claveAdmin,
  CREDITO_INICIAL,
} from '../data/clienteDemo';
import { leerJSON, guardarJSON } from '../services/almacenamiento';
import { rutValido } from '../services/validaciones';
import { CLAVE_COMPRAS, validarDatos, saldoCuenta } from '../services/compras';
const CLAVE_USUARIOS = 'clientes_los_maestros_v1';
const CLAVE_SESION = 'cliente_actual_los_maestros';
const CLAVE_AJUSTES = 'ajustes_cuentas_los_maestros_v1';
const normalizarRut = (rut) => rut.replace(/[.\s-]/g, '').toUpperCase();
function leerUsuarios() {
  const lista = leerJSON(CLAVE_USUARIOS, []);
  return Array.isArray(lista)
    ? lista.filter(
        (u) =>
          u &&
          typeof u.id === 'string' &&
          typeof u.email === 'string' &&
          typeof u.razonSocial === 'string' &&
          typeof u.rut === 'string' &&
          typeof u.hash === 'string' &&
          typeof u.sal === 'string',
      )
    : [];
}
function leerAjustes() {
  const datos = leerJSON(CLAVE_AJUSTES, {});
  return datos && typeof datos === 'object' && !Array.isArray(datos)
    ? datos
    : {};
}
function perfil(u, ajustes = leerAjustes()) {
  const ajuste = ajustes[u.id];
  return {
    id: u.id,
    razonSocial: u.razonSocial,
    rut: u.rut,
    email: u.email,
    rol: u.id === adminDemo.id ? 'ADMIN' : 'CLIENTE',
    lineaCredito:
      Number.isSafeInteger(ajuste?.lineaCredito) && ajuste.lineaCredito >= 0
        ? ajuste.lineaCredito
        : CREDITO_INICIAL,
    activo: ajuste?.activo !== false,
  };
}
function sesionInicial() {
  const id =
    leerJSON(CLAVE_SESION, null, sessionStorage) ||
    leerJSON(CLAVE_SESION, null);
  const u = [adminDemo, clienteDemo, ...leerUsuarios()].find(
    (u) => u.id === id,
  );
  if (!u) return null;
  const p = perfil(u);
  return p.activo ? p : null;
}
async function huella(password, sal) {
  const bytes = new TextEncoder().encode(`${sal}:${password}`);
  const resultado = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(resultado), (n) =>
    n.toString(16).padStart(2, '0'),
  ).join('');
}
function validarClave(password) {
  if (
    typeof password !== 'string' ||
    password.length < 8 ||
    password.length > 72
  )
    throw new Error('La contraseña debe tener entre 8 y 72 caracteres.');
}
export const ProveedorAut = ({ children }) => {
  const [usuario, setUsuario] = useState(sesionInicial);
  const [ajustes, setAjustes] = useState(leerAjustes);
  const [clientesRegistrados, setClientesRegistrados] = useState(leerUsuarios);
  const usuarios = useRef(clientesRegistrados);
  const usuarioActual = useRef(usuario);
  const actualizarSesion = (u) => {
    usuarioActual.current = u;
    setUsuario(u);
  };
  useEffect(() => {
    const sincronizar = (e) => {
      if (e.key === CLAVE_USUARIOS || e.key === null) {
        const lista = leerUsuarios();
        usuarios.current = lista;
        setClientesRegistrados(lista);
      }
      if (e.key === CLAVE_AJUSTES || e.key === null) {
        const nuevos = leerAjustes();
        setAjustes(nuevos);
        if (usuarioActual.current) {
          const p = perfil(usuarioActual.current, nuevos);
          usuarioActual.current = p.activo ? p : null;
          setUsuario(usuarioActual.current);
          if (!p.activo) {
            localStorage.removeItem(CLAVE_SESION);
            sessionStorage.removeItem(CLAVE_SESION);
          }
        }
      }
    };
    window.addEventListener('storage', sincronizar);
    return () => window.removeEventListener('storage', sincronizar);
  }, []);
  const registrarUsuario = async (nuevo) => {
    const email = nuevo.email.trim().toLowerCase();
    if (!nuevo.razonSocial.trim() || !rutValido(nuevo.rut))
      throw new Error('Revisa tu nombre y RUT.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      throw new Error('Ingresa un correo válido.');
    validarClave(nuevo.password);
    const sal = crypto.randomUUID();
    const hash = await huella(nuevo.password, sal);
    usuarios.current = leerUsuarios();
    const lista = [...usuarios.current, clienteDemo, adminDemo];
    if (
      lista.some(
        (u) =>
          u.email === email ||
          normalizarRut(u.rut) === normalizarRut(nuevo.rut),
      )
    )
      throw new Error('Ya existe una cuenta con ese correo o RUT.');
    const u = {
      id: crypto.randomUUID(),
      razonSocial: nuevo.razonSocial.trim(),
      rut: nuevo.rut.trim(),
      email,
      sal,
      hash,
      lineaCredito: CREDITO_INICIAL,
    };
    const siguientes = [...usuarios.current, u];
    guardarJSON(CLAVE_USUARIOS, siguientes);
    usuarios.current = siguientes;
    setClientesRegistrados(siguientes);
    return perfil(u);
  };
  const iniciarSesion = async (email, password, recordar = true) => {
    const correo = email.trim().toLowerCase();
    let encontrado;
    const guardados = leerUsuarios();
    usuarios.current = guardados;
    setClientesRegistrados(guardados);
    if (correo === clienteDemo.email && password === claveDemo)
      encontrado = clienteDemo;
    else if (correo === adminDemo.email && password === claveAdmin)
      encontrado = adminDemo;
    else {
      usuarios.current = leerUsuarios();
      const u = usuarios.current.find((u) => u.email === correo);
      if (u && (await huella(password, u.sal)) === u.hash) encontrado = u;
    }
    if (!encontrado) throw new Error('El correo o la contraseña no coinciden.');
    const p = perfil(encontrado);
    if (!p.activo)
      throw new Error('Tu cuenta está desactivada. Contacta al administrador.');
    if (recordar) guardarJSON(CLAVE_SESION, p.id);
    else localStorage.removeItem(CLAVE_SESION);
    guardarJSON(CLAVE_SESION, p.id, sessionStorage);
    actualizarSesion(p);
    return p;
  };
  const cerrarSesion = () => {
    localStorage.removeItem(CLAVE_SESION);
    sessionStorage.removeItem(CLAVE_SESION);
    actualizarSesion(null);
  };
  const actualizarCuenta = (id, cambios) => {
    if (usuarioActual.current?.rol !== 'ADMIN')
      throw new Error('Solo el administrador puede gestionar las cuentas.');
    const cliente = [clienteDemo, ...leerUsuarios()].find((u) => u.id === id);
    if (!cliente) throw new Error('Cliente no encontrado.');
    const limite = Number(cambios.lineaCredito);
    const saldo = saldoCuenta(validarDatos(leerJSON(CLAVE_COMPRAS, null)), id);
    if (!Number.isSafeInteger(limite) || limite < 0 || limite > 100000000)
      throw new Error(
        'Ingresa un cupo entre $0 y $100.000.000, sin decimales.',
      );
    if (limite < saldo)
      throw new Error(
        'El cupo no puede ser menor al saldo utilizado por el cliente.',
      );
    if (typeof cambios.activo !== 'boolean')
      throw new Error('Revisa el estado de la cuenta.');
    const siguientes = {
      ...leerAjustes(),
      [id]: { lineaCredito: limite, activo: cambios.activo },
    };
    guardarJSON(CLAVE_AJUSTES, siguientes);
    setAjustes(siguientes);
  };
  const restablecerClave = async ({ email, rut, password }) => {
    validarClave(password);
    const lista = leerUsuarios();
    const correo = email.trim().toLowerCase();
    if ([clienteDemo.email, adminDemo.email].includes(correo))
      throw new Error(
        'Las cuentas de ejemplo conservan la contraseña indicada para las pruebas.',
      );
    const u = lista.find(
      (u) => u.email === correo && normalizarRut(u.rut) === normalizarRut(rut),
    );
    if (!u)
      throw new Error(
        'El correo y RUT no coinciden con una cuenta.',
      );
    const sal = crypto.randomUUID();
    const hash = await huella(password, sal);
    const siguientes = lista.map((cliente) =>
      cliente.id === u.id ? { ...cliente, sal, hash } : cliente,
    );
    guardarJSON(CLAVE_USUARIOS, siguientes);
    usuarios.current = siguientes;
    setClientesRegistrados(siguientes);
  };
  const clientes =
    usuario?.rol === 'ADMIN'
      ? [clienteDemo, ...clientesRegistrados].map((u) => perfil(u, ajustes))
      : [];
  return (
    <ContextoAut.Provider
      value={{
        usuario,
        iniciarSesion,
        registrarUsuario,
        cerrarSesion,
        clientes,
        actualizarCuenta,
        restablecerClave,
      }}
    >
      {children}
    </ContextoAut.Provider>
  );
};
export { useAut } from './auth';
