# 🏦 AhorramasApp - Guía de Uso Rápida

## 🚀 Inicio Rápido

### Requisitos
- Node.js 18+
- npm o yarn
- Expo CLI: `npm install -g expo-cli`

### Instalación

```bash
# Clonar repositorio
git clone https://github.com/Re-L77/AhorramasApp.git
cd AhorramasApp

# Instalar dependencias
npm install
```

### Ejecutar la Aplicación

#### En Desarrollo (Web)
```bash
npm start
# Luego presiona 'w' para web, o 'i' para iOS, o 'a' para Android
```

#### En Web directamente
```bash
npm run web
```

#### En Android
```bash
npm run android
```

#### En iOS
```bash
npm run ios
```

---

## ⚙️ Configuración de Base de Datos

### Nota Importante

- **SQLite**: Se usa en iOS/Android
- **localStorage**: Se usa en web (desarrollo)
- **Inicialización automática**: Ocurre al iniciar la app

Si ves advertencias sobre WASM, **es normal en web**. La app funcionará correctamente usando localStorage.

---

## 📱 Estructura MVC Implementada

### Modelos (Models)
Ubicación: `/models`
- `User.js` - Gestión de usuarios
- `Transaction.js` - Transacciones financieras
- `Budget.js` - Presupuestos
- `Notification.js` - Notificaciones

### Controladores (Controllers)
Ubicación: `/controllers`
- `UserController.js` - Lógica de autenticación y perfil
- `TransactionController.js` - Lógica de transacciones
- `BudgetController.js` - Lógica de presupuestos
- `NotificationController.js` - Lógica de notificaciones

### Vistas (Screens)
Ubicación: `/screens`
- `LoginScreen.js` - Pantalla de login
- `RegisterScreen.js` - Pantalla de registro
- `HomeScreen.js` - Pantalla principal
- `ProfileScreen.js` - Perfil del usuario
- `TransactionsScreen.js` - Lista de transacciones
- `BudgetScreen.js` - Presupuestos
- `NotificationsScreen.js` - Centro de notificaciones

---

## 💡 Ejemplos de Uso

### Autenticar Usuario

```javascript
import { UserController } from '../controllers/UserController';

// En un componente
const handleLogin = async () => {
  const result = await UserController.autenticarUsuario(correo, contraseña);
  
  if (result.success) {
    console.log('Usuario autenticado:', result.usuario);
    navigation.navigate('Home', { userId: result.usuario.id });
  } else {
    alert('Error: ' + result.error);
  }
};
```

### Crear Transacción

```javascript
import { TransactionController } from '../controllers/TransactionController';

const handleCreateTransaction = async (userId) => {
  const result = await TransactionController.crearTransaccion(
    userId,
    'egreso',                    // tipo
    50.00,                       // monto
    'Almuerzo en restaurante',   // descripción
    'Comida'                     // categoría
  );

  if (result.success) {
    console.log('Transacción creada:', result.transactionId);
  }
};
```

### Obtener Resumen Financiero

```javascript
import { TransactionController } from '../controllers/TransactionController';

const handleGetSummary = async (userId) => {
  const result = await TransactionController.obtenerResumen(userId);
  
  if (result.success) {
    const { ingresos, egresos, saldo } = result.resumen;
    console.log(`Ingresos: $${ingresos}`);
    console.log(`Egresos: $${egresos}`);
    console.log(`Saldo: $${saldo}`);
  }
};
```

### Crear Notificación

```javascript
import { NotificationController } from '../controllers/NotificationController';

const handleNotification = async (userId) => {
  const result = await NotificationController.crearNotificacion(
    userId,
    '⚠️ Presupuesto Bajo',
    'Tu presupuesto de comida está casi agotado',
    'alerta'
  );
};
```

---

## 📊 Tipos de Datos

### Transacciones
- **Tipo**: 'ingreso' | 'egreso'
- **Categoría**: 'Comida', 'Transporte', 'Entretenimiento', 'Salud', etc.

### Notificaciones
- **Tipo**: 'alerta' | 'recordatorio' | 'logro' | 'info'

---

## 🐛 Solución de Problemas

### Error: "Unable to resolve './wa-sqlite/wa-sqlite.wasm'"
**Solución**: Esto es normal en web. La app usará localStorage en lugar de SQLite.

### Error: "Module not found: expo-sqlite"
**Solución**: 
```bash
npm install expo-sqlite
```

### La app no inicia
**Solución**:
```bash
# Limpiar caché
rm -rf node_modules package-lock.json
npm install

# Reiniciar Expo
npm start
```

---

## 📚 Documentación Completa

Ver archivos:
- `ARCHITECTURE_MVC.md` - Detalles técnicos de la arquitectura
- `INTEGRATION_SUMMARY.md` - Resumen de contribuciones del equipo

---

## 👥 Equipo

- **Daniel** - Autenticación y perfil de usuario
- **Juan** - Transacciones y finanzas
- **Carlos** - Presupuestos y análisis
- **Vanesa** - Notificaciones y alertas

---

## 📝 Licencia

Proyecto privado - Re-L77/AhorramasApp

---

## 🔗 Enlaces Útiles

- [Documentación de Expo](https://docs.expo.dev)
- [Documentación de React Native](https://reactnative.dev)
- [expo-sqlite Docs](https://docs.expo.dev/versions/latest/sdk/sqlite/)
- [Repositorio](https://github.com/Re-L77/AhorramasApp)

---

**Última actualización:** 29 de Noviembre de 2025
