import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAut } from '../context/auth';
import { rutValido } from '../services/validaciones';
const vacio = { razonSocial: '', rut: '', email: '', password: '' };
export const Registro = ({ integrado = false, onRegistrado }) => {
  const [datos, setDatos] = useState(vacio),
    [confirmacion, setConfirmacion] = useState(''),
    [error, setError] = useState(''),
    [enviando, setEnviando] = useState(false);
  const { registrarUsuario } = useAut();
  const navigate = useNavigate();
  const location = useLocation();
  const enviar = async (e) => {
    e.preventDefault();
    setError('');
    if (!rutValido(datos.rut)) {
      setError('Revisa el RUT y su dígito verificador.');
      return;
    }
    if (datos.password !== confirmacion) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    setEnviando(true);
    try {
      const cliente = await registrarUsuario(datos);
      if (onRegistrado) {
        onRegistrado(cliente);
        setDatos(vacio);
        setConfirmacion('');
      } else
        navigate('/cuentas', {
          replace: true,
          state: {
            desde: location.state?.desde,
            email: cliente.email,
            mensaje: 'Tu cuenta está lista. Inicia sesión para continuar.',
          },
        });
    } catch (e) {
      setError(e.message);
    } finally {
      setEnviando(false);
    }
  };
  return (
    <section
      className="panel-acceso panel-registro"
      aria-label="Registrar una cuenta"
    >
      <h3>Registrar cuenta</h3>
      <form onSubmit={enviar}>
        <fieldset disabled={enviando}>
          {error && (
            <p role="alert" className="mensaje error">
              {error}
            </p>
          )}
          {Object.entries({
            razonSocial: 'Razón social / Nombre completo',
            rut: 'RUT',
            email: 'Correo electrónico',
            password: 'Contraseña',
          }).map(([campo, label]) => (
            <div className="grupo-formulario" key={campo}>
              <label htmlFor={`registro-${campo}`}>{label}</label>
              <input
                id={`registro-${campo}`}
                type={
                  campo === 'password'
                    ? 'password'
                    : campo === 'email'
                      ? 'email'
                      : 'text'
                }
                required
                maxLength={
                  campo === 'password' ? 72 : campo === 'rut' ? 12 : 200
                }
                minLength={campo === 'password' ? 8 : undefined}
                autoComplete={
                  campo === 'password'
                    ? 'new-password'
                    : campo === 'email'
                      ? 'email'
                      : campo === 'razonSocial'
                        ? 'name'
                        : undefined
                }
                value={datos[campo]}
                onChange={(e) =>
                  setDatos({ ...datos, [campo]: e.target.value })
                }
              />
            </div>
          ))}
          <div className="grupo-formulario">
            <label htmlFor="confirmacion-clave">Confirmar contraseña</label>
            <input
              id="confirmacion-clave"
              type="password"
              autoComplete="new-password"
              required
              value={confirmacion}
              onChange={(e) => setConfirmacion(e.target.value)}
            />
          </div>
          <p className="ayuda-formulario">
            Mínimo 8 caracteres.
          </p>
          <button className="boton-enviar">
            {enviando ? 'Guardando…' : 'Crear mi cuenta'}
          </button>
        </fieldset>
      </form>
      {!integrado && (
        <Link
          className="enlace-volver"
          to="/cuentas"
          state={{ desde: location.state?.desde }}
        >
          Ya tengo cuenta
        </Link>
      )}
    </section>
  );
};
