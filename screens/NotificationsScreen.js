import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useAuth } from "../hooks/useAuth";
import { Notification } from "../models/Notification";

export default function NotificationsScreen() {
  const { usuario } = useAuth();
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (usuario?.id) {
      cargarNotificaciones();
    }
  }, [usuario?.id]);

  useFocusEffect(
    React.useCallback(() => {
      // Recargar notificaciones cada vez que la pantalla obtiene el foco
      if (usuario?.id) {
        cargarNotificacionesSilencioso();
      }
    }, [usuario?.id])
  );

  const cargarNotificacionesSilencioso = async () => {
    try {
      if (!usuario?.id) {
        return;
      }

      const notificacionesData = await Notification.obtenerNotificacionesUsuario(usuario.id);

      if (notificacionesData && Array.isArray(notificacionesData)) {
        // Mapear notificaciones de BD a formato visual
        const notificacionesFormateadas = notificacionesData.map((notif) => ({
          id: notif.id?.toString() || Date.now().toString(),
          type: notif.tipo || "recordatorio",
          title: notif.titulo || "Notificación",
          message: notif.descripcion || notif.contenido || "",
          timestamp: new Date(notif.fecha).toLocaleDateString('es-ES'),
          fecha: new Date(notif.fecha), // Para ordenamiento
          read: notif.leida === 1,
          color: getColorByType(notif.tipo),
          icon: getIconByType(notif.tipo),
        }));

        // Ordenar de más reciente a más antigua
        notificacionesFormateadas.sort((a, b) => b.fecha - a.fecha);

        setNotifications(notificacionesFormateadas);
      }
    } catch (error) {
      console.error("Error al cargar notificaciones:", error);
    }
  };

  const cargarNotificaciones = async () => {
    try {
      setCargando(true);
      if (!usuario?.id) {
        console.log('Usuario no disponible');
        setCargando(false);
        return;
      }

      console.log('Cargando notificaciones para userId:', usuario.id);
      const notificacionesData = await Notification.obtenerNotificacionesUsuario(usuario.id);
      console.log('Notificaciones obtenidas:', notificacionesData);

      if (notificacionesData && Array.isArray(notificacionesData)) {
        // Mapear notificaciones de BD a formato visual
        const notificacionesFormateadas = notificacionesData.map((notif) => ({
          id: notif.id?.toString() || Date.now().toString(),
          type: notif.tipo || "recordatorio",
          title: notif.titulo || "Notificación",
          message: notif.descripcion || notif.contenido || "",
          timestamp: new Date(notif.fecha).toLocaleDateString('es-ES'),
          fecha: new Date(notif.fecha), // Para ordenamiento
          read: notif.leida === 1,
          color: getColorByType(notif.tipo),
          icon: getIconByType(notif.tipo),
        }));

        // Ordenar de más reciente a más antigua
        notificacionesFormateadas.sort((a, b) => b.fecha - a.fecha);

        setNotifications(notificacionesFormateadas);
      } else {
        setNotifications([]);
      }
      setCargando(false);
    } catch (error) {
      console.error("Error al cargar notificaciones:", error);
      setNotifications([]);
      setCargando(false);
    }
  };

  const getColorByType = (tipo) => {
    const colores = {
      alerta: "#DC2626",
      recordatorio: "#F97316",
      logro: "#10B981",
      info: "#1089ff",
      presupuesto: "#DC2626",
      ingreso: "#059669",
      gasto: "#1089ff",
      ahorro: "#10B981",
    };
    return colores[tipo] || "#1089ff";
  };

  const getIconByType = (tipo) => {
    const iconos = {
      alerta: "⚠️",
      recordatorio: "🎯",
      logro: "🏆",
      info: "📊",
      ingreso: "✅",
      gasto: "📊",
      presupuesto: "⚠️",
      ahorro: "🎉",
    };
    return iconos[tipo] || "📬";
  };

  const handleMarkAsRead = async (id) => {
    try {
      // Actualizar UI inmediatamente
      const nuevasNotificaciones = notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      );
      setNotifications(nuevasNotificaciones);

      // Actualizar conteo de no leídas
      const noLeidas = nuevasNotificaciones.filter((n) => !n.read).length;
      navigation.setParams({ notificationsUpdated: Date.now(), unreadCount: noLeidas });

      // Luego actualizar en BD
      await Notification.marcarComoLeida(parseInt(id));
    } catch (error) {
      console.error("Error al marcar como leída:", error);
      // Recargar si hay error
      cargarNotificaciones();
    }
  };

  const handleDelete = async (id) => {
    try {
      // Actualizar UI inmediatamente
      const nuevasNotificaciones = notifications.filter((notif) => notif.id !== id);
      setNotifications(nuevasNotificaciones);

      // Actualizar conteo de no leídas
      const noLeidas = nuevasNotificaciones.filter((n) => !n.read).length;
      navigation.setParams({ notificationsUpdated: Date.now(), unreadCount: noLeidas });

      // Luego eliminar de BD
      await Notification.eliminarNotificacion(parseInt(id));
    } catch (error) {
      console.error("Error al eliminar notificación:", error);
      // Recargar si hay error
      cargarNotificaciones();
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      // Actualizar UI inmediatamente
      const nuevasNotificaciones = notifications.map((notif) => ({ ...notif, read: true }));
      setNotifications(nuevasNotificaciones);

      // Usar setParams para forzar re-render del padre
      navigation.setParams({ notificationsUpdated: Date.now(), unreadCount: 0 });

      // Luego actualizar en BD
      if (usuario?.id) {
        await Notification.marcarTodasComoLeidas(usuario.id);
      }
    } catch (error) {
      console.error("Error al marcar todas como leídas:", error);
      // Recargar si hay error
      cargarNotificaciones();
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <SafeAreaView style={styles.container}>
      {cargando ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1089ff" />
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <>
              {/* Header Card */}
              <View style={styles.headerCard}>
                <View style={styles.headerTitleRow}>
                  <Text style={styles.headerTitle}>🔔 Notificaciones</Text>
                  {unreadCount > 0 && (
                    <TouchableOpacity onPress={handleMarkAllAsRead}>
                      <Text style={styles.markAllButton}>
                        Marcar todo como leído
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>

                {/* Stats */}
                <View style={styles.statsRow}>
                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>No leídas</Text>
                    <Text style={[styles.statAmount, { color: "#DC2626" }]}>
                      {unreadCount}
                    </Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Total</Text>
                    <Text style={[styles.statAmount, { color: "#1089ff" }]}>
                      {notifications.length}
                    </Text>
                  </View>
                </View>
              </View>
            </>
          }
          renderItem={({ item }) => (
            <View
              style={[
                styles.notificationCard,
                !item.read && styles.notificationCardUnread,
              ]}
            >
              <View
                style={[styles.colorIndicator, { backgroundColor: item.color }]}
              />

              <Text style={styles.notificationIcon}>{item.icon}</Text>

              <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>{item.title}</Text>
                <Text style={styles.notificationMessage}>{item.message}</Text>
                <Text style={styles.notificationTime}>{item.timestamp}</Text>
              </View>

              <View style={styles.notificationActions}>
                {!item.read && (
                  <Pressable
                    onPress={() => handleMarkAsRead(item.id)}
                    style={styles.actionButton}
                  >
                    <Text style={styles.actionText}>✓</Text>
                  </Pressable>
                )}
                <Pressable
                  onPress={() => handleDelete(item.id)}
                  style={styles.deleteButton}
                >
                  <Text style={styles.deleteText}>✕</Text>
                </Pressable>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>📭 Sin notificaciones</Text>
              <Text style={styles.emptyText}>
                Aquí aparecerán tus notificaciones
              </Text>
            </View>
          }
          contentContainerStyle={styles.listContainer}
          scrollEnabled={true}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  listContainer: { paddingHorizontal: 15, paddingBottom: 100 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  // Header Card
  headerCard: {
    backgroundColor: "#FFFFFF",
    marginTop: 15,
    marginBottom: 15,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2937",
  },
  markAllButton: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1089ff",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
  },
  statAmount: {
    fontSize: 16,
    fontWeight: "600",
  },

  // Notification Card
  notificationCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F3F4F6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  notificationCardUnread: {
    backgroundColor: "#F0F7FF",
    borderColor: "#BFDBFE",
  },
  colorIndicator: {
    width: 4,
    height: "100%",
    borderRadius: 2,
    marginRight: 12,
  },
  notificationIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 11,
    color: "#9CA3AF",
  },
  notificationActions: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  actionButton: {
    backgroundColor: "#DBEAFE",
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  actionText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1089ff",
  },
  deleteButton: {
    backgroundColor: "#FEE2E2",
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteText: {
    fontSize: 16,
    color: "#DC2626",
  },

  // Empty State
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#9CA3AF",
  },
});
