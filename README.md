# Ferretería Los Maestros

[Ver sitio publicado](https://ferreterialosmaestros.vercel.app/)

Proyecto frontend en React y Vite para la etapa actual del curso. El catálogo se obtiene de los archivos JavaScript del proyecto. El registro, inicio de sesión, cuenta corriente, reserva y pago son demostraciones realizadas en el navegador.

## Ejecutar

```bash
npm install
npm run dev
```

## Verificar y compilar

```bash
npm run lint
npm test
npm run build
```

Vercel usa `npm run build`, salida `dist` y las reescrituras de `vercel.json` para React Router. No se necesitan servidores adicionales ni variables de entorno.

## Datos de la demostración

Regístrate para probar el acceso a reservas y cuenta corriente. Los usuarios registrados y la sesión se mantienen en memoria mientras la aplicación siga abierta; al recargar se reinician. Usa datos de prueba. El carrito se conserva en localStorage, con validación de su contenido.

El catálogo, búsqueda, filtros y paginación funcionan sin iniciar sesión. Las reservas y pagos muestran su resultado simulado; no generan cobros ni envían solicitudes a la tienda. La cuenta corriente muestra valores de ejemplo.

Se conservan las correcciones de validación, etiquetas de formularios, idioma español y menú responsive.
