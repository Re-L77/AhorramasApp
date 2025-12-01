// controllers/UserController.js
/**
 * Controlador de Usuario
 * Maneja la lógica de negocio relacionada con usuarios
 * Autor: Daniel
 */

import { User } from '../models/User';

export class UserController {
  /**
   * Registrar un nuevo usuario
   */
  static async registrarUsuario(nombre, correo, telefono, contraseña) {
    try {
      // Validar que el usuario no exista
      const usuarioExistente = await User.obtenerUsuarioPorCorreo(correo);
      if (usuarioExistente) {
        throw new Error('El correo electrónico ya está registrado');
      }

      // Validar contraseña
      if (contraseña.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }

      // Crear usuario
      const userId = await User.crearUsuario(nombre, correo, telefono, contraseña);
      return {
        success: true,
        userId,
        message: 'Usuario registrado correctamente'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Autenticar usuario
   */
  static async autenticarUsuario(correo, contraseña) {
    try {
      const usuario = await User.obtenerUsuarioPorCorreo(correo);

      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }

      // Aquí normalmente verificarías con hash, pero por simplificar:
      if (usuario.contraseña !== contraseña) {
        throw new Error('Contraseña incorrecta');
      }

      return {
        success: true,
        usuario: {
          id: usuario.id,
          nombre: usuario.nombre,
          correo: usuario.correo,
          telefono: usuario.telefono
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
   * Obtener perfil del usuario
   */
  static async obtenerPerfil(userId) {
    try {
      const usuario = await User.obtenerUsuarioPorId(userId);

      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }

      return {
        success: true,
        usuario: {
          id: usuario.id,
          nombre: usuario.nombre,
          correo: usuario.correo,
          telefono: usuario.telefono,
          fechaCreacion: usuario.fechaCreacion
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
   * Actualizar información del usuario
   */
  static async actualizarPerfil(userId, nombre, correo, telefono) {
    try {
      // Validar correo único (excepto el actual)
      const usuarioActual = await User.obtenerUsuarioPorId(userId);
      if (usuarioActual.correo !== correo) {
        const usuarioConCorreo = await User.obtenerUsuarioPorCorreo(correo);
        if (usuarioConCorreo) {
          throw new Error('El correo electrónico ya está en uso');
        }
      }

      await User.actualizarUsuario(userId, nombre, correo, telefono);

      return {
        success: true,
        message: 'Perfil actualizado correctamente'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Cambiar contraseña del usuario
   */
  static async cambiarContraseña(userId, contraseñaActual, nuevaContraseña, confirmContraseña) {
    try {
      const usuario = await User.obtenerUsuarioPorId(userId);

      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }

      if (usuario.contraseña !== contraseñaActual) {
        throw new Error('La contraseña actual es incorrecta');
      }

      if (nuevaContraseña.length < 6) {
        throw new Error('La nueva contraseña debe tener al menos 6 caracteres');
      }

      if (nuevaContraseña !== confirmContraseña) {
        throw new Error('Las contraseñas no coinciden');
      }

      await User.cambiarContraseña(userId, nuevaContraseña);

      return {
        success: true,
        message: 'Contraseña actualizada correctamente'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Cambiar contraseña por correo (recuperación de contraseña)
   */
  static async cambiarContraseñaPorCorreo(correo, nuevaContraseña) {
    try {
      const usuario = await User.obtenerUsuarioPorCorreo(correo);

      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }

      if (nuevaContraseña.length < 6) {
        throw new Error('La nueva contraseña debe tener al menos 6 caracteres');
      }

      await User.cambiarContraseñaPorCorreo(correo, nuevaContraseña);

      return {
        success: true,
        message: 'Contraseña actualizada correctamente'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Obtener todos los usuarios
   */
  static async obtenerUsuarios() {
    try {
      const usuarios = await User.obtenerTodos();

      return {
        success: true,
        usuarios: usuarios
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Eliminar cuenta de usuario
   */
  static async eliminarCuenta(userId) {
    try {
      await User.eliminarUsuario(userId);

      return {
        success: true,
        message: 'Cuenta eliminada correctamente'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}
