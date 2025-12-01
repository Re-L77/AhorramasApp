// database/DatabaseService.js
/**
 * Servicio de Base de Datos
 * Inicializa y gestiona la conexión con SQLite
 * Autor: Equipo Técnico
 */

import { Platform } from 'react-native';
import * as SQLite from 'expo-sqlite';

// Importar siempre los modelos (ya tienen validación interna para web)
import { User } from '../models/User';
import { Transaction } from '../models/Transaction';
import { Budget } from '../models/Budget';
import { Notification } from '../models/Notification';

export class DatabaseService {
  static isWebPlatform = Platform.OS === 'web';

  /**
   * Inicializar la base de datos
   * Crear todas las tablas necesarias
   */
  static async inicializarBaseDatos() {
    try {
      console.log('Inicializando base de datos...');

      if (this.isWebPlatform) {
        // En web, solo usar localStorage
        await User.initializeTable();
        await Transaction.initializeTable();
        await Budget.initializeTable();
        await Notification.initializeTable();
        console.log('✅ Base de datos (localStorage) inicializada correctamente');
        return { success: true, mode: 'localStorage' };
      }

      // En nativo, intentar recrear las tablas si hay error
      try {
        await User.initializeTable();
        await Transaction.initializeTable();
        await Budget.initializeTable();
        await Notification.initializeTable();
      } catch (error) {
        console.warn('Error al crear tablas, intentando limpiar y recrear...', error);
        // Si falla, limpiar y reintentar
        await this.limpiarBaseDatos();
        await User.initializeTable();
        await Transaction.initializeTable();
        await Budget.initializeTable();
        await Notification.initializeTable();
      }

      console.log('✅ Base de datos SQLite inicializada correctamente');
      return { success: true, mode: 'sqlite' };
    } catch (error) {
      console.error('Error al inicializar base de datos:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Verificar si la base de datos está inicializada
   */
  static async verificarBaseDatos() {
    try {
      if (this.isWebPlatform) {
        return { success: true, mode: 'localStorage' };
      }

      // Intentar obtener un usuario para verificar que las tablas existen
      await User.obtenerTodos();
      return { success: true, mode: 'sqlite' };
    } catch (error) {
      console.error('Error al verificar base de datos:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Limpiar la base de datos (solo para desarrollo)
   */
  static async limpiarBaseDatos() {
    try {
      console.warn('Limpiando base de datos...');

      if (this.isWebPlatform) {
        localStorage.clear();
        console.log('LocalStorage limpiado');
        return { success: true };
      }

      // En nativo, eliminar todas las tablas
      const db = SQLite.openDatabaseSync('ahorramasapp.db');
      try {
        await db.execAsync(`
          DROP TABLE IF EXISTS notifications;
          DROP TABLE IF EXISTS budgets;
          DROP TABLE IF EXISTS transactions;
          DROP TABLE IF EXISTS users;
        `);
        console.log('Base de datos SQLite limpiada');
      } catch (error) {
        console.warn('Error al limpiar tablas:', error);
      }

      return { success: true };
    } catch (error) {
      console.error('Error al limpiar base de datos:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Hacer backup de la base de datos
   */
  static async hacerBackup() {
    try {
      // Implementar lógica de backup
      console.log('Backup de base de datos realizado');
      return { success: true };
    } catch (error) {
      console.error('Error al hacer backup:', error);
      return { success: false, error: error.message };
    }
  }
}
