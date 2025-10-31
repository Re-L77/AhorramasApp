import React from "react";
import { View, Text, StyleSheet, Platform, StatusBar, TouchableOpacity } from "react-native";

const COLORS = {
  black: "#000000",
  gray: "#D9D9D9",
  white: "#FFFFFF",
  blueLight: "#90CAF9",
  red: "#992020",
};

export default function ProfileScreen() {
  return (
    <View style={styles.safe}>
      <View style={styles.container}>
        {/* Aquí iria el Header con logo */}
        <View style={styles.header}>
          <View style={styles.logoBox} />
          <Text style={styles.appName}>Ahorra +</Text>
        </View>

        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatar} />
        </View>

        {/* Datos del usuario */}
        <Text style={styles.name}>Alex Martínez</Text>
        <Text style={styles.email}>124056435@upq.edu.mx</Text>
        <Text style={styles.phone}>+52 442 2317790</Text>

        {/* Botones */}
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Editar perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    alignSelf: "flex-start",
  },
  logoBox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: COLORS.blueLight,
    marginRight: 8,
  },
  appName: {
    fontSize: 12,
    color: COLORS.black,
    fontWeight: "600",
  },
  avatarContainer: {
    alignItems: "center",
    marginTop: 24,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.black,
  },
  name: {
    fontSize: 20,
    color: COLORS.black,
    fontWeight: "700",
    marginTop: 16,
  },
  email: {
    fontSize: 14,
    color: COLORS.black,
    marginTop: 4,
  },
  phone: {
    fontSize: 14,
    color: COLORS.black,
    marginTop: 2,
  },
  editButton: {
    backgroundColor: COLORS.blueLight,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginTop: 24,
  },
  editButtonText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 16,
  },
  logoutText: {
    color: COLORS.red,
    fontWeight: "700",
    fontSize: 15,
    marginTop: 16,
  },
});
