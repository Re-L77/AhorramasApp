import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function SettingsScreen() {
  const [notifications, setNotifications] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);

  const handleLogout = () => {
    // TODO: Implementar logout
    console.log("Logout");
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>⚙️ Configuración</Text>
      </View>

      {/* Configuración */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferencias</Text>

        {/* Notificaciones */}
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="notifications" size={24} color="#1089ff" />
            <View style={styles.settingText}>
              <Text style={styles.settingName}>Notificaciones</Text>
              <Text style={styles.settingDescription}>
                Recibe alertas de transacciones
              </Text>
            </View>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: "#E5E7EB", true: "#A7F3D0" }}
            thumbColor={notifications ? "#10B981" : "#9CA3AF"}
          />
        </View>

        {/* Tema */}
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="moon" size={24} color="#1089ff" />
            <View style={styles.settingText}>
              <Text style={styles.settingName}>Modo Oscuro</Text>
              <Text style={styles.settingDescription}>
                Tema oscuro para la aplicación
              </Text>
            </View>
          </View>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: "#E5E7EB", true: "#A7F3D0" }}
            thumbColor={darkMode ? "#10B981" : "#9CA3AF"}
          />
        </View>
      </View>

      {/* Información */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información</Text>

        <TouchableOpacity style={styles.settingButton}>
          <View style={styles.settingLeft}>
            <Ionicons name="help-circle" size={24} color="#1089ff" />
            <View style={styles.settingText}>
              <Text style={styles.settingName}>Ayuda y Soporte</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#D1D5DB" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingButton}>
          <View style={styles.settingLeft}>
            <Ionicons name="document-text" size={24} color="#1089ff" />
            <View style={styles.settingText}>
              <Text style={styles.settingName}>Términos y Condiciones</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#D1D5DB" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingButton}>
          <View style={styles.settingLeft}>
            <Ionicons name="shield" size={24} color="#1089ff" />
            <View style={styles.settingText}>
              <Text style={styles.settingName}>Privacidad</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#D1D5DB" />
        </TouchableOpacity>
      </View>

      {/* Cuenta */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cuenta</Text>

        <TouchableOpacity style={styles.settingButton}>
          <View style={styles.settingLeft}>
            <Ionicons name="person" size={24} color="#1089ff" />
            <View style={styles.settingText}>
              <Text style={styles.settingName}>Perfil</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#D1D5DB" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingButton}>
          <View style={styles.settingLeft}>
            <Ionicons name="lock-closed" size={24} color="#1089ff" />
            <View style={styles.settingText}>
              <Text style={styles.settingName}>Cambiar Contraseña</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#D1D5DB" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.settingButton, styles.logoutButton]}
          onPress={handleLogout}
        >
          <View style={styles.settingLeft}>
            <Ionicons name="log-out" size={24} color="#EF4444" />
            <View style={styles.settingText}>
              <Text style={[styles.settingName, { color: "#EF4444" }]}>
                Cerrar Sesión
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Version */}
      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>Versión 1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    backgroundColor: "#1089ff",
    paddingVertical: 20,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  section: {
    backgroundColor: "#FFFFFF",
    marginTop: 16,
    paddingHorizontal: 0,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#6B7280",
    paddingHorizontal: 16,
    paddingVertical: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  settingButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  logoutButton: {
    borderBottomWidth: 0,
  },
  settingLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  settingText: {
    flex: 1,
  },
  settingName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  versionContainer: {
    alignItems: "center",
    paddingVertical: 24,
  },
  versionText: {
    fontSize: 12,
    color: "#9CA3AF",
  },
});
