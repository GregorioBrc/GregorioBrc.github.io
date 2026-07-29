# ProfitLocalAgent - Agente Servicio de Windows para Monitoreo y Telemetria ERP

[![.NET 8](https://img.shields.io/badge/.NET-8.0-512BD4?style=flat-square&logo=dotnet&logoColor=white)](https://dotnet.microsoft.com/)
[![C#](https://img.shields.io/badge/C%23-12.0-239120?style=flat-square&logo=c-sharp&logoColor=white)](https://docs.microsoft.com/en-us/dotnet/csharp/)
[![Windows Service](https://img.shields.io/badge/Windows-Service-0078D4?style=flat-square&logo=windows&logoColor=white)](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/host/hosted-services)
[![Serilog](https://img.shields.io/badge/Logging-Serilog-2B2B2B?style=flat-square)](https://serilog.net/)
[![SQL Server](https://img.shields.io/badge/SQL%20Server-Profit%202K8-CC292B?style=flat-square&logo=microsoft-sql-server&logoColor=white)](https://www.microsoft.com/sql-server/)

## Descripcion General

**ProfitLocalAgent** es un servicio de segundo plano (*Windows Worker Service*) diseñado para ejecutarse de forma persistente en la infraestructura local (*On-Premises*) donde reside el servidor de base de datos SQL Server del ERP Profit Plus 2K8.

Su objetivo principal es actuar como un **Agente de Borde (Edge Polling Agent)**, realizando inspecciones continuas sobre las tablas relacionales de Profit Plus 2K8 para detectar mutaciones de datos (cambios de precios, variaciones de inventario, ajustes de tasa cambiaria y creacion de clientes) e invocar de forma asincrona los procesos de sincronizacion de la Web API en la nube.

---

## Modulos Tecnicos y Arquitectura de Operacion

### Deteccion Reactiva de Eventos (Event-Driven Polling)

* **Inspeccion de Mutaciones en Tablas Legacy**: Muestra mediante consultas T-SQL optimizadas con bloques `TOP 1` la existencia de registros modificados o creados posteriormente a la ultima marca de tiempo registrada localmente (`fe_us_mo` / `fecha_reg`).
* **Sincronizacion de Tasa Cambiaria (Prioridad Alta)**: Detecta cambios inmediatos en la tabla `tasas` para la moneda `US$`. Al confirmar un cambio, dispara en orden la actualizacion de tasa centralizada y la revalorizacion forzada de precios de todo el catalogo en la nube.
* **Sincronizacion Incremental de Inventarios y Clientes**: Monitorea las tablas `art` y `clientes`, ejecutando peticiones HTTP diferenciales cuando detecta movimientos locales.

### Telemetria y Monitoreo de Salud (Heartbeat System)

* **Ping de Estado en Segundo Plano**: Transmite cada 15 minutos un paquete de telemetria en formato JSON hacia la Web API central mediante el endpoint `/api/Status/heartbeat`.
* **Diagnostico On-Premises**: Reporta en cada ciclo el estado de conectividad con SQL Server local, version del agente, marca de tiempo de la ultima sincronizacion exitosa y buffer de errores recientes en memoria.

### Resiliencia y Tolerancia a Fallos

* **Bucle de ConexiÃ³n Persistente (SqlServer Auto-Healing)**: Implementa una rutina de comprobacion previa (`EsperarPorSqlServer`) que bloquea la ejecucion del bucle principal hasta confirmar la disponibilidad del motor SQL Server, reintentando automaticamente cada 30 segundos en caso de reinicios del servidor.
* **Manejo de Lag de Commits**: Incorpora un retardo configurable (`_segunLag`) antes de notificar a la nube, garantizando que las transacciones pendientes del ERP hayan sido escritas fisicamente en disco antes de activar los procesos de lectura remotos.
* **Persistencia de Estado Local**: Almacena el ultimo estado conocido de sincronizacion en un archivo local comprimido (`sync_state.json`), asegurando la continuidad operativa ante apagones o reinicios del servicio de Windows.
* **Trazabilidad con Serilog**: Registro de logs con rotacion diaria de archivos (`RollingInterval.Day`) y limite de retencion para auditoria local.

---

## Ejecucion como Servicio de Windows Nativo

El proyecto utiliza la extension `Microsoft.Extensions.Hosting.WindowsServices`, permitiendo su instalacion y ejecucion en el Services Pipe de Windows Server bajo el identificador `IGBC Profit Sync Agent`.

### Comandos de Instalacion via PowerShell / CMD (Modo Administrador)

```powershell
# Creacion del Servicio de Windows
sc.exe create "IGBC Profit Sync Agent" binPath= "C:\Servicios\ProfitLocalAgent\ProfitLocalAgent.exe" start= auto

# Inicio del Servicio
sc.exe start "IGBC Profit Sync Agent"

# Estado del Servicio
sc.exe query "IGBC Profit Sync Agent"
