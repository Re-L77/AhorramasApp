import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import {
  useNavigation,
  useIsFocused,
  useRoute,
} from "@react-navigation/native";

export default function LoginScreen() {
  const [showSplash, setShowSplash] = useState(true);
  const [showFinalSplash, setShowFinalSplash] = useState(false);
  const [nombre, setNombre] = useState("Juan Pérez");
  const [contraseña, setContraseña] = useState("password123");
  const [correo, setCorreo] = useState("juan@example.com");
  const [telefono, setTelefono] = useState("3015551234");
  const [mensaje, setMensaje] = useState("");
  const navigation = useNavigation();
  const route = useRoute();
  const isFocused = useIsFocused();
  const isFirstLoad = useRef(true);

  const fadeAnim = useState(new Animated.Value(0))[0];
  const scaleAnim = useState(new Animated.Value(0.8))[0];

  useEffect(() => {
    // Verificar si viene de Register (skipSplash)
    const skipSplash = route.params?.skipSplash;

    // Solo mostrar splash la primera vez y si no viene de Register
    if (isFocused && isFirstLoad.current && !skipSplash) {
      isFirstLoad.current = false;

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: false,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.out(Easing.exp),
          useNativeDriver: false,
        }),
      ]).start();

      setTimeout(() => {
        setShowSplash(false);
      }, 3000);
    } else if (isFocused && (!isFirstLoad.current || skipSplash)) {
      // Si regresa a login desde register, no mostrar splash
      setShowSplash(false);
    }
  }, [isFocused, route.params?.skipSplash]);

  const handleLogin = () => {
    if (!nombre || !contraseña || !correo || !telefono) {
      Alert.alert("Error", "Por favor completa todos los campos.");
      setMensaje("Faltan campos por llenar");
      return;
    }

    // Validar email básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      Alert.alert("Error", "Por favor ingresa un correo válido.");
      return;
    }

    // Validar teléfono (al menos 10 dígitos)
    if (telefono.replace(/\D/g, "").length < 10) {
      Alert.alert("Error", "Por favor ingresa un teléfono válido.");
      return;
    }

    setMensaje("Inicio de sesión exitoso");
    setShowFinalSplash(true);
    setTimeout(() => {
      setShowFinalSplash(false);
      // Navegar a MainTabs usando navigate (no reset)
      navigation.navigate("MainTabs");
    }, 2500);
  };

  if (showSplash) {
    return (
      <View style={styles.splashContainer}>
        <Animated.Text
          style={[
            styles.splashText,
            { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
          ]}
        >
          AHORRA+
        </Animated.Text>
      </View>
    );
  }

  if (showFinalSplash) {
    return (
      <View style={styles.splashContainer}>
        <Animated.Text
          style={[
            styles.splashText,
            { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
          ]}
        >
          ¡Bienvenido!
        </Animated.Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>AHORRA+</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.title}>Inicio de Sesión</Text>

        <TextInput
          style={styles.input}
          placeholder="Nombre"
          placeholderTextColor="#9CA3AF"
          value={nombre}
          onChangeText={setNombre}
        />
        <TextInput
          style={styles.input}
          placeholder="Correo"
          placeholderTextColor="#9CA3AF"
          keyboardType="email-address"
          value={correo}
          onChangeText={setCorreo}
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#9CA3AF"
          secureTextEntry
          value={contraseña}
          onChangeText={setContraseña}
        />
        <TextInput
          style={styles.input}
          placeholder="Teléfono"
          placeholderTextColor="#9CA3AF"
          keyboardType="phone-pad"
          value={telefono}
          onChangeText={setTelefono}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        </TouchableOpacity>

        <TouchableOpacity
<<<<<<< HEAD
=======
          onPress={() => navigation.navigate("ForgotPassword")}
          style={styles.forgotPasswordLink}
        >
          <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>

        <TouchableOpacity
>>>>>>> Juan
          onPress={() => navigation.navigate("Register")}
          style={styles.registerLink}
        >
          <Text style={styles.registroText}>
            ¿No tienes cuenta?{" "}
            <Text style={styles.registroTextBold}>Registrate aquí</Text>
          </Text>
        </TouchableOpacity>

        {mensaje ? <Text style={styles.mensajeText}>{mensaje}</Text> : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: "#1089ff",
    alignItems: "center",
    justifyContent: "center",
  },
  splashText: {
    color: "#fff",
    fontSize: 40,
    fontWeight: "700",
    letterSpacing: 2,
  },
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
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
  formContainer: {
    flex: 1,
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
    justifyContent: "center",
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
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
<<<<<<< HEAD
  registerLink: {
    marginTop: 20,
=======
  forgotPasswordLink: {
    marginTop: 12,
    alignItems: "center",
  },
  forgotPasswordText: {
    color: "#1089ff",
    fontSize: 13,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  registerLink: {
    marginTop: 16,
>>>>>>> Juan
    alignItems: "center",
  },
  registroText: {
    color: "#6B7280",
    fontSize: 14,
    fontWeight: "500",
  },
  registroTextBold: {
    color: "#1089ff",
    fontWeight: "700",
  },
  mensajeText: {
    marginTop: 16,
    fontSize: 13,
    fontWeight: "600",
    color: "#059669",
    textAlign: "center",
  },
});
