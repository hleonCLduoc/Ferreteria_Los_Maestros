import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAut } from '../context/ContextoAutenticacion';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { iniciarSesion } = useAut();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      setError("El correo electrónico es obligatorio.");
      return;
    }

    const loginExitoso = iniciarSesion(email, password);
    
    if (loginExitoso) {
      setError('');
      navigate('/cuentas'); 
    } else {
      setError('Usuario no registrado o credenciales incorrectas.');
    }
  };

  // Función simulada para recuperar clave
  const handleRecuperarClave = () => {
    if (!email) {
      alert("Por favor, ingresa tu correo electrónico primero para enviarte la recuperación.");
      return;
    }
    alert(`Te hemos enviado las instrucciones para recuperar tu contraseña a: ${email}`);
  };

  return (
    <main>
      <section className="login">
        <h2>Iniciar Sesión</h2>
        
        <form onSubmit={handleSubmit} className="formulario-contenedor">
          {error && <p style={{ color: '#dc2626', fontWeight: 'bold', marginBottom: '15px' }}>{error}</p>}
          
          <div style={{ marginBottom: '15px', textAlign: 'left' }}>
            <label htmlFor="email">Correo Electrónico:</label>
            <input
              id="email"
              type="email"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(''); // Esto limpia el error en cuanto vuelves a escribir
              }}
              onInvalid={(e) => e.target.setCustomValidity('Por favor, incluye un "@" en el correo válido.')}
              onInput={(e) => e.target.setCustomValidity('')}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>

          <div style={{ marginBottom: '10px', textAlign: 'left' }}>
            <label htmlFor="password">Contraseña:</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(''); // Esto limpia el error en cuanto vuelves a escribir
              }}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>

          {/* Nuevo botón de recuperar clave */}
          <div style={{ textAlign: 'right', marginBottom: '20px' }}>
            <button 
              type="button" 
              onClick={handleRecuperarClave}
              style={{ background: 'none', border: 'none', color: '#2563eb', textDecoration: 'underline', cursor: 'pointer', padding: 0, fontSize: '0.9rem' }}
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <button 
            type="submit" 
            style={{ padding: '10px 20px', backgroundColor: '#eab308', color: '#000', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', width: '100%' }}
          >
            Ingresar
          </button>

          <div style={{ marginTop: '25px', paddingTop: '15px', borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
            <p style={{ marginBottom: '10px', color: '#475569' }}>¿Aún no eres contratista asociado?</p>
            <Link 
              to="/registro" 
              style={{ padding: '8px 15px', backgroundColor: '#2563eb', color: 'white', textDecoration: 'none', borderRadius: '5px', display: 'inline-block', fontWeight: 'bold' }}
            >
              Regístrate primero aquí
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
};