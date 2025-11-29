// models/User.js
/**
 * Modelo de Usuario
 * Define la estructura y operaciones de la entidad Usuario
 * Autor: Daniel
 */

import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('ahorramasapp.db');

export class User {
  constructor(id, nombre, correo, telefono, contraseña, fechaCreacion) {
    this.id = id;
    this.nombre = nombre;
    this.correo = correo;
    this.telefono = telefono;
    this.contraseña = contraseña;
    this.fechaCreacion = fechaCreacion;
  }

  // Getter methods
  getId() {
    return this.id;
  }

  getNombre() {
    return this.nombre;
  }

  getCorreo() {
    return this.correo;
  }

  getTelefono() {
    return this.telefono;
  }

  getContraseña() {
    return this.contraseña;
  }

  getFechaCreacion() {
    return this.fechaCreacion;
  }

  // Setter methods
  setNombre(nombre) {
    this.nombre = nombre;
  }

  setCorreo(correo) {
    this.correo = correo;
  }

  setTelefono(telefono) {
    this.telefono = telefono;
  }

  setContraseña(contraseña) {
    this.contraseña = contraseña;
  }

  // Métodos estáticos para operaciones de base de datos
  static async initializeTable() {
    try {
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nombre TEXT NOT NULL,
          correo TEXT UNIQUE NOT NULL,
          telefono TEXT,
          contraseña TEXT NOT NULL,
          fechaCreacion TEXT NOT NULL
        );
      `);
      console.log('Tabla users creada o ya existe');
    } catch (error) {
      console.error('Error al crear tabla users:', error);
    }
  }

  static async crearUsuario(nombre, correo, telefono, contraseña) {
    try {
      const resultado = await db.runAsync(
        `INSERT INTO users (nombre, correo, telefono, contraseña, fechaCreacion)
         VALUES (?, ?, ?, ?, ?)`,
        [nombre, correo, telefono, contraseña, new Date().toISOString()]
      );
      return resultado.lastInsertRowId;
    } catch (error) {
      console.error('Error al crear usuario:', error);
      throw error;
    }
  }

  static async obtenerUsuarioPorId(id) {
    try {
      const resultado = await db.getFirstAsync(
        `SELECT * FROM users WHERE id = ?`,
        [id]
      );
      return resultado;
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      return null;
    }
  }

  static async obtenerUsuarioPorCorreo(correo) {
    try {
      const resultado = await db.getFirstAsync(
        `SELECT * FROM users WHERE correo = ?`,
        [correo]
      );
      return resultado;
    } catch (error) {
      console.error('Error al obtener usuario por correo:', error);
      return null;
    }
  }

  static async actualizarUsuario(id, nombre, correo, telefono) {
    try {
      await db.runAsync(
        `UPDATE users SET nombre = ?, correo = ?, telefono = ? WHERE id = ?`,
        [nombre, correo, telefono, id]
      );
      return true;
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      throw error;
    }
  }

  static async cambiarContraseña(id, nuevaContraseña) {
    try {
      await db.runAsync(
        `UPDATE users SET contraseña = ? WHERE id = ?`,
        [nuevaContraseña, id]
      );
      return true;
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      throw error;
    }
  }

  static async eliminarUsuario(id) {
    try {
      await db.runAsync(
        `DELETE FROM users WHERE id = ?`,
        [id]
      );
      return true;
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      throw error;
    }
  }

  static async obtenerTodos() {
    try {
      const resultado = await db.getAllAsync(`SELECT * FROM users`);
      return resultado;
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      return [];
    }
  }
}
