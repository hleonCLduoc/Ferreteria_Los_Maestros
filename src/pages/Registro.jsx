import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAut } from '../context/ContextoAutenticacion';

export const Registro = () => {
  const [razonSocial, setRazonSocial] = useState('');
  const [rut, setRut] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { registrarUsuario } = useAut();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    //  guardamos al contratista a nuestro contexto
    registrarUsuario({ razonSocial, rut, email, password });
    
    //  lo mandamos al login
    alert("¡Registro listo! Ahora entra con tus datos.");
    navigate('/login');
  };

  return (
    <main>
      <section className="registro">
        <h2>Registro de Contratistas</h2>
        <form onSubmit={handleSubmit} className="formulario-contenedor" style={{ textAlign: 'left' }}>
          
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="razonSocial">Razón Social / Nombre Completo:</label>
            <input id="razonSocial" type="text" required value={razonSocial} onChange={(e) => setRazonSocial(e.target.value)} style={{ width: '100%', padding: '8px' }} />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="rut">RUT:</label>
            <input id="rut" type="text" required value={rut} onChange={(e) => setRut(e.target.value)} style={{ width: '100%', padding: '8px' }} />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="email">Correo Electrónico:</label>
            <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '8px' }} />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="password">Contraseña:</label>
            <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '8px' }} />
          </div>

          <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '5px' }}>
            Registrarme
          </button>
        </form>
      </section>
    </main>
  );
};