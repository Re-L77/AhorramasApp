// models/Budget.js
/**
 * Modelo de Presupuesto
 * Define la estructura y operaciones de la entidad Presupuesto
 * Autor: Carlos
 */

import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('ahorramasapp.db');

export class Budget {
  constructor(id, userId, categoria, montoLimite, montoActual, mes, año) {
    this.id = id;
    this.userId = userId;
    this.categoria = categoria;
    this.montoLimite = montoLimite;
    this.montoActual = montoActual;
    this.mes = mes;
    this.año = año;
  }

  // Getter methods
  getId() {
    return this.id;
  }

  getUserId() {
    return this.userId;
  }

  getCategoria() {
    return this.categoria;
  }

  getMontoLimite() {
    return this.montoLimite;
  }

  getMontoActual() {
    return this.montoActual;
  }

  getMes() {
    return this.mes;
  }

  getAño() {
    return this.año;
  }

  getPorcentajeUso() {
    return (this.montoActual / this.montoLimite) * 100;
  }

  // Setter methods
  setMontoLimite(monto) {
    this.montoLimite = monto;
  }

  setMontoActual(monto) {
    this.montoActual = monto;
  }

  // Métodos estáticos para operaciones de base de datos
  static async initializeTable() {
    try {
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS budgets (
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
      `);
      console.log('Tabla budgets creada o ya existe');
    } catch (error) {
      console.error('Error al crear tabla budgets:', error);
    }
  }

  static async crearPresupuesto(userId, categoria, montoLimite, mes, año) {
    try {
      const resultado = await db.runAsync(
        `INSERT INTO budgets (userId, categoria, montoLimite, montoActual, mes, año)
         VALUES (?, ?, ?, 0, ?, ?)`,
        [userId, categoria, montoLimite, mes, año]
      );
      return resultado.lastInsertRowId;
    } catch (error) {
      console.error('Error al crear presupuesto:', error);
      throw error;
    }
  }

  static async obtenerPresupuestosUsuario(userId, mes, año) {
    try {
      const resultado = await db.getAllAsync(
        `SELECT * FROM budgets WHERE userId = ? AND mes = ? AND año = ?`,
        [userId, mes, año]
      );
      return resultado;
    } catch (error) {
      console.error('Error al obtener presupuestos:', error);
      return [];
    }
  }

  static async obtenerPresupuestoPorId(id) {
    try {
      const resultado = await db.getFirstAsync(
        `SELECT * FROM budgets WHERE id = ?`,
        [id]
      );
      return resultado;
    } catch (error) {
      console.error('Error al obtener presupuesto:', error);
      return null;
    }
  }

  static async actualizarPresupuesto(id, montoLimite) {
    try {
      await db.runAsync(
        `UPDATE budgets SET montoLimite = ? WHERE id = ?`,
        [montoLimite, id]
      );
      return true;
    } catch (error) {
      console.error('Error al actualizar presupuesto:', error);
      throw error;
    }
  }

  static async actualizarMontoActual(id, montoActual) {
    try {
      await db.runAsync(
        `UPDATE budgets SET montoActual = ? WHERE id = ?`,
        [montoActual, id]
      );
      return true;
    } catch (error) {
      console.error('Error al actualizar monto actual:', error);
      throw error;
    }
  }

  static async eliminarPresupuesto(id) {
    try {
      await db.runAsync(
        `DELETE FROM budgets WHERE id = ?`,
        [id]
      );
      return true;
    } catch (error) {
      console.error('Error al eliminar presupuesto:', error);
      throw error;
    }
  }

  static async obtenerPresupuestoPorCategoria(userId, categoria, mes, año) {
    try {
      const resultado = await db.getFirstAsync(
        `SELECT * FROM budgets WHERE userId = ? AND categoria = ? AND mes = ? AND año = ?`,
        [userId, categoria, mes, año]
      );
      return resultado;
    } catch (error) {
      console.error('Error al obtener presupuesto por categoría:', error);
      return null;
    }
  }

  static async obtenerTodosPresupuestos() {
    try {
      const resultado = await db.getAllAsync(`SELECT * FROM budgets`);
      return resultado;
    } catch (error) {
      console.error('Error al obtener todos los presupuestos:', error);
      return [];
    }
  }
}
