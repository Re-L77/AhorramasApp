// models/Notification.js
/**
 * Modelo de Notificaciones
 * Define la estructura y operaciones de la entidad Notificación
 * Autor: Vanesa
 */

import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('ahorramasapp.db');

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
      await db.execAsync(`
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
      console.log('Tabla notifications creada o ya existe');
    } catch (error) {
      console.error('Error al crear tabla notifications:', error);
    }
  }

  static async crearNotificacion(userId, titulo, descripcion, tipo, fecha) {
    try {
      const resultado = await db.runAsync(
        `INSERT INTO notifications (userId, titulo, descripcion, tipo, fecha, leida)
         VALUES (?, ?, ?, ?, ?, 0)`,
        [userId, titulo, descripcion, tipo, fecha]
      );
      return resultado.lastInsertRowId;
    } catch (error) {
      console.error('Error al crear notificación:', error);
      throw error;
    }
  }

  static async obtenerNotificacionesUsuario(userId, soloNoLeidas = false) {
    try {
      let query = `SELECT * FROM notifications WHERE userId = ? ORDER BY fecha DESC`;
      let params = [userId];

      if (soloNoLeidas) {
        query = `SELECT * FROM notifications WHERE userId = ? AND leida = 0 ORDER BY fecha DESC`;
      }

      const resultado = await db.getAllAsync(query, params);
      return resultado;
    } catch (error) {
      console.error('Error al obtener notificaciones:', error);
      return [];
    }
  }

  static async obtenerNotificacionPorId(id) {
    try {
      const resultado = await db.getFirstAsync(
        `SELECT * FROM notifications WHERE id = ?`,
        [id]
      );
      return resultado;
    } catch (error) {
      console.error('Error al obtener notificación:', error);
      return null;
    }
  }

  static async marcarComoLeida(id) {
    try {
      await db.runAsync(
        `UPDATE notifications SET leida = 1 WHERE id = ?`,
        [id]
      );
      return true;
    } catch (error) {
      console.error('Error al marcar como leída:', error);
      throw error;
    }
  }

  static async marcarTodasComoLeidas(userId) {
    try {
      await db.runAsync(
        `UPDATE notifications SET leida = 1 WHERE userId = ? AND leida = 0`,
        [userId]
      );
      return true;
    } catch (error) {
      console.error('Error al marcar todas como leídas:', error);
      throw error;
    }
  }

  static async eliminarNotificacion(id) {
    try {
      await db.runAsync(
        `DELETE FROM notifications WHERE id = ?`,
        [id]
      );
      return true;
    } catch (error) {
      console.error('Error al eliminar notificación:', error);
      throw error;
    }
  }

  static async eliminarNotificacionesAntiguas(dias = 30) {
    try {
      const fechaLimite = new Date();
      fechaLimite.setDate(fechaLimite.getDate() - dias);

      await db.runAsync(
        `DELETE FROM notifications WHERE fecha < ?`,
        [fechaLimite.toISOString()]
      );
      return true;
    } catch (error) {
      console.error('Error al eliminar notificaciones antiguas:', error);
      throw error;
    }
  }

  static async obtenerNotificacionesPorTipo(userId, tipo) {
    try {
      const resultado = await db.getAllAsync(
        `SELECT * FROM notifications WHERE userId = ? AND tipo = ? ORDER BY fecha DESC`,
        [userId, tipo]
      );
      return resultado;
    } catch (error) {
      console.error('Error al obtener notificaciones por tipo:', error);
      return [];
    }
  }

  static async contarNoLeidas(userId) {
    try {
      const resultado = await db.getFirstAsync(
        `SELECT COUNT(*) as total FROM notifications WHERE userId = ? AND leida = 0`,
        [userId]
      );
      return resultado?.total || 0;
    } catch (error) {
      console.error('Error al contar notificaciones no leídas:', error);
      return 0;
    }
  }
}
