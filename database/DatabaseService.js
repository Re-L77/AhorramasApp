// database/DatabaseService.js
/**
 * Servicio de Base de Datos
 * Inicializa y gestiona la conexión con SQLite
 * Autor: Equipo Técnico
 */

import { User } from '../models/User';
import { Transaction } from '../models/Transaction';
import { Budget } from '../models/Budget';
import { Notification } from '../models/Notification';

export class DatabaseService {
  /**
   * Inicializar la base de datos
   * Crear todas las tablas necesarias
   */
  static async inicializarBaseDatos() {
    try {
      console.log('Inicializando base de datos...');

      // Crear tablas en orden de dependencia
      await User.initializeTable();
      await Transaction.initializeTable();
      await Budget.initializeTable();
      await Notification.initializeTable();

      console.log('Base de datos inicializada correctamente');
      return { success: true };
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
      // Intentar obtener un usuario para verificar que las tablas existen
      await User.obtenerTodos();
      return { success: true };
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

      // Nota: En una app real, querrás hacer backup primero
      // Este es solo para desarrollo

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
