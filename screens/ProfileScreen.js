import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  StatusBar,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

const COLORS = {
  black: "#000000",
  gray: "#D9D9D9",
  white: "#FFFFFF",
  blueLight: "#1089ff",
  red: "#992020",
  blueStrong: "#1089ff",
};

export default function ProfileScreen({ route }) {
  const navigation = useNavigation();
  const [nombre, setNombre] = useState("Alex Martínez");
  const [correo, setCorreo] = useState("124056435@upq.edu.mx");
  const [telefono, setTelefono] = useState("+52 442 2317790");

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
        onPress: () => { },
        style: "cancel",
      },
      {
        text: "Cerrar sesión",
        onPress: () => {
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
    <View style={styles.safe}>
      <View style={styles.container}>
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatar} />
        </View>

        {/* Información del perfil */}
        <Text style={styles.name}>{nombre}</Text>
        <Text style={styles.email}>{correo}</Text>
        <Text style={styles.phone}>{telefono}</Text>

        {/* Botones de acción */}
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => {
            navigation.navigate("ProfileEdit", {
              userData: { nombre, correo, telefono },
            });
          }}
        >
          <Text style={styles.editButtonText}>Editar perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>🚪 Cerrar sesión</Text>
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
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingBottom: 60,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.black,
  },
  name: {
    fontSize: 24,
    color: COLORS.black,
    fontWeight: "700",
    marginBottom: 10,
  },
  email: {
    fontSize: 16,
    color: COLORS.black,
    marginBottom: 6,
  },
  phone: {
    fontSize: 16,
    color: COLORS.black,
    marginBottom: 28,
  },
  editButton: {
    backgroundColor: COLORS.blueLight,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 14,
    marginBottom: 20,
    width: "100%",
    alignItems: "center",
  },
  editButtonText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: "#DC2626",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    shadowColor: "#DC2626",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
    textAlign: "center",
  },
});
