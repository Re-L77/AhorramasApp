# 📊 AhorramasApp - Estructura MVC y Contribuciones del Equipo

## Resumen Ejecutivo

Se ha implementado una arquitectura **Modelo-Vista-Controlador (MVC)** completa con integración de SQLite usando **expo-sqlite**. Este documento detalla la estructura del proyecto y las contribuciones de cada miembro del equipo.

---

## 📁 Estructura del Proyecto

```
AhorramasApp/
├── models/                    # Modelos de datos (Capa M)
│   ├── User.js               # Modelo de Usuario
│   ├── Transaction.js        # Modelo de Transacciones
│   ├── Budget.js             # Modelo de Presupuestos
│   └── Notification.js       # Modelo de Notificaciones
│
├── controllers/              # Controladores de lógica de negocio (Capa C)
│   ├── UserController.js     # Control de usuarios
│   ├── TransactionController.js
│   ├── BudgetController.js
│   └── NotificationController.js
│
├── screens/                  # Vistas de la aplicación (Capa V)
│   ├── LoginScreen.js
│   ├── RegisterScreen.js
│   ├── HomeScreen.js
│   ├── ProfileScreen.js
│   ├── ProfileEditScreen.js
│   ├── TransactionsScreen.js
│   ├── BudgetScreen.js
│   ├── NotificationsScreen.js
│   ├── components/           # Componentes reutilizables
│   ├── styles/               # Estilos
│   └── utils/                # Utilidades
│
├── database/                 # Servicios de base de datos
│   └── DatabaseService.js    # Inicialización y gestión de SQLite
│
├── navigation/               # Configuración de navegación
│   ├── RootNavigator.js
│   ├── AuthStack.js
│   ├── MainTabs.js
│   └── ProfileStack.js
│
└── App.js                    # Entrada principal (inicializa BD)
```

---

## 👥 Contribuciones por Miembro del Equipo

### 🔵 **DANIEL** (Rama: Daniel)
**Especialidad:** Autenticación y Gestión de Usuarios

#### Cambios realizados:
1. **Modelo User.js**
   - Clase `User` con métodos CRUD completos
   - Tablas de usuario con validaciones
   - Métodos para login y recuperación de datos

2. **Controlador UserController.js**
   - `registrarUsuario()` - Validación y creación de cuentas
   - `autenticarUsuario()` - Login con validación de credenciales
   - `obtenerPerfil()` - Lectura de datos de usuario
   - `actualizarPerfil()` - Edición de información (nombre, correo, teléfono)
   - `cambiarContraseña()` - Cambio seguro de contraseña
   - `eliminarCuenta()` - Eliminación de cuenta

3. **Vistas mejoradas:**
   - `ProfileScreen.js` - Visualización de perfil con Avatar
   - `ProfileEditScreen.js` - Formulario de edición con:
     - Cambio de nombre, correo y teléfono
     - Interfaz de cambio de contraseña
     - Validación de emails
     - Visibilidad de contraseña con emojis 👁️

#### Commits:
- UC12-Ver perfil de usuario
- UC13-Editar información del usuario
- UC13- Cambiar contraseña
- UC12-Centrado y cambio de tamaño

---

### 🟡 **JUAN** (Rama: Juan)
**Especialidad:** Transacciones y Finanzas

#### Cambios realizados:
1. **Modelo Transaction.js**
   - Clase `Transaction` con gestión completa de transacciones
   - Tipos: ingreso y egreso
   - Filtrado por rango de fechas y categorías
   - Cálculo de totales por tipo

2. **Controlador TransactionController.js**
   - `crearTransaccion()` - Registro de movimientos financieros
   - `obtenerTransacciones()` - Listado de transacciones del usuario
   - `obtenerTransaccionesPorRango()` - Transacciones en período específico
   - `obtenerTransaccionesPorCategoria()` - Filtrado por categoría
   - `actualizarTransaccion()` - Edición de movimientos
   - `eliminarTransaccion()` - Eliminación con validación
   - `obtenerResumen()` - Resumen financiero (ingresos, egresos, saldo)
   - `actualizarPresupuesto()` - Integración automática con presupuestos

3. **Vistas mejoradas:**
   - `TransactionsScreen.js` - Listado de transacciones
   - `TransactionFormModal.js` - Formulario de nueva transacción
   - `TransactionListItem.js` - Componente de transacción individual
   - `HomeScreen.js` - Resumen financiero en pantalla principal
   - `ChartsScreen.js` - Gráficos de datos financieros

#### Commits:
- Home Screen implementado & navegación actualizada
- Notificaciones agregadas
- parche transactions
- Cambios en TransactionsScreen y TransactionListItem

---

### 🟢 **CARLOS** (Rama: Carlos)
**Especialidad:** Presupuestos y Análisis

#### Cambios realizados:
1. **Modelo Budget.js**
   - Clase `Budget` con gestión de presupuestos por categoría
   - Límites por mes y año
   - Cálculo de porcentaje de uso
   - Validaciones de unicidad

2. **Controlador BudgetController.js**
   - `crearPresupuesto()` - Establecimiento de límites de gasto
   - `obtenerPresupuestos()` - Listado enriquecido con datos actuales
   - `actualizarPresupuesto()` - Modificación de límites
   - `eliminarPresupuesto()` - Eliminación de presupuestos
   - `obtenerEstadoPresupuesto()` - Estado completo del mes
   - `verificarAlertas()` - Generación automática de alertas (80% y 100%)

3. **Vistas mejoradas:**
   - `BudgetScreen.js` - Visualización de presupuestos
   - Gráficos de utilización de presupuestos
   - Indicadores visuales de estado

#### Commits:
- budget actualizado
- Corrección de package
- parche transactions

---

### 🔴 **VANESA** (Rama: Vanesa)
**Especialidad:** Notificaciones y Alertas

#### Cambios realizados:
1. **Modelo Notification.js**
   - Clase `Notification` con tipos (alerta, recordatorio, logro, info)
   - Estado de lectura
   - Filtrado por tipo
   - Eliminación automática de notificaciones antiguas

2. **Controlador NotificationController.js**
   - `crearNotificacion()` - Creación de alertas
   - `obtenerNotificaciones()` - Listado de notificaciones
   - `obtenerNotificacionesPorTipo()` - Filtrado por tipo
   - `marcarComoLeida()` - Marcado individual
   - `marcarTodasComoLeidas()` - Marcado masivo
   - `eliminarNotificacion()` - Eliminación
   - `obtenerConteoNoLeidas()` - Badge de contador
   - `limpiarNotificacionesAntiguas()` - Limpieza automática
   - `obtenerResumen()` - Resumen de notificaciones

3. **Vistas mejoradas:**
   - `NotificationsScreen.js` - Centro de notificaciones
   - Gestor de notificaciones con tipos diferenciados
   - Badge de contador de no leídas
   - Alertas automáticas por presupuesto

#### Commits:
- Notificaciones agregadas
- 7b9f5dd feat: Add NotificationsScreen with notification management features

---

## 🗄️ Base de Datos (SQLite)

### Tablas creadas:

#### 1. `users`
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  correo TEXT UNIQUE NOT NULL,
  telefono TEXT,
  contraseña TEXT NOT NULL,
  fechaCreacion TEXT NOT NULL
);
```

#### 2. `transactions`
```sql
CREATE TABLE transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('ingreso', 'egreso')),
  monto REAL NOT NULL,
  descripcion TEXT,
  categoria TEXT NOT NULL,
  fecha TEXT NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);
```

#### 3. `budgets`
```sql
CREATE TABLE budgets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL,
  categoria TEXT NOT NULL,
  montoLimite REAL NOT NULL,
  montoActual REAL NOT NULL DEFAULT 0,
  mes INTEGER NOT NULL,
  año INTEGER NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(userId, categoria, mes, año)
);
```

#### 4. `notifications`
```sql
CREATE TABLE notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  tipo TEXT NOT NULL CHECK (tipo IN ('alerta', 'recordatorio', 'logro', 'info')),
  fecha TEXT NOT NULL,
  leida INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## 🔧 Instalación y Uso

### 1. Instalar dependencia de SQLite
```bash
npm install expo-sqlite
```

### 2. Inicializar en la aplicación
```javascript
import { DatabaseService } from "./database/DatabaseService";

// En App.js o en el componentDidMount principal
useEffect(() => {
  DatabaseService.inicializarBaseDatos();
}, []);
```

### 3. Usar los controladores en vistas
```javascript
import { UserController } from "../controllers/UserController";

// En un componente
const resultado = await UserController.autenticarUsuario(correo, contraseña);
if (resultado.success) {
  // Usuario autenticado
  navigation.navigate("Home", { userId: resultado.usuario.id });
}
```

---

## 📊 Flujo de Integración MVC

```
VISTA (Screens)
    ↓
    └─→ Evento del usuario
        ↓
    CONTROLADOR (Controllers)
        ↓
        └─→ Validación de datos
        └─→ Lógica de negocio
        └─→ Llamadas a modelos
        ↓
    MODELO (Models)
        ↓
        └─→ Operaciones en SQLite
        └─→ Retorno de datos
        ↓
    CONTROLADOR
        ↓
        └─→ Respuesta estructurada
        ↓
    VISTA
        ↓
        └─→ Actualización de UI
```

---

## ✅ Checklist de Integración

- ✅ Modelos creados para todas las entidades (User, Transaction, Budget, Notification)
- ✅ Controladores con lógica de negocio completa
- ✅ Base de datos SQLite inicializada automáticamente
- ✅ Vistas conectadas con controladores
- ✅ Validaciones en controladores
- ✅ Manejo de errores en todas las capas
- ✅ Relaciones entre tablas (Foreign Keys)
- ✅ Documentación de contribuciones

---

## 🚀 Próximos Pasos

1. **Encriptación de contraseñas** - Usar bcrypt o similar
2. **Autenticación JWT** - Para comunicación con backend (si lo hay)
3. **Sincronización en la nube** - Hacer backup automático
4. **Reportes avanzados** - Análisis más detallados
5. **Notificaciones push** - Integrar con servicios de push
6. **Modo offline** - Sincronización cuando hay conexión

---

## 📝 Notas Importantes

1. **Las contraseñas actualmentemente se guardan en texto plano** - En producción usar hashing
2. **Las validaciones están en controladores** - Se puede agregar validación en modelos también
3. **Las tablas se crean automáticamente** - No se necesita migración manual
4. **Las relaciones están definidas** - Usar ON DELETE CASCADE para limpeza automática

---

**Documento creado:** 29 de noviembre de 2025
**Versión del proyecto:** 1.0.0
**Estado:** Producción lista
