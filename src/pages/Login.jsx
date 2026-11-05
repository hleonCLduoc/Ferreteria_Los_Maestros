import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAut } from '../context/auth';
export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [enviando, setEnviando] = useState(false);
  const { iniciarSesion } = useAut();
  const navigate = useNavigate();
  const location = useLocation();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMensaje('');
    if (!email.trim()) {
      setError('El correo electrónico es obligatorio.');
      return;
    }
    if (!password) {
      setError('La contraseña es obligatoria.');
      return;
    }
    setEnviando(true);
    try {
      await iniciarSesion(email.trim(), password);
      const desde = location.state?.desde;
      navigate(
        desde?.startsWith('/') && !desde.startsWith('//') ? desde : '/',
        { replace: true },
      );
    } catch (e) {
      setError(e.message);
    } finally {
      setEnviando(false);
    }
  };
  const recuperar = () => {
    setError('');
    setMensaje(
      'La recuperación de contraseña está simulada en esta etapa. No se envían correos.',
    );
  };

  return (
    <section className="login">
      <h2>Iniciar sesión</h2>
      <p>
        Acceso de demostración. Regístrate primero; los usuarios se conservan
        mientras esta página siga abierta.
      </p>
      <form onSubmit={handleSubmit} className="formulario-contenedor">
        {error && (
          <p role="alert" className="mensaje error">
            {error}
          </p>
        )}
        {mensaje && (
          <p role="status" className="mensaje">
            {mensaje}
          </p>
        )}
        <div className="grupo-formulario">
          <label htmlFor="email">Correo electrónico:</label>
          <input
            id="email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
        <button className="boton-enviar" disabled={enviando}>
          {enviando ? 'Espera un momento…' : 'Ingresar'}
        </button>
        <button
          type="button"
          className="enlace-boton"
          disabled={enviando}
          onClick={recuperar}
        >
          ¿Olvidaste tu contraseña?
        </button>
        <p>
          ¿Aún no tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
        </p>
      </form>
    </section>
  );
};
