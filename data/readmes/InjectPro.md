# InjectPro - Sistema POS, Facturacion Multimoneda y Gestion Comercial de Taller

[![Laravel 12](https://img.shields.io/badge/Laravel-12.x-FF2D20?style=flat-square&logo=laravel&logoColor=white)](https://laravel.com/)
[![PHP](https://img.shields.io/badge/PHP-8.2%2B-777BB4?style=flat-square&logo=php&logoColor=white)](https://php.net/)
[![React 19](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-7.0-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Sanctum](https://img.shields.io/badge/Auth-Laravel_Sanctum-FF2D20?style=flat-square&logo=laravel&logoColor=white)](https://laravel.com/docs/sanctum)
[![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?style=flat-square&logo=sqlite&logoColor=white)](https://www.sqlite.org/)

## Descripcion General

**InjectPro** es una plataforma web desacoplada de Punto de Venta (POS) y Gestion Comercial diseñada para talleres mecánicos de prueba y calibracion de inyectores diesel/gasolina.

La arquitectura divide de forma estricta las responsabilidades entre una **API RESTful desarrollada en Laravel 12** (con autenticacion Sanctum, validaciones avanzadas mediante FormRequests y serializacion Eloquent API Resources) y una **Single Page Application (SPA) construida en React 19** con **Tailwind CSS v4** y **Vite**.

---

## Modulos Tecnicos y Capacidades de Negocio

### Pipeline Transaccional de Facturacion (`to_invoice`)

* **Facturacion Atomica Mixta**: Procesamiento en una sola transaccion de base de datos (`DB::transaction`) que unifica productos de venta directa, mano de obra de servicios y repuestos/consumibles asociados a dichos servicios.
* **Descuento Automatico de Inventario**: Descuento directo en tiempo real del stock de productos al generar la factura, lanzando excepciones transaccionales en caso de existencias insuficientes.
* **Generacion Automatica de Deuda**: Si el pago recibido es menor al monto total de la factura, el sistema calcula la diferencia en moneda base y crea un registro de deuda asociada al cliente (`Debt`), cambiando el estado de la factura a "Pendiente".

### Motor Financiero Multimoneda (COP / USD / VES)

* **Conversion Dinamica de Tasas**: Registro centralizado de tasas de cambio cambiarias en la tabla `settings` (`exchange_rate_usd`, `exchange_rate_ves`).
* **Recepcion de Pagos Multimoneda**: Soporte para cobro de facturas en Pesos Colombianos (COP), Dolares (USD) y Bolivares (VES), calculando el cambio/vuelto equivalente y registrando la tasa de referencia utilizada en el pago.

### Gestion de Cartera, Cuentas por Cobrar y Pagos (`PaymentController`)

* **Consolidacion de Saldos Pendientes**: Consulta dinamica de clientes con deuda activa y ordenamiento por nivel de morosidad.
* **Procesamiento de Abonos Cascada (`paymentClient`)**: Modulo que toma un monto abonado por el cliente en cualquier moneda y lo aplica secuencialmente sobre sus facturas pendientes mas antiguas hasta agotar el pago o saldar las deudas.

### Cierre de Caja y Arqueo Diario (`RegisterCloseController`)

* **Consolidacion de Flujo de Caja**: Proceso administrativo que audita todos los pagos recibidos en una fecha determinada, agrupando de forma separada los montos totales recaudados en efectivo COP, USD y VES.
* **Bloqueo y Auditoria de Registro**: Vinculacion de las facturas y pagos del dia al ID del cierre de caja generado, impidiendo la alteracion posterior de transacciones auditadas.

---

## Arquitectura de Software y Seguridad

### Autenticacion Bearer Token (Laravel Sanctum)

* **Proteccion de Rutas API**: Seguridad mediante middleware `auth:sanctum` para todas las operaciones sensibles.
* **Interceptor Axios Frontend**: Manejo centralizado de tokens de acceso (`Bearer Token`) con redireccion automatica a la vista de login (`DesAuth()`) ante respuestas HTTP 401 Unauthorized.

### Capa de Validacion y Transformacion

* **FormRequests Dedicados**: Validacion estricta de datos de entrada (`StoreToInvoiceRequest`, `StoreClientPaymentRequest`, `StoreProductRequest`, etc.) asegurando tipos de datos, limites numéricos y existencia de llaves foraneas.
* **Eloquent API Resources**: Estandarizacion de la estructura de respuestas JSON para optimizar la carga util transmitida hacia el cliente React.

---

## Modelo de Persistencia Relacional

### Entidades de Datos Principales

* **`users`**: Usuarios administradores u operadores del sistema.
* **`clients`**: Ficha del cliente (Nombre, Teléfono, Cédula/NIT) con relaciones de deudas e historial de facturacion.
* **`products`**: Inventario de repuestos con precio, stock actual y umbral de stock minimo (`min_stock`).
* **`services`**: Catalogo de trabajos de taller con tarifa base de mano de obra y relacion de productos consumibles necesarios (`product_service`).
* **`invoices`**: Encabezado de factura (Fecha, Tipo, Estado, Total, Cliente, Usuario, Cierre de Caja).
* **`invoice_product` / `invoice_service`**: Tablas pivote con precios unitarios y subtotales congelados al momento de la venta.
* **`payments`**: Registros de pago con moneda, monto, tasa de cambio de referencia y vinculo a factura.
* **`debts`**: Registro de cuentas por cobrar asociadas a facturas pendientes de pago.
* **`register_close`**: Resumen diario de arqueo de caja por moneda (COP, USD, VES).
* **`settings`**: Parametros de configuracion del sistema (Tasas de cambio, datos de la empresa, IVA).

---

## Directorio de Endpoints API Principales

### Autenticacion (`/api`)

* `POST /api/login` — Autenticacion de usuario y emision de Bearer Token.
* `POST /api/register` — Registro de nuevos usuarios operadores.
* `POST /api/logout` — Revocacion del token de acceso activo.

### Operaciones POS y Facturacion (`/api/invoices`)

* `GET /api/invoices` — Listado de facturas emitidas ordenadas cronologicamente.
* `POST /api/invoices/to_invoice` — Endpoint principal POS para procesamiento transaccional de facturas.
* `GET /api/invoices/{id}` — Detalle completo de factura con relaciones cargadas (`Client`, `Products`, `Services`, `Payments`).

### Cartera y Cobranza (`/api`)

* `GET /api/clientsInDebt` — Listado de clientes con saldo deudor consolidado.
* `GET /api/totalDebt` — Sumatoria total de cuentas por cobrar del taller.
* `GET /api/debtClient/{client}` — Consulta de deuda especifica de un cliente.
* `POST /api/paymentClient` — Registro de abono a cartera con distribucion automatica sobre deudas.

### Control de Caja e Inventario (`/api`)

* `GET /api/products/inventory/filter` — Catalogo de productos paginado con filtro de estado de stock (`disponible`, `bajo_stock`, `agotado`).
* `POST /api/createRegisterClose` — Generacion y conciliacion del cierre de caja diario.

---

## Guia de Instalacion y Ejecucion

### Configuración del Backend (Laravel)

1. Ingresar a la carpeta del backend e instalar dependencias PHP:

   ```bash
   cd backend
   composer install
   ```

2. Configurar el archivo de variables de entorno:

   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

3. Preparar la base de datos y ejecutar las migraciones con datos de prueba:

   ```bash
   touch database/database.sqlite
   php artisan migrate --seed
   ```

4. Iniciar el servidor API de Laravel:

   ```bash
   php artisan serve --port=8000
   ```

### Configuración del Frontend (React + Vite)

1. Ingresar a la carpeta del frontend e instalar dependencias:

   ```bash
   cd ../frontend
   npm install
   ```

2. Iniciar el servidor de desarrollo de Vite:

   ```bash
   npm run dev
   ```

3. Acceder en el navegador a `http://127.0.0.1:5173`.

---

**Desarrollado por:**
Jose Gregorio Briceño Romero
Francisco José Sanchez Zea
Axel Orlando Porras González
*Ingenieria Informatica - Universidad Nacional Experimental del Tachira (UNET)*
