import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../hooks/useAuth";
import { UserController } from "../controllers/UserController";

export default function ProfileScreen({ route }) {
  const navigation = useNavigation();
  const { logout, usuario } = useAuth();
  const [nombre, setNombre] = useState(usuario?.nombre || "Usuario");
  const [correo, setCorreo] = useState(usuario?.correo || "usuario@example.com");
  const [telefono, setTelefono] = useState(usuario?.telefono || "No especificado");
  const [loading, setLoading] = useState(false);

  // Cargar datos del usuario desde la BD
  useFocusEffect(
    React.useCallback(() => {
      const cargarPerfil = async () => {
        if (!usuario?.id) return;

        setLoading(true);
        const resultado = await UserController.obtenerPerfil(usuario.id);
        setLoading(false);

        if (resultado.success) {
          setNombre(resultado.usuario.nombre);
          setCorreo(resultado.usuario.correo);
          setTelefono(resultado.usuario.telefono || "No especificado");
        } else {
          Alert.alert("Error", "No se pudo cargar el perfil");
        }
      };

      cargarPerfil();
    }, [usuario?.id])
  );

  // Actualizar datos cuando se regresa de ProfileEdit
  useFocusEffect(
    React.useCallback(() => {
      if (route?.params?.updatedData) {
        const { nombre: n, correo: c, telefono: t } = route.params.updatedData;
        setNombre(n);
        setCorreo(c);
        setTelefono(t);
        navigation.setParams({ updatedData: null });
      }
    }, [route?.params?.updatedData, navigation])
  );

  const handleLogout = () => {
    Alert.alert("Cerrar sesión", "¿Estás seguro de que deseas cerrar sesión?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Cerrar sesión",
        onPress: () => {
          logout();
          navigation.reset({
            index: 0,
            routes: [{ name: "Auth" }],
          });
        },
        style: "destructive",
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1089ff" />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarBg}>
              <Ionicons name="person-circle" size={120} color="#1089ff" />
            </View>
          </View>

          {/* Profile Info Card */}
          <View style={styles.infoCard}>
            <Text style={styles.name}>{nombre}</Text>
            <Text style={styles.email}>{correo}</Text>

            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Ionicons name="call" size={18} color="#1089ff" />
                <Text style={styles.infoText}>{telefono}</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonsSection}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => {
                navigation.navigate("ProfileEdit", {
                  userData: { nombre, correo, telefono },
                });
              }}
            >
              <Ionicons name="pencil" size={20} color="#FFFFFF" />
              <Text style={styles.editButtonText}>Editar Perfil</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Ionicons name="log-out" size={20} color="#FFFFFF" />
              <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
            </TouchableOpacity>
          </View>

          {/* Stats Section */}
          <View style={styles.statsSection}>
            <Text style={styles.statsSectionTitle}>Actividad</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: "#DBEAFE" }]}>
                  <Ionicons name="swap-horizontal" size={24} color="#1089ff" />
                </View>
                <Text style={styles.statValue}>24</Text>
                <Text style={styles.statLabel}>Transacciones</Text>
              </View>

              <View style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: "#D1FAE5" }]}>
                  <Ionicons name="wallet" size={24} color="#059669" />
                </View>
                <Text style={styles.statValue}>$3.5K</Text>
                <Text style={styles.statLabel}>Balance</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  avatarSection: {
    alignItems: "center",
    marginVertical: 24,
  },
  avatarBg: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 24,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  name: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 6,
    textAlign: "center",
  },
  email: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 16,
    textAlign: "center",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 16,
    marginTop: 12,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoText: {
    fontSize: 13,
    color: "#6B7280",
  },
  buttonsSection: {
    gap: 12,
    marginBottom: 32,
  },
  editButton: {
    backgroundColor: "#1089ff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: "#1089ff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
    gap: 8,
  },
  editButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: "#DC2626",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: "#DC2626",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
    gap: 8,
  },
  logoutButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
  statsSection: {
    marginBottom: 24,
  },
  statsSectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#6B7280",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: "#9CA3AF",
    textAlign: "center",
  },
});