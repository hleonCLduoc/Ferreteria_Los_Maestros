import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAut } from '../context/auth';
export const Login = ({
  integrado = false,
  correoInicial = '',
  mensajeExito = '',
}) => {
  const { usuario, iniciarSesion, restablecerClave } = useAut();
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(correoInicial),
    [password, setPassword] = useState(''),
    [recordar, setRecordar] = useState(true),
    [error, setError] = useState(''),
    [enviando, setEnviando] = useState(false),
    [recuperando, setRecuperando] = useState(false),
    [mensaje, setMensaje] = useState('');
  const [recuperacion, setRecuperacion] = useState({
    email: correoInicial,
    rut: '',
    password: '',
    confirmar: '',
  });
  const desde = location.state?.desde;
  const destino =
    desde?.startsWith('/') &&
    !desde.startsWith('//') &&
    !['/login', '/registro', '/cuentas'].includes(desde.split('?')[0])
      ? desde
      : '/cuentas';
  const entrar = async (correo, clave) => {
    setError('');
    setEnviando(true);
    try {
      await iniciarSesion(correo, clave, recordar);
      navigate(destino, { replace: true });
    } catch (e) {
      setError(e.message);
    } finally {
      setEnviando(false);
    }
  };
  const enviar = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('El correo electrónico es obligatorio.');
      return;
    }
    if (!password) {
      setError('Ingresa tu contraseña.');
      return;
    }
    entrar(email, password);
  };
  const recuperar = async (e) => {
    e.preventDefault();
    setError('');
    setMensaje('');
    if (recuperacion.password !== recuperacion.confirmar) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    setEnviando(true);
    try {
      await restablecerClave(recuperacion);
      setEmail(recuperacion.email);
      setPassword('');
      setRecuperando(false);
      setMensaje(
        'Contraseña actualizada.',
      );
      setRecuperacion({ email: '', rut: '', password: '', confirmar: '' });
    } catch (e) {
      setError(e.message);
    } finally {
      setEnviando(false);
    }
  };
  if (usuario && !integrado) return <Navigate to={destino} replace />;
  return (
    <section className="panel-acceso" aria-label="Ingresar a mi cuenta">
      <h3>{recuperando ? 'Recuperar contraseña' : 'Iniciar sesión'}</h3>
      {(mensaje || mensajeExito || location.state?.mensaje) && (
        <p role="status" className="mensaje">
          {mensaje || mensajeExito || location.state?.mensaje}
        </p>
      )}
      {error && (
        <p role="alert" className="mensaje error">
          {error}
        </p>
      )}
      {recuperando ? (
        <form onSubmit={recuperar}>
          <fieldset disabled={enviando}>
            {[
              ['email', 'Correo de tu cuenta', 'email'],
              ['rut', 'RUT de la cuenta', 'text'],
              ['password', 'Nueva contraseña', 'password'],
              ['confirmar', 'Confirmar nueva contraseña', 'password'],
            ].map(([campo, label, tipo]) => (
              <div className="grupo-formulario" key={campo}>
                <label htmlFor={`recuperar-${campo}`}>{label}</label>
                <input
                  id={`recuperar-${campo}`}
                  type={tipo}
                  required
                  minLength={tipo === 'password' ? 8 : undefined}
                  maxLength={tipo === 'password' ? 72 : 200}
                  autoComplete={
                    tipo === 'password' ? 'new-password' : undefined
                  }
                  value={recuperacion[campo]}
                  onChange={(e) =>
                    setRecuperacion({
                      ...recuperacion,
                      [campo]: e.target.value,
                    })
                  }
                />
              </div>
            ))}
            <button className="boton-enviar">
              {enviando ? 'Actualizando…' : 'Actualizar contraseña'}
            </button>
            <button
              type="button"
              className="enlace-boton"
              onClick={() => {
                setRecuperando(false);
                setError('');
              }}
            >
              Volver a iniciar sesión
            </button>
          </fieldset>
        </form>
      ) : (
        <>
          <form onSubmit={enviar}>
            <fieldset disabled={enviando}>
              <div className="grupo-formulario">
                <label htmlFor="email">Correo electrónico:</label>
                <input
                  id="email"
                  type="email"
                  autoComplete="username"
                  autoFocus={!!correoInicial}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.cl"
                />
              </div>
              <div className="grupo-formulario">
                <label htmlFor="password">Contraseña:</label>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <label className="opcion-check">
                <input
                  type="checkbox"
                  checked={recordar}
                  onChange={(e) => setRecordar(e.target.checked)}
                />{' '}
                Mantener sesión iniciada
              </label>
              <button className="boton-enviar">
                {enviando ? 'Ingresando…' : 'Ingresar'}
              </button>
              <button
                type="button"
                className="enlace-boton"
                onClick={() => {
                  setRecuperacion({ ...recuperacion, email });
                  setRecuperando(true);
                  setError('');
                  setMensaje('');
                }}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </fieldset>
          </form>
          {!integrado && (
            <Link className="enlace-volver" to="/cuentas" state={{ desde }}>
              Crear una cuenta
            </Link>
          )}
        </>
      )}
    </section>
  );
};
