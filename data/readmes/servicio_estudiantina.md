# 📚 Sistema de Gestión de Partituras - Estudiantina UNET "Eufrasio Medina"

<div align="center">

<img src="public/images/logo_unet_fondo.jpg" alt="Logo UNET" width="200"/>

[![Laravel](https://img.shields.io/badge/Laravel-12.x-orange?style=flat-square&logo=laravel)](https://laravel.com/)
[![PHP](https://img.shields.io/badge/PHP-8.2+-blue?style=flat-square&logo=php)](https://php.net/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

</div>

## 🎯 Descripción del Proyecto

El **Sistema de Gestión de Partituras** es una aplicación web desarrollada con Laravel que permite administrar de manera eficiente el catálogo musical de la Estudiantina UNET "Eufrasio Medina". Fundada en 1976, esta prestigiosa agrupación ha sido un pilar en la promoción de la música venezolana andina.

### ✨ Características Principales

- **Gestión integral de partituras** con información detallada de cada obra
- **Sistema de autenticación** con roles diferenciados (Administrador/Usuario)
- **Catálogo de autores e instrumentos** para clasificación organizada
- **Sistema de préstamos** para control de inventario físico
- **Interfaz responsive** adaptada a dispositivos móviles
- **Modo oscuro** para mejor experiencia visual
- **Generación de códigos QR** para acceso rápido a partituras

## 🏛️ Contexto Académico

Este proyecto forma parte del desarrollo de un sistema de información para la gestión del patrimonio musical de la Universidad Nacional Experimental del Táchira (UNET), específicamente para la Estudiantina "Eufrasio Medina".

### 📊 Estructura de Datos

El sistema gestiona las siguientes entidades principales:

- **📖 Partituras**: Catálogo digital de partituras musicales
- **✍️ Autores**: Compositores y arreglistas de las obras
- **🎵 Obras**: Información sobre las piezas musicales
- **🎸 Instrumentos**: Clasificación por instrumentos musicales
- **🏗️ Estantes**: Ubicación física del material
- **👥 Usuarios**: Sistema de gestión de usuarios multirol

## 🚀 Tecnologías Utilizadas

### Backend

- **Framework**: Laravel 12.x
- **Lenguaje**: PHP 8.2+
- **Base de Datos**: SQLite (desarrollo) / MySQL (producción)
- **ORM**: Eloquent
- **Autenticación**: Laravel Breeze

### Frontend

- **Framework CSS**: Tailwind CSS 4.x
- **Motor de Plantillas**: Blade
- **JavaScript**: ES6+
- **Build Tool**: Vite
- **Componentes**: Laravel Components

### Dependencias Principales

```json
{
  "laravel/framework": "^12.0",
  "simplesoftwareio/simple-qrcode": "^4.2",
  "tailwindcss": "^4.0.0",
  "vite": "^7.0.4"
}
```

## 📦 Instalación

### Requisitos Previos

- PHP 8.2 o superior
- Composer
- Node.js 16+ y npm
- SQLite (para desarrollo)

### Pasos de Instalación

1. **Clonar el repositorio**

```bash
git clone https://github.com/tu-usuario/sistema-partituras-unet.git
cd sistema-partituras-unet
```

1. **Instalar dependencias PHP**

```bash
composer install
```

1. **Instalar dependencias Node.js**

```bash
npm install
```

1. **Configurar el entorno**

```bash
cp .env.example .env
php artisan key:generate
```

1. **Base de datos**

```bash
touch database/database.sqlite
php artisan migrate
php artisan db:seed
```

1. **Compilar assets**

```bash
npm run dev
```

1. **Iniciar el servidor**

```bash
php artisan serve --port 8050
```

## 🎮 Uso del Sistema

### Acceso al Sistema

- **URL Principal**: `http://localhost:8050`
- **Usuario Admin**: Configurado durante la instalación
- **Sistema de Login**: Con recuperación de contraseña

### Funcionalidades por Rol

#### 👨‍💼 Administrador

- ✅ Gestión completa de usuarios
- ✅ CRUD de partituras, autores, obras e instrumentos
- ✅ Control de inventario y estantes
- ✅ Gestión de préstamos
- ✅ Sistema de contribuciones
- ✅ Panel de administración intuitivo

#### 👤 Usuario Regular

- 🔍 Visualización de partituras
- 📚 Catálogo por autor
- 👤 Gestión de perfil personal
- 🔑 Cambio de contraseña
- 🌓 Modo oscuro/claro

## 📁 Estructura del Proyecto

```
servicio_estudiantina/
├── app/
│   ├── Http/Controllers/    # Controladores de la aplicación
│   ├── Models/              # Modelos Eloquent
│   ├── View/Components/     # Componentes Blade reutilizables
│   └── Mail/                  # Correos electrónicos
├── config/                    # Archivos de configuración
├── database/
│   ├── migrations/           # Migraciones de base de datos
│   ├── seeders/              # Datos de prueba
│   └── factories/            # Generadores de datos
├── public/
│   └── images/               # Recursos estáticos
├── resources/
│   ├── css/                  # Estilos Tailwind CSS
│   ├── js/                   # JavaScript de la aplicación
│   ├── views/                # Vistas Blade
│   └── docs/                 # Documentación adicional
├── routes/                   # Rutas de la aplicación
└── storage/                  # Almacenamiento de archivos
```

## 🔒 Seguridad

- **Autenticación**: Sistema basado en sesiones seguras
- **Autorización**: Control de acceso basado en roles
- **Validación**: Validación de datos en servidor y cliente
- **Protección CSRF**: Tokens de seguridad en formularios
- **Encriptación**: Contraseñas hasheadas con bcrypt

## 🧪 Testing

El proyecto incluye pruebas automatizadas con PHPUnit:

```bash
# Ejecutar todas las pruebas
php artisan test

# Ejecutar pruebas específicas
php artisan test --filter=FeatureTest
```

## 🚀 Despliegue

### Optimización para Producción

```bash
# Optimizar la aplicación
php artisan optimize
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Compilar assets para producción
npm run build
```

### Variables de Entorno Importantes

```env
APP_NAME="Servicio Estudiantina UNET"
APP_ENV=production
APP_KEY=base64:...
APP_DEBUG=false
APP_URL=https://tudominio.com
```

## 📚 Documentación Adicional

- [Documentación de Mensajes de Administración](resources/docs/mensajes-administracion.md)
- [Laravel Documentation](https://laravel.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, sigue estos pasos:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 📞 Contacto

**Universidad Nacional Experimental del Táchira (UNET)**

- 📧 Email: <cultura@unet.edu.ve>
- 📞 Teléfono: +58 276 3532578
- 📍 Ubicación: Edf. 35 (A), primer piso

---

<div align="center">
  <p><strong>Desarrollado con ❤️ para la Estudiantina UNET "Eufrasio Medina"</strong></p>
  <p><em>"Promoviendo la música venezolana andina desde 1976"</em></p>
</div>
