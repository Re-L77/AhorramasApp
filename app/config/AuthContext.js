// context/AuthContext.js
/**
 * Contexto de Autenticación
 * Gestiona el estado global de la sesión del usuario
 * Permite acceder a los datos del usuario actual desde cualquier screen
 */

import React, { createContext, useState, useCallback } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [usuario, setUsuario] = useState(null);
    const [isAutenticado, setIsAutenticado] = useState(false);
    const [cargando, setCargando] = useState(false);

    /**
     * Iniciar sesión
     * @param {Object} usuarioData - Datos del usuario autenticado
     */
    const login = useCallback((usuarioData) => {
        setUsuario(usuarioData);
        setIsAutenticado(true);
    }, []);

    /**
     * Cerrar sesión
     */
    const logout = useCallback(() => {
        setUsuario(null);
        setIsAutenticado(false);
    }, []);

    /**
     * Actualizar datos del usuario en la sesión
     * @param {Object} datosActualizados - Datos parciales o completos para actualizar
     */
    const actualizarUsuario = useCallback((datosActualizados) => {
        if (usuario) {
            setUsuario(prevUsuario => ({
                ...prevUsuario,
                ...datosActualizados
            }));
        }
    }, [usuario]);

    /**
     * Obtener el ID del usuario actual
     */
    const obtenerIdUsuario = useCallback(() => {
        return usuario?.id || null;
    }, [usuario]);

    /**
     * Obtener el correo del usuario actual
     */
    const obtenerCorreoUsuario = useCallback(() => {
        return usuario?.correo || null;
    }, [usuario]);

    /**
     * Obtener el nombre del usuario actual
     */
    const obtenerNombreUsuario = useCallback(() => {
        return usuario?.nombre || null;
    }, [usuario]);

    /**
     * Verificar si el usuario está autenticado
     */
    const estaAutenticado = useCallback(() => {
        return isAutenticado && usuario !== null;
    }, [isAutenticado, usuario]);

    const value = {
        // Estado
        usuario,
        isAutenticado,
        cargando,
        setCargando,

        // Métodos de autenticación
        login,
        logout,
        actualizarUsuario,

        // Métodos auxiliares
        obtenerIdUsuario,
        obtenerCorreoUsuario,
        obtenerNombreUsuario,
        estaAutenticado,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
