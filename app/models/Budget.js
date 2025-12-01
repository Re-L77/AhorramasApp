/**
 * Modelo de Presupuesto
 * Define la estructura y operaciones de la entidad Presupuesto
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
  // Usuario 1 - Presupuestos de noviembre 2025
  { id: 1, userId: 1, categoria: 'Alimentación', montoLimite: 800, montoActual: 0, mes: 11, año: 2025 },
  { id: 2, userId: 1, categoria: 'Transporte', montoLimite: 400, montoActual: 0, mes: 11, año: 2025 },
  { id: 3, userId: 1, categoria: 'Entretenimiento', montoLimite: 300, montoActual: 0, mes: 11, año: 2025 },
  { id: 4, userId: 1, categoria: 'Servicios', montoLimite: 600, montoActual: 0, mes: 11, año: 2025 },
  { id: 5, userId: 1, categoria: 'Educación', montoLimite: 500, montoActual: 0, mes: 11, año: 2025 },
  { id: 6, userId: 1, categoria: 'Ahorro', montoLimite: 1000, montoActual: 0, mes: 11, año: 2025 },

  // Usuario 2 - Presupuestos de noviembre 2025
  { id: 7, userId: 2, categoria: 'Alimentación', montoLimite: 700, montoActual: 0, mes: 11, año: 2025 },
  { id: 8, userId: 2, categoria: 'Transporte', montoLimite: 350, montoActual: 0, mes: 11, año: 2025 },
  { id: 9, userId: 2, categoria: 'Entretenimiento', montoLimite: 250, montoActual: 0, mes: 11, año: 2025 },

  // Usuario 3 - Presupuestos de noviembre 2025
  { id: 10, userId: 3, categoria: 'Alimentación', montoLimite: 600, montoActual: 0, mes: 11, año: 2025 },
  { id: 11, userId: 3, categoria: 'Transporte', montoLimite: 400, montoActual: 0, mes: 11, año: 2025 },

  // Usuario 1 - Presupuestos de diciembre 2025
  { id: 12, userId: 1, categoria: 'Alimentación', montoLimite: 800, montoActual: 0, mes: 12, año: 2025 },
  { id: 13, userId: 1, categoria: 'Transporte', montoLimite: 400, montoActual: 0, mes: 12, año: 2025 },
  { id: 14, userId: 1, categoria: 'Entretenimiento', montoLimite: 300, montoActual: 0, mes: 12, año: 2025 },
  { id: 15, userId: 1, categoria: 'Servicios', montoLimite: 600, montoActual: 0, mes: 12, año: 2025 },
  { id: 16, userId: 1, categoria: 'Educación', montoLimite: 500, montoActual: 0, mes: 12, año: 2025 },
  { id: 17, userId: 1, categoria: 'Ahorro', montoLimite: 1000, montoActual: 0, mes: 12, año: 2025 },

  // Usuario 2 - Presupuestos de diciembre 2025
  { id: 18, userId: 2, categoria: 'Alimentación', montoLimite: 700, montoActual: 0, mes: 12, año: 2025 },
  { id: 19, userId: 2, categoria: 'Transporte', montoLimite: 350, montoActual: 0, mes: 12, año: 2025 },
  { id: 20, userId: 2, categoria: 'Entretenimiento', montoLimite: 250, montoActual: 0, mes: 12, año: 2025 },

  // Usuario 3 - Presupuestos de diciembre 2025
  { id: 21, userId: 3, categoria: 'Alimentación', montoLimite: 600, montoActual: 0, mes: 12, año: 2025 },
  { id: 22, userId: 3, categoria: 'Transporte', montoLimite: 400, montoActual: 0, mes: 12, año: 2025 }
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
      } else {
        // Limpiar presupuestos de noviembre para recargar con los de diciembre
        try {
          const conteo = await database.getAllAsync('SELECT COUNT(*) as count FROM budgets WHERE mes = 11');
          if (conteo[0].count > 0) {
            await database.execAsync('DELETE FROM budgets WHERE mes = 11;');
            console.log('✅ Presupuestos de noviembre eliminados');

            // Cargar presupuestos de diciembre
            for (const presupuesto of INITIAL_BUDGETS) {
              try {
                await database.runAsync(
                  `INSERT OR IGNORE INTO budgets (id, userId, categoria, montoLimite, montoActual, mes, año)
                   VALUES (?, ?, ?, ?, ?, ?, ?)`,
                  [presupuesto.id, presupuesto.userId, presupuesto.categoria, presupuesto.montoLimite, presupuesto.montoActual, presupuesto.mes, presupuesto.año]
                );
              } catch (e) {
                // Ignorar duplicados
              }
            }
            console.log('✅ Presupuestos de diciembre cargados');
          }
        } catch (cleanErr) {
          console.warn('No se pudo limpiar presupuestos antiguos:', cleanErr);
        }
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
      // Buscar case-insensitive usando LOWER()
      const resultado = await database.getFirstAsync(
        `SELECT * FROM budgets WHERE userId = ? AND LOWER(categoria) = LOWER(?) AND mes = ? AND año = ?`,
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
      return presupuestos.find(p =>
        p.userId === userId &&
        p.categoria.toLowerCase() === categoria.toLowerCase() &&
        p.mes === mes &&
        p.año === año
      ) || null;
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
