export const Cuentas = () => {
  const cuentaContratista = {
    cliente: "Constructora Elqui Ltda.",
    rut: "76.123.456-7",
    creditoDisponible: "$2.500.000",
    saldoUtilizado: "$850.000",
    fechaVencimiento: "30 de Octubre, 2026"
  };

  return (
    <main>
      <section className="extracto">
        <h2>Mi Cuenta Corriente</h2>
        <p>Estado de crédito y saldo pendiente para contratistas registrados:</p>

        <div className="formulario-contenedor" style={{ textAlign: 'left' }}>
          <h3>Datos del Cliente</h3>
          <p><strong>Razón Social:</strong> {cuentaContratista.cliente}</p>
          <p><strong>RUT:</strong> {cuentaContratista.rut}</p>

          <hr style={{ margin: '15px 0', borderColor: '#e2e8f0' }} />

          <h3>Estado Financiero</h3>
          <p><strong>Línea de Crédito Total:</strong> {cuentaContratista.creditoDisponible}</p>
          <p><strong>Saldo Utilizado:</strong> <span style={{ color: '#dc2626', fontWeight: 'bold' }}>{cuentaContratista.saldoUtilizado}</span></p>
          <p><strong>Próximo Vencimiento:</strong> {cuentaContratista.fechaVencimiento}</p>
        </div>
      </section>
    </main>
  );
};