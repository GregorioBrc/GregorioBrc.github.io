# Sistema de Gestion de Partituras e Inventario - Estudiantina UNET "Eufrasio Medina"

[![Laravel 12](https://img.shields.io/badge/Laravel-12.x-FF2D20?style=flat-square&logo=laravel&logoColor=white)](https://laravel.com/)
[![PHP](https://img.shields.io/badge/PHP-8.2%2B-777BB4?style=flat-square&logo=php&logoColor=white)](https://php.net/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-7.0-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?style=flat-square&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![Pest / PHPUnit](https://img.shields.io/badge/Testing-Pest_PHP-00599C?style=flat-square)](https://pestphp.com/)

## Descripcion General

El **Sistema de Gestion de Partituras e Inventario** es una aplicacion web desarrollada sobre **Laravel 12** diseñada para catalogar, preservar y administrar el acervo musical e inventario fisico de la Estudiantina UNET "Eufrasio Medina", agrupacion institucional fundada en 1976 en la Universidad Nacional Experimental del Tachira (UNET).

La plataforma permite la digitalizacion de partituras, clasificacion de obras por instrumentacion y autor, generacion automatica de codigos QR para acceso rapido a documentos PDF o ejecuciones de referencia en video, y el control fisico de estantes, gavetas y prestamos para los integrantes de la agrupacion.

---

## Capacidades del Sistema y Modulos Principales

### Catalogación Musical Avanzada

* **Ficha Unificada de Obras y Partituras**: Vinculacion dinamica entre obras musicales, instrumentos requeridos, archivos PDF alojados en servidor y enlaces de video de referencia.
* **Generacion Automatica de Codigos QR**: Integracion con `SimpleSoftwareIO/SimpleQrCode` para generar codigos QR interactivos en tiempo real que permiten a los musicos escanear y descargar partituras directamente en sus dispositivos moviles.
* **Clasificacion por Autores y Contribuciones**: Modelo relacional intermedio que distingue entre compositores, arreglistas, letristas y transcriptores mediante la entidad pivot `contribuciones`.

### Control de Inventario Fisico y Prestamos

* **Ubicacion por Estantes y Gavetas**: Mapeo fisico del material impreso en el archivo de la Estudiantina (`estantes` / `gavetas`).
* **Registro de Prestamos (`prestamos`)**: Control de salida y devolucion de partituras fisicas asignadas a los usuarios del sistema (`usuarios_inventario`).

### Experiencia de Usuario y Personalizacion

* **Interfaz Adaptativa con Tailwind CSS 4**: Diseño responsivo optimizado para escritorios y telefonos moviles.
* **Soporte de Modo Oscuro Persistente**: Preferencia de tema almacenada en la base de datos por usuario (`dark_mode`) y conmutacion en caliente via AJAX.

---

## Arquitectura de Software y Modelo Relacional

El sistema esta construido siguiendo el patron **Model-View-Controller (MVC)** nativo de Laravel con componentes Blade reutilizables (`AppLayout`, `HeaderLanding`, `Footer`, `Alert`):

### Entidades de Datos Principales

* **`User`**: Usuarios de la aplicacion con diferenciacion de roles (`es_escritor = true` para administradores).
* **`obra`**: Registros musicales con titulo y año de composicion.
* **`autor`**: Compositores, arreglistas y colaboradores.
* **`partitura`**: Documento especifico asociado a una obra e instrumento, con URLs de PDF y video.
* **`instrumento`**: Catalogo de instrumentos (familia y tipo).
* **`estante`**: Almacenamiento fisico (gavetas).
* **`inventario`**: Relacion muchos a muchos entre partituras y estantes con control de cantidad disponible.
* **`prestamo`**: Registro transaccional de circulacion de material fisico.

---

## Control de Acceso y Middleware

El sistema implementa seguridad basada en middlewares de Laravel para proteger las rutas del sistema:

* **`AdminMiddleware`**: Restringe el acceso a los paneles CRUD de administracion (`/admin/*`) unicamente a usuarios con privilegios de escritura (`es_escritor = true`).
* **`UserMiddleware`**: Controla la navegacion de los musicos e integrantes regulares hacia sus partituras asignadas (`/usuario/*`).
* **`RedirectIfAuthenticated`**: Redirige automaticamente a los usuarios autenticados segun su rol al intentar acceder al formulario de login.

---

## Guia de Instalacion y Despliegue Local

### Requisitos Previos

* PHP 8.2 o superior con extensiones PDO y SQLite habilitadas.
* Composer 2.x.
* Node.js 18.x y npm.

### Pasos para la Configuracion

1. Clonar el repositorio e instalar dependencias PHP:

   ```bash
   composer install
   ```

2. Instalar dependencias de frontend:

   ```bash
   npm install
   ```

3. Configurar el archivo de entorno:

   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. Preparar la base de datos local SQLite y ejecutar migraciones con datos semilla:

   ```bash
   touch database/database.sqlite
   php artisan migrate --seed
   ```

5. Compilar los recursos frontend:

   ```bash
   npm run build
   ```

6. Iniciar el servidor local de desarrollo:

   ```bash
   php artisan serve --port 8050
   ```

7. Acceder en el navegador a `http://localhost:8050`.

---

## Pruebas Automatizadas

El proyecto incluye suites de prueba automatizadas mediante **Pest / PHPUnit** para verificar las reglas de negocio y los controladores de administracion:

```bash
php artisan test
```

---

**Desarrollado por:**
Jose Gregorio Briceño Romero
Francisco José Sanchez Zea
Axel Orlando Porras González
*Ingenieria Informatica - Universidad Nacional Experimental del Tachira (UNET)*
