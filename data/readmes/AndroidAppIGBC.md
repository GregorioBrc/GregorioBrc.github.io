# Portal IGBC - Aplicación Móvil de Ventas y Pedidos

## 📱 Descripción General

Portal IGBC es una aplicación móvil empresarial desarrollada con .NET MAUI que permite gestionar el ciclo completo de ventas, pedidos y cobranzas para empresas distribuidoras. La aplicación está diseñada para tres tipos de usuarios: **Vendedores**, **Aprobadores** y **Administradores**, cada uno con funcionalidades específicas adaptadas a sus necesidades operativas.

![Versión](https://img.shields.io/badge/version-1.0.0-blue)
![Plataforma](https://img.shields.io/badge/platform-Android%20%7C%20Windows-success)
![Framework](https://img.shields.io/badge/framework-.NET%20MAUI%208.0-purple)

## 🎯 Características Principales

### Para Vendedores

- 📋 Gestión de catálogo de productos
- 🛒 Creación y seguimiento de pedidos
- 🏪 Gestión de clientes
- 📊 Historial de ventas y pedidos
- 💰 Módulo de cobranzas
- 👤 Perfil de usuario

### Para Aprobadores

- ✅ Aprobación/Rechazo de pedidos
- 📈 Dashboard de pedidos pendientes
- 📜 Historial detallado de pedidos aprobados
- 📋 Vista detallada de cada pedido

### Para Administradores

- 📊 Panel administrativo completo
- 👥 Gestión de vendedores
- 📦 Administración de pedidos globales
- 🔧 Control total del sistema

## 🏗️ Arquitectura y Tecnologías

### Stack Tecnológico

- **Frontend**: .NET MAUI 8.0 (Multi-plataforma)
- **Backend**: ASP.NET Core Web API
- **Autenticación**: JWT (JSON Web Tokens)
- **Base de Datos**: SQLite (local), SQL Server (remoto)
- **Comunicación en tiempo real**: SignalR
- **Notificaciones**: Firebase Cloud Messaging
- **Imágenes**: FFImageLoading

### Arquitectura MVVM (Model-View-ViewModel)

```
AndroidAppIGBC/
├── Views/               # Interfaces de usuario (XAML)
├── ViewModels/          # Lógica de presentación
├── Models/              # Modelos de datos
├── Services/            # Servicios y API
├── Clases_Api/         # Modelos de API
├── Platforms/          # Código específico de plataforma
└── Resources/          # Recursos e imágenes
```

## 📋 Requisitos Previos

### Para desarrollo

- Visual Studio 2022 (v17.8 o superior)
- .NET 8.0 SDK
- Android SDK (API 21 o superior)
- Windows 10 SDK (para plataforma Windows)

### Para producción

- Android 5.0 (API 21) o superior
- Windows 10 versión 19041.0 o superior

## 🚀 Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/AndroidAppIGBC.git
cd AndroidAppIGBC
```

### 2. Configurar la URL del API

Actualiza el archivo [`Services/Link_Api.cs`](Services/Link_Api.cs:7):

```csharp
public static string Link_Server = "https://tu-servidor-api.com";
```

### 3. Configurar Firebase (para notificaciones)

- Agrega tu archivo `google-services.json` en [`Platforms/Android/`](Platforms/Android/google-services.json)
- Configura el proyecto Firebase con Cloud Messaging habilitado

### 4. Restaurar Paquetes NuGet

```bash
dotnet restore
```

### 5. Compilar y Ejecutar

```bash
# Para Android
dotnet build -t:Run -f net8.0-android

# Para Windows
dotnet build -t:Run -f net8.0-windows10.0.19041.0
```

## 🔧 Configuración de la Base de Datos

La aplicación utiliza SQLite para almacenamiento local. Las tablas se crean automáticamente al iniciar la aplicación. Configuración en [`Definiciones/Def_SQLite.cs`](Definiciones/Def_SQLite.cs).

## 🌐 API Backend

La aplicación se conecta a un API RESTful. Los modelos principales incluyen:

- **Pedidos**: Gestión de órdenes de compra
- **Productos**: Catálogo de productos
- **Clientes**: Administración de clientes
- **Cobranzas**: Control de pagos
- **Usuarios**: Gestión de usuarios y roles

## 📱 Características Técnicas

### Seguridad

- Autenticación JWT con renovación automática
- Validación de tokens en cada petición
- Cierre de sesión automático por expiración
- Encriptación de datos sensibles

### Rendimiento

- Carga asíncrona de datos
- Caché inteligente de imágenes
- Paginación de listas largas
- Monitoreo de conectividad

### UX/UI

- Diseño responsive para diferentes tamaños de pantalla
- Temas de color personalizables
- Animaciones suaves
- Soporte multiidioma

### Notificaciones

- Push notifications con Firebase
- Configuración de canales de notificación específicos
- Sonidos y vibración personalizados
- Badge de notificaciones

## 🔐 Roles de Usuario

| Rol | Permisos | Vistas Específicas |
|-----|----------|-------------------|
| **Vendedor** | Crear pedidos, ver catálogo, gestionar clientes, cobranzas | [`Views/`](Views/) estándar |
| **Aprobador** | Aprobar/rechazar pedidos, ver historial | [`Views/ViewsAprobador/`](Views/ViewsAprobador/) |
| **Admin** | Control total del sistema | [`Views/ViewsAdm/`](Views/ViewsAdm/) |

### Pruebas en Dispositivo

- Conecta un dispositivo Android con modo desarrollador activado
- Ejecuta: `dotnet build -t:Run -f net8.0-android`

## 📦 Despliegue

### Android

1. Genera el APK firmado:

```bash
dotnet publish -f net8.0-android -c Release
```

1. El APK se generará en: `bin/Release/net8.0-android/publish/`

### Windows

1. Genera el MSIX:

```bash
dotnet publish -f net8.0-windows10.0.19041.0 -c Release
```

## 📝 Documentación de Código

El código está documentado siguiendo estándares XML de .NET. Para generar documentación:

```bash
dotnet build /p:DocumentationFile=bin\Debug\AndroidAppIGBC.xml
```
