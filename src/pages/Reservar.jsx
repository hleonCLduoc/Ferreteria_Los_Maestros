import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAut } from '../context/ContextoAutenticacion';

export const Reservar = () => {
  // 1. Traemos al usuario que está conectado actualmente
  const { usuario } = useAut();

  const [formData, setFormData] = useState({
    // Si hay usuario, le ponemos sus datos por defecto. Si no, lo dejamos en blanco.
    nombre: usuario ? usuario.razonSocial : '', 
    rut: usuario ? usuario.rut : '',
    telefono: '',
    producto: 'Cemento Polpaico 25kg',
    cantidad: 1,
  });

  const [mensaje, setMensaje] = useState('');

  // 2. Aquí está el candado: Si no hay nadie logueado, lo mandamos pa' fuera (al login)
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nombre || !formData.rut || !formData.telefono) {
      setMensaje('⚠️ Por favor completa todos los campos obligatorios.');
      return;
    }
    setMensaje(`✅ ¡Reserva realizada con éxito para ${formData.nombre}! Producto: ${formData.producto}.`);
  };

  return (
    <main>
      <section className="extracto">
        <h2>Reserva de Materiales en Línea</h2>
        <p>Asegura tu stock antes de dirigirte a nuestra tienda física en La Serena.</p>

        <div className="formulario-contenedor">
          {mensaje && <p style={{ color: '#0284c7', fontWeight: 'bold', marginBottom: '15px' }}>{mensaje}</p>}
          
          <form onSubmit={handleSubmit}>
            <div className="grupo-formulario">
              <label>Nombre Completo / Razón Social:</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej: Juan Pérez"
              />
            </div>

            <div className="grupo-formulario">
              <label>RUT:</label>
              <input
                type="text"
                name="rut"
                value={formData.rut}
                onChange={handleChange}
                placeholder="12.345.678-9"
              />
            </div>

            <div className="grupo-formulario">
              <label>Teléfono de Contacto:</label>
              <input
                type="text"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="+56 9 1234 5678"
              />
            </div>

            <div className="grupo-formulario">
              <label>Producto a Reservar:</label>
              <select name="producto" value={formData.producto} onChange={handleChange} style={{ width: '100%', padding: '8px' }}>
                <option value="Cemento Polpaico 25kg">Cemento Polpaico 25kg</option>
                <option value="Taladro Percutor Bosch">Taladro Percutor Bosch</option>
                <option value="Pala Punta de Huevo">Pala Punta de Huevo</option>
              </select>
            </div>

            <div className="grupo-formulario">
              <label>Cantidad:</label>
              <input
                type="number"
                name="cantidad"
                min="1"
                value={formData.cantidad}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px' }}
              />
            </div>

            <button type="submit" className="boton-enviar" style={{ padding: '10px 20px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' }}>
              Confirmar Reserva
            </button>
          </form>
        </div>
      </section>
    </main>
  );
};