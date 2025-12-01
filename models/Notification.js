// models/Notification.js
/**
 * Modelo de Notificaciones
 * Define la estructura y operaciones de la entidad Notificación
 * Autor: Vanesa
 */

import { Platform } from 'react-native';
import * as SQLite from 'expo-sqlite';

let db = null;

// Lazy load de la BD
const getDB = () => {
  if (Platform.OS !== 'web' && !db) {
    db = SQLite.openDatabaseSync('ahorramasapp.db');
  }
  return db;
};

// Datos iniciales de prueba
const INITIAL_NOTIFICATIONS = [
  // Usuario 1 - Notificaciones de ingresos
  { id: 1, userId: 1, titulo: 'Ingreso registrado', descripcion: 'Se registró un ingreso de $3000 (Salario mensual)', tipo: 'logro', fecha: '2025-11-01', leida: 1 },
  { id: 2, userId: 1, titulo: 'Ingreso registrado', descripcion: 'Se registró un ingreso de $500 (Bonificación)', tipo: 'logro', fecha: '2025-11-05', leida: 1 },
  { id: 3, userId: 1, titulo: 'Ingreso registrado', descripcion: 'Se registró un ingreso de $200 (Freelance trabajo)', tipo: 'logro', fecha: '2025-11-10', leida: 1 },
  { id: 22, userId: 1, titulo: 'Ingreso registrado', descripcion: 'Se registró un ingreso de $150 (Reembolso)', tipo: 'logro', fecha: '2025-11-18', leida: 0 },

  // Usuario 1 - Notificaciones de gastos
  { id: 4, userId: 1, titulo: 'Gasto registrado', descripcion: 'Se registró un gasto de $150 (Supermercado)', tipo: 'info', fecha: '2025-11-02', leida: 1 },
  { id: 5, userId: 1, titulo: 'Gasto registrado', descripcion: 'Se registró un gasto de $200 (Servicios)', tipo: 'info', fecha: '2025-11-01', leida: 1 },
  { id: 6, userId: 1, titulo: 'Gasto registrado', descripcion: 'Se registró un gasto de $50 (Gasolina)', tipo: 'info', fecha: '2025-11-03', leida: 1 },
  { id: 23, userId: 1, titulo: 'Gasto registrado', descripcion: 'Se registró un gasto de $80 (Restaurante)', tipo: 'info', fecha: '2025-11-17', leida: 0 },
  { id: 24, userId: 1, titulo: 'Gasto registrado', descripcion: 'Se registró un gasto de $120 (Medicinas)', tipo: 'info', fecha: '2025-11-19', leida: 0 },
  { id: 25, userId: 1, titulo: 'Gasto registrado', descripcion: 'Se registró un gasto de $45 (Transporte)', tipo: 'info', fecha: '2025-11-20', leida: 1 },

  // Usuario 1 - Notificaciones de presupuesto
  { id: 7, userId: 1, titulo: 'Presupuesto excedido', descripcion: 'Has excedido el presupuesto de Alimentación', tipo: 'alerta', fecha: '2025-11-15', leida: 0 },
  { id: 8, userId: 1, titulo: 'Advertencia de presupuesto', descripcion: 'Tu presupuesto de Servicios está al 80%', tipo: 'alerta', fecha: '2025-11-07', leida: 1 },
  { id: 26, userId: 1, titulo: 'Presupuesto disponible', descripcion: 'Tu presupuesto de Entretenimiento tiene $150 disponibles', tipo: 'info', fecha: '2025-11-16', leida: 1 },

  // Usuario 1 - Notificaciones de logros
  { id: 9, userId: 1, titulo: 'Meta de ahorro alcanzada', descripcion: '¡Felicidades! Alcanzaste tu meta de ahorro mensual', tipo: 'logro', fecha: '2025-11-14', leida: 1 },
  { id: 10, userId: 1, titulo: 'Logro desbloqueado', descripcion: 'Completaste 15 transacciones este mes', tipo: 'logro', fecha: '2025-11-16', leida: 0 },
  { id: 27, userId: 1, titulo: 'Racha de ahorro', descripcion: 'Llevas 5 días consecutivos ahorrando dinero', tipo: 'logro', fecha: '2025-11-21', leida: 0 },
  { id: 28, userId: 1, titulo: 'Presupuesto balanceado', descripcion: 'Mantuviste el balance perfecto este mes', tipo: 'logro', fecha: '2025-11-11', leida: 1 },

  // Usuario 1 - Notificación de bienvenida y recordatorios
  { id: 11, userId: 1, titulo: 'Bienvenido a Ahorra+', descripcion: 'Comienza a rastrear tus finanzas hoy', tipo: 'recordatorio', fecha: '2025-11-01', leida: 1 },
  { id: 29, userId: 1, titulo: 'Recordatorio', descripcion: 'No olvides registrar tus gastos del día', tipo: 'recordatorio', fecha: '2025-11-22', leida: 1 },
  { id: 30, userId: 1, titulo: 'Resumen mensual', descripcion: 'Tu resumen financiero de noviembre está listo', tipo: 'recordatorio', fecha: '2025-11-30', leida: 1 },

  // Otros usuarios
  { id: 12, userId: 2, titulo: 'Bienvenido a Ahorra+', descripcion: 'Comienza a rastrear tus finanzas hoy', tipo: 'recordatorio', fecha: '2025-11-01', leida: 1 },
  { id: 13, userId: 3, titulo: 'Bienvenido a Ahorra+', descripcion: 'Comienza a rastrear tus finanzas hoy', tipo: 'recordatorio', fecha: '2025-11-01', leida: 0 }
];

export class Notification {
  constructor(id, userId, titulo, descripcion, tipo, fecha, leida) {
    this.id = id;
    this.userId = userId;
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.tipo = tipo; // 'alerta', 'recordatorio', 'logro', 'info'
    this.fecha = fecha;
    this.leida = leida;
  }

  // Getter methods
  getId() {
    return this.id;
  }

  getUserId() {
    return this.userId;
  }

  getTitulo() {
    return this.titulo;
  }

  getDescripcion() {
    return this.descripcion;
  }

  getTipo() {
    return this.tipo;
  }

  getFecha() {
    return this.fecha;
  }

  getLeida() {
    return this.leida;
  }

  // Setter methods
  setLeida(leida) {
    this.leida = leida;
  }

  // Métodos estáticos para operaciones de base de datos
  static async initializeTable() {
    try {
      if (Platform.OS === 'web') {
        if (!localStorage.getItem('notificaciones')) {
          localStorage.setItem('notificaciones', JSON.stringify(INITIAL_NOTIFICATIONS));
        }
        console.log('Tabla notificaciones creada o ya existe en localStorage');
        return;
      }

      const database = getDB();

      // Intentar crear la tabla con el nuevo esquema
      try {
        await database.execAsync(`
          CREATE TABLE IF NOT EXISTS notifications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER NOT NULL,
            titulo TEXT NOT NULL,
            descripcion TEXT,
            tipo TEXT NOT NULL CHECK (tipo IN ('alerta', 'recordatorio', 'logro', 'info')),
            fecha TEXT NOT NULL,
            leida INTEGER NOT NULL DEFAULT 0,
            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
          );
        `);
      } catch (error) {
        // Si falla, probablemente la tabla existe con esquema viejo, intentar recrearla
        console.warn('Tabla notifications existe con esquema antiguo, recreando...', error);
        await database.execAsync('DROP TABLE IF EXISTS notifications;');
        await database.execAsync(`
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
        `);
      }

      // Verificar si la tabla está vacía y cargar datos iniciales
      const notificaciones = await database.getAllAsync('SELECT COUNT(*) as count FROM notifications');
      if (notificaciones[0].count === 0) {
        for (const notificacion of INITIAL_NOTIFICATIONS) {
          await database.runAsync(
            `INSERT INTO notifications (id, userId, titulo, descripcion, tipo, fecha, leida)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [notificacion.id, notificacion.userId, notificacion.titulo, notificacion.descripcion || notificacion.contenido || '', notificacion.tipo, notificacion.fecha, notificacion.leida ? 1 : 0]
          );
        }
        console.log('✅ Datos iniciales cargados en SQLite (notificaciones)');
      }

      console.log('Tabla notifications creada o ya existe');
    } catch (error) {
      console.error('Error al crear tabla notifications:', error);
      throw error;
    }
  }

  static async crearNotificacion(userId, titulo, descripcion, tipo, fecha) {
    try {
      console.log('📝 Notification.crearNotificacion:', { userId, titulo, tipo, fecha });

      if (Platform.OS === 'web') {
        return this._crearNotificacionWeb(userId, titulo, descripcion, tipo, fecha);
      }

      const database = getDB();
      const resultado = await database.runAsync(
        `INSERT INTO notifications (userId, titulo, descripcion, tipo, fecha, leida)
         VALUES (?, ?, ?, ?, ?, 0)`,
        [userId, titulo, descripcion, tipo, fecha]
      );

      console.log('✅ Notificación insertada con ID:', resultado.lastInsertRowId);
      return resultado.lastInsertRowId;
    } catch (error) {
      console.error('❌ Error al crear notificación:', error);
      throw error;
    }
  }

  static _crearNotificacionWeb(userId, titulo, descripcion, tipo, fecha) {
    try {
      const notificaciones = JSON.parse(localStorage.getItem('notificaciones') || '[]');
      const id = notificaciones.length > 0 ? Math.max(...notificaciones.map(n => n.id)) + 1 : 1;
      notificaciones.push({
        id,
        userId,
        titulo,
        descripcion,
        tipo,
        fecha,
        leida: false
      });
      localStorage.setItem('notificaciones', JSON.stringify(notificaciones));
      return id;
    } catch (error) {
      console.error('Error al crear notificación en web:', error);
      throw error;
    }
  }

  static async obtenerNotificacionesUsuario(userId, soloNoLeidas = false) {
    try {
      if (Platform.OS === 'web') {
        return this._obtenerNotificacionesUsuarioWeb(userId, soloNoLeidas);
      }

      let query = `SELECT * FROM notifications WHERE userId = ? ORDER BY fecha DESC`;
      let params = [userId];

      if (soloNoLeidas) {
        query = `SELECT * FROM notifications WHERE userId = ? AND leida = 0 ORDER BY fecha DESC`;
      }

      const database = getDB();
      const resultado = await database.getAllAsync(query, params);
      return resultado;
    } catch (error) {
      console.error('Error al obtener notificaciones:', error);
      return [];
    }
  }

  static _obtenerNotificacionesUsuarioWeb(userId, soloNoLeidas = false) {
    try {
      const notificaciones = JSON.parse(localStorage.getItem('notificaciones') || '[]');
      let filtradas = notificaciones.filter(n => n.userId === userId);
      if (soloNoLeidas) {
        filtradas = filtradas.filter(n => !n.leida);
      }
      return filtradas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    } catch (error) {
      console.error('Error al obtener notificaciones en web:', error);
      return [];
    }
  }

  static async obtenerNotificacionPorId(id) {
    try {
      if (Platform.OS === 'web') {
        return this._obtenerNotificacionPorIdWeb(id);
      }

      const database = getDB();
      const resultado = await database.getFirstAsync(
        `SELECT * FROM notifications WHERE id = ?`,
        [id]
      );
      return resultado;
    } catch (error) {
      console.error('Error al obtener notificación:', error);
      return null;
    }
  }

  static _obtenerNotificacionPorIdWeb(id) {
    try {
      const notificaciones = JSON.parse(localStorage.getItem('notificaciones') || '[]');
      return notificaciones.find(n => n.id === id) || null;
    } catch (error) {
      console.error('Error al obtener notificación en web:', error);
      return null;
    }
  }

  static async marcarComoLeida(id) {
    try {
      if (Platform.OS === 'web') {
        return this._marcarComoLeidaWeb(id);
      }

      const database = getDB();
      await database.runAsync(
        `UPDATE notifications SET leida = 1 WHERE id = ?`,
        [id]
      );
      return true;
    } catch (error) {
      console.error('Error al marcar como leída:', error);
      throw error;
    }
  }

  static _marcarComoLeidaWeb(id) {
    try {
      const notificaciones = JSON.parse(localStorage.getItem('notificaciones') || '[]');
      const index = notificaciones.findIndex(n => n.id === id);
      if (index !== -1) {
        notificaciones[index].leida = true;
        localStorage.setItem('notificaciones', JSON.stringify(notificaciones));
      }
      return true;
    } catch (error) {
      console.error('Error al marcar como leída en web:', error);
      throw error;
    }
  }

  static async marcarTodasComoLeidas(userId) {
    try {
      if (Platform.OS === 'web') {
        return this._marcarTodasComoLeidasWeb(userId);
      }

      const database = getDB();
      await database.runAsync(
        `UPDATE notifications SET leida = 1 WHERE userId = ? AND leida = 0`,
        [userId]
      );
      return true;
    } catch (error) {
      console.error('Error al marcar todas como leídas:', error);
      throw error;
    }
  }

  static _marcarTodasComoLeidasWeb(userId) {
    try {
      const notificaciones = JSON.parse(localStorage.getItem('notificaciones') || '[]');
      notificaciones.forEach(n => {
        if (n.userId === userId && !n.leida) {
          n.leida = true;
        }
      });
      localStorage.setItem('notificaciones', JSON.stringify(notificaciones));
      return true;
    } catch (error) {
      console.error('Error al marcar todas como leídas en web:', error);
      throw error;
    }
  }

  static async eliminarNotificacion(id) {
    try {
      if (Platform.OS === 'web') {
        return this._eliminarNotificacionWeb(id);
      }

      const database = getDB();
      await database.runAsync(
        `DELETE FROM notifications WHERE id = ?`,
        [id]
      );
      return true;
    } catch (error) {
      console.error('Error al eliminar notificación:', error);
      throw error;
    }
  }

  static _eliminarNotificacionWeb(id) {
    try {
      const notificaciones = JSON.parse(localStorage.getItem('notificaciones') || '[]');
      const filtered = notificaciones.filter(n => n.id !== id);
      localStorage.setItem('notificaciones', JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Error al eliminar notificación en web:', error);
      throw error;
    }
  }

  static async eliminarNotificacionesAntiguas(dias = 30) {
    try {
      if (Platform.OS === 'web') {
        return this._eliminarNotificacionesAntiguasWeb(dias);
      }

      const fechaLimite = new Date();
      fechaLimite.setDate(fechaLimite.getDate() - dias);

      const database = getDB();
      await database.runAsync(
        `DELETE FROM notifications WHERE fecha < ?`,
        [fechaLimite.toISOString()]
      );
      return true;
    } catch (error) {
      console.error('Error al eliminar notificaciones antiguas:', error);
      throw error;
    }
  }

  static _eliminarNotificacionesAntiguasWeb(dias = 30) {
    try {
      const notificaciones = JSON.parse(localStorage.getItem('notificaciones') || '[]');
      const fechaLimite = new Date();
      fechaLimite.setDate(fechaLimite.getDate() - dias);

      const filtered = notificaciones.filter(n => new Date(n.fecha) >= fechaLimite);
      localStorage.setItem('notificaciones', JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Error al eliminar notificaciones antiguas en web:', error);
      throw error;
    }
  }

  static async obtenerNotificacionesPorTipo(userId, tipo) {
    try {
      if (Platform.OS === 'web') {
        return this._obtenerNotificacionesPorTipoWeb(userId, tipo);
      }

      const database = getDB();
      const resultado = await database.getAllAsync(
        `SELECT * FROM notifications WHERE userId = ? AND tipo = ? ORDER BY fecha DESC`,
        [userId, tipo]
      );
      return resultado;
    } catch (error) {
      console.error('Error al obtener notificaciones por tipo:', error);
      return [];
    }
  }

  static _obtenerNotificacionesPorTipoWeb(userId, tipo) {
    try {
      const notificaciones = JSON.parse(localStorage.getItem('notificaciones') || '[]');
      return notificaciones
        .filter(n => n.userId === userId && n.tipo === tipo)
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    } catch (error) {
      console.error('Error al obtener notificaciones por tipo en web:', error);
      return [];
    }
  }

  static async contarNoLeidas(userId) {
    try {
      if (Platform.OS === 'web') {
        return this._contarNoLeidasWeb(userId);
      }

      const database = getDB();
      const resultado = await database.getFirstAsync(
        `SELECT COUNT(*) as total FROM notifications WHERE userId = ? AND leida = 0`,
        [userId]
      );
      return resultado?.total || 0;
    } catch (error) {
      console.error('Error al contar notificaciones no leídas:', error);
      return 0;
    }
  }

  static _contarNoLeidasWeb(userId) {
    try {
      const notificaciones = JSON.parse(localStorage.getItem('notificaciones') || '[]');
      return notificaciones.filter(n => n.userId === userId && !n.leida).length;
    } catch (error) {
      console.error('Error al contar notificaciones no leídas en web:', error);
      return 0;
    }
  }
}
