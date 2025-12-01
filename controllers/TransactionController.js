// controllers/TransactionController.js
/**
 * Controlador de Transacciones
 * Maneja la lógica de negocio relacionada con transacciones
 * Autor: Juan
 */

import { Platform } from 'react-native';
import { Transaction } from '../models/Transaction';
import { Budget } from '../models/Budget';
import { Notification } from '../models/Notification';

export class TransactionController {
  /**
   * Crear una nueva transacción
   */
  static async crearTransaccion(userId, tipo, monto, descripcion, categoria, icono = null) {
    try {
      if (Platform.OS === 'web') {
        return this._crearTransaccionWeb(userId, tipo, monto, descripcion, categoria, icono);
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
        fecha,
        icono
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
  static _crearTransaccionWeb(userId, tipo, monto, descripcion, categoria, icono = null) {
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
        fecha: new Date().toISOString(),
        icono
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
  static async actualizarTransaccion(transaccionId, tipo, monto, descripcion, categoria, icono = null) {
    try {
      if (Platform.OS === 'web') {
        return this._actualizarTransaccionWeb(transaccionId, tipo, monto, descripcion, categoria, icono);
      }

      if (!['ingreso', 'egreso'].includes(tipo)) {
        throw new Error('El tipo debe ser "ingreso" o "egreso"');
      }

      if (monto <= 0) {
        throw new Error('El monto debe ser mayor a 0');
      }

      // Obtener transacción antigua para comparar
      const transaccionAntigua = await Transaction.obtenerTransaccionPorId(transaccionId);

      await Transaction.actualizarTransaccion(transaccionId, tipo, monto, descripcion, categoria, icono);

      // Actualizar presupuesto si es egreso y cambió el monto o categoría
      if (tipo === 'egreso' && transaccionAntigua) {
        const diferenciaMonto = monto - transaccionAntigua.monto;

        // Si cambió la categoría, restar del presupuesto antiguo y sumar al nuevo
        if (transaccionAntigua.categoria !== categoria) {
          await this.actualizarPresupuesto(transaccionAntigua.userId, transaccionAntigua.categoria, -transaccionAntigua.monto);
          await this.actualizarPresupuesto(transaccionAntigua.userId, categoria, monto);
        } else if (diferenciaMonto !== 0) {
          // Si no cambió la categoría, solo actualizar la diferencia
          await this.actualizarPresupuesto(transaccionAntigua.userId, categoria, diferenciaMonto);
        }
      }

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
  static _actualizarTransaccionWeb(transaccionId, tipo, monto, descripcion, categoria, icono = null) {
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

      const transaccionAntigua = transacciones[index];

      transacciones[index] = {
        ...transacciones[index],
        tipo,
        monto: parseFloat(monto),
        descripcion,
        categoria,
        icono
      };

      localStorage.setItem('transacciones', JSON.stringify(transacciones));

      // Actualizar presupuesto si es egreso y cambió el monto o categoría
      if (tipo === 'egreso') {
        const diferenciaMonto = parseFloat(monto) - transaccionAntigua.monto;

        // Si cambió la categoría, restar del presupuesto antiguo y sumar al nuevo
        if (transaccionAntigua.categoria !== categoria) {
          this._actualizarPresupuestoWeb(transaccionAntigua.userId, transaccionAntigua.categoria, -transaccionAntigua.monto);
          this._actualizarPresupuestoWeb(transaccionAntigua.userId, categoria, parseFloat(monto));
        } else if (diferenciaMonto !== 0) {
          // Si no cambió la categoría, solo actualizar la diferencia
          this._actualizarPresupuestoWeb(transaccionAntigua.userId, categoria, diferenciaMonto);
        }
      }

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

      // Crear notificación de eliminación
      const monto = transaccion.monto || 0;
      const titulo = '🗑️ Transacción eliminada';
      const contenido = `Se eliminó la transacción de ${transaccion.categoria} por $${monto}`;

      await Notification.crearNotificacion(
        userId,
        titulo,
        contenido,
        'info',
        new Date().toISOString()
      );

      // Si era un egreso, restar del presupuesto
      if (transaccion.tipo === 'egreso') {
        await this.actualizarPresupuesto(userId, transaccion.categoria, -transaccion.monto);
      }

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

      // Crear notificación de eliminación
      const monto = transaccion.monto || 0;
      const titulo = '🗑️ Transacción eliminada';
      const contenido = `Se eliminó la transacción de ${transaccion.categoria} por $${monto}`;

      this._crearNotificacionWeb(userId, titulo, contenido, 'info');

      // Si era un egreso, restar del presupuesto
      if (transaccion.tipo === 'egreso') {
        this._actualizarPresupuestoWeb(userId, transaccion.categoria, -transaccion.monto);
      }

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
        const montoAnterior = presupuesto.montoActual;
        console.log(`💰 Actualizando presupuesto ${presupuesto.categoria}: ${montoAnterior} + ${monto} = ${nuevoMonto}`);
        await Budget.actualizarMontoActual(presupuesto.id, nuevoMonto);

        // Verificar si se excedió el presupuesto (cruzó el límite)
        const estabaExcedido = montoAnterior > presupuesto.montoLimite;
        const ahoraExcedido = nuevoMonto > presupuesto.montoLimite;

        // Crear alerta si acaba de excederse (cruzó el límite de arriba hacia abajo no se notifica)
        if (!estabaExcedido && ahoraExcedido) {
          console.log(`⚠️ ALERTA: Presupuesto de ${presupuesto.categoria} excedido!`);
          const porcentajeExceso = ((nuevoMonto - presupuesto.montoLimite) / presupuesto.montoLimite * 100).toFixed(1);
          await Notification.crearNotificacion(
            userId,
            '⚠️ Presupuesto excedido',
            `Has excedido el presupuesto de ${presupuesto.categoria} en $${(nuevoMonto - presupuesto.montoLimite).toFixed(2)} (${porcentajeExceso}% adicional)`,
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
        const montoAnterior = presupuesto.montoActual;
        presupuesto.montoActual += monto;
        const nuevoMonto = presupuesto.montoActual;

        // Verificar si se excedió (cruzó el límite)
        const estabaExcedido = montoAnterior > presupuesto.montoLimite;
        const ahoraExcedido = nuevoMonto > presupuesto.montoLimite;

        // Crear alerta solo si acaba de excederse (cruzó el límite)
        if (!estabaExcedido && ahoraExcedido) {
          console.log(`⚠️ ALERTA: Presupuesto de ${presupuesto.categoria} excedido!`);
          const porcentajeExceso = ((nuevoMonto - presupuesto.montoLimite) / presupuesto.montoLimite * 100).toFixed(1);
          const notificaciones = this._obtenerNotificacionesWeb();
          notificaciones.push({
            id: notificaciones.length > 0 ? Math.max(...notificaciones.map(n => n.id)) + 1 : 1,
            userId,
            titulo: '⚠️ Presupuesto excedido',
            descripcion: `Has excedido el presupuesto de ${presupuesto.categoria} en $${(nuevoMonto - presupuesto.montoLimite).toFixed(2)} (${porcentajeExceso}% adicional)`,
            tipo: 'alerta',
            fecha: new Date().toISOString(),
            leida: 0
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

  /**
   * Recalcular presupuestos basado en transacciones existentes
   * Útil para sincronizar datos cuando se cargan presupuestos por primera vez
   */
  static async recalcularPresupuestos(userId, mes, año) {
    try {
      if (Platform.OS === 'web') {
        return this._recalcularPresupuestosWeb(userId, mes, año);
      }

      // Obtener todas las transacciones del usuario
      const transacciones = await Transaction.obtenerTransaccionesUsuario(userId);

      // Obtener presupuestos del mes
      const presupuestos = await Budget.obtenerPresupuestosUsuario(userId, mes, año);

      // Para cada presupuesto, recalcular el monto actual
      for (const presupuesto of presupuestos) {
        // Sumar todos los egresos de esa categoría en ese mes (case-insensitive)
        const transaccionesCategoria = transacciones.filter(t => {
          const fechaTransaccion = new Date(t.fecha);
          const mesTransaccion = fechaTransaccion.getMonth() + 1;
          const añoTransaccion = fechaTransaccion.getFullYear();
          return t.tipo === 'egreso' &&
            t.categoria.toLowerCase() === presupuesto.categoria.toLowerCase() &&
            mesTransaccion === mes && añoTransaccion === año;
        });

        const totalMes = transaccionesCategoria.reduce((sum, t) => sum + t.monto, 0);

        // Actualizar el presupuesto si cambió
        if (totalMes !== presupuesto.montoActual) {
          console.log(`🔄 Actualizando presupuesto ${presupuesto.categoria}: ${presupuesto.montoActual} → ${totalMes}`);
          await Budget.actualizarMontoActual(presupuesto.id, totalMes);
        }
      }

      return { success: true };
    } catch (error) {
      console.error('Error al recalcular presupuestos:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Recalcular presupuestos en web
   */
  static _recalcularPresupuestosWeb(userId, mes, año) {
    try {
      const transaccionesJSON = localStorage.getItem('transacciones');
      const transacciones = transaccionesJSON ? JSON.parse(transaccionesJSON) : [];

      const presupuestosJSON = localStorage.getItem('presupuestos');
      const presupuestos = presupuestosJSON ? JSON.parse(presupuestosJSON) : [];

      // Filtrar presupuestos del usuario y mes
      const presupuestosUsuario = presupuestos.filter(p => p.userId === userId && p.mes === mes && p.año === año);

      for (const presupuesto of presupuestosUsuario) {
        // Sumar todos los egresos de esa categoría en ese mes (case-insensitive)
        const transaccionesCategoria = transacciones.filter(t => {
          const fechaTransaccion = new Date(t.fecha);
          const mesTransaccion = fechaTransaccion.getMonth() + 1;
          const añoTransaccion = fechaTransaccion.getFullYear();
          return t.userId === userId && t.tipo === 'egreso' &&
            t.categoria.toLowerCase() === presupuesto.categoria.toLowerCase() &&
            mesTransaccion === mes && añoTransaccion === año;
        });

        const totalMes = transaccionesCategoria.reduce((sum, t) => sum + t.monto, 0);

        // Actualizar el presupuesto
        const indexPresupuesto = presupuestos.findIndex(p => p.id === presupuesto.id);
        if (indexPresupuesto !== -1 && totalMes !== presupuesto.montoActual) {
          console.log(`🔄 Actualizando presupuesto ${presupuesto.categoria}: ${presupuesto.montoActual} → ${totalMes}`);
          presupuestos[indexPresupuesto].montoActual = totalMes;
        }
      }

      localStorage.setItem('presupuestos', JSON.stringify(presupuestos));
      return { success: true };
    } catch (error) {
      console.error('Error al recalcular presupuestos en web:', error);
      return { success: false, error: error.message };
    }
  }
}
