// controllers/NotificationController.js
/**
 * Controlador de Notificaciones
 * Maneja la lógica de negocio relacionada con notificaciones
 * Autor: Vanesa
 */

import { Notification } from '../models/Notification';

export class NotificationController {
  /**
   * Crear notificación
   */
  static async crearNotificacion(userId, titulo, descripcion, tipo) {
    try {
      const tiposValidos = ['alerta', 'recordatorio', 'logro', 'info'];

      if (!tiposValidos.includes(tipo)) {
        throw new Error(`El tipo debe ser uno de: ${tiposValidos.join(', ')}`);
      }

      const notificationId = await Notification.crearNotificacion(
        userId,
        titulo,
        descripcion,
        tipo,
        new Date().toISOString()
      );

      return {
        success: true,
        notificationId,
        message: 'Notificación creada correctamente'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Obtener notificaciones del usuario
   */
  static async obtenerNotificaciones(userId, soloNoLeidas = false) {
    try {
      const notificaciones = await Notification.obtenerNotificacionesUsuario(userId, soloNoLeidas);

      return {
        success: true,
        notificaciones
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Obtener notificaciones por tipo
   */
  static async obtenerNotificacionesPorTipo(userId, tipo) {
    try {
      const tiposValidos = ['alerta', 'recordatorio', 'logro', 'info'];

      if (!tiposValidos.includes(tipo)) {
        throw new Error(`El tipo debe ser uno de: ${tiposValidos.join(', ')}`);
      }

      const notificaciones = await Notification.obtenerNotificacionesPorTipo(userId, tipo);

      return {
        success: true,
        notificaciones
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Marcar notificación como leída
   */
  static async marcarComoLeida(notificationId) {
    try {
      await Notification.marcarComoLeida(notificationId);

      return {
        success: true,
        message: 'Notificación marcada como leída'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Marcar todas las notificaciones como leídas
   */
  static async marcarTodasComoLeidas(userId) {
    try {
      await Notification.marcarTodasComoLeidas(userId);

      return {
        success: true,
        message: 'Todas las notificaciones marcadas como leídas'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Eliminar notificación
   */
  static async eliminarNotificacion(notificationId) {
    try {
      await Notification.eliminarNotificacion(notificationId);

      return {
        success: true,
        message: 'Notificación eliminada'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Obtener conteo de notificaciones no leídas
   */
  static async obtenerConteoNoLeidas(userId) {
    try {
      const total = await Notification.contarNoLeidas(userId);

      return {
        success: true,
        noLeidas: total
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Limpiar notificaciones antiguas
   */
  static async limpiarNotificacionesAntiguas(dias = 30) {
    try {
      await Notification.eliminarNotificacionesAntiguas(dias);

      return {
        success: true,
        message: `Notificaciones más antiguas de ${dias} días eliminadas`
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Obtener resumen de notificaciones
   */
  static async obtenerResumen(userId) {
    try {
      const todas = await Notification.obtenerNotificacionesUsuario(userId, false);
      const noLeidas = await Notification.contarNoLeidas(userId);

      const tiposCount = {
        alerta: 0,
        recordatorio: 0,
        logro: 0,
        info: 0
      };

      todas.forEach(notif => {
        tiposCount[notif.tipo]++;
      });

      return {
        success: true,
        resumen: {
          total: todas.length,
          noLeidas,
          porTipo: tiposCount
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}
