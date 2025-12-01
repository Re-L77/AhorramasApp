// controllers/BudgetController.js
/**
 * Controlador de Presupuestos
 * Maneja la lógica de negocio relacionada con presupuestos
 * Autor: Carlos
 */

import { Platform } from 'react-native';

let Budget = null;
let Transaction = null;
let Notification = null;

if (Platform.OS !== 'web') {
  Budget = require('../models/Budget').Budget;
  Transaction = require('../models/Transaction').Transaction;
  Notification = require('../models/Notification').Notification;
}

export class BudgetController {
  /**
   * Crear presupuesto
   */
  static async crearPresupuesto(userId, categoria, montoLimite) {
    try {
      if (Platform.OS === 'web') {
        return this._crearPresupuestoWeb(userId, categoria, montoLimite);
      }

      if (montoLimite <= 0) {
        throw new Error('El monto límite debe ser mayor a 0');
      }

      const ahora = new Date();
      const mes = ahora.getMonth() + 1;
      const año = ahora.getFullYear();

      const presupuestoExistente = await Budget.obtenerPresupuestoPorCategoria(
        userId,
        categoria,
        mes,
        año
      );

      if (presupuestoExistente) {
        throw new Error('Ya existe presupuesto para esta categoría en este mes');
      }

      const budgetId = await Budget.crearPresupuesto(userId, categoria, montoLimite, mes, año);

      return {
        success: true,
        budgetId,
        message: 'Presupuesto creado correctamente'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Crear presupuesto en web
   */
  static _crearPresupuestoWeb(userId, categoria, montoLimite) {
    try {
      if (montoLimite <= 0) {
        throw new Error('El monto límite debe ser mayor a 0');
      }

      const presupuestos = this._obtenerPresupuestosWeb();
      const ahora = new Date();
      const mes = ahora.getMonth() + 1;
      const año = ahora.getFullYear();

      const existe = presupuestos.find(p =>
        p.userId === userId && p.categoria === categoria && p.mes === mes && p.año === año
      );

      if (existe) {
        throw new Error('Ya existe presupuesto para esta categoría en este mes');
      }

      const nuevoId = presupuestos.length > 0 ? Math.max(...presupuestos.map(p => p.id)) + 1 : 1;
      const nuevoPresupuesto = {
        id: nuevoId,
        userId,
        categoria,
        montoLimite,
        montoActual: 0,
        mes,
        año
      };

      presupuestos.push(nuevoPresupuesto);
      localStorage.setItem('presupuestos', JSON.stringify(presupuestos));

      return {
        success: true,
        budgetId: nuevoId,
        message: 'Presupuesto creado correctamente'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Obtener presupuestos del usuario para el mes actual
   */
  static async obtenerPresupuestos(userId) {
    try {
      if (Platform.OS === 'web') {
        return this._obtenerPresupuestosWeb(userId);
      }

      const ahora = new Date();
      const mes = ahora.getMonth() + 1;
      const año = ahora.getFullYear();

      const presupuestos = await Budget.obtenerPresupuestosUsuario(userId, mes, año);

      const presupuestosEnriquecidos = await Promise.all(
        presupuestos.map(async (presupuesto) => {
          const transacciones = await Transaction.obtenerTransaccionesPorCategoria(
            userId,
            presupuesto.categoria
          );

          const montoActual = transacciones.reduce((sum, t) => {
            if (t.tipo === 'egreso') {
              return sum + t.monto;
            }
            return sum;
          }, 0);

          return {
            ...presupuesto,
            montoActual,
            porcentajeUso: (montoActual / presupuesto.montoLimite) * 100,
            estado: montoActual > presupuesto.montoLimite ? 'excedido' : 'normal'
          };
        })
      );

      return {
        success: true,
        presupuestos: presupuestosEnriquecidos
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Obtener presupuestos en web
   */
  static _obtenerPresupuestosWeb(userId = null) {
    try {
      const presupuestosJSON = localStorage.getItem('presupuestos');
      const presupuestos = presupuestosJSON ? JSON.parse(presupuestosJSON) : [];

      const ahora = new Date();
      const mes = ahora.getMonth() + 1;
      const año = ahora.getFullYear();

      let resultado = presupuestos.filter(p => p.mes === mes && p.año === año);

      if (userId) {
        resultado = resultado.filter(p => p.userId === userId);
      }

      // Enriquecer con datos de transacciones
      const presupuestosEnriquecidos = resultado.map(presupuesto => {
        const transaccionesJSON = localStorage.getItem('transacciones');
        const transacciones = transaccionesJSON ? JSON.parse(transaccionesJSON) : [];

        const montoActual = transacciones
          .filter(t => t.userId === presupuesto.userId && t.categoria === presupuesto.categoria && t.tipo === 'egreso')
          .reduce((sum, t) => sum + t.monto, 0);

        return {
          ...presupuesto,
          montoActual,
          porcentajeUso: (montoActual / presupuesto.montoLimite) * 100,
          estado: montoActual > presupuesto.montoLimite ? 'excedido' : 'normal'
        };
      });

      if (userId) {
        return {
          success: true,
          presupuestos: presupuestosEnriquecidos
        };
      }

      return {
        success: true,
        presupuestos: presupuestosEnriquecidos
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Actualizar presupuesto
   */
  static async actualizarPresupuesto(budgetId, montoLimite) {
    try {
      if (Platform.OS === 'web') {
        return this._actualizarPresupuestoWeb(budgetId, montoLimite);
      }

      if (montoLimite <= 0) {
        throw new Error('El monto límite debe ser mayor a 0');
      }

      await Budget.actualizarPresupuesto(budgetId, montoLimite);

      return {
        success: true,
        message: 'Presupuesto actualizado correctamente'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Actualizar presupuesto en web
   */
  static _actualizarPresupuestoWeb(budgetId, montoLimite) {
    try {
      if (montoLimite <= 0) {
        throw new Error('El monto límite debe ser mayor a 0');
      }

      const presupuestos = this._obtenerPresupuestosWeb().presupuestos ||
        (localStorage.getItem('presupuestos') ? JSON.parse(localStorage.getItem('presupuestos')) : []);

      const presupuesto = presupuestos.find(p => p.id === budgetId);

      if (!presupuesto) {
        throw new Error('Presupuesto no encontrado');
      }

      presupuesto.montoLimite = montoLimite;
      localStorage.setItem('presupuestos', JSON.stringify(presupuestos));

      return {
        success: true,
        message: 'Presupuesto actualizado correctamente'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Eliminar presupuesto
   */
  static async eliminarPresupuesto(budgetId) {
    try {
      if (Platform.OS === 'web') {
        return this._eliminarPresupuestoWeb(budgetId);
      }

      await Budget.eliminarPresupuesto(budgetId);

      return {
        success: true,
        message: 'Presupuesto eliminado correctamente'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Eliminar presupuesto en web
   */
  static _eliminarPresupuestoWeb(budgetId) {
    try {
      const presupuestosJSON = localStorage.getItem('presupuestos');
      const presupuestos = presupuestosJSON ? JSON.parse(presupuestosJSON) : [];

      const index = presupuestos.findIndex(p => p.id === budgetId);

      if (index === -1) {
        throw new Error('Presupuesto no encontrado');
      }

      presupuestos.splice(index, 1);
      localStorage.setItem('presupuestos', JSON.stringify(presupuestos));

      return {
        success: true,
        message: 'Presupuesto eliminado correctamente'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Obtener estado del presupuesto
   */
  static async obtenerEstadoPresupuesto(userId) {
    try {
      if (Platform.OS === 'web') {
        return this._obtenerEstadoPresupuestoWeb(userId);
      }

      const presupuestos = await this.obtenerPresupuestos(userId);

      if (!presupuestos.success) {
        throw presupuestos.error;
      }

      const totalPresupuestado = presupuestos.presupuestos.reduce(
        (sum, p) => sum + p.montoLimite,
        0
      );
      const totalGastado = presupuestos.presupuestos.reduce((sum, p) => sum + p.montoActual, 0);
      const porcentajeGasto = totalPresupuestado > 0 ? (totalGastado / totalPresupuestado) * 100 : 0;

      const categoriasExcedidas = presupuestos.presupuestos.filter(p => p.estado === 'excedido');

      return {
        success: true,
        estado: {
          totalPresupuestado,
          totalGastado,
          saldoDisponible: totalPresupuestado - totalGastado,
          porcentajeGasto,
          categoriasExcedidas: categoriasExcedidas.map(c => ({
            categoria: c.categoria,
            limite: c.montoLimite,
            gasto: c.montoActual,
            exceso: c.montoActual - c.montoLimite
          }))
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
   * Obtener estado presupuesto en web
   */
  static _obtenerEstadoPresupuestoWeb(userId) {
    try {
      const presupuestosJSON = localStorage.getItem('presupuestos');
      const presupuestos = presupuestosJSON ? JSON.parse(presupuestosJSON) : [];
      const transaccionesJSON = localStorage.getItem('transacciones');
      const transacciones = transaccionesJSON ? JSON.parse(transaccionesJSON) : [];

      const ahora = new Date();
      const mes = ahora.getMonth() + 1;
      const año = ahora.getFullYear();

      let presupuestosUsuario = presupuestos.filter(p =>
        p.userId === userId && p.mes === mes && p.año === año
      );

      // Enriquecer datos
      presupuestosUsuario = presupuestosUsuario.map(p => {
        const montoActual = transacciones
          .filter(t => t.userId === userId && t.categoria === p.categoria && t.tipo === 'egreso')
          .reduce((sum, t) => sum + t.monto, 0);

        return {
          ...p,
          montoActual,
          porcentajeUso: (montoActual / p.montoLimite) * 100,
          estado: montoActual > p.montoLimite ? 'excedido' : 'normal'
        };
      });

      const totalPresupuestado = presupuestosUsuario.reduce((sum, p) => sum + p.montoLimite, 0);
      const totalGastado = presupuestosUsuario.reduce((sum, p) => sum + p.montoActual, 0);
      const porcentajeGasto = totalPresupuestado > 0 ? (totalGastado / totalPresupuestado) * 100 : 0;

      const categoriasExcedidas = presupuestosUsuario.filter(p => p.estado === 'excedido');

      return {
        success: true,
        estado: {
          totalPresupuestado,
          totalGastado,
          saldoDisponible: totalPresupuestado - totalGastado,
          porcentajeGasto,
          categoriasExcedidas: categoriasExcedidas.map(c => ({
            categoria: c.categoria,
            limite: c.montoLimite,
            gasto: c.montoActual,
            exceso: c.montoActual - c.montoLimite
          }))
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
   * Verificar alertas de presupuesto
   */
  static async verificarAlertas(userId) {
    try {
      if (Platform.OS === 'web') {
        return this._verificarAlertasWeb(userId);
      }

      const presupuestos = await this.obtenerPresupuestos(userId);

      if (!presupuestos.success) {
        throw presupuestos.error;
      }

      for (const presupuesto of presupuestos.presupuestos) {
        const porcentaje = presupuesto.porcentajeUso;

        if (porcentaje >= 100) {
          await Notification.crearNotificacion(
            userId,
            '⚠️ Presupuesto excedido',
            `Categoría: ${presupuesto.categoria}. Gasto: $${presupuesto.montoActual.toFixed(2)} de $${presupuesto.montoLimite.toFixed(2)}`,
            'alerta',
            new Date().toISOString()
          );
        } else if (porcentaje >= 80) {
          await Notification.crearNotificacion(
            userId,
            '⚠️ Presupuesto al 80%',
            `Categoría: ${presupuesto.categoria}. Has gastado el 80% del presupuesto`,
            'recordatorio',
            new Date().toISOString()
          );
        }
      }

      return {
        success: true,
        message: 'Alertas verificadas'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Verificar alertas en web
   */
  static _verificarAlertasWeb(userId) {
    try {
      const presupuestosJSON = localStorage.getItem('presupuestos');
      const presupuestos = presupuestosJSON ? JSON.parse(presupuestosJSON) : [];
      const transaccionesJSON = localStorage.getItem('transacciones');
      const transacciones = transaccionesJSON ? JSON.parse(transaccionesJSON) : [];
      const notificacionesJSON = localStorage.getItem('notificaciones');
      const notificaciones = notificacionesJSON ? JSON.parse(notificacionesJSON) : [];

      const ahora = new Date();
      const mes = ahora.getMonth() + 1;
      const año = ahora.getFullYear();

      const presupuestosUsuario = presupuestos.filter(p =>
        p.userId === userId && p.mes === mes && p.año === año
      );

      for (const presupuesto of presupuestosUsuario) {
        const montoActual = transacciones
          .filter(t => t.userId === userId && t.categoria === presupuesto.categoria && t.tipo === 'egreso')
          .reduce((sum, t) => sum + t.monto, 0);

        const porcentaje = (montoActual / presupuesto.montoLimite) * 100;

        if (porcentaje >= 100) {
          const notifId = notificaciones.length > 0 ? Math.max(...notificaciones.map(n => n.id)) + 1 : 1;
          notificaciones.push({
            id: notifId,
            userId,
            titulo: '⚠️ Presupuesto excedido',
            descripcion: `Categoría: ${presupuesto.categoria}. Gasto: $${montoActual.toFixed(2)} de $${presupuesto.montoLimite.toFixed(2)}`,
            tipo: 'alerta',
            fecha: new Date().toISOString(),
            leida: false
          });
        } else if (porcentaje >= 80) {
          const notifId = notificaciones.length > 0 ? Math.max(...notificaciones.map(n => n.id)) + 1 : 1;
          notificaciones.push({
            id: notifId,
            userId,
            titulo: '⚠️ Presupuesto al 80%',
            descripcion: `Categoría: ${presupuesto.categoria}. Has gastado el 80% del presupuesto`,
            tipo: 'recordatorio',
            fecha: new Date().toISOString(),
            leida: false
          });
        }
      }

      localStorage.setItem('notificaciones', JSON.stringify(notificaciones));

      return {
        success: true,
        message: 'Alertas verificadas'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}
