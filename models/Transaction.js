// models/Transaction.js
/**
 * Modelo de Transacciones
 * Define la estructura y operaciones de la entidad Transacción
 * Autor: Juan
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
const INITIAL_TRANSACTIONS = [
  // Usuario 1 - Ingresos
  { id: 1, userId: 1, tipo: 'ingreso', monto: 3000, descripcion: 'Salario mensual', categoria: 'Ingresos', fecha: '2025-11-01' },
  { id: 2, userId: 1, tipo: 'ingreso', monto: 500, descripcion: 'Bonificación', categoria: 'Ingresos', fecha: '2025-11-05' },
  { id: 3, userId: 1, tipo: 'ingreso', monto: 200, descripcion: 'Freelance trabajo', categoria: 'Ingresos', fecha: '2025-11-10' },
  
  // Usuario 1 - Egresos Alimentación
  { id: 4, userId: 1, tipo: 'egreso', monto: 150, descripcion: 'Supermercado', categoria: 'Alimentación', fecha: '2025-11-02' },
  { id: 5, userId: 1, tipo: 'egreso', monto: 80, descripcion: 'Restaurante', categoria: 'Alimentación', fecha: '2025-11-06' },
  { id: 6, userId: 1, tipo: 'egreso', monto: 120, descripcion: 'Compras verdulería', categoria: 'Alimentación', fecha: '2025-11-12' },
  
  // Usuario 1 - Egresos Transporte
  { id: 7, userId: 1, tipo: 'egreso', monto: 50, descripcion: 'Gasolina', categoria: 'Transporte', fecha: '2025-11-03' },
  { id: 8, userId: 1, tipo: 'egreso', monto: 30, descripcion: 'Uber', categoria: 'Transporte', fecha: '2025-11-08' },
  { id: 9, userId: 1, tipo: 'egreso', monto: 45, descripcion: 'Mantenimiento auto', categoria: 'Transporte', fecha: '2025-11-15' },
  
  // Usuario 1 - Egresos Servicios
  { id: 10, userId: 1, tipo: 'egreso', monto: 200, descripcion: 'Internet y teléfono', categoria: 'Servicios', fecha: '2025-11-01' },
  { id: 11, userId: 1, tipo: 'egreso', monto: 150, descripcion: 'Electricidad', categoria: 'Servicios', fecha: '2025-11-04' },
  { id: 12, userId: 1, tipo: 'egreso', monto: 100, descripcion: 'Agua y Gas', categoria: 'Servicios', fecha: '2025-11-07' },
  
  // Usuario 1 - Egresos Entretenimiento
  { id: 13, userId: 1, tipo: 'egreso', monto: 70, descripcion: 'Cine', categoria: 'Entretenimiento', fecha: '2025-11-09' },
  { id: 14, userId: 1, tipo: 'egreso', monto: 50, descripcion: 'Suscripción streaming', categoria: 'Entretenimiento', fecha: '2025-11-11' },
  
  // Usuario 1 - Egresos Educación
  { id: 15, userId: 1, tipo: 'egreso', monto: 300, descripcion: 'Curso online', categoria: 'Educación', fecha: '2025-11-13' },
  
  // Usuario 1 - Ahorro
  { id: 16, userId: 1, tipo: 'egreso', monto: 500, descripcion: 'Ahorro mensual', categoria: 'Ahorro', fecha: '2025-11-14' },
  
  // Otros usuarios
  { id: 17, userId: 2, tipo: 'ingreso', monto: 1800, descripcion: 'Salario', categoria: 'Ingresos', fecha: '2025-11-01' },
  { id: 18, userId: 2, tipo: 'egreso', monto: 100, descripcion: 'Cine', categoria: 'Entretenimiento', fecha: '2025-11-02' },
  { id: 19, userId: 3, tipo: 'ingreso', monto: 2500, descripcion: 'Freelance', categoria: 'Ingresos', fecha: '2025-11-01' },
  { id: 20, userId: 3, tipo: 'egreso', monto: 80, descripcion: 'Gasolina', categoria: 'Transporte', fecha: '2025-11-03' }
];

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
      if (Platform.OS === 'web') {
        if (!localStorage.getItem('transacciones')) {
          localStorage.setItem('transacciones', JSON.stringify(INITIAL_TRANSACTIONS));
        }
        console.log('Tabla transacciones creada o ya existe en localStorage');
        return;
      }

      const database = getDB();
      await database.execAsync(`
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

      // Verificar si la tabla está vacía y cargar datos iniciales
      const transacciones = await database.getAllAsync('SELECT COUNT(*) as count FROM transactions');
      if (transacciones[0].count === 0) {
        for (const transaccion of INITIAL_TRANSACTIONS) {
          await database.runAsync(
            `INSERT INTO transactions (id, userId, tipo, monto, descripcion, categoria, fecha)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [transaccion.id, transaccion.userId, transaccion.tipo, transaccion.monto, transaccion.descripcion, transaccion.categoria, transaccion.fecha]
          );
        }
        console.log('✅ Datos iniciales cargados en SQLite (transacciones)');
      }

      console.log('Tabla transactions creada o ya existe');
    } catch (error) {
      console.error('Error al crear tabla transactions:', error);
    }
  }

  static async crearTransaccion(userId, tipo, monto, descripcion, categoria, fecha) {
    try {
      if (Platform.OS === 'web') {
        return this._crearTransaccionWeb(userId, tipo, monto, descripcion, categoria, fecha);
      }

      const database = getDB();
      const resultado = await database.runAsync(
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

  static _crearTransaccionWeb(userId, tipo, monto, descripcion, categoria, fecha) {
    try {
      const transacciones = JSON.parse(localStorage.getItem('transacciones') || '[]');
      const id = transacciones.length > 0 ? Math.max(...transacciones.map(t => t.id)) + 1 : 1;
      transacciones.push({
        id,
        userId,
        tipo,
        monto,
        descripcion,
        categoria,
        fecha
      });
      localStorage.setItem('transacciones', JSON.stringify(transacciones));
      return id;
    } catch (error) {
      console.error('Error al crear transacción en web:', error);
      throw error;
    }
  }

  static async obtenerTransaccionesUsuario(userId) {
    try {
      if (Platform.OS === 'web') {
        return this._obtenerTransaccionesUsuarioWeb(userId);
      }

      const database = getDB();
      const resultado = await database.getAllAsync(
        `SELECT * FROM transactions WHERE userId = ? ORDER BY fecha DESC`,
        [userId]
      );
      return resultado;
    } catch (error) {
      console.error('Error al obtener transacciones:', error);
      return [];
    }
  }

  static _obtenerTransaccionesUsuarioWeb(userId) {
    try {
      const transacciones = JSON.parse(localStorage.getItem('transacciones') || '[]');
      return transacciones.filter(t => t.userId === userId).sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    } catch (error) {
      console.error('Error al obtener transacciones en web:', error);
      return [];
    }
  }

  static async obtenerTransaccionPorId(id) {
    try {
      if (Platform.OS === 'web') {
        return this._obtenerTransaccionPorIdWeb(id);
      }

      const database = getDB();
      const resultado = await database.getFirstAsync(
        `SELECT * FROM transactions WHERE id = ?`,
        [id]
      );
      return resultado;
    } catch (error) {
      console.error('Error al obtener transacción:', error);
      return null;
    }
  }

  static _obtenerTransaccionPorIdWeb(id) {
    try {
      const transacciones = JSON.parse(localStorage.getItem('transacciones') || '[]');
      return transacciones.find(t => t.id === id) || null;
    } catch (error) {
      console.error('Error al obtener transacción en web:', error);
      return null;
    }
  }

  static async actualizarTransaccion(id, tipo, monto, descripcion, categoria) {
    try {
      if (Platform.OS === 'web') {
        return this._actualizarTransaccionWeb(id, tipo, monto, descripcion, categoria);
      }

      const database = getDB();
      await database.runAsync(
        `UPDATE transactions SET tipo = ?, monto = ?, descripcion = ?, categoria = ? WHERE id = ?`,
        [tipo, monto, descripcion, categoria, id]
      );
      return true;
    } catch (error) {
      console.error('Error al actualizar transacción:', error);
      throw error;
    }
  }

  static _actualizarTransaccionWeb(id, tipo, monto, descripcion, categoria) {
    try {
      const transacciones = JSON.parse(localStorage.getItem('transacciones') || '[]');
      const index = transacciones.findIndex(t => t.id === id);
      if (index !== -1) {
        transacciones[index].tipo = tipo;
        transacciones[index].monto = monto;
        transacciones[index].descripcion = descripcion;
        transacciones[index].categoria = categoria;
        localStorage.setItem('transacciones', JSON.stringify(transacciones));
      }
      return true;
    } catch (error) {
      console.error('Error al actualizar transacción en web:', error);
      throw error;
    }
  }

  static async eliminarTransaccion(id) {
    try {
      if (Platform.OS === 'web') {
        return this._eliminarTransaccionWeb(id);
      }

      const database = getDB();
      await database.runAsync(
        `DELETE FROM transactions WHERE id = ?`,
        [id]
      );
      return true;
    } catch (error) {
      console.error('Error al eliminar transacción:', error);
      throw error;
    }
  }

  static _eliminarTransaccionWeb(id) {
    try {
      const transacciones = JSON.parse(localStorage.getItem('transacciones') || '[]');
      const filtered = transacciones.filter(t => t.id !== id);
      localStorage.setItem('transacciones', JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Error al eliminar transacción en web:', error);
      throw error;
    }
  }

  static async obtenerTotalPorTipo(userId, tipo) {
    try {
      if (Platform.OS === 'web') {
        return this._obtenerTotalPorTipoWeb(userId, tipo);
      }

      const database = getDB();
      const resultado = await database.getFirstAsync(
        `SELECT SUM(monto) as total FROM transactions WHERE userId = ? AND tipo = ?`,
        [userId, tipo]
      );
      return resultado?.total || 0;
    } catch (error) {
      console.error('Error al obtener total:', error);
      return 0;
    }
  }

  static _obtenerTotalPorTipoWeb(userId, tipo) {
    try {
      const transacciones = JSON.parse(localStorage.getItem('transacciones') || '[]');
      const total = transacciones
        .filter(t => t.userId === userId && t.tipo === tipo)
        .reduce((sum, t) => sum + t.monto, 0);
      return total;
    } catch (error) {
      console.error('Error al obtener total en web:', error);
      return 0;
    }
  }

  static async obtenerTransaccionesPorRango(userId, fechaInicio, fechaFin) {
    try {
      if (Platform.OS === 'web') {
        return this._obtenerTransaccionesPorRangoWeb(userId, fechaInicio, fechaFin);
      }

      const database = getDB();
      const resultado = await database.getAllAsync(
        `SELECT * FROM transactions WHERE userId = ? AND fecha BETWEEN ? AND ? ORDER BY fecha DESC`,
        [userId, fechaInicio, fechaFin]
      );
      return resultado;
    } catch (error) {
      console.error('Error al obtener transacciones por rango:', error);
      return [];
    }
  }

  static _obtenerTransaccionesPorRangoWeb(userId, fechaInicio, fechaFin) {
    try {
      const transacciones = JSON.parse(localStorage.getItem('transacciones') || '[]');
      return transacciones
        .filter(t => t.userId === userId && t.fecha >= fechaInicio && t.fecha <= fechaFin)
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    } catch (error) {
      console.error('Error al obtener transacciones por rango en web:', error);
      return [];
    }
  }

  static async obtenerTransaccionesPorCategoria(userId, categoria) {
    try {
      if (Platform.OS === 'web') {
        return this._obtenerTransaccionesPorCategoriaWeb(userId, categoria);
      }

      const database = getDB();
      const resultado = await database.getAllAsync(
        `SELECT * FROM transactions WHERE userId = ? AND categoria = ? ORDER BY fecha DESC`,
        [userId, categoria]
      );
      return resultado;
    } catch (error) {
      console.error('Error al obtener transacciones por categoría:', error);
      return [];
    }
  }

  static _obtenerTransaccionesPorCategoriaWeb(userId, categoria) {
    try {
      const transacciones = JSON.parse(localStorage.getItem('transacciones') || '[]');
      return transacciones
        .filter(t => t.userId === userId && t.categoria === categoria)
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    } catch (error) {
      console.error('Error al obtener transacciones por categoría en web:', error);
      return [];
    }
  }
}
