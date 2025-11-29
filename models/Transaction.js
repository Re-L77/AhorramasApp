// models/Transaction.js
/**
 * Modelo de Transacciones
 * Define la estructura y operaciones de la entidad Transacción
 * Autor: Juan
 */

import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('ahorramasapp.db');

export class Transaction {
  constructor(id, userId, tipo, monto, descripcion, categoria, fecha) {
    this.id = id;
    this.userId = userId;
    this.tipo = tipo; // 'ingreso' o 'egreso'
    this.monto = monto;
    this.descripcion = descripcion;
    this.categoria = categoria;
    this.fecha = fecha;
  }

  // Getter methods
  getId() {
    return this.id;
  }

  getUserId() {
    return this.userId;
  }

  getTipo() {
    return this.tipo;
  }

  getMonto() {
    return this.monto;
  }

  getDescripcion() {
    return this.descripcion;
  }

  getCategoria() {
    return this.categoria;
  }

  getFecha() {
    return this.fecha;
  }

  // Métodos estáticos para operaciones de base de datos
  static async initializeTable() {
    try {
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS transactions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          userId INTEGER NOT NULL,
          tipo TEXT NOT NULL CHECK (tipo IN ('ingreso', 'egreso')),
          monto REAL NOT NULL,
          descripcion TEXT,
          categoria TEXT NOT NULL,
          fecha TEXT NOT NULL,
          FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
        );
      `);
      console.log('Tabla transactions creada o ya existe');
    } catch (error) {
      console.error('Error al crear tabla transactions:', error);
    }
  }

  static async crearTransaccion(userId, tipo, monto, descripcion, categoria, fecha) {
    try {
      const resultado = await db.runAsync(
        `INSERT INTO transactions (userId, tipo, monto, descripcion, categoria, fecha)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, tipo, monto, descripcion, categoria, fecha]
      );
      return resultado.lastInsertRowId;
    } catch (error) {
      console.error('Error al crear transacción:', error);
      throw error;
    }
  }

  static async obtenerTransaccionesUsuario(userId) {
    try {
      const resultado = await db.getAllAsync(
        `SELECT * FROM transactions WHERE userId = ? ORDER BY fecha DESC`,
        [userId]
      );
      return resultado;
    } catch (error) {
      console.error('Error al obtener transacciones:', error);
      return [];
    }
  }

  static async obtenerTransaccionPorId(id) {
    try {
      const resultado = await db.getFirstAsync(
        `SELECT * FROM transactions WHERE id = ?`,
        [id]
      );
      return resultado;
    } catch (error) {
      console.error('Error al obtener transacción:', error);
      return null;
    }
  }

  static async actualizarTransaccion(id, tipo, monto, descripcion, categoria) {
    try {
      await db.runAsync(
        `UPDATE transactions SET tipo = ?, monto = ?, descripcion = ?, categoria = ? WHERE id = ?`,
        [tipo, monto, descripcion, categoria, id]
      );
      return true;
    } catch (error) {
      console.error('Error al actualizar transacción:', error);
      throw error;
    }
  }

  static async eliminarTransaccion(id) {
    try {
      await db.runAsync(
        `DELETE FROM transactions WHERE id = ?`,
        [id]
      );
      return true;
    } catch (error) {
      console.error('Error al eliminar transacción:', error);
      throw error;
    }
  }

  static async obtenerTotalPorTipo(userId, tipo) {
    try {
      const resultado = await db.getFirstAsync(
        `SELECT SUM(monto) as total FROM transactions WHERE userId = ? AND tipo = ?`,
        [userId, tipo]
      );
      return resultado?.total || 0;
    } catch (error) {
      console.error('Error al obtener total:', error);
      return 0;
    }
  }

  static async obtenerTransaccionesPorRango(userId, fechaInicio, fechaFin) {
    try {
      const resultado = await db.getAllAsync(
        `SELECT * FROM transactions WHERE userId = ? AND fecha BETWEEN ? AND ? ORDER BY fecha DESC`,
        [userId, fechaInicio, fechaFin]
      );
      return resultado;
    } catch (error) {
      console.error('Error al obtener transacciones por rango:', error);
      return [];
    }
  }

  static async obtenerTransaccionesPorCategoria(userId, categoria) {
    try {
      const resultado = await db.getAllAsync(
        `SELECT * FROM transactions WHERE userId = ? AND categoria = ? ORDER BY fecha DESC`,
        [userId, categoria]
      );
      return resultado;
    } catch (error) {
      console.error('Error al obtener transacciones por categoría:', error);
      return [];
    }
  }
}
