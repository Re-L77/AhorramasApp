/**
 * EventBus - Sistema de eventos global para la app
 * Permite que cualquier pantalla emita eventos que otras pantallas pueden escuchar
 */

class EventBusService {
    constructor() {
        this.listeners = {};
    }

    /**
     * Suscribirse a un evento
     * @param {string} eventName - Nombre del evento
     * @param {function} callback - Función a ejecutar cuando se emita el evento
     * @returns {function} Función para desuscribirse
     */
    on(eventName, callback) {
        if (!this.listeners[eventName]) {
            this.listeners[eventName] = [];
        }
        this.listeners[eventName].push(callback);

        // Retornar función para desuscribirse
        return () => {
            this.listeners[eventName] = this.listeners[eventName].filter(
                (listener) => listener !== callback
            );
        };
    }

    /**
     * Emitir un evento
     * @param {string} eventName - Nombre del evento
     * @param {*} data - Datos a pasar al evento
     */
    emit(eventName, data) {
        if (this.listeners[eventName]) {
            this.listeners[eventName].forEach((callback) => {
                callback(data);
            });
        }
    }

    /**
     * Suscribirse a un evento solo una vez
     * @param {string} eventName - Nombre del evento
     * @param {function} callback - Función a ejecutar
     */
    once(eventName, callback) {
        const unsubscribe = this.on(eventName, (data) => {
            callback(data);
            unsubscribe();
        });
        return unsubscribe;
    }
}

// Instancia global
export const eventBus = new EventBusService();
