// controllers/BudgetController.js
/**
 * Controlador de Presupuestos
 * Maneja la lógica de negocio relacionada con presupuestos
 * Autor: Carlos
 */

import { Budget } from '../models/Budget';
import { Transaction } from '../models/Transaction';
import { Notification } from '../models/Notification';

export class BudgetController {
  /**
   * Crear presupuesto
   */
  static async crearPresupuesto(userId, categoria, montoLimite) {
    try {
      if (montoLimite <= 0) {
        throw new Error('El monto límite debe ser mayor a 0');
      }

      const ahora = new Date();
      const mes = ahora.getMonth() + 1;
      const año = ahora.getFullYear();

      // Verificar que no exista presupuesto para este mes y categoría
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
   * Obtener presupuestos del usuario para el mes actual
   */
  static async obtenerPresupuestos(userId) {
    try {
      const ahora = new Date();
      const mes = ahora.getMonth() + 1;
      const año = ahora.getFullYear();

      const presupuestos = await Budget.obtenerPresupuestosUsuario(userId, mes, año);

      // Enriquecer con datos de gasto actual
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
   * Actualizar presupuesto
   */
  static async actualizarPresupuesto(budgetId, montoLimite) {
    try {
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
   * Eliminar presupuesto
   */
  static async eliminarPresupuesto(budgetId) {
    try {
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
   * Obtener estado del presupuesto
   */
  static async obtenerEstadoPresupuesto(userId) {
    try {
      const presupuestos = await this.obtenerPresupuestos(userId);

      if (!presupuestos.success) {
        throw presupuestos.error;
      }

      const totalPresupuestado = presupuestos.presupuestos.reduce(
        (sum, p) => sum + p.montoLimite,
        0
      );
      const totalGastado = presupuestos.presupuestos.reduce((sum, p) => sum + p.montoActual, 0);
      const porcentajeGasto = (totalGastado / totalPresupuestado) * 100;

      // Categorías excedidas
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
   * Verificar alertas de presupuesto
   */
  static async verificarAlertas(userId) {
    try {
      const presupuestos = await this.obtenerPresupuestos(userId);

      if (!presupuestos.success) {
        throw presupuestos.error;
      }

      for (const presupuesto of presupuestos.presupuestos) {
        const porcentaje = presupuesto.porcentajeUso;

        if (porcentaje >= 100) {
          // Presupuesto excedido
          await Notification.crearNotificacion(
            userId,
            '⚠️ Presupuesto excedido',
            `Categoría: ${presupuesto.categoria}. Gasto: $${presupuesto.montoActual.toFixed(2)} de $${presupuesto.montoLimite.toFixed(2)}`,
            'alerta',
            new Date().toISOString()
          );
        } else if (porcentaje >= 80) {
          // Advertencia - casi se alcanza el límite
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
}
