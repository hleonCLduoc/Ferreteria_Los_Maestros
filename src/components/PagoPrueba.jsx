export function PagoPrueba({
  resultado,
  onCambiar,
  nombre = 'resultado-pago',
  transferencia = false,
}) {
  return (
    <div className="pago-prueba">
      <div className="tarjeta-prueba">
        <span>
          {transferencia ? 'Transferencia' : 'Tarjeta'}
        </span>
        <strong>
          {transferencia ? 'Confirmación de pago' : '•••• •••• •••• 4242'}
        </strong>
        <small>Pago simulado</small>
      </div>
      <fieldset>
        <legend>Resultado</legend>
        <label>
          <input
            type="radio"
            name={nombre}
            value="APROBADO"
            checked={resultado === 'APROBADO'}
            onChange={(e) => onCambiar(e.target.value)}
          />{' '}
          Aprobar pago
        </label>
        <label>
          <input
            type="radio"
            name={nombre}
            value="RECHAZADO"
            checked={resultado === 'RECHAZADO'}
            onChange={(e) => onCambiar(e.target.value)}
          />{' '}
          Rechazar pago
        </label>
      </fieldset>
    </div>
  );
}
