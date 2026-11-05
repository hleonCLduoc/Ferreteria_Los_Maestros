# Ferretería Los Maestros

[Ver sitio publicado](https://ferreterialosmaestros.vercel.app/)

Proyecto frontend en React y Vite. Catálogo, acceso, reservas, compras y cuenta corriente forman un recorrido completo de prueba en el navegador. No utiliza backend, APIs ni una base de datos de servidor.

## Ejecutar y verificar

```bash
npm install
npm run dev
npm run lint
npm test
npm run build
```

Vercel utiliza npm run build, salida dist y las reescrituras de vercel.json. No requiere variables de entorno. La caché de desarrollo de Vite se guarda en la carpeta temporal del equipo para evitar los bloqueos de Dropbox.

## Cuenta para probar

- Correo: cliente@losmaestros.cl
- Contraseña: Demo1234

También puedes registrar un cliente desde el botón Crear cuenta. El registro valida RUT, correo y confirmación de contraseña. Los perfiles se conservan en localStorage y la contraseña se representa mediante una huella con sal; sigue siendo una simulación local, no un sistema de autenticación para producción. La sesión resiste una recarga y se cierra desde el área privada de Mi cuenta.

## Mi cuenta y administración

El menú público muestra Inicio, Catálogo, Blog, Nosotros y Mi cuenta. Mi cuenta muestra primero el inicio de sesión. Crear cuenta despliega el registro y contrae el ingreso; al terminar el registro vuelve al inicio de sesión con el correo completado. Después del ingreso, el cliente ve sus compras, reservas y cuenta corriente; las opciones privadas no aparecen en el menú público.

Cada cliente comienza con $100.000 de cupo y saldo utilizado cero. El usuario administrador de prueba es:

- Correo: admin@losmaestros.cl
- Contraseña: Admin1234

Después de ingresar, el administrador puede consultar clientes de este navegador, revisar su actividad, ajustar cupos y activar o desactivar cuentas. No puede reducir el cupo por debajo de la deuda actual. Las cuentas nuevas siempre son de cliente; el registro público no crea administradores.

La recuperación de acceso está en el formulario de ingreso. Para una cuenta registrada localmente permite cambiar la contraseña confirmando correo y RUT. Es una recuperación simulada: no envía correos ni verifica la identidad mediante un servidor. Las cuentas de ejemplo mantienen sus claves predeterminadas.

## Persistencia de los datos

Recargar, cerrar sesión o cerrar el navegador no borra las cuentas registradas en localStorage. Si se desmarca Mantener mi sesión, cerrar la pestaña termina la sesión, pero no elimina la cuenta.

Otro navegador, perfil, modo privado o dominio tiene su propio almacenamiento. localhost, 127.0.0.1 y el sitio Vercel son orígenes diferentes y no comparten registros. Allí se comienza sin las cuentas creadas en otros orígenes, aunque las cuentas de ejemplo cliente y administrador siempre están disponibles porque vienen en el código. El administrador solo puede gestionar las cuentas guardadas en su propio origen. Borrar los datos del sitio sí elimina esos registros.

## Recorrido de compra

Catálogo → Carrito → Ingreso → Entrega → Pago → Comprobante → Mi cuenta.

El cliente elige retiro o despacho y luego tarjeta de prueba, transferencia o cuenta corriente. La tarjeta permite simular aprobación y rechazo sin introducir datos bancarios reales. Si el pago se rechaza, el carrito permanece disponible para reintentar. La transferencia genera un pedido pendiente que puede completarse desde Mi cuenta. Una compra a cuenta corriente aumenta la deuda y reduce el crédito disponible.

Mi cuenta reúne resumen, compras, reservas y movimientos. Los abonos de prueba disminuyen el saldo y saldan los pedidos más antiguos. El historial se filtra por cliente. Todos los datos permanecen exclusivamente en este navegador.

## Reservas

Se puede reservar un producto o el carrito completo. Al confirmar se asigna un número y se apartan las cantidades durante 24 horas. La reserva aparece en Mi cuenta, donde se puede cancelar o pagar. Pagar una reserva la convierte en compra sin descontar dos veces el stock. Cancelarla o dejarla vencer libera las existencias.

El catálogo refleja las compras y reservas locales. No representa existencias compartidas entre dispositivos ni genera solicitudes reales a la tienda.

## Organización del código

- App.jsx: proveedores, rutas públicas y rutas que requieren sesión.
- ContextoAutenticacion.jsx: registro, ingreso, sesión y cierre local.
- ContextoCompras.jsx y services/compras.js: compras, reservas, stock y cuenta corriente.
- ContextoCarrito.jsx: cantidades y persistencia del carrito.
- Pago.jsx y Confirmacion.jsx: entrega, pago simulado y comprobante.
- AccesoCuenta.jsx: ingreso principal y registro desplegable.
- MiCuenta.jsx: entrada pública y selección de la vista de cliente o administrador.
- Cuentas.jsx: historial del cliente y abonos.
- AdminHome.jsx: administración local de cuentas y cupos.

Las operaciones se guardan con las claves compras_los_maestros_v1, clientes_los_maestros_v1 y ajustes_cuentas_los_maestros_v1. Para comenzar una nueva prueba desde cero puedes borrar los datos de este sitio desde las herramientas del navegador. Usa únicamente datos ficticios.
