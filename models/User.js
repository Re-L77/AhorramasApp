// models/User.js
/**
 * Modelo de Usuario
 * Define la estructura y operaciones de la entidad Usuario
 * Autor: Daniel
 */

import { Platform } from 'react-native';
import * as SQLite from 'expo-sqlite';

let db = null;

// Lazy load de la BD
const getDB = () => {
  if (Platform.OS !== 'web' && !db) {
    db = SQLite.openDatabaseSync('ahorramasapp.db');
  }
  return db;
};

// Datos iniciales de prueba
const INITIAL_USERS = [
  {
    id: 1,
    nombre: 'Juan',
    correo: 'juan@example.com',
    telefono: '1234567890',
    contraseña: 'password123',
    fechaCreacion: '2025-01-15'
  },
  {
    id: 2,
    nombre: 'Maria',
    correo: 'maria@example.com',
    telefono: '0987654321',
    contraseña: 'password456',
    fechaCreacion: '2025-01-16'
  },
  {
    id: 3,
    nombre: 'Carlos',
    correo: 'carlos@example.com',
    telefono: '1122334455',
    contraseña: 'password789',
    fechaCreacion: '2025-01-17'
  }
];

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
      if (Platform.OS === 'web') {
        // En web, usar localStorage con datos iniciales
        if (!localStorage.getItem('usuarios')) {
          localStorage.setItem('usuarios', JSON.stringify(INITIAL_USERS));
        }
        console.log('Tabla usuarios creada o ya existe en localStorage');
        return;
      }

      const database = getDB();
      await database.execAsync(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nombre TEXT NOT NULL,
          correo TEXT UNIQUE NOT NULL,
          telefono TEXT,
          contraseña TEXT NOT NULL,
          fechaCreacion TEXT NOT NULL
        );
      `);

      // Verificar si la tabla está vacía y cargar datos iniciales
      const usuarios = await database.getAllAsync('SELECT COUNT(*) as count FROM users');
      if (usuarios[0].count === 0) {
        // Cargar datos iniciales en SQLite
        for (const usuario of INITIAL_USERS) {
          await database.runAsync(
            `INSERT INTO users (id, nombre, correo, telefono, contraseña, fechaCreacion)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [usuario.id, usuario.nombre, usuario.correo, usuario.telefono, usuario.contraseña, usuario.fechaCreacion]
          );
        }
        console.log('✅ Datos iniciales cargados en SQLite');
      }

      console.log('Tabla users creada o ya existe');
    } catch (error) {
      console.error('Error al crear tabla users:', error);
    }
  }

  static async crearUsuario(nombre, correo, telefono, contraseña) {
    try {
      if (Platform.OS === 'web') {
        return this._crearUsuarioWeb(nombre, correo, telefono, contraseña);
      }

      const database = getDB();
      const resultado = await database.runAsync(
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

  static _crearUsuarioWeb(nombre, correo, telefono, contraseña) {
    try {
      const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
      const id = usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id)) + 1 : 1;
      const nuevoUsuario = {
        id,
        nombre,
        correo,
        telefono,
        contraseña,
        fechaCreacion: new Date().toISOString()
      };
      usuarios.push(nuevoUsuario);
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
      return id;
    } catch (error) {
      console.error('Error al crear usuario en web:', error);
      throw error;
    }
  }

  static async obtenerUsuarioPorId(id) {
    try {
      if (Platform.OS === 'web') {
        return this._obtenerUsuarioPorIdWeb(id);
      }

      const database = getDB();
      const resultado = await database.getFirstAsync(
        `SELECT * FROM users WHERE id = ?`,
        [id]
      );
      return resultado;
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      return null;
    }
  }

  static _obtenerUsuarioPorIdWeb(id) {
    try {
      const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
      return usuarios.find(u => u.id === id) || null;
    } catch (error) {
      console.error('Error al obtener usuario por id en web:', error);
      return null;
    }
  }

  static async obtenerUsuarioPorCorreo(correo) {
    try {
      if (Platform.OS === 'web') {
        return this._obtenerUsuarioPorCorreoWeb(correo);
      }

      const database = getDB();
      const resultado = await database.getFirstAsync(
        `SELECT * FROM users WHERE correo = ?`,
        [correo]
      );
      return resultado;
    } catch (error) {
      console.error('Error al obtener usuario por correo:', error);
      return null;
    }
  }

  static _obtenerUsuarioPorCorreoWeb(correo) {
    try {
      const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
      return usuarios.find(u => u.correo === correo) || null;
    } catch (error) {
      console.error('Error al obtener usuario por correo en web:', error);
      return null;
    }
  }

  static async actualizarUsuario(id, nombre, correo, telefono) {
    try {
      if (Platform.OS === 'web') {
        return this._actualizarUsuarioWeb(id, nombre, correo, telefono);
      }

      const database = getDB();
      await database.runAsync(
        `UPDATE users SET nombre = ?, correo = ?, telefono = ? WHERE id = ?`,
        [nombre, correo, telefono, id]
      );
      return true;
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      throw error;
    }
  }

  static _actualizarUsuarioWeb(id, nombre, correo, telefono) {
    try {
      const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
      const index = usuarios.findIndex(u => u.id === id);
      if (index !== -1) {
        usuarios[index].nombre = nombre;
        usuarios[index].correo = correo;
        usuarios[index].telefono = telefono;
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
      }
      return true;
    } catch (error) {
      console.error('Error al actualizar usuario en web:', error);
      throw error;
    }
  }

  static async cambiarContraseña(id, nuevaContraseña) {
    try {
      if (Platform.OS === 'web') {
        return this._cambiarContraseñaWeb(id, nuevaContraseña);
      }

      const database = getDB();
      await database.runAsync(
        `UPDATE users SET contraseña = ? WHERE id = ?`,
        [nuevaContraseña, id]
      );
      return true;
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      throw error;
    }
  }

  static _cambiarContraseñaWeb(id, nuevaContraseña) {
    try {
      const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
      const usuario = usuarios.find(u => u.id === id);
      if (usuario) {
        usuario.contraseña = nuevaContraseña;
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
      }
      return true;
    } catch (error) {
      console.error('Error al cambiar contraseña en web:', error);
      throw error;
    }
  }

  static async cambiarContraseñaPorCorreo(correo, nuevaContraseña) {
    try {
      if (Platform.OS === 'web') {
        return this._cambiarContraseñaPorCorreoWeb(correo, nuevaContraseña);
      }

      const database = getDB();
      await database.runAsync(
        `UPDATE users SET contraseña = ? WHERE correo = ?`,
        [nuevaContraseña, correo]
      );
      return true;
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      throw error;
    }
  }

  static _cambiarContraseñaPorCorreoWeb(correo, nuevaContraseña) {
    try {
      const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
      const usuario = usuarios.find(u => u.correo === correo);
      if (usuario) {
        usuario.contraseña = nuevaContraseña;
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
      }
      return true;
    } catch (error) {
      console.error('Error al cambiar contraseña en web:', error);
      throw error;
    }
  }

  static async eliminarUsuario(id) {
    try {
      if (Platform.OS === 'web') {
        return this._eliminarUsuarioWeb(id);
      }

      const database = getDB();
      await database.runAsync(
        `DELETE FROM users WHERE id = ?`,
        [id]
      );
      return true;
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      throw error;
    }
  }

  static _eliminarUsuarioWeb(id) {
    try {
      const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
      const filtered = usuarios.filter(u => u.id !== id);
      localStorage.setItem('usuarios', JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Error al eliminar usuario en web:', error);
      throw error;
    }
  }

  static async obtenerTodos() {
    try {
      if (Platform.OS === 'web') {
        return this._obtenerTodosWeb();
      }

      const database = getDB();
      const resultado = await database.getAllAsync(`SELECT * FROM users`);
      return resultado;
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      return [];
    }
  }

  static _obtenerTodosWeb() {
    try {
      return JSON.parse(localStorage.getItem('usuarios') || '[]');
    } catch (error) {
      console.error('Error al obtener usuarios en web:', error);
      return [];
    }
  }
}
