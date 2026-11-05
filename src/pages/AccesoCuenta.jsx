import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAut } from '../context/auth';
import { Login } from './Login';
import { Registro } from './Registro';
export function AccesoCuenta() {
  const { usuario } = useAut();
  const location = useLocation();
  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const [registrado, setRegistrado] = useState(() => ({
    email: location.state?.email || '',
    mensaje: '',
  }));
  if (usuario) return <Navigate to="/cuentas" replace />;
  return (
    <section>
      <div className="encabezado-pagina encabezado-acceso">
        <h2>Mi cuenta</h2>
      </div>
      <div className="acceso-cuenta">
        {mostrarRegistro && (
          <button
            type="button"
            className="boton-secundario abrir-registro"
            aria-expanded={false}
            aria-controls="inicio-sesion"
            onClick={() => setMostrarRegistro(false)}
          >
            Iniciar sesión
            <span aria-hidden="true">+</span>
          </button>
        )}
        <div id="inicio-sesion" hidden={mostrarRegistro}>
          <Login
            key={registrado.email}
            integrado
            correoInicial={registrado.email}
            mensajeExito={registrado.mensaje}
          />
        </div>
        <div className="opcion-registro">
          <button
            type="button"
            className="boton-secundario abrir-registro"
            aria-expanded={mostrarRegistro}
            aria-controls="registro-cuenta"
            onClick={() => setMostrarRegistro(!mostrarRegistro)}
          >
            {mostrarRegistro ? 'Cerrar registro' : 'Crear cuenta'}
            <span aria-hidden="true">{mostrarRegistro ? '−' : '+'}</span>
          </button>
        </div>
        <div id="registro-cuenta" hidden={!mostrarRegistro}>
          {mostrarRegistro && (
            <Registro
              integrado
              onRegistrado={(cliente) => {
                setRegistrado({
                  email: cliente.email,
                  mensaje: 'Tu cuenta ya está creada.',
                });
                setMostrarRegistro(false);
              }}
            />
          )}
        </div>
      </div>
    </section>
  );
}
