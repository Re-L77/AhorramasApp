import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      type: "presupuesto",
      title: "⚠️ Presupuesto excedido",
      message: "Has excedido el presupuesto de Comida",
      timestamp: "Hace 2 horas",
      read: false,
      color: "#DC2626",
    },
    {
      id: "2",
      type: "ingreso",
      title: "✅ Ingreso registrado",
      message: "Se registró un ingreso de $1,200 (Sueldo)",
      timestamp: "Hace 5 horas",
      read: false,
      color: "#059669",
    },
    {
      id: "3",
      type: "gasto",
      title: "📊 Gasto registrado",
      message: "Se registró un gasto de $50 (Transporte)",
      timestamp: "Hace 1 día",
      read: true,
      color: "#1089ff",
    },
    {
      id: "4",
      type: "recordatorio",
      title: "🔔 Recordatorio",
      message: "Recuerda revisar tus presupuestos mensuales",
      timestamp: "Hace 2 días",
      read: true,
      color: "#F97316",
    },
    {
      id: "5",
      type: "ahorro",
      title: "🎉 Meta de ahorro alcanzada",
      message: "¡Felicidades! Alcanzaste tu meta de ahorro",
      timestamp: "Hace 3 días",
      read: true,
      color: "#10B981",
    },
  ]);

  const handleMarkAsRead = (id) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const handleDelete = (id) => {
    setNotifications(notifications.filter((notif) => notif.id !== id));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((notif) => ({ ...notif, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <SafeAreaView style={styles.container}>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  listContainer: { paddingHorizontal: 15, paddingBottom: 100 },

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
