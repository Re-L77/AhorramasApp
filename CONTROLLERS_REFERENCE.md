# 📚 Guía de Controladores - AHORRA+

Este documento describe todos los controladores disponibles y cómo usarlos en las screens. **Nota:** No modifiques los modelos ni controladores, solo úsalos en las screens.

---

## 1️⃣ UserController

### Propósito
Gestiona la autenticación y perfil de usuarios.

### Métodos Disponibles

#### `registrarUsuario(nombre, correo, telefono, contraseña)`
Registra un nuevo usuario.

```javascript
const resultado = await UserController.registrarUsuario(
  "Juan Pérez",
  "juan@example.com",
  "3015551234",
  "password123"
);

if (resultado.success) {
  // Usuario registrado correctamente
  // resultado.userId → ID del nuevo usuario
} else {
  // resultado.error → Mensaje de error
}
```

#### `autenticarUsuario(correo, contraseña)`
Autentica un usuario existente.

```javascript
const resultado = await UserController.autenticarUsuario(
  "juan@example.com",
  "password123"
);

if (resultado.success) {
  // resultado.usuario → { id, nombre, correo, telefono }
  // Usar para navegar a MainTabs
} else {
  // resultado.error → Mensaje de error
}
```

#### `obtenerPerfil(userId)`
Obtiene los datos del perfil del usuario.

```javascript
const resultado = await UserController.obtenerPerfil(userId);

if (resultado.success) {
  // resultado.usuario → { id, nombre, correo, telefono, fechaCreacion }
}
```

#### `actualizarPerfil(userId, nombre, correo, telefono)`
Actualiza la información del perfil.

```javascript
const resultado = await UserController.actualizarPerfil(
  userId,
  "Juan Pérez",
  "juan.nuevo@example.com",
  "3015559999"
);

if (resultado.success) {
  // Perfil actualizado correctamente
}
```

#### `cambiarContraseña(userId, contraseñaActual, nuevaContraseña, confirmContraseña)`
Cambia la contraseña del usuario.

```javascript
const resultado = await UserController.cambiarContraseña(
  userId,
  "password123",
  "nuevaPassword456",
  "nuevaPassword456"
);

if (resultado.success) {
  // Contraseña cambiada correctamente
}
```

---

## 2️⃣ TransactionController

### Propósito
Gestiona transacciones (ingresos y egresos).

### Métodos Disponibles

#### `crearTransaccion(userId, tipo, monto, descripcion, categoria)`
Crea una nueva transacción.

```javascript
const resultado = await TransactionController.crearTransaccion(
  userId,
  "egreso",           // "ingreso" o "egreso"
  150.50,             // Monto
  "Compra de comida", // Descripción
  "Alimentación"      // Categoría
);

if (resultado.success) {
  // resultado.transactionId → ID de la transacción
}
```

#### `obtenerTransacciones(userId)`
Obtiene todas las transacciones del usuario.

```javascript
const resultado = await TransactionController.obtenerTransacciones(userId);

if (resultado.success) {
  // resultado.transacciones → Array de transacciones
  // Cada una con: { id, userId, tipo, monto, descripcion, categoria, fecha }
}
```

#### `obtenerTransaccionesPorRango(userId, fechaInicio, fechaFin)`
Obtiene transacciones en un rango de fechas.

```javascript
const resultado = await TransactionController.obtenerTransaccionesPorRango(
  userId,
  "2024-11-01",
  "2024-11-30"
);

if (resultado.success) {
  // resultado.transacciones → Array filtrado
}
```

#### `obtenerTransaccionesPorCategoria(userId, categoria)`
Obtiene transacciones de una categoría específica.

```javascript
const resultado = await TransactionController.obtenerTransaccionesPorCategoria(
  userId,
  "Alimentación"
);

if (resultado.success) {
  // resultado.transacciones → Array de esa categoría
}
```

#### `actualizarTransaccion(transaccionId, tipo, monto, descripcion, categoria)`
Actualiza una transacción existente.

```javascript
const resultado = await TransactionController.actualizarTransaccion(
  transaccionId,
  "egreso",
  200.00,
  "Compra de mercado",
  "Alimentación"
);
```

#### `eliminarTransaccion(transaccionId, userId)`
Elimina una transacción.

```javascript
const resultado = await TransactionController.eliminarTransaccion(
  transaccionId,
  userId
);
```

#### `obtenerResumen(userId)`
Obtiene resumen financiero (ingresos, egresos, saldo).

```javascript
const resultado = await TransactionController.obtenerResumen(userId);

if (resultado.success) {
  // resultado.resumen → { ingresos, egresos, saldo }
}
```

---

## 3️⃣ BudgetController

### Propósito
Gestiona presupuestos mensuales por categoría.

### Métodos Disponibles

#### `crearPresupuesto(userId, categoria, montoLimite)`
Crea un presupuesto para una categoría.

```javascript
const resultado = await BudgetController.crearPresupuesto(
  userId,
  "Alimentación",
  500.00  // Monto límite mensual
);

if (resultado.success) {
  // resultado.budgetId → ID del presupuesto
}
```

#### `obtenerPresupuestos(userId)`
Obtiene todos los presupuestos del usuario para el mes actual.

```javascript
const resultado = await BudgetController.obtenerPresupuestos(userId);

if (resultado.success) {
  // resultado.presupuestos → Array con:
  // { id, categoria, montoLimite, montoActual, porcentajeUso, estado }
  // estado: "normal" o "excedido"
}
```

#### `actualizarPresupuesto(budgetId, montoLimite)`
Actualiza el límite de un presupuesto.

```javascript
const resultado = await BudgetController.actualizarPresupuesto(
  budgetId,
  600.00  // Nuevo límite
);
```

#### `eliminarPresupuesto(budgetId)`
Elimina un presupuesto.

```javascript
const resultado = await BudgetController.eliminarPresupuesto(budgetId);
```

#### `obtenerEstadoPresupuesto(userId)`
Obtiene el estado completo de los presupuestos.

```javascript
const resultado = await BudgetController.obtenerEstadoPresupuesto(userId);

if (resultado.success) {
  // resultado.estado → {
  //   totalPresupuestado,
  //   totalGastado,
  //   saldoDisponible,
  //   porcentajeGasto,
  //   categoriasExcedidas: [{ categoria, limite, gasto, exceso }]
  // }
}
```

#### `verificarAlertas(userId)`
Verifica y crea notificaciones de presupuestos al 80% o excedidos.

```javascript
const resultado = await BudgetController.verificarAlertas(userId);

// Crea automáticamente notificaciones si aplica
```

---

## 4️⃣ NotificationController

### Propósito
Gestiona notificaciones del usuario.

### Métodos Disponibles

#### `crearNotificacion(userId, titulo, descripcion, tipo)`
Crea una notificación.

```javascript
const resultado = await NotificationController.crearNotificacion(
  userId,
  "Presupuesto excedido",
  "Has excedido el presupuesto de Alimentación",
  "alerta"  // "alerta", "recordatorio", "logro", "info"
);

if (resultado.success) {
  // resultado.notificationId → ID de la notificación
}
```

#### `obtenerNotificaciones(userId, soloNoLeidas = false)`
Obtiene las notificaciones del usuario.

```javascript
const resultado = await NotificationController.obtenerNotificaciones(
  userId,
  false  // true para solo no leídas
);

if (resultado.success) {
  // resultado.notificaciones → Array de notificaciones
  // Cada una con: { id, userId, titulo, descripcion, tipo, fecha, leida }
}
```

#### `obtenerNotificacionesPorTipo(userId, tipo)`
Obtiene notificaciones de un tipo específico.

```javascript
const resultado = await NotificationController.obtenerNotificacionesPorTipo(
  userId,
  "alerta"
);

if (resultado.success) {
  // resultado.notificaciones → Array filtrado por tipo
}
```

#### `marcarComoLeida(notificationId)`
Marca una notificación como leída.

```javascript
const resultado = await NotificationController.marcarComoLeida(notificationId);
```

#### `marcarTodasComoLeidas(userId)`
Marca todas las notificaciones como leídas.

```javascript
const resultado = await NotificationController.marcarTodasComoLeidas(userId);
```

#### `eliminarNotificacion(notificationId)`
Elimina una notificación.

```javascript
const resultado = await NotificationController.eliminarNotificacion(notificationId);
```

#### `obtenerConteoNoLeidas(userId)`
Obtiene el número de notificaciones no leídas.

```javascript
const resultado = await NotificationController.obtenerConteoNoLeidas(userId);

if (resultado.success) {
  // resultado.noLeidas → Número de notificaciones no leídas
}
```

#### `obtenerResumen(userId)`
Obtiene un resumen de las notificaciones.

```javascript
const resultado = await NotificationController.obtenerResumen(userId);

if (resultado.success) {
  // resultado.resumen → {
  //   total: número total,
  //   noLeidas: número no leído,
  //   porTipo: { alerta, recordatorio, logro, info }
  // }
}
```

---

## 📱 Ejemplo: Integración en una Screen

```javascript
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { TransactionController } from '../controllers/TransactionController';

export default function MyScreen({ route }) {
  const [transacciones, setTransacciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const userId = route.params.userId;

  useEffect(() => {
    cargarTransacciones();
  }, []);

  const cargarTransacciones = async () => {
    const resultado = await TransactionController.obtenerTransacciones(userId);
    
    if (resultado.success) {
      setTransacciones(resultado.transacciones);
    } else {
      console.error('Error:', resultado.error);
    }
    
    setCargando(false);
  };

  const crearNuevaTransaccion = async () => {
    const resultado = await TransactionController.crearTransaccion(
      userId,
      "egreso",
      100,
      "Gasto",
      "Alimentación"
    );

    if (resultado.success) {
      // Recargar lista
      cargarTransacciones();
    } else {
      console.error('Error:', resultado.error);
    }
  };

  if (cargando) return <Text>Cargando...</Text>;

  return (
    <View>
      <Text>Total de transacciones: {transacciones.length}</Text>
      {/* Renderizar transacciones */}
    </View>
  );
}
```

---

## ✅ Estructura de Respuesta

Todos los controladores retornan objetos con esta estructura:

```javascript
{
  success: true/false,
  message: "Descripción de la operación",
  error: "Mensaje de error (solo si success es false)",
  // Datos específicos según el método:
  // usuario, transacciones, presupuestos, notificaciones, etc.
}
```

---

## 🔑 Categorías Predefinidas

Usa estas categorías en transacciones y presupuestos:

- Alimentación
- Transporte
- Vivienda
- Servicios
- Educación
- Entretenimiento
- Ahorro
- Otros

---

## 🚀 Notas Importantes

1. **No modificar controladores ni modelos** - Solo úsalos desde las screens
2. **Siempre verificar `success`** antes de usar los datos
3. **Los controladores funcionan en web y nativo** - No necesitas hacer nada especial
4. **Las fechas usan formato ISO** - `YYYY-MM-DD` o ISO string
5. **Los montos son números** - No strings
6. **El userId viene de la autenticación** - Pásalo siempre en los métodos

¡Listo para integrar en tus screens!
