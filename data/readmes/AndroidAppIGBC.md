# Portal IGBC - Aplicacion Movil Multiplataforma B2B (.NET 9 MAUI)

[![.NET 9](https://img.shields.io/badge/.NET-9.0-512BD4?style=flat-square&logo=dotnet&logoColor=white)](https://dotnet.microsoft.com/)
[![.NET MAUI](https://img.shields.io/badge/.NET%20MAUI-Multiplatform-512BD4?style=flat-square&logo=dotnet&logoColor=white)](https://dotnet.microsoft.com/apps/maui)
[![C#](https://img.shields.io/badge/C%23-12.0-239120?style=flat-square&logo=c-sharp&logoColor=white)](https://docs.microsoft.com/en-us/dotnet/csharp/)
[![Android](https://img.shields.io/badge/Android-API%2021%2B-3DDC84?style=flat-square&logo=android&logoColor=white)](https://developer.android.com/)
[![Windows](https://img.shields.io/badge/Windows-WinUI%203-0078D4?style=flat-square&logo=windows&logoColor=white)](https://docs.microsoft.com/en-us/windows/apps/winui/winui3/)
[![SQLite](https://img.shields.io/badge/SQLite-Local%20Cache-003B57?style=flat-square&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![SignalR](https://img.shields.io/badge/Real--Time-SignalR-512BD4?style=flat-square)](https://dotnet.microsoft.com/apps/aspnet/signalr)
[![Firebase FCM](https://img.shields.io/badge/Firebase-Push%20Notifications-FFCA28?style=flat-square&logo=firebase&logoColor=black)](https://firebase.google.com/)

## Descripcion General

**Portal IGBC** es una aplicacion movil y de escritorio multiplataforma desarrollada con **.NET 9 MAUI** orientada a la gestion comercial B2B, distribucion de inventarios, cobranza y automatizacion de la fuerza de ventas.

La aplicacion esta diseñada bajo el patron de arquitectura **MVVM (Model-View-ViewModel)** con inyeccion de dependencias nativa, tolerancia a fallos offline mediante almacenamiento SQLite, sincronizacion delta automatica, comunicacion bidireccional en tiempo real con SignalR e impresion de documentos mediante wrappers de la API nativa de Windows (Win32) y Android.

---

## Modulos Tecnicos y Arquitectura de Navegacion (5 Role Shells)

El sistema implementa una arquitectura de navegacion dinamica basada en **5 AppShells independientes**, restringiendo vistas, comandos y permisos segun el rol autenticado:

### 1. Portal del Vendedor (`AppShell`)

* **Creacion de Pedidos y Carrito Activo**: Formularios de venta con calculadora dinamica de descuentos, tasa del dia y conversion de moneda en tiempo real (USD / Bs).
* **Gestion de Clientes y Cartera**: Listado ordenado alfabeticamente o por RIF, ficha detallada del cliente, limite de credito y saldo a favor.
* **Persistencia de Borrador Activo (`ActiveOrderDraftService`)**: Guardado automatico del estado del carrito e insumos del formulario en `Preferences` para evitar la perdida de datos ante cierres inesperados.
* **Procesamiento de Pedidos Offline (`LocalPendingOrder`)**: En ausencia de conectividad, las ordenes se almacenan localmente en SQLite y se auto-envian al servidor mediante el escuchador `Connectivity.Current.ConnectivityChanged`.

### 2. Portal del Cobrador y Tesoreria (`CobradorAppShell`)

* **Analisis de Cartera por Colores (`ReporteCarteraPage`)**: Dashboard interactivo que clasifica cuentas por cobrar en tramos de riesgo por antiguedad (0-30, 31-35, 36-40, 41-45, +46 dias).
* **Gestion de Saldos a Favor (`SaldoFavorPage`)**: Edicion y consulta directa de billeteras virtuales y adelantos en dolares de clientes.
* **Explorador de Comprobantes Cloud (`BlobExplorerPage`)**: Navegador jerarquico de archivos para la inspeccion de imagenes de comprobantes almacenadas en Azure Blob Storage.
* **Aprobacion y Edicion Inline de Pagos (`ConfirmarPagoPage` / `DetallePagoPage`)**: Confirmacion financiera de cobros y depositos bancarios con edicion de referencias, montos y fechas en caliente previa inyeccion al ERP.

### 3. Portal de Aprobacion Operativa (`AprobadorAppShell`)

* **Revision y Modificacion de Renglones**: Habilitacion de edicion de cantidades, precios o aplicacion de descuentos sobre pedidos antes de la facturacion.
* **Borrador de Aprobacion (`AprobadorDraftService`)**: Guardado temporal local de las modificaciones sugeridas por el aprobador.
* **Visualizacion de Ordenes Divididas (`OrdenesHijas`)**: Navegacion jerarquica por sub-pedidos generados automaticamente por limites de renglones o segregacion de promociones.
* **Forzado de Confirmacion (`ForzarConfirmacionCommand`)**: Mecanismo para avanzar pedidos en estado de revision del vendedor.

### 4. Portal del Administrador (`AdminAppShell`)

* **Monitoreo Global de Fuerza de Ventas**: Ubicación GPS de vendedores, estado de conexion online/offline, gestion de dispositivos autorizados y bloqueo de acceso.
* **Aprobación de Dispositivos (`DispositivosController`)**: Control de acceso basado en el hash del hardware (`DeviceId`) del telefono movil.
* **Configuracion de Escalas de Descuento**: Definicion de reglas de descuento por tipo de pago, moneda y monto minimo.

### 5. Portal Cliente B2B (`ClienteAppShell`)

* **Auto-Servicio B2B**: Catalogo digital con aplicacion automatica de promociones y descuentos por volumen de compra.
* **Seguimiento de Estado**: Consulta del estado de procesamiento de pedidos en tiempo real.

---

## Estrategia de Persistencia Local y Sincronización Asincrona

### Sincronización Delta de Catalogo (`CatalogAutoSyncService`)

Un servicio en segundo plano ejecuta peticiones ciclicas cada 5 minutos hacia `/api/Productos/updates?lastSync=...`. El servidor retorna exclusivamente la lista de productos modificados (`Producto_DynamicUpdate_ODT`) o creados desde la ultima sincronizacion, reduciendo drásticamente el consumo de datos moviles.

### Caché SQLite del Dashboard (`DashboardCacheService`)

Implementacion de persistencia en SQLite para las metricas del inicio, garantizando que el vendedor pueda visualizar indicadores de venta, saldo pendiente y catalogo promocional de forma instantanea sin latencia de red.

### Monitoreo de Stock en Tiempo Real (`StockMonitoringService`)

Conexion via **SignalR** que escucha eventos de actualizacion de inventario (`OnStockActualizado`). Si otro usuario o el ERP modifica el stock de un producto presente en el carrito del vendedor, la aplicacion ajusta dinamicamente la cantidad permitida y notifica al usuario mediante `InAppNotificationService`.

---

## Impresion Nativa y Exportacion a PDF (`PrinfService`)

La aplicacion incluye un motor de impresion multiplataforma en HTML/CSS que construye documentos en memoria (`PrinfHtmlBuilder`):

* **Android**: Integracion con el componente `PrintManager` de Android OS a traves de un `WebView` oculto.
* **Windows (WinUI 3)**: Uso de `WebView2` combinado con invocaciones P/Invoke a la API nativa de Windows (`user32.dll`: `EnumWindows`, `GetClassName`, `SwitchToThisWindow`) para forzar el enfoque de la ventana nativa de impresion del sistema, exportacion directa a archivo PDF mediante `PrintToPdfAsync` y uso de `FileSavePicker` asociado al identificador de la ventana (`WindowNative.GetWindowHandle`).

---

## Herramientas de Desarrollo y Diagnostico Embebidas (`DevPage`)

La aplicacion incorpora un panel de diagnostico interno para entornos de prueba:

* **Server Override**: Permite cambiar en caliente la URL del servidor backend entre entornos de desarrollo, pruebas o produccion sin recomputar el paquete.
* **Token Override**: Inyeccion manual de tokens JWT para simular sesiones de usuario.
* **Consola de Registros**: Captura de logs de ejecucion, respuestas de red y excepciones con opcion de copia al portapapeles.
* **Pruebas de Red**: Diagnostico de latencia Ping HTTP, estado de API `/health` y verificacion de socket SignalR.
* **Mantenimiento**: Comandos para vaciado de tablas SQLite y eliminacion limpia de SecureStorage.

---

## Stack Tecnologico

| Tecnologia | Version | Aplicacion |
| --- | --- | --- |
| **.NET** | 9.0 | Framework ejecutor multiplataforma |
| **.NET MAUI** | 9.0 | Framework UI para Android y Windows |
| **C#** | 12.0 | Lenguaje de programacion |
| **SQLite-net PCL** | 1.9.172 | Persistencia y base de datos local en el dispositivo |
| **SignalR Client** | 10.0.0 | Comunicacion en tiempo real por WebSockets |
| **FFImageLoading MAUI** | 1.3.2 | Carga optimizada y cache en memoria/disco de imagenes |
| **Plugin.Firebase** | 3.1.4 | Recepcion de notificaciones Push FCM en Android |
| **System.IdentityModel.Tokens.Jwt** | 7.6.0 | Decodificacion y validacion de claims JWT localmente |

---

## Estructura del Proyecto

```
AndroidAppIGBC/
├── Clases_Api/              # Modelos ODT y DTOs de transferencia con la Web API
├── Converters/              # Conversores ValueConverters para XAML
├── Definiciones/            # Constantes de configuracion, llaves y endpoints
├── Models/                  # Entidades de SQLite local, modelos picker y cache
├── Platforms/               # Codigo especifico de plataforma (Android / Windows)
│   ├── Android/             # Services nativos de notificaciones y PrintManager
│   └── Windows/             # WinUI 3 y wrappers de llamadas Win32 API
├── Resources/               # Estilos, colores, fuentes SVG e imagenes
├── Services/                # Servicios de negocio, autenticacion, API y sincronizacion
│   ├── Api/                 # Cliente HTTP centralizado con manejo de refresco JWT
│   ├── Auth/                # Almacenamiento seguro de tokens (SecureStorage)
│   ├── Background/          # Workers de sincronizacion en segundo plano
│   ├── Cache/               # Administracion de base de datos SQLite
│   ├── Pedido/              # Calculadora de precios, promociones y borradores
│   ├── printfService/       # Generador HTML e integracion nativa de impresion
│   └── SignalR/             # Suscriptor de eventos sockets en tiempo real
├── ViewModels/              # ViewModels organizados por subcarpetas de rol
│   ├── ViewModelsAdm/       # ViewModels del Administrador
│   ├── ViewModelsAprobador/ # ViewModels del Aprobador
│   ├── ViewModelsCliente/   # ViewModels del Cliente B2B
│   └── ViewModelsCobrador/  # ViewModels del Cobrador / Tesoreria
└── Views/                   # Vistas XAML organizadas por subcarpetas de rol
```

---

**Desarrollado por Jose Gregorio Briceño Romero**  
*Ingenieria Informatica - Universidad Nacional Experimental del Tachira (UNET)*
