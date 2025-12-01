// models/Budget.js
/**
 * Modelo de Presupuesto
 * Define la estructura y operaciones de la entidad Presupuesto
 * Autor: Carlos
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
const INITIAL_BUDGETS = [
  { id: 1, userId: 1, categoria: 'Alimentación', montoLimite: 500, montoActual: 150, mes: 11, año: 2025 },
  { id: 2, userId: 1, categoria: 'Transporte', montoLimite: 300, montoActual: 50, mes: 11, año: 2025 },
  { id: 3, userId: 1, categoria: 'Entretenimiento', montoLimite: 200, montoActual: 0, mes: 11, año: 2025 },
  { id: 4, userId: 2, categoria: 'Alimentación', montoLimite: 400, montoActual: 100, mes: 11, año: 2025 },
  { id: 5, userId: 2, categoria: 'Entretenimiento', montoLimite: 250, montoActual: 100, mes: 11, año: 2025 },
  { id: 6, userId: 3, categoria: 'Transporte', montoLimite: 400, montoActual: 80, mes: 11, año: 2025 }
];

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
      if (Platform.OS === 'web') {
        if (!localStorage.getItem('presupuestos')) {
          localStorage.setItem('presupuestos', JSON.stringify(INITIAL_BUDGETS));
        }
        console.log('Tabla presupuestos creada o ya existe en localStorage');
        return;
      }

      const database = getDB();
      await database.execAsync(`
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

      // Verificar si la tabla está vacía y cargar datos iniciales
      const presupuestos = await database.getAllAsync('SELECT COUNT(*) as count FROM budgets');
      if (presupuestos[0].count === 0) {
        for (const presupuesto of INITIAL_BUDGETS) {
          await database.runAsync(
            `INSERT INTO budgets (id, userId, categoria, montoLimite, montoActual, mes, año)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [presupuesto.id, presupuesto.userId, presupuesto.categoria, presupuesto.montoLimite, presupuesto.montoActual, presupuesto.mes, presupuesto.año]
          );
        }
        console.log('✅ Datos iniciales cargados en SQLite (presupuestos)');
      }

      console.log('Tabla budgets creada o ya existe');
    } catch (error) {
      console.error('Error al crear tabla budgets:', error);
    }
  }

  static async crearPresupuesto(userId, categoria, montoLimite, mes, año) {
    try {
      if (Platform.OS === 'web') {
        return this._crearPresupuestoWeb(userId, categoria, montoLimite, mes, año);
      }

      const database = getDB();
      const resultado = await database.runAsync(
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

  static _crearPresupuestoWeb(userId, categoria, montoLimite, mes, año) {
    try {
      const presupuestos = JSON.parse(localStorage.getItem('presupuestos') || '[]');
      const id = presupuestos.length > 0 ? Math.max(...presupuestos.map(p => p.id)) + 1 : 1;
      presupuestos.push({
        id,
        userId,
        categoria,
        montoLimite,
        montoActual: 0,
        mes,
        año
      });
      localStorage.setItem('presupuestos', JSON.stringify(presupuestos));
      return id;
    } catch (error) {
      console.error('Error al crear presupuesto en web:', error);
      throw error;
    }
  }

  static async obtenerPresupuestosUsuario(userId, mes, año) {
    try {
      if (Platform.OS === 'web') {
        return this._obtenerPresupuestosUsuarioWeb(userId, mes, año);
      }

      const database = getDB();
      const resultado = await database.getAllAsync(
        `SELECT * FROM budgets WHERE userId = ? AND mes = ? AND año = ?`,
        [userId, mes, año]
      );
      return resultado;
    } catch (error) {
      console.error('Error al obtener presupuestos:', error);
      return [];
    }
  }

  static _obtenerPresupuestosUsuarioWeb(userId, mes, año) {
    try {
      const presupuestos = JSON.parse(localStorage.getItem('presupuestos') || '[]');
      return presupuestos.filter(p => p.userId === userId && p.mes === mes && p.año === año);
    } catch (error) {
      console.error('Error al obtener presupuestos en web:', error);
      return [];
    }
  }

  static async obtenerPresupuestoPorId(id) {
    try {
      if (Platform.OS === 'web') {
        return this._obtenerPresupuestoPorIdWeb(id);
      }

      const database = getDB();
      const resultado = await database.getFirstAsync(
        `SELECT * FROM budgets WHERE id = ?`,
        [id]
      );
      return resultado;
    } catch (error) {
      console.error('Error al obtener presupuesto:', error);
      return null;
    }
  }

  static _obtenerPresupuestoPorIdWeb(id) {
    try {
      const presupuestos = JSON.parse(localStorage.getItem('presupuestos') || '[]');
      return presupuestos.find(p => p.id === id) || null;
    } catch (error) {
      console.error('Error al obtener presupuesto en web:', error);
      return null;
    }
  }

  static async actualizarPresupuesto(id, montoLimite) {
    try {
      if (Platform.OS === 'web') {
        return this._actualizarPresupuestoWeb(id, montoLimite);
      }

      const database = getDB();
      await database.runAsync(
        `UPDATE budgets SET montoLimite = ? WHERE id = ?`,
        [montoLimite, id]
      );
      return true;
    } catch (error) {
      console.error('Error al actualizar presupuesto:', error);
      throw error;
    }
  }

  static _actualizarPresupuestoWeb(id, montoLimite) {
    try {
      const presupuestos = JSON.parse(localStorage.getItem('presupuestos') || '[]');
      const index = presupuestos.findIndex(p => p.id === id);
      if (index !== -1) {
        presupuestos[index].montoLimite = montoLimite;
        localStorage.setItem('presupuestos', JSON.stringify(presupuestos));
      }
      return true;
    } catch (error) {
      console.error('Error al actualizar presupuesto en web:', error);
      throw error;
    }
  }

  static async actualizarMontoActual(id, montoActual) {
    try {
      if (Platform.OS === 'web') {
        return this._actualizarMontoActualWeb(id, montoActual);
      }

      const database = getDB();
      await database.runAsync(
        `UPDATE budgets SET montoActual = ? WHERE id = ?`,
        [montoActual, id]
      );
      return true;
    } catch (error) {
      console.error('Error al actualizar monto actual:', error);
      throw error;
    }
  }

  static _actualizarMontoActualWeb(id, montoActual) {
    try {
      const presupuestos = JSON.parse(localStorage.getItem('presupuestos') || '[]');
      const index = presupuestos.findIndex(p => p.id === id);
      if (index !== -1) {
        presupuestos[index].montoActual = montoActual;
        localStorage.setItem('presupuestos', JSON.stringify(presupuestos));
      }
      return true;
    } catch (error) {
      console.error('Error al actualizar monto actual en web:', error);
      throw error;
    }
  }

  static async eliminarPresupuesto(id) {
    try {
      if (Platform.OS === 'web') {
        return this._eliminarPresupuestoWeb(id);
      }

      const database = getDB();
      await database.runAsync(
        `DELETE FROM budgets WHERE id = ?`,
        [id]
      );
      return true;
    } catch (error) {
      console.error('Error al eliminar presupuesto:', error);
      throw error;
    }
  }

  static _eliminarPresupuestoWeb(id) {
    try {
      const presupuestos = JSON.parse(localStorage.getItem('presupuestos') || '[]');
      const filtered = presupuestos.filter(p => p.id !== id);
      localStorage.setItem('presupuestos', JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Error al eliminar presupuesto en web:', error);
      throw error;
    }
  }

  static async obtenerPresupuestoPorCategoria(userId, categoria, mes, año) {
    try {
      if (Platform.OS === 'web') {
        return this._obtenerPresupuestoPorCategoriaWeb(userId, categoria, mes, año);
      }

      const database = getDB();
      const resultado = await database.getFirstAsync(
        `SELECT * FROM budgets WHERE userId = ? AND categoria = ? AND mes = ? AND año = ?`,
        [userId, categoria, mes, año]
      );
      return resultado;
    } catch (error) {
      console.error('Error al obtener presupuesto por categoría:', error);
      return null;
    }
  }

  static _obtenerPresupuestoPorCategoriaWeb(userId, categoria, mes, año) {
    try {
      const presupuestos = JSON.parse(localStorage.getItem('presupuestos') || '[]');
      return presupuestos.find(p => p.userId === userId && p.categoria === categoria && p.mes === mes && p.año === año) || null;
    } catch (error) {
      console.error('Error al obtener presupuesto por categoría en web:', error);
      return null;
    }
  }

  static async obtenerTodosPresupuestos() {
    try {
      if (Platform.OS === 'web') {
        return this._obtenerTodosPresupuestosWeb();
      }

      const database = getDB();
      const resultado = await database.getAllAsync(`SELECT * FROM budgets`);
      return resultado;
    } catch (error) {
      console.error('Error al obtener todos los presupuestos:', error);
      return [];
    }
  }

  static _obtenerTodosPresupuestosWeb() {
    try {
      return JSON.parse(localStorage.getItem('presupuestos') || '[]');
    } catch (error) {
      console.error('Error al obtener todos los presupuestos en web:', error);
      return [];
    }
  }
}
