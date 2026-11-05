import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAut } from '../context/auth';
import { rutValido } from '../services/validaciones';
export const Registro = () => {
  const [datos, setDatos] = useState({
    razonSocial: '',
    rut: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);
  const { registrarUsuario } = useAut();
  const navigate = useNavigate();
  const enviar = async (e) => {
    e.preventDefault();
    setError('');
    if (!rutValido(datos.rut)) {
      setError('Revisa el RUT y su dígito verificador.');
      return;
    }
    setEnviando(true);
    try {
      await registrarUsuario(datos);
      navigate('/login', { replace: true });
    } catch (e) {
      setError(e.message);
    } finally {
      setEnviando(false);
    }
  };
  return (
    <section className="registro">
      <h2>Registro de clientes y contratistas</h2>
      <form onSubmit={enviar} className="formulario-contenedor">
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
            <label htmlFor={campo}>{label}</label>
            <input
              id={campo}
              type={
                campo === 'password'
                  ? 'password'
                  : campo === 'email'
                    ? 'email'
                    : 'text'
              }
              required
              maxLength={
                campo === 'password'
                  ? 72
                  : campo === 'razonSocial'
                    ? 150
                    : campo === 'email'
                      ? 200
                      : 12
              }
              minLength={campo === 'password' ? 8 : undefined}
              autoComplete={
                campo === 'password'
                  ? 'new-password'
                  : campo === 'email'
                    ? 'email'
                    : undefined
              }
              value={datos[campo]}
              onChange={(e) => setDatos({ ...datos, [campo]: e.target.value })}
            />
          </div>
        ))}
        <p>Usa una contraseña de al menos 8 caracteres.</p>
        <button className="boton-enviar" disabled={enviando}>
          {enviando ? 'Guardando…' : 'Registrarme'}
        </button>
        <Link to="/login">Ya tengo cuenta</Link>
      </form>
    </section>
  );
};
