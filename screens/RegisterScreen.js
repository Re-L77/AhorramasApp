import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { UserController } from "../controllers/UserController";
import { useAuth } from "../hooks/useAuth";

export default function RegisterScreen() {
  const [nombre, setNombre] = useState("Juan Pérez");
  const [correo, setCorreo] = useState("juan.perez@example.com");
  const [contraseña, setContraseña] = useState("password123");
  const [confirmar, setConfirmar] = useState("password123");
  const [telefono, setTelefono] = useState("1234567890");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);
  const navigation = useNavigation();
  const { login } = useAuth();

  const enviarDatos = async () => {
    if (
      nombre.trim() === "" ||
      correo.trim() === "" ||
      contraseña.trim() === "" ||
      confirmar.trim() === "" ||
      telefono.trim() === ""
    ) {
      Alert.alert("Error", "Por favor completa todos los campos");
      setMensaje("Faltan campos por llenar");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      Alert.alert("Error", "Por favor ingresa un correo válido");
      setMensaje("Correo inválido");
      return;
    }

    if (contraseña.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres");
      setMensaje("Contraseña muy corta");
      return;
    }

    if (contraseña !== confirmar) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      setMensaje("Las contraseñas no coinciden");
      return;
    }

    if (telefono.replace(/\D/g, "").length < 10) {
      Alert.alert("Error", "Por favor ingresa un teléfono válido");
      setMensaje("Teléfono inválido");
      return;
    }

    setCargando(true);
    setMensaje("Registrando usuario...");

    // Llamar al controlador para registrar
    const resultado = await UserController.registrarUsuario(
      nombre,
      correo,
      telefono,
      contraseña
    );

    if (resultado.success) {
      setCargando(false);
      Alert.alert("✅ Registro Exitoso", `¡Bienvenido ${nombre}!`);
      setMensaje("Iniciando sesión...");

      // Activar la sesión con useAuth
      login(resultado.usuario);

      // Guardar el userId antes del timeout
      const usuarioId = resultado.usuario.id;

      setTimeout(() => {
        // Limpiar campos
        setNombre("");
        setCorreo("");
        setContraseña("");
        setConfirmar("");
        setTelefono("");
        setMensaje("");

        // Navegar al MainTabs directamente (ya autenticado)
        navigation.navigate("MainTabs", { userId: usuarioId });
      }, 1500);
    } else {
      setCargando(false);
      Alert.alert("Error", resultado.error);
      setMensaje("Error al registrar");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.headerText}>AHORRA+</Text>
          </View>
          <View style={styles.formCard}>
            <Text style={styles.title}>Crear Cuenta</Text>
            <TextInput style={styles.input} placeholder="Nombre de usuario" placeholderTextColor="#9CA3AF" value={nombre} onChangeText={setNombre} editable={!cargando} />
            <TextInput style={styles.input} placeholder="Correo electrónico" placeholderTextColor="#9CA3AF" keyboardType="email-address" value={correo} onChangeText={setCorreo} editable={!cargando} />
            <TextInput style={styles.input} placeholder="Contraseña" placeholderTextColor="#9CA3AF" secureTextEntry value={contraseña} onChangeText={setContraseña} editable={!cargando} />
            <TextInput style={styles.input} placeholder="Confirmar contraseña" placeholderTextColor="#9CA3AF" secureTextEntry value={confirmar} onChangeText={setConfirmar} editable={!cargando} />
            <TextInput style={styles.input} placeholder="Teléfono" placeholderTextColor="#9CA3AF" keyboardType="phone-pad" value={telefono} onChangeText={setTelefono} editable={!cargando} />
            <TouchableOpacity style={[styles.button, cargando && styles.buttonDisabled]} onPress={enviarDatos} disabled={cargando}>
              <Text style={styles.buttonText}>{cargando ? "Registrando..." : "Registrar"}</Text>
            </TouchableOpacity>
            {cargando ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#1089ff" />
              </View>
            ) : null}
            {mensaje ? <Text style={[styles.mensajeText, cargando && styles.mensajeLoading]}>{mensaje}</Text> : null}
            <TouchableOpacity onPress={() => navigation.navigate("Login")} style={styles.loginLink}>
              <Text style={styles.loginText}>
                ¿Ya tienes cuenta?{" "}
                <Text style={styles.loginTextBold}>Inicia sesión</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    backgroundColor: "#1089ff",
    width: "100%",
    paddingVertical: 16,
    paddingTop: 48,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginVertical: 20,
    borderRadius: 20,
    paddingVertical: 32,
    paddingHorizontal: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 28,
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 48,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "#F9FAFB",
    fontSize: 15,
    color: "#1F2937",
    fontWeight: "500",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#1089ff",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#1089ff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
  loadingContainer: {
    marginVertical: 20,
  },
  mensajeText: {
    marginTop: 16,
    fontSize: 13,
    fontWeight: "600",
    color: "#059669",
    textAlign: "center",
  },
  mensajeLoading: {
    color: "#1089ff",
  },
  loginLink: {
    marginTop: 20,
    alignItems: "center",
  },
  loginText: {
    color: "#6B7280",
    fontSize: 14,
    fontWeight: "500",
  },
  loginTextBold: {
    color: "#1089ff",
    fontWeight: "700",
  },
});