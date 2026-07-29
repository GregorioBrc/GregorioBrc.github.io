# WebApi_IGBC - Backend Comercial y Middleware de Integracion con ERP Profit Plus 2K8

[![.NET 8](https://img.shields.io/badge/.NET-8.0-512BD4?style=flat-square&logo=dotnet&logoColor=white)](https://dotnet.microsoft.com/)
[![C#](https://img.shields.io/badge/C%23-12.0-239120?style=flat-square&logo=c-sharp&logoColor=white)](https://docs.microsoft.com/en-us/dotnet/csharp/)
[![ASP.NET Core](https://img.shields.io/badge/ASP.NET%20Core-8.0-512BD4?style=flat-square&logo=dotnet&logoColor=white)](https://dotnet.microsoft.com/apps/aspnet)
[![Entity Framework Core](https://img.shields.io/badge/EF%20Core-9.0-512BD4?style=flat-square&logo=dotnet&logoColor=white)](https://docs.microsoft.com/ef/)
[![Dapper](https://img.shields.io/badge/Dapper-2.1-EA2839?style=flat-square)](https://github.com/DapperLib/Dapper)
[![MySQL](https://img.shields.io/badge/MySQL-10.4-4479A1?style=flat-square&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![SQL Server](https://img.shields.io/badge/SQL%20Server-Profit%202K8-CC292B?style=flat-square&logo=microsoft-sql-server&logoColor=white)](https://www.microsoft.com/sql-server/)
[![Azure Blob Storage](https://img.shields.io/badge/Azure-Blob%20Storage-0089D6?style=flat-square&logo=microsoft-azure&logoColor=white)](https://azure.microsoft.com/)
[![Firebase FCM](https://img.shields.io/badge/Firebase-Cloud%20Messaging-FFCA28?style=flat-square&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![SignalR](https://img.shields.io/badge/Real--time-SignalR-512BD4?style=flat-square)](https://dotnet.microsoft.com/apps/aspnet/signalr)

## Descripcion General

WebApi_IGBC es una solucion de infraestructura backend desarrollada sobre ASP.NET Core 8.0 que funciona como middleware de integracion empresarial entre aplicaciones moviles/web y el sistema de planificacion de recursos empresariales (ERP) Profit Plus 2K8 (SQL Server).

La plataforma permite automatizar el flujo de ventas B2B, sincronizando en tiempo real inventarios, pedidos, facturacion, cobranza multimoneda y estado de cartera de clientes, eliminando la duplicidad de carga manual y garantizando la integridad transaccional entre la nube y el sistema administrativo central.

---

## Modulos Tecnicos y Arquitectura de Software

### Middleware de Interoperabilidad con Profit Plus 2K8
* **Inyeccion Transaccional mediante Stored Procedures**: Integracion directa con el motor de SQL Server de Profit 2K8 mediante Dapper, ejecutando de forma atomica los procedimientos almacenados nativos del ERP (`pp_ins_pedidos`, `pp_ins_reng_ped`, `pp_ins_cobros`, `pp_ins_reng_cob`, `pp_ins_reng_tip`, `pp_next_number` y `pp_cierra_cobros`).
* **Segregacion y Particion de Ordenes**: Implementacion de algoritmo de particion que analiza el volumen de items de cada pedido. Si la orden excede 15 renglones o mezcla productos en promocion con regulares, el sistema fragmenta el pedido en ordenes hijas relacionales (`OrdenPadreId`) compatibles con los limites de facturacion del ERP.
* **Motor de Ajuste Cambiario y Cuadre Multimoneda**: Calculo automatizado de diferenciales cambiarios entre la fecha de emision de la factura y la fecha del cobro. Genera automaticamente los registros correspondientes de Notas de Debito (`N/DB`), Notas de Credito (`N/CR`) o consumo/generacion de Adelantos (`ADEL`) dentro de las tablas nativas de Profit 2K8 (`docum_cc`, `cobros`, `reng_cob`).

### Gestion Financiera, Cartera y Arqueo
* **Analisis de Riesgo de Cartera**: Generacion dinamica de estados de cuenta y antiguedad de saldo, clasificando los creditos en rangos de riesgo (Verde, Amarillo, Naranja, Rojo, Azul) segun los dias de vencimiento.
* **Control de Saldos a Favor**: Administracion local y sincronizada con Profit 2K8 de adelantos y saldos a favor de clientes para su aplicacion automatica en nuevos cobros.
* **Gestion de Efectivo y Conciliacion**: Modulo de arqueo de caja en divisas para la fuerza de ventas y registro de transacciones contables (`Contabilidad_Efectivo`) previa conciliacion de depositos bancarios.

### Tareas Asincronas en Segundo Plano (Worker Services)
La API implementa 7 servicios alojados (`IHostedService`) que ejecutan procesos de sincronizacion diferencial entre MySQL y SQL Server:
* **TasaSyncService_Back**: Sincronizacion diaria y reintentos programados para la tasa oficial de cambio en divisas.
* **ProductosSyncService_Back**: Sincronizacion incremental de catalogo, precios y stock disponible.
* **ClientesSyncService_Back**: Sincronizacion de ficha de clientes y saldos a favor.
* **VendedoresSyncService_Back**: Sincronizacion de fuerza de ventas y asignaciones.
* **FacturasSyncService_Back**: Verificacion periodica del estado de facturacion y cobro de pedidos.
* **CuentasBancariasSyncService_Back**: Actualizacion de cuentas e instituciones bancarias habilitadas.
* **Desc_PromoServiceBack**: Sincronizacion de reglas de descuento y promociones globales.

### Procesamiento Multimedia y Notificaciones
* **Azure Blob Storage + ImageSharp**: Servicio de carga de comprobantes de pago que procesa las imagenes recibidas, ajusta la orientacion EXIF, escala la resolucion maxima a 1600px y convierte el archivo al formato optimizado WebP antes de su almacenamiento en la nube.
* **Comunicaciones en Tiempo Real**: Notificaciones instantaneas mediante SignalR Hubs (`NotificacionesHub`) para cambios de estado de pedidos, variaciones de inventario y monitoreo de usuarios conectados.
* **Notificaciones Push FCM**: Integracion con Firebase Cloud Messaging mediante canal de alta prioridad para alertas operativas en dispositivos Android/iOS.

---

## Modelo de Datos e Infranqueabilidad de Seguridad

### Seguridad y Control de Acceso
* **Autenticacion Stateless**: Implementacion de tokens JWT con firma simetrica HMAC-SHA256, expiracion controlada y validacion dinamica por middleware (`Middleware_Desautentificar`).
* **Mecanismo de Revocacion In-Memory**: Servicio de revocacion de accesos y tokens que invalida la sesion de usuarios bloqueados sin impactar el rendimiento de la base de datos principal.
* **Control de Dispositivos y Vinculacion**: Validacion obligatoria de identidad de hardware (`DeviceId` e `Info_Telefono`) con requerimiento de aprobacion administrativa previa al inicio de sesion.
* **Rate Limiting**: Politicas de limitacion de peticiones fijas por IP en endpoints criticos (`LoginLimit`: 3 req/min) y globales por usuario (`GlobalLimit`: 30 req/min).

### Matriz de Roles del Sistema
* **Admin**: Gestion total de usuarios, parametros del sistema, autorizacion de dispositivos e invalidacion de cache.
* **Aprobador**: Revision de pedidos entrantes, ajuste de precios, asignacion de transporte/sucursal e inyeccion a Profit Plus 2K8.
* **Vendedor**: Registro de pedidos, consulta de catalogo/promociones, gestion de clientes asignados y reporte de cobros.
* **Cobrador**: Validacion financiera de pagos y depositos, conciliacion bancaria, gestion de cartera y aprobacion de saldo a favor.
* **Cliente**: Acceso al catalogo digital, auto-gestion de pedidos y consulta de saldo pendiente.

---

## Estructura de Persistencia Dual

El sistema utiliza una arquitectura de almacenamiento hibrida orientada al rendimiento:

1. **Base de Datos Local (MySQL 10.4 / Entity Framework Core 9.0)**: Almacena el estado operacional de la API, tokens de dispositivos, logs de ubicacion, configuraciones del sistema, usuarios, roles, estado de sesion, cache de productos y registro temporal de cobranzas.
2. **Base de Datos ERP (Microsoft SQL Server / Profit Plus 2K8)**: Base de datos central donde residen los datos maestros del negocio. Es la fuente definitiva para la facturacion, contabilidad, maestros de inventario (`art`), clientes (`clientes`), vendedores (`vendedor`), documentos de CxC (`docum_cc`) y registros de caja/banco (`cuentas`, `cajas`).

---

## Resumen de Endpoints Principales

### Autenticacion y Seguridad (/api/Auth)
* `POST /api/Auth/login`: Autenticacion de usuario, verificacion de hash BCrypt y registro/validacion de dispositivo.
* `POST /api/Auth/logout-all`: Invalidation global de tokens de sesion para todos los usuarios.
* `GET /api/Auth/GenerarTokenSistema`: Generacion de credencial JWT de larga duracion para agentes de sincronizacion local.

### Gestion de Ordenes (/api/Ordenes)
* `GET /api/Ordenes`: Obtencion de ordenes de venta paginadas con proyecciones DTO optimizadas.
* `POST /api/Ordenes/CrearCompleta`: Creacion atomica de ordenes con descuento directo de inventario local.
* `POST /api/Ordenes/ConfirmarEdicion/{id}`: Confirmacion de cambios aplicados a ordenes en negociacion.
* `GET /api/Ordenes/Hijas/{parentId}`: Consulta de sub-pedidos generados por division automatica.

### Aprobacion e Inyeccion ERP (/api/Aprobador)
* `GET /api/Aprobador`: Listado de pedidos pendientes por aprobacion operativa.
* `POST /api/Aprobador/Aprobar/{id}`: Ejecuta la division de renglones e inyecta la orden en el ERP Profit Plus 2K8.
* `POST /api/Aprobador/Editar/{id}`: Modificacion de cantidades, precios o descuentos de un pedido previo a su inyeccion.

### Cobranza y Conciliacion (/api/Cobrador - /api/Cobranzas)
* `GET /api/Cobrador/ReporteCartera`: Generacion de reporte de cuentas por cobrar estructurado por tramos de vencimiento.
* `POST /api/Cobranzas/PagoOrden`: Registro de pago asociado a factura con carga adjunta de comprobante a Azure Blob Storage.
* `POST /api/Cobrador/Aprobar/{id}`: Aprobacion del pago e inyeccion transaccional del cobro en Profit Plus 2K8.

### Estado y Cache (/api/Status - /api/CacheManager)
* `GET /api/Status/health`: Diagnostico de conectividad con la base de datos MySQL local y SQL Server Profit 2K8.
* `POST /api/CacheManager/clear-all`: Limpieza e invalidacion manual de las estructuras en memoria cache.

---

## Tecnologias y Librerias

| Tecnologia | Version | Funcion |
|---|---|---|
| **.NET** | 8.0 | Framework de desarrollo principal |
| **C#** | 12.0 | Lenguaje de programacion |
| **ASP.NET Core** | 8.0 | Web API Framework |
| **Entity Framework Core** | 9.0.9 | ORM para base de datos MySQL local |
| **Dapper** | 2.1.72 | Micro-ORM para ejecucion de Stored Procedures en Profit 2K8 |
| **Pomelo Entity Framework** | 9.0.0 | Driver de alto rendimiento para MySQL / MariaDB |
| **Microsoft SqlClient** | 5.1.6 | Conectividad nativa con Microsoft SQL Server |
| **Azure Storage Blobs** | 12.27.0 | SDK de integracion con almacenamiento en la nube |
| **SixLabors ImageSharp** | 2.1.9 | Compresion y conversion WebP de imagenes de comprobantes |
| **FirebaseAdmin** | 3.4.0 | Integracion con el servicio FCM Push Notifications |
| **BCrypt.Net-Next** | 4.0.3 | Hashing y verificacion de contraseñas de usuarios |
| **Swashbuckle (Swagger)** | 6.6.2 | Documentacion interactiva OpenAPI |

---

**Desarrollado por Jose Gregorio Briceño Romero**  
*Ingenieria Informatica - Universidad Nacional Experimental del Tachira (UNET)*
