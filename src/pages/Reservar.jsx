import { useState } from 'react';

export const Reservar = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    rut: '',
    telefono: '',
    producto: 'Cemento Polpaico 25kg',
    cantidad: 1,
  });

  const [mensaje, setMensaje] = useState('');

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
              <label>Nombre Completo:</label>
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
              <select name="producto" value={formData.producto} onChange={handleChange}>
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
              />
            </div>

            <button type="submit" className="boton-enviar">Confirmar Reserva</button>
          </form>
        </div>
      </section>
    </main>
  );
};