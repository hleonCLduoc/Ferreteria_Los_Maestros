import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errores, setErrores] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errores[name]) {
      setErrores({ ...errores, [name]: '' });
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formData.email.trim()) {
      nuevosErrores.email = 'El correo electrónico es obligatorio.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      nuevosErrores.email = 'Ingresa un correo electrónico válido.';
    }

    if (!formData.password) {
      nuevosErrores.password = 'La contraseña es obligatoria.';
    } else if (formData.password.length < 6) {
      nuevosErrores.password = 'La contraseña debe tener al menos 6 caracteres.';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validarFormulario()) return;

    localStorage.setItem('usuario_sesion', JSON.stringify({ email: formData.email }));

    alert(`¡Bienvenido a Ferretería Los Maestros! Sesión iniciada con: ${formData.email}`);

    navigate('/cuentas');
  };

  return (
    <main>
      <section className="extracto">
        <h2>Iniciar Sesión</h2>
        <p>Accede a tu cuenta de contratista o cliente para gestionar tus pedidos y crédito.</p>

        <div className="formulario-contenedor" style={{ maxWidth: '450px', margin: '30px auto' }}>
          <form onSubmit={handleSubmit} noValidate>
            <div className="grupo-formulario" style={{ marginBottom: '15px', textAlign: 'left' }}>
              <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>
                Correo Electrónico:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="ejemplo@correo.com"
                style={{
                  width: '100%',
                  padding: '8px',
                  borderColor: errores.email ? '#dc2626' : '#ccc',
                  borderRadius: '4px'
                }}
              />
              {errores.email && (
                <span style={{ color: '#dc2626', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>
                  {errores.email}
                </span>
              )}
            </div>

            <div className="grupo-formulario" style={{ marginBottom: '20px', textAlign: 'left' }}>
              <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>
                Contraseña:
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '8px',
                  borderColor: errores.password ? '#dc2626' : '#ccc',
                  borderRadius: '4px'
                }}
              />
              {errores.password && (
                <span style={{ color: '#dc2626', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>
                  {errores.password}
                </span>
              )}
            </div>

            <button type="submit" className="boton-enviar" style={{ width: '100%' }}>
              Ingresar
            </button>
          </form>

          <p style={{ marginTop: '20px', fontSize: '0.9rem' }}>
            ¿Aún no tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
          </p>
        </div>
      </section>
    </main>
  );
};