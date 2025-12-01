# AhorramasApp

Aplicación móvil de gestión de finanzas personales desarrollada con React Native y Expo.

## Descripción

AhorramasApp es una herramienta para el control y seguimiento de gastos e ingresos personales. Permite a los usuarios registrar transacciones, establecer presupuestos por categoría y recibir notificaciones sobre el estado de sus finanzas.

## Características

- Autenticación de usuarios
- Registro de transacciones (ingresos y egresos)
- Gestión de presupuestos por categoría
- Sistema de notificaciones en tiempo real
- Visualización de estadísticas con gráficos
- Base de datos local (SQLite)
- Interfaz responsive

## Requisitos

- Node.js 14+
- npm o yarn
- Expo CLI
- Android Studio (para Android)
- Xcode (para iOS)

## Instalación

```bash
# Clonar repositorio
git clone https://github.com/Re-L77/AhorramasApp.git
cd AhorramasApp

# Instalar dependencias
npm install

# Iniciar en desarrollo
npx expo start
```

## Estructura del Proyecto

```
app/
├── controllers/      Lógica de negocio
├── models/          Acceso a datos y entidades
├── views/
│   ├── screens/     Pantallas principales
│   ├── components/  Componentes reutilizables
│   └── styles/      Estilos
├── navigation/      Configuración de navegación
├── services/        Servicios auxiliares
├── utils/           Funciones de utilidad
├── hooks/           Custom React hooks
└── config/          Configuración global
```

## Tecnologías

- React Native
- Expo
- React Navigation
- SQLite
- React Context API

## Desarrollo

### Estructura MVC

El proyecto sigue una arquitectura Model-View-Controller:

- **Models**: Entidades de datos (User, Transaction, Budget, Notification)
- **Controllers**: Lógica de negocio y validaciones
- **Views**: Componentes visuales organizados en screens y components

### Convenciones

- Los controllers contienen la lógica de negocio
- Los models manejan la interacción con la base de datos
- Los screens corresponden a pantallas completas
- Los components son elementos reutilizables
- Los services proporcionan funcionalidades transversales

## Compilación

### Android

```bash
npx expo build:android
```

### iOS

```bash
npx expo build:ios
```

## Contribuidores

- Juan Pablo Ordaz Magos
- Daniel Alexandro Castelo Castillo
- Carlos Ruiz Arvizu
- Vanesa Alejandra Vazquéz

## Licencia

Todos los derechos reservados. Re-L77
