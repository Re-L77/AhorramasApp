// controllers/TransactionController.js
/**
 * Controlador de Transacciones
 * Maneja la lógica de negocio relacionada con transacciones
 * Autor: Juan
 */

import { Platform } from 'react-native';

let Transaction = null;
let Budget = null;
let Notification = null;

if (Platform.OS !== 'web') {
  Transaction = require('../models/Transaction').Transaction;
  Budget = require('../models/Budget').Budget;
  Notification = require('../models/Notification').Notification;
}

export class TransactionController {
  /**
   * Crear una nueva transacción
   */
  static async crearTransaccion(userId, tipo, monto, descripcion, categoria) {
    try {
      if (Platform.OS === 'web') {
        return this._crearTransaccionWeb(userId, tipo, monto, descripcion, categoria);
      }

      // Validar datos
      if (!['ingreso', 'egreso'].includes(tipo)) {
        throw new Error('El tipo debe ser "ingreso" o "egreso"');
      }

      if (monto <= 0) {
        throw new Error('El monto debe ser mayor a 0');
      }

      const fecha = new Date().toISOString();
      const transaccionId = await Transaction.crearTransaccion(
        userId,
        tipo,
        monto,
        descripcion,
        categoria,
        fecha
      );

      // Crear notificación automática
      const tipoNotif = tipo === 'ingreso' ? 'logro' : 'info';
      const titulo = tipo === 'ingreso' ? '✅ Ingreso registrado' : '📊 Gasto registrado';
      const contenido = tipo === 'ingreso'
        ? `Se registró un ingreso de $${monto} (${descripcion})`
        : `Se registró un gasto de $${monto} (${categoria})`;

      await Notification.crearNotificacion(
        userId,
        titulo,
        contenido,
        tipoNotif,
        fecha
      );

      // Si es egreso, actualizar presupuesto
      if (tipo === 'egreso') {
        await this.actualizarPresupuesto(userId, categoria, monto);
      }

      return {
        success: true,
        transactionId: transaccionId,
        message: 'Transacción creada correctamente'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Crear transacción en web (localStorage)
   */
  static _crearTransaccionWeb(userId, tipo, monto, descripcion, categoria) {
    try {
      if (!['ingreso', 'egreso'].includes(tipo)) {
        throw new Error('El tipo debe ser "ingreso" o "egreso"');
      }

      if (monto <= 0) {
        throw new Error('El monto debe ser mayor a 0');
      }

      const transacciones = this._obtenerTransaccionesWeb();
      const nuevoId = transacciones.length > 0 ? Math.max(...transacciones.map(t => t.id)) + 1 : 1;

      const nuevaTransaccion = {
        id: nuevoId,
        userId,
        tipo,
        monto: parseFloat(monto),
        descripcion,
        categoria,
        fecha: new Date().toISOString()
      };

      transacciones.push(nuevaTransaccion);
      localStorage.setItem('transacciones', JSON.stringify(transacciones));

      // Crear notificación automática en web
      const tipoNotif = tipo === 'ingreso' ? 'logro' : 'info';
      const titulo = tipo === 'ingreso' ? '✅ Ingreso registrado' : '📊 Gasto registrado';
      const contenido = tipo === 'ingreso'
        ? `Se registró un ingreso de $${monto} (${descripcion})`
        : `Se registró un gasto de $${monto} (${categoria})`;

      this._crearNotificacionWeb(userId, titulo, contenido, tipoNotif);

      // Actualizar presupuesto si es egreso
      if (tipo === 'egreso') {
        this._actualizarPresupuestoWeb(userId, categoria, monto);
      }

      return {
        success: true,
        transactionId: nuevoId,
        message: 'Transacción creada correctamente'
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
  static _crearNotificacionWeb(userId, titulo, contenido, tipo = 'info') {
    try {
      const notificacionesJSON = localStorage.getItem('notificaciones');
      const notificaciones = notificacionesJSON ? JSON.parse(notificacionesJSON) : [];

      const nuevoId = notificaciones.length > 0 ? Math.max(...notificaciones.map(n => n.id)) + 1 : 1;

      const nuevaNotificacion = {
        id: nuevoId,
        userId,
        titulo,
        descripcion: contenido,
        tipo,
        fecha: new Date().toISOString(),
        leida: 0
      };

      notificaciones.push(nuevaNotificacion);
      localStorage.setItem('notificaciones', JSON.stringify(notificaciones));
    } catch (error) {
      console.error('Error creating notification in web:', error);
    }
  }

  /**
   * Obtener transacciones del usuario
   */
  static async obtenerTransacciones(userId) {
    try {
      if (Platform.OS === 'web') {
        return this._obtenerTransaccionesWeb(userId);
      }

      const transacciones = await Transaction.obtenerTransaccionesUsuario(userId);

      return {
        success: true,
        transacciones
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Obtener transacciones en web
   */
  static _obtenerTransaccionesWeb(userId = null) {
    try {
      const transaccionesJSON = localStorage.getItem('transacciones');
      const transacciones = transaccionesJSON ? JSON.parse(transaccionesJSON) : [];

      if (userId) {
        return {
          success: true,
          transacciones: transacciones.filter(t => t.userId === userId)
        };
      }

      return {
        success: true,
        transacciones
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Obtener transacciones en un rango de fechas
   */
  static async obtenerTransaccionesPorRango(userId, fechaInicio, fechaFin) {
    try {
      if (Platform.OS === 'web') {
        return this._obtenerTransaccionesPorRangoWeb(userId, fechaInicio, fechaFin);
      }

      const transacciones = await Transaction.obtenerTransaccionesPorRango(
        userId,
        fechaInicio,
        fechaFin
      );

      return {
        success: true,
        transacciones
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Obtener transacciones por rango en web
   */
  static _obtenerTransaccionesPorRangoWeb(userId, fechaInicio, fechaFin) {
    try {
      const transaccionesJSON = localStorage.getItem('transacciones');
      const transacciones = transaccionesJSON ? JSON.parse(transaccionesJSON) : [];

      const filtradas = transacciones.filter(t => {
        const fecha = new Date(t.fecha);
        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);
        return t.userId === userId && fecha >= inicio && fecha <= fin;
      });

      return {
        success: true,
        transacciones: filtradas
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Obtener transacciones por categoría
   */
  static async obtenerTransaccionesPorCategoria(userId, categoria) {
    try {
      if (Platform.OS === 'web') {
        return this._obtenerTransaccionesPorCategoriaWeb(userId, categoria);
      }

      const transacciones = await Transaction.obtenerTransaccionesPorCategoria(userId, categoria);

      return {
        success: true,
        transacciones
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Obtener transacciones por categoría en web
   */
  static _obtenerTransaccionesPorCategoriaWeb(userId, categoria) {
    try {
      const transaccionesJSON = localStorage.getItem('transacciones');
      const transacciones = transaccionesJSON ? JSON.parse(transaccionesJSON) : [];

      const filtradas = transacciones.filter(t =>
        t.userId === userId && t.categoria.toLowerCase() === categoria.toLowerCase()
      );

      return {
        success: true,
        transacciones: filtradas
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Actualizar transacción
   */
  static async actualizarTransaccion(transaccionId, tipo, monto, descripcion, categoria) {
    try {
      if (Platform.OS === 'web') {
        return this._actualizarTransaccionWeb(transaccionId, tipo, monto, descripcion, categoria);
      }

      if (!['ingreso', 'egreso'].includes(tipo)) {
        throw new Error('El tipo debe ser "ingreso" o "egreso"');
      }

      if (monto <= 0) {
        throw new Error('El monto debe ser mayor a 0');
      }

      await Transaction.actualizarTransaccion(transaccionId, tipo, monto, descripcion, categoria);

      return {
        success: true,
        message: 'Transacción actualizada correctamente'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Actualizar transacción en web
   */
  static _actualizarTransaccionWeb(transaccionId, tipo, monto, descripcion, categoria) {
    try {
      if (!['ingreso', 'egreso'].includes(tipo)) {
        throw new Error('El tipo debe ser "ingreso" o "egreso"');
      }

      if (monto <= 0) {
        throw new Error('El monto debe ser mayor a 0');
      }

      const transacciones = this._obtenerTransaccionesWeb().transacciones;
      const index = transacciones.findIndex(t => t.id === transaccionId);

      if (index === -1) {
        throw new Error('Transacción no encontrada');
      }

      transacciones[index] = {
        ...transacciones[index],
        tipo,
        monto: parseFloat(monto),
        descripcion,
        categoria
      };

      localStorage.setItem('transacciones', JSON.stringify(transacciones));

      return {
        success: true,
        message: 'Transacción actualizada correctamente'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Eliminar transacción
   */
  static async eliminarTransaccion(transaccionId, userId) {
    try {
      if (Platform.OS === 'web') {
        return this._eliminarTransaccionWeb(transaccionId, userId);
      }

      const transaccion = await Transaction.obtenerTransaccionPorId(transaccionId);

      if (!transaccion || transaccion.userId !== userId) {
        throw new Error('Transacción no encontrada o no tienes permiso para eliminarla');
      }

      await Transaction.eliminarTransaccion(transaccionId);

      return {
        success: true,
        message: 'Transacción eliminada correctamente'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Eliminar transacción en web
   */
  static _eliminarTransaccionWeb(transaccionId, userId) {
    try {
      const transacciones = this._obtenerTransaccionesWeb().transacciones;
      const transaccion = transacciones.find(t => t.id === transaccionId);

      if (!transaccion || transaccion.userId !== userId) {
        throw new Error('Transacción no encontrada o no tienes permiso para eliminarla');
      }

      const filtradas = transacciones.filter(t => t.id !== transaccionId);
      localStorage.setItem('transacciones', JSON.stringify(filtradas));

      return {
        success: true,
        message: 'Transacción eliminada correctamente'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Obtener resumen financiero
   */
  static async obtenerResumen(userId) {
    try {
      if (Platform.OS === 'web') {
        return this._obtenerResumenWeb(userId);
      }

      const ingresos = await Transaction.obtenerTotalPorTipo(userId, 'ingreso');
      const egresos = await Transaction.obtenerTotalPorTipo(userId, 'egreso');
      const saldo = ingresos - egresos;

      return {
        success: true,
        resumen: {
          ingresos,
          egresos,
          saldo
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
      const result = this._obtenerTransaccionesWeb(userId);
      const transacciones = result.transacciones;

      const ingresos = transacciones
        .filter(t => t.tipo === 'ingreso')
        .reduce((sum, t) => sum + t.monto, 0);

      const egresos = transacciones
        .filter(t => t.tipo === 'egreso')
        .reduce((sum, t) => sum + t.monto, 0);

      const saldo = ingresos - egresos;

      return {
        success: true,
        resumen: {
          ingresos,
          egresos,
          saldo
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
   * Actualizar presupuesto basado en transacción
   */
  static async actualizarPresupuesto(userId, categoria, monto) {
    try {
      if (Platform.OS === 'web') {
        return this._actualizarPresupuestoWeb(userId, categoria, monto);
      }

      const ahora = new Date();
      const mes = ahora.getMonth() + 1;
      const año = ahora.getFullYear();

      const presupuesto = await Budget.obtenerPresupuestoPorCategoria(userId, categoria, mes, año);

      if (presupuesto) {
        const nuevoMonto = presupuesto.montoActual + monto;
        await Budget.actualizarMontoActual(presupuesto.id, nuevoMonto);

        // Verificar si se excedió el presupuesto
        if (nuevoMonto > presupuesto.montoLimite) {
          await Notification.crearNotificacion(
            userId,
            'Presupuesto excedido',
            `Has excedido el presupuesto de ${categoria}`,
            'alerta',
            new Date().toISOString()
          );
        }
      }
    } catch (error) {
      console.error('Error al actualizar presupuesto:', error);
    }
  }

  /**
   * Actualizar presupuesto en web
   */
  static _actualizarPresupuestoWeb(userId, categoria, monto) {
    try {
      const presupuestosJSON = localStorage.getItem('presupuestos');
      const presupuestos = presupuestosJSON ? JSON.parse(presupuestosJSON) : [];

      const ahora = new Date();
      const mes = ahora.getMonth() + 1;
      const año = ahora.getFullYear();

      const presupuesto = presupuestos.find(p =>
        p.userId === userId && p.categoria === categoria && p.mes === mes && p.año === año
      );

      if (presupuesto) {
        presupuesto.montoActual += monto;

        // Verificar si se excedió
        if (presupuesto.montoActual > presupuesto.montoLimite) {
          const notificaciones = this._obtenerNotificacionesWeb();
          notificaciones.push({
            id: notificaciones.length > 0 ? Math.max(...notificaciones.map(n => n.id)) + 1 : 1,
            userId,
            titulo: 'Presupuesto excedido',
            descripcion: `Has excedido el presupuesto de ${categoria}`,
            tipo: 'alerta',
            fecha: new Date().toISOString(),
            leida: false
          });
          localStorage.setItem('notificaciones', JSON.stringify(notificaciones));
        }

        localStorage.setItem('presupuestos', JSON.stringify(presupuestos));
      }
    } catch (error) {
      console.error('Error al actualizar presupuesto en web:', error);
    }
  }

  /**
   * Helper para obtener notificaciones en web
   */
  static _obtenerNotificacionesWeb() {
    const notificacionesJSON = localStorage.getItem('notificaciones');
    return notificacionesJSON ? JSON.parse(notificacionesJSON) : [];
  }
}
