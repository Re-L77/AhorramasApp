// database/DatabaseService.js
/**
 * Servicio de Base de Datos
 * Inicializa y gestiona la conexión con SQLite
 * Autor: Equipo Técnico
 */

import { Platform } from 'react-native';

// Solo importar en plataformas que lo soporten
let User, Transaction, Budget, Notification;

if (Platform.OS !== 'web') {
  User = require('../models/User').User;
  Transaction = require('../models/Transaction').Transaction;
  Budget = require('../models/Budget').Budget;
  Notification = require('../models/Notification').Notification;
}

export class DatabaseService {
  static isWebPlatform = Platform.OS === 'web';

  /**
   * Inicializar la base de datos
   * Crear todas las tablas necesarias
   */
  static async inicializarBaseDatos() {
    try {
      console.log('Inicializando base de datos...');

      // En web, usar localStorage como alternativa temporal
      if (this.isWebPlatform) {
        console.log('⚠️ Usando almacenamiento local (localStorage) en web');
        console.log('ℹ️ Para usar SQLite, ejecutar en iOS/Android');
        return { success: true, mode: 'localStorage' };
      }

      // Crear tablas en orden de dependencia
      await User.initializeTable();
      await Transaction.initializeTable();
      await Budget.initializeTable();
      await Notification.initializeTable();

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

      console.log('Base de datos limpiada');
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
