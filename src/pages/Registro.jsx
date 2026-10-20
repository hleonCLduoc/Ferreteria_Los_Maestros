import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export const Registro = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    rut: '',
    password: '',
    confirmarPassword: '',
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

    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre completo es obligatorio.';
    }

    if (!formData.email.trim()) {
      nuevosErrores.email = 'El correo electrónico es obligatorio.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      nuevosErrores.email = 'Ingresa un correo electrónico válido.';
    }

    if (!formData.rut.trim()) {
      nuevosErrores.rut = 'El RUT es obligatorio.';
    }

    if (!formData.password) {
      nuevosErrores.password = 'La contraseña es obligatoria.';
    } else if (formData.password.length < 6) {
      nuevosErrores.password = 'La contraseña debe tener al menos 6 caracteres.';
    }

    if (!formData.confirmarPassword) {
      nuevosErrores.confirmarPassword = 'Debes confirmar la contraseña.';
    } else if (formData.password !== formData.confirmarPassword) {
      nuevosErrores.confirmarPassword = 'Las contraseñas no coinciden.';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validarFormulario()) return;

    localStorage.setItem(
      'usuario_registrado',
      JSON.stringify({
        nombre: formData.nombre,
        email: formData.email,
        rut: formData.rut,
      })
    );

    alert(`¡Usuario registrado exitosamente!\n\nBienvenido(a), ${formData.nombre}. Ahora puedes iniciar sesión.`);

    navigate('/login');
  };

  return (
    <main>
      <section className="extracto">
        <h2>Crear Cuenta</h2>
        <p>Regístrate para acceder a convenios de contratistas, reservas prioritarias y crédito de materiales.</p>

        <div className="formulario-contenedor" style={{ maxWidth: '500px', margin: '30px auto' }}>
          <form onSubmit={handleSubmit} noValidate>
            <div className="grupo-formulario" style={{ marginBottom: '15px', textAlign: 'left' }}>
              <label htmlFor="nombre" style={{ display: 'block', marginBottom: '5px' }}>
                Nombre Completo:
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Juan Pérez"
                style={{
                  width: '100%',
                  padding: '8px',
                  borderColor: errores.nombre ? '#dc2626' : '#ccc',
                  borderRadius: '4px',
                }}
              />
              {errores.nombre && (
                <span style={{ color: '#dc2626', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>
                  {errores.nombre}
                </span>
              )}
            </div>

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
                  borderRadius: '4px',
                }}
              />
              {errores.email && (
                <span style={{ color: '#dc2626', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>
                  {errores.email}
                </span>
              )}
            </div>

            <div className="grupo-formulario" style={{ marginBottom: '15px', textAlign: 'left' }}>
              <label htmlFor="rut" style={{ display: 'block', marginBottom: '5px' }}>
                RUT:
              </label>
              <input
                type="text"
                id="rut"
                name="rut"
                value={formData.rut}
                onChange={handleChange}
                placeholder="12.345.678-9"
                style={{
                  width: '100%',
                  padding: '8px',
                  borderColor: errores.rut ? '#dc2626' : '#ccc',
                  borderRadius: '4px',
                }}
              />
              {errores.rut && (
                <span style={{ color: '#dc2626', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>
                  {errores.rut}
                </span>
              )}
            </div>

            <div className="grupo-formulario" style={{ marginBottom: '15px', textAlign: 'left' }}>
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
                  borderRadius: '4px',
                }}
              />
              {errores.password && (
                <span style={{ color: '#dc2626', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>
                  {errores.password}
                </span>
              )}
            </div>

            <div className="grupo-formulario" style={{ marginBottom: '20px', textAlign: 'left' }}>
              <label htmlFor="confirmarPassword" style={{ display: 'block', marginBottom: '5px' }}>
                Confirmar Contraseña:
              </label>
              <input
                type="password"
                id="confirmarPassword"
                name="confirmarPassword"
                value={formData.confirmarPassword}
                onChange={handleChange}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '8px',
                  borderColor: errores.confirmarPassword ? '#dc2626' : '#ccc',
                  borderRadius: '4px',
                }}
              />
              {errores.confirmarPassword && (
                <span style={{ color: '#dc2626', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>
                  {errores.confirmarPassword}
                </span>
              )}
            </div>

            <button type="submit" className="boton-enviar" style={{ width: '100%' }}>
              Registrarse
            </button>
          </form>

          <p style={{ marginTop: '20px', fontSize: '0.9rem' }}>
            ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link>
          </p>
        </div>
      </section>
    </main>
  );
};