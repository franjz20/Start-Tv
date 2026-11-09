# StartTv - Streaming App

Aplicación de streaming de películas y series con arquitectura frontend-backend separada.

## Stack Tecnológico

### Frontend
- **Framework**: Vite + React 19 + TypeScript
- **Routing**: TanStack Router
- **State Management**: Zustand + TanStack Query
- **Styling**: Tailwind CSS + shadcn/ui
- **Streaming**: PlayLatinSRC (iframe)
- **Mobile**: Capacitor (APK/IPA)

### Backend
- **Runtime**: Node.js
- **Framework**: Express
- **Features**: Proxy para TMDB, rate limiting

## Características

- ✅ Catálogo de películas y series
- ✅ Búsqueda avanzada
- ✅ Sistema de favoritos (local storage)
- ✅ Soporte multi-idioma (español + inglés)
- ✅ Reproducción optimizada con PlayLatinSRC
- ✅ API Key protegida en backend
- ✅ Diseño minimalista responsive
- ✅ Compatible con Web, Móvil y SmartTV

## Estructura del Proyecto

```
StartTv/
├── backend/          # Backend Node.js + Express
│   ├── src/
│   │   ├── index.js      # Servidor principal
│   │   ├── routes/       # Rutas de la API
│   │   └── services/     # Servicios (TMDB)
│   ├── .env              # Variables de entorno del backend
│   └── package.json
├── src/              # Frontend React
│   ├── components/
│   ├── routes/
│   ├── services/
│   └── store/
├── .env              # Variables de entorno del frontend
└── package.json
```

## Instalación

### Backend

```bash
cd backend
npm install
```

Crear archivo `.env` en `backend/`:
```env
PORT=3001
TMDB_API_KEY=tu_api_key_de_tmdb
```

### Frontend

```bash
npm install
```

Crear archivo `.env` en la raíz:
```env
VITE_BACKEND_URL=http://localhost:3001
```

## Desarrollo

### Iniciar Backend

```bash
cd backend
npm run dev
```

### Iniciar Frontend

```bash
npm run dev
```

## Configuración de TMDB

Obtén tu API key gratuita en: https://www.themoviedb.org/settings/api

## Build para Web

```bash
npm run build
```

## Build para Móvil (Capacitor)

### Android

```bash
# Instalar dependencias de Android
npm install @capacitor/android
npx cap add android

# Build de la app web
npm run build

# Sincronizar con Capacitor
npx cap sync android

# Abrir Android Studio
npx cap open android
```

### iOS

```bash
# Instalar dependencias de iOS
npm install @capacitor/ios
npx cap add ios

# Build de la app web
npm run build

# Sincronizar con Capacitor
npx cap sync ios

# Abrir Xcode
npx cap open ios
```

## Optimizaciones de Reproducción

1. **Preconnect**: Conexión anticipada con PlayLatinSRC
2. **Persistent Player**: El iframe se mantiene activo para evitar recargas
3. **Eager Loading**: Carga inmediata del iframe
4. **Sandbox**: Permisos optimizados para el reproductor
5. **WebView Optimizations**: Configuración específica para Capacitor

## Seguridad

- La API key de TMDB está protegida en el backend
- El frontend nunca expone la API key de TMDB
- CORS configurado para permitir peticiones del frontend

## Licencia

Este proyecto es para fines educativos.
