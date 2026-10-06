export const BlogCard = ({ titulo, categoria, fecha, resumen, imagen }) => {
  return (
    <article className="producto-tarjeta">
      <img src={imagen} alt={titulo} className="producto-img" />
      <div style={{ padding: '10px', textAlign: 'left' }}>
        <span className="etiqueta-alerta" style={{ fontSize: '11px', marginBottom: '5px' }}>
          {categoria}
        </span>
        <p className="subtitulo-seccion" style={{ fontSize: '12px', margin: '4px 0' }}>
          {fecha}
        </p>
        <h3 style={{ fontSize: '16px', color: '#1e293b' }}>{titulo}</h3>
        <p style={{ fontSize: '13px', color: '#555', margin: '8px 0' }}>{resumen}</p>
      </div>
    </article>
  );
};