// controllers/TransactionController.js
/**
 * Controlador de Transacciones
 * Maneja la lógica de negocio relacionada con transacciones
 * Autor: Juan
 */

import { Transaction } from '../models/Transaction';
import { Budget } from '../models/Budget';
import { Notification } from '../models/Notification';

export class TransactionController {
  /**
   * Crear una nueva transacción
   */
  static async crearTransaccion(userId, tipo, monto, descripcion, categoria) {
    try {
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
   * Obtener transacciones del usuario
   */
  static async obtenerTransacciones(userId) {
    try {
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
   * Obtener transacciones en un rango de fechas
   */
  static async obtenerTransaccionesPorRango(userId, fechaInicio, fechaFin) {
    try {
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
   * Obtener transacciones por categoría
   */
  static async obtenerTransaccionesPorCategoria(userId, categoria) {
    try {
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
   * Actualizar transacción
   */
  static async actualizarTransaccion(transaccionId, tipo, monto, descripcion, categoria) {
    try {
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
   * Eliminar transacción
   */
  static async eliminarTransaccion(transaccionId, userId) {
    try {
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
   * Obtener resumen financiero
   */
  static async obtenerResumen(userId) {
    try {
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
   * Actualizar presupuesto basado en transacción
   */
  static async actualizarPresupuesto(userId, categoria, monto) {
    try {
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
}
