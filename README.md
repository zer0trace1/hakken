# HAKKEN Frontend

Frontend de **HAKKEN**, una plataforma OSINT orientada a la búsqueda y correlación de información pública a partir de distintos identificadores, como nombres, usernames, correos electrónicos, teléfonos, direcciones IP y dominios.

Este repositorio contiene la interfaz web de la aplicación, desarrollada con **Vue 3** y **Vite**. Desde el frontend se gestionan la landing page, el acceso autenticado al dashboard, las búsquedas OSINT, el historial, el módulo de Google Dorks y el sistema de investigaciones mediante grafos.

## Características principales

- Aplicación web desarrollada con Vue 3 y Vite.
- Landing page pública de presentación del proyecto.
- Dashboard privado para el uso de las funcionalidades OSINT.
- Integración con autenticación mediante AWS Cognito/OIDC.
- Comunicación con el backend de HAKKEN mediante API REST.
- Módulo de investigaciones con visualización de relaciones mediante grafos.
- Componentes separados para autenticación, dashboard, landing e investigaciones.
- Preparado para despliegue en Cloudflare Pages.

## Tecnologías utilizadas

- Vue 3
- Vite
- JavaScript
- Vue Router
- Vue Flow
- AWS Cognito / OIDC
- Cloudflare Pages
- HTML5 / CSS3

## Estructura del proyecto

```text
.
├── .vscode/
├── dist/
├── node_modules/
├── public/
├── src/
│   ├── assets/
│   ├── auth/
│   │   └── oidc.js
│   ├── components/
│   │   ├── AuthCallback.vue
│   │   ├── Dashboard.vue
│   │   ├── HakkenFlowNode.vue
│   │   ├── InvestigationFlowBoard.vue
│   │   └── Landing.vue
│   ├── router/
│   │   └── index.js
│   ├── services/
│   │   └── api.js
│   ├── App.vue
│   └── main.js
├── .gitignore
├── index.html
├── package-lock.json
├── package.json
├── README.md
└── vite.config.js
```

> Las carpetas `node_modules/` y `dist/` son generadas automáticamente y no deberían subirse al repositorio.

## Descripción de carpetas principales

- `public/`: recursos públicos servidos directamente por Vite.
- `src/`: código principal de la aplicación.
- `src/assets/`: imágenes, iconos y recursos visuales.
- `src/auth/`: configuración y lógica relacionada con autenticación OIDC.
- `src/components/`: componentes principales de la interfaz.
- `src/router/`: definición de rutas de la aplicación.
- `src/services/`: funciones para la comunicación con la API del backend.
- `App.vue`: componente raíz de la aplicación.
- `main.js`: punto de entrada del frontend.
- `vite.config.js`: configuración del proyecto Vite.

## Instalación en local

Instalar dependencias:

```bash
npm install
```

Ejecutar el proyecto en modo desarrollo:

```bash
npm run dev
```

Generar la versión de producción:

```bash
npm run build
```

Previsualizar la build de producción:

```bash
npm run preview
```

## Configuración

El frontend se comunica con el backend de HAKKEN a través del servicio definido en `src/services/api.js`.

La configuración relacionada con autenticación se encuentra en `src/auth/oidc.js`.

Este repositorio no incluye archivos de ejemplo de variables de entorno. En caso de usar archivos `.env` locales para desarrollo o despliegue, estos deben mantenerse fuera del control de versiones.

## Seguridad

Antes de subir cambios al repositorio, revisar que no se incluyan archivos o datos sensibles.

No deberían subirse:

- Archivos `.env`.
- Tokens o claves privadas.
- Credenciales de servicios externos.
- Información sensible de AWS Cognito que no deba publicarse.
- Resultados reales de búsquedas OSINT.
- Datos personales.
- La carpeta `node_modules/`.
- La carpeta `dist/`.

## Repositorio relacionado

Este frontend forma parte del proyecto HAKKEN y se complementa con el backend de la plataforma, disponible en un repositorio independiente.

## Licencia

Este proyecto se distribuye bajo licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más información.
