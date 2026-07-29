# Agropecuaria - Sistema Desktop de Gestion Empresarial e Inventarios

[![.NET 8](https://img.shields.io/badge/.NET-8.0-512BD4?style=flat-square&logo=dotnet&logoColor=white)](https://dotnet.microsoft.com/)
[![C#](https://img.shields.io/badge/C%23-12.0-239120?style=flat-square&logo=c-sharp&logoColor=white)](https://docs.microsoft.com/en-us/dotnet/csharp/)
[![WPF](https://img.shields.io/badge/WPF-Desktop%20UI-0078D4?style=flat-square&logo=windows&logoColor=white)](https://docs.microsoft.com/en-us/dotnet/desktop/wpf/)
[![SQLite](https://img.shields.io/badge/SQLite-Embedded%20DB-003B57?style=flat-square&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![SQL Server](https://img.shields.io/badge/SQL%20Server-Enterprise%20DB-CC292B?style=flat-square&logo=microsoft-sql-server&logoColor=white)](https://www.microsoft.com/sql-server/)
[![NLog](https://img.shields.io/badge/Logging-NLog-512BD4?style=flat-square)](https://nlog-project.org/)

## Descripcion General

**Agropecuaria** es una solucion de software de escritorio empresarial desarrollada sobre **.NET 8.0** y **Windows Presentation Foundation (WPF)** diseñada para la administracion integral de inventarios, facturacion, gestion de clientes, proveedores y control financiero en empresas del sector agropecuario y comercial.

El sistema esta construido bajo patrones de diseño orientados a objetos (**MVVM**, **Repository Pattern** y **Singleton**), ofreciendo una interfaz grafica moderna y fluida con persistencia dual (SQLite local o SQL Server remoto), auditoria mediante logs en disco e inmutabilidad de transacciones comerciales.

---

## Modulos Funcionales Principales

### Control de Inventarios y Lotes

* **Seguimiento por Lotes y Vencimientos**: Trazabilidad detallada de insumos, medicinas y productos perecederos con fechas de caducidad.
* **Alertas de Stock Minimo**: Notificaciones dinamicas en interfaz cuando los niveles de existencias caen por debajo de los umbrales configurados.
* **Esquema de Precios Multinivel**: Soporte para multiples estructuras de precios diferenciadas por tipo de venta (Detal, Mayor, Especial).
* **Categorizacion Jerarquica**: Clasificacion organizada de articulos por grupos, familias y lineas comerciales.

### Facturacion y Administracion Comercial

* **Emision e Impresion de Documentos**: Generacion dinamica e impresion de facturas, notas de credito y comprobantes comerciales.
* **Gestion de Clientes y Proveedores**: Fichas unificadas con historial de compras, ventas, cuentas por cobrar y cuentas por pagar.
* **Procesamiento de Devoluciones**: Registro de anulaciones y devoluciones con reajuste automatico de inventario y saldos.

### Control Financiero y Auditoria

* **Conciliacion de Ingresos y Egresos**: Administracion de cajas, gastos operativos e inversiones comerciales.
* **Reportes y Analisis de Rentabilidad**: Generacion de informes consolidados de balance general, margen de ganancia y flujo de caja.
* **Logging y Diagnostico Asincrono**: Integracion con **NLog** para el registro estructurado de eventos, excepciones y auditoria de usuarios en archivos rodantes.

---

## Arquitectura del Sistema y Patrones de Diseño

El proyecto implementa una arquitectura en capas desacoplada para garantizar mantenibilidad, testing y escalabilidad:

### 1. Capa de Presentacion (WPF / XAML)

* Patron **MVVM (Model-View-ViewModel)** con data binding bidireccional y comandos (`ICommand`).
* Vistas modulares responsivas diseñadas en XAML con recursos globales de estilos y temas de color.

### 2. Capa de Logica de Negocio (BLL)

* Gestores de dominio encargados de las validaciones de negocio, calculo de impuestos, descuentos y reglas de inventario.
* Validacion estricta de consistencia previa al compromiso transaccional.

### 3. Capa de Acceso a Datos (DAL)

* Implementacion del patron **Repository**, abstrayendo el motor de base de datos subyacente.
* Soporte intercambiable para motor embebido **SQLite** (operacion stand-alone sin servidor) o **Microsoft SQL Server** (operacion multi-usuario en red local).

### 4. Servicios Transversales (Cross-Cutting)

* **Servicio de Seguridad**: Control de acceso granular basado en roles y permisos individuales por modulo (`Permiso_Inventario`, `Permiso_Editar_Producto`, `Permiso_Crear_Facturas`).
* **Servicio de Respaldo**: Backup automatico programado de la base de datos local hacia directorios de contingencia.

---

## Esquema de Base de Datos Principal

### Tabla: Usuario

```sql
CREATE TABLE Usuario (
    usuario VARCHAR(50) PRIMARY KEY,
    contraseña VARCHAR(250) NOT NULL,
    Mostrar BOOLEAN DEFAULT 1
);
```

### Tabla: Producto

```sql
CREATE TABLE Producto (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    Nombre VARCHAR(100) NOT NULL,
    cantidad_total_actual REAL DEFAULT 0,
    cantidad_minima INTEGER DEFAULT 0,
    precio_costo REAL DEFAULT 0,
    precio_venta_detal REAL DEFAULT 0,
    precio_venta_mayor REAL DEFAULT 0,
    precio_venta_especial REAL DEFAULT 0,
    grupo INTEGER
);
```

### Tabla: Clientes

```sql
CREATE TABLE Clientes (
    Cedula VARCHAR(20) PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    ubicacion VARCHAR(200)
);
```

---

## Tecnologias y Herramientas

| Tecnologia | Version | Aplicacion |
| --- | --- | --- |
| **.NET** | 8.0 | Runtime y framework de desarrollo |
| **C#** | 12.0 | Lenguaje de programacion |
| **WPF** | 8.0 | Framework de interfaz grafica nativo de Windows |
| **XAML** | - | Lenguaje de marcado declarativo para la UI |
| **SQLite** | 3.x | Engine de base de datos embebida local |
| **SQL Server** | 2019+ | Engine de base de datos relacional empresarial |
| **NLog** | 5.x | Framework de registro de eventos y errores |

---

## Requisitos de Despliegue

### Requisitos de Hardware

* **Procesador**: x64 a 1.5 GHz o superior.
* **Memoria RAM**: 2 GB minimo (4 GB recomendado).
* **Espacio en Disco**: 200 MB libres para instalacion y almacenamiento de logs.
* **Pantalla**: Resolucion minima de 1280x720 pixeles.

### Requisitos de Software

* **Sistema Operativo**: Windows 8/8.1 / Windows 10 / Windows 11 (x64).
* **Entorno de Ejecución**: Microsoft .NET 8.0 Desktop Runtime.

---

**Desarrollado por Jose Gregorio Briceño Romero**  
*Ingenieria Informatica - Universidad Nacional Experimental del Tachira (UNET)*
