/**
 * Controlador de Notificaciones
 * Maneja la lógica de negocio relacionada con notificaciones
 */

import { Platform } from 'react-native';

let Notification = null;

if (Platform.OS !== 'web') {
  Notification = require('../models/Notification').Notification;
}

export class NotificationController {
  /**
   * Crear notificación
   */
  static async crearNotificacion(userId, titulo, descripcion, tipo) {
    try {
      if (Platform.OS === 'web') {
        return this._crearNotificacionWeb(userId, titulo, descripcion, tipo);
      }

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
   * Crear notificación en web
   */
  static _crearNotificacionWeb(userId, titulo, descripcion, tipo) {
    try {
      const tiposValidos = ['alerta', 'recordatorio', 'logro', 'info'];

      if (!tiposValidos.includes(tipo)) {
        throw new Error(`El tipo debe ser uno de: ${tiposValidos.join(', ')}`);
      }

      const notificaciones = this._obtenerNotificacionesWeb();
      const nuevoId = notificaciones.length > 0 ? Math.max(...notificaciones.map(n => n.id)) + 1 : 1;

      const nuevaNotificacion = {
        id: nuevoId,
        userId,
        titulo,
        descripcion,
        tipo,
        fecha: new Date().toISOString(),
        leida: false
      };

      notificaciones.push(nuevaNotificacion);
      localStorage.setItem('notificaciones', JSON.stringify(notificaciones));

      return {
        success: true,
        notificationId: nuevoId,
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
      if (Platform.OS === 'web') {
        return this._obtenerNotificacionesWeb(userId, soloNoLeidas);
      }

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
   * Obtener notificaciones en web
   */
  static _obtenerNotificacionesWeb(userId = null, soloNoLeidas = false) {
    try {
      const notificacionesJSON = localStorage.getItem('notificaciones');
      const notificaciones = notificacionesJSON ? JSON.parse(notificacionesJSON) : [];

      let resultado = notificaciones;

      if (userId) {
        resultado = resultado.filter(n => n.userId === userId);
      }

      if (soloNoLeidas) {
        resultado = resultado.filter(n => !n.leida);
      }

      return {
        success: true,
        notificaciones: resultado.sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion))
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
      if (Platform.OS === 'web') {
        return this._obtenerNotificacionesPorTipoWeb(userId, tipo);
      }

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
   * Obtener notificaciones por tipo en web
   */
  static _obtenerNotificacionesPorTipoWeb(userId, tipo) {
    try {
      const tiposValidos = ['alerta', 'recordatorio', 'logro', 'info'];

      if (!tiposValidos.includes(tipo)) {
        throw new Error(`El tipo debe ser uno de: ${tiposValidos.join(', ')}`);
      }

      const notificacionesJSON = localStorage.getItem('notificaciones');
      const notificaciones = notificacionesJSON ? JSON.parse(notificacionesJSON) : [];

      const filtradas = notificaciones.filter(n =>
        n.userId === userId && n.tipo === tipo
      );

      return {
        success: true,
        notificaciones: filtradas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
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
      if (Platform.OS === 'web') {
        return this._marcarComoLeidaWeb(notificationId);
      }

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
   * Marcar como leída en web
   */
  static _marcarComoLeidaWeb(notificationId) {
    try {
      const notificaciones = this._obtenerNotificacionesWeb().notificaciones;
      const notificacion = notificaciones.find(n => n.id === notificationId);

      if (!notificacion) {
        throw new Error('Notificación no encontrada');
      }

      notificacion.leida = true;
      localStorage.setItem('notificaciones', JSON.stringify(notificaciones));

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
      if (Platform.OS === 'web') {
        return this._marcarTodasComoLeidasWeb(userId);
      }

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
   * Marcar todas como leídas en web
   */
  static _marcarTodasComoLeidasWeb(userId) {
    try {
      const notificacionesJSON = localStorage.getItem('notificaciones');
      let notificaciones = notificacionesJSON ? JSON.parse(notificacionesJSON) : [];

      notificaciones = notificaciones.map(n =>
        n.userId === userId ? { ...n, leida: true } : n
      );

      localStorage.setItem('notificaciones', JSON.stringify(notificaciones));

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
      if (Platform.OS === 'web') {
        return this._eliminarNotificacionWeb(notificationId);
      }

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
   * Eliminar notificación en web
   */
  static _eliminarNotificacionWeb(notificationId) {
    try {
      const notificacionesJSON = localStorage.getItem('notificaciones');
      let notificaciones = notificacionesJSON ? JSON.parse(notificacionesJSON) : [];

      const index = notificaciones.findIndex(n => n.id === notificationId);

      if (index === -1) {
        throw new Error('Notificación no encontrada');
      }

      notificaciones.splice(index, 1);
      localStorage.setItem('notificaciones', JSON.stringify(notificaciones));

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
      if (Platform.OS === 'web') {
        return this._obtenerConteoNoLeidasWeb(userId);
      }

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
   * Obtener conteo no leídas en web
   */
  static _obtenerConteoNoLeidasWeb(userId) {
    try {
      const notificacionesJSON = localStorage.getItem('notificaciones');
      const notificaciones = notificacionesJSON ? JSON.parse(notificacionesJSON) : [];

      const noLeidas = notificaciones.filter(n => n.userId === userId && !n.leida).length;

      return {
        success: true,
        noLeidas
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
      if (Platform.OS === 'web') {
        return this._limpiarNotificacionesAntiguasWeb(dias);
      }

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
   * Limpiar antiguas en web
   */
  static _limpiarNotificacionesAntiguasWeb(dias = 30) {
    try {
      const notificacionesJSON = localStorage.getItem('notificaciones');
      let notificaciones = notificacionesJSON ? JSON.parse(notificacionesJSON) : [];

      const ahora = new Date();
      const fechaLimite = new Date(ahora.getTime() - dias * 24 * 60 * 60 * 1000);

      notificaciones = notificaciones.filter(n => new Date(n.fecha) > fechaLimite);

      localStorage.setItem('notificaciones', JSON.stringify(notificaciones));

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
      if (Platform.OS === 'web') {
        return this._obtenerResumenWeb(userId);
      }

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

  /**
   * Obtener resumen en web
   */
  static _obtenerResumenWeb(userId) {
    try {
      const result = this._obtenerNotificacionesWeb(userId, false);
      const todas = result.notificaciones;
      const noLeidas = todas.filter(n => !n.leida).length;

      const tiposCount = {
        alerta: 0,
        recordatorio: 0,
        logro: 0,
        info: 0
      };

      todas.forEach(notif => {
        if (tiposCount.hasOwnProperty(notif.tipo)) {
          tiposCount[notif.tipo]++;
        }
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
