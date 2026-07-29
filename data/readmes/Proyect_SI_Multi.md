# Portal Fullstack de Chat Multi-Proveedor LLM (ChatGPT Clone)

[![React 19](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.21-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?style=flat-square&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![Sequelize](https://img.shields.io/badge/Sequelize-ORM-52B0E7?style=flat-square&logo=sequelize&logoColor=white)](https://sequelize.org/)
[![Google Gemini](https://img.shields.io/badge/Google-Gemini%20API-4285F4?style=flat-square&logo=google&logoColor=white)](https://ai.google.dev/)
[![OpenAI](https://img.shields.io/badge/OpenAI-API-412991?style=flat-square&logo=openai&logoColor=white)](https://openai.com/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)

## Descripcion General

Esta aplicacion es una plataforma web Fullstack para interaccion conversacional con **Modelos de Lenguaje de Gran Escala (LLMs)** multi-proveedor. El sistema desacopla la capa de presentacion web de los proveedores de inteligencia artificial mediante una API Gateway centralizada en **Express.js** e **TypeScript**, permitiendo a los usuarios alternar dinamicamente entre modelos comerciales en la nube (Google Gemini, OpenAI, OpenRouter, Hugging Face) e instancias locales/remotas alojadas en Google Colab a traves de tuneles Cloudflare.

La plataforma gestiona sesiones autenticadas, historial persistente de conversaciones en formato JSON, parametros de generacion personalizados (temperatura, limite de tokens) y una interfaz reactiva construida sobre **React 19** y **Vite**.

---

## Integracion Multi-Proveedor LLM

El servidor backend expone controladores dedicados para abstraer las diferencias entre las APIs de cada proveedor:

### 1. Google Gemini Service (`geminiService.ts`)

* Integracion con la libreria oficial `@google/generative-ai`.
* Soporte para modelos como `gemini-2.0-flash-lite` y `gemini-2.0-flash`.
* Mapeo dinamico de instrucciones del sistema (*System Instructions*) y parametros de muestreo.

### 2. OpenAI / OpenRouter / Hugging Face Service (`openaiService.ts`)

* Implementacion con la libreria oficial `openai` configurando `baseURL` dinamico.
* Enrutamiento hacia endpoints compatibles con la especificacion OpenAI v1 para proveedores externos (Hugging Face Inference API y OpenRouter).

### 3. Local / Colab LLM Service (`llmService.ts`)

* Abstraccion mediante `axios` para conectar con servidores vLLM, Ollama o Text-Generation-WebUI alojados en entornos remotos a traves de Cloudflare Tunnels.
* Endpoints para la carga dinamica de modelos en VRAM (`/v1/internal/model/load`) e inspeccion de modelos disponibles (`/v1/internal/model/list`).

---

## Arquitectura del Sistema y Modulos

### Backend (Express + TypeScript + Sequelize)

* **Arquitectura Controller-Service**: Separacion estricta entre enrutadores (`routers/`), controladores de peticiones (`controllers/`), servicios de integracion (`services/`) y modelos de persistencia (`models/`).
* **ORM Sequelize con SQLite**: Persistencia relacional local en `database.sqlite` con almacenamiento de historial de mensajes en columnas de tipo `DataTypes.JSON`.
* **Cargador de Modelos Semilla**: Inicializacion automatica al arrancar la aplicacion con modelos base preconfigurados (`gemini-2.0-flash`, `Mistral-Nemo-Instruct`, `dolphin3.0-mistral-24b`).

### Frontend (React 19 + TypeScript + Vite)

* **Estado Global de Sesion (`AuthContext.tsx`)**: Gestion de autenticacion del usuario con persistencia en `localStorage`.
* **Componentes de Interfaz**:
  * `BarraLateral.tsx`: Barra de navegacion colapsable con seleccion de conversaciones, proveedores y modelos.
  * `Inicio.tsx`: Pantalla de bienvenida con entrada de texto inicial.
  * `Mensajes.tsx`: Renderizado continuo de hilos conversacionales con formato de saltos de linea.
* **Paginas y Rutas (`react-router-dom` v7)**: Vistas independientes para Login (`LoginPage.tsx`), Registro (`RegisterPage.tsx`) y Panel de Chat (`ChatPage.tsx`).

---

## Esquema de Persistencia Relacional

### Modelo: User (`User.ts`)

```typescript
{
  id: number;           // Clave primaria autoincremental
  username: string;     // Identificador de usuario unico
  mail: string;         // Correo electronico unico
  password: string;     // Credencial de acceso
}
```

### Modelo: Chat (`Chat.ts`)

```typescript
{
  id_C: number;         // Identificador secuencial por usuario
  userId: string;       // Identificador del usuario propietario
  messages: JSON;       // Array de objetos mensaje [{ role, content }]
}
```

### Modelo: Modelo (`Modelos.ts`)

```typescript
{
  id: number;           // Clave primaria autoincremental
  nombre: string;       // Nombre del modelo (ej: gemini-2.0-flash)
  servicio: string;     // Proveedor (Gemini, HuggingFace, OpenRouter, Colab)
}
```

---

## Especificacion de Endpoints de la API

### Autenticacion y Usuarios (`/api/user`)

* `POST /api/user/users` — Registro de nuevos usuarios y creacion de preferencias iniciales.
* `POST /api/user/Consult` — Autenticacion de credenciales y retorno de preferencias del usuario.
* `POST /api/user/chats` — Obtencion del historial de conversaciones del usuario autenticado.
* `DELETE /api/user/chats` — Eliminacion de una conversacion especifica.
* `POST /api/user/Models` — Obtencion del catalogo unificado de modelos registrados.

### Servicios de Inteligencia Artificial

* `POST /api/gemini/chat` — Procesamiento de mensajes mediante la API de Google Gemini.
* `POST /api/openai/chat` — Procesamiento mediante OpenAI, OpenRouter o Hugging Face.
* `POST /api/chatllm/chat` — Procesamiento mediante servidor local / Colab.
* `POST /api/chatllm/models/load` — Invocacion para la carga de modelos en VRAM remota.

---

## Guia de Instalacion y Ejecucion Local

### Requisitos Previos

* Node.js version 18.0 o superior.
* Gestor de paquetes npm version 9.0 o superior.

### Configuración del Backend

1. Navegar al directorio del servidor e instalar dependencias:

   ```bash
   cd Backend
   npm install
   ```

2. Crear archivo `.env` en la carpeta `Backend/` con las claves de API requeridas:

   ```env
   PORT=3015
   GEMINI_API_KEY=tu_clave_gemini
   huggingface_API_KEY=tu_clave_huggingface
   OpenRouter_API_KEY=tu_clave_openrouter
   ```

3. Iniciar el servidor en modo desarrollo:

   ```bash
   npm run dev
   ```

### Configuración del Frontend

1. Navegar al directorio de la interfaz web e instalar dependencias:

   ```bash
   cd ../frontend
   npm install
   ```

2. Iniciar el servidor de desarrollo de Vite:

   ```bash
   npm run dev
   ```

3. Acceder en el navegador a `http://localhost:5173`.

---

**Desarrollado por:**  
Jose Gregorio Briceño Romero  
Francisco José Sanchez Zea  
*Ingenieria Informatica - Universidad Nacional Experimental del Tachira (UNET)*
