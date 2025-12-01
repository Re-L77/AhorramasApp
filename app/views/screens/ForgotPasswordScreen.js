import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { UserController } from '../../controllers/UserController';
import { useAuth } from '../../hooks/useAuth';

export default function ForgotPasswordScreen() {
  const [step, setStep] = useState(1); // 1: Email/Phone, 2: Verification Code, 3: Reset Password
  const [email, setEmail] = useState("juan@example.com");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigation = useNavigation();
  const { login } = useAuth();

  // Códigos de verificación estáticos
  const VERIFICATION_CODES = {
    "juan@example.com": "123456",
    "maria@example.com": "654321",
    "carlos@example.com": "789012",
  };

  // Validar email
  const validateEmail = (text) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(text);
  };

  // Paso 1: Enviar código de recuperación
  const handleSendCode = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Por favor ingresa tu correo electrónico");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Error", "Por favor ingresa un correo válido");
      return;
    }

    setLoading(true);

    // Verificar que el usuario exista
    const usuariosResult = await UserController.obtenerUsuarios();
    const usuarioExiste = usuariosResult.success &&
      usuariosResult.usuarios.some(u => u.correo === email);

    if (!usuarioExiste) {
      setLoading(false);
      Alert.alert("Error", "No existe una cuenta con este correo electrónico");
      return;
    }

    // Obtener el código de verificación para este correo
    const codigo = VERIFICATION_CODES[email] || "000000";

    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        "Código enviado",
        `Se envió un código de verificación a ${email}\n\nCódigo de prueba: ${codigo}`,
      );
      setStep(2);
    }, 1500);
  };

  // Paso 2: Verificar código
  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      Alert.alert("Error", "Por favor ingresa el código de verificación");
      return;
    }

    // Código de verificación estático para cada correo
    const codigoEsperado = VERIFICATION_CODES[email] || "000000";

    if (verificationCode !== codigoEsperado) {
      Alert.alert("Error", "Código de verificación inválido");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert("Código verificado", "Ahora puedes establecer una nueva contraseña");
      setStep(3);
    }, 1000);
  };

  // Paso 3: Cambiar contraseña
  const handleResetPassword = async () => {
    if (!newPassword.trim()) {
      Alert.alert("Error", "Por favor ingresa una nueva contraseña");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }

    setLoading(true);

    // Llamar al controlador para cambiar la contraseña
    const resultado = await UserController.cambiarContraseñaPorCorreo(email, newPassword);

    if (resultado.success) {
      setLoading(false);
      Alert.alert(
        "¡Éxito!",
        "Tu contraseña ha sido restablecida correctamente",
        [
          {
            text: "Ir al Login",
            onPress: () => {
              // Limpiar todos los datos del formulario
              setEmail("");
              setVerificationCode("");
              setNewPassword("");
              setConfirmPassword("");
              setStep(1);

              // Navegar al Login
              navigation.navigate("Login", { skipSplash: true });
            },
          },
        ]
      );
    } else {
      setLoading(false);
      Alert.alert("Error", resultado.error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        {/* Header */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>← Volver</Text>
        </TouchableOpacity>

        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>🔐 Recuperar Contraseña</Text>
          <Text style={styles.headerSubtitle}>
            {step === 1
              ? "Ingresa tu correo para recuperar tu cuenta"
              : step === 2
                ? "Verifica el código enviado a tu correo"
                : "Establece una nueva contraseña"}
          </Text>
        </View>

        {/* Indicador de progreso */}
        <View style={styles.progressContainer}>
          {[1, 2, 3].map((stepNum) => (
            <View
              key={stepNum}
              style={[
                styles.progressStep,
                stepNum <= step && styles.progressStepActive,
              ]}
            >
              <Text
                style={[
                  styles.progressStepText,
                  stepNum <= step && styles.progressStepTextActive,
                ]}
              >
                {stepNum}
              </Text>
            </View>
          ))}
        </View>

        {/* Contenido por paso */}
        <View style={styles.contentContainer}>
          {step === 1 && (
            <>
              <Text style={styles.label}>Correo Electrónico</Text>
              <TextInput
                style={styles.input}
                placeholder="ejemplo@correo.com"
                placeholderTextColor="#D1D5DB"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
              />
              <Text style={styles.helperText}>
                ✓ Recibirás un código de verificación en este correo
              </Text>
            </>
          )}

          {step === 2 && (
            <>
              <Text style={styles.label}>Código de Verificación</Text>
              <TextInput
                style={styles.input}
                placeholder="Ingresa el código de 6 dígitos"
                placeholderTextColor="#D1D5DB"
                value={verificationCode}
                onChangeText={setVerificationCode}
                keyboardType="numeric"
                maxLength={6}
                editable={!loading}
              />
              <Text style={styles.helperText}>
                El código fue enviado a: {email}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setStep(1);
                  setVerificationCode("");
                }}
              >
                <Text style={styles.resendLink}>¿No recibiste el código? Reenviar</Text>
              </TouchableOpacity>
            </>
          )}

          {step === 3 && (
            <>
              <Text style={styles.label}>Nueva Contraseña</Text>
              <View style={styles.passwordInputWrapper}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Ingresa tu nueva contraseña"
                  placeholderTextColor="#D1D5DB"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry={!showPassword}
                  editable={!loading}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  <Text style={styles.eyeIcon}>
                    {showPassword ? "👁" : "👁‍🗨"}
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>Confirmar Contraseña</Text>
              <View style={styles.passwordInputWrapper}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Confirma tu nueva contraseña"
                  placeholderTextColor="#D1D5DB"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  editable={!loading}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeButton}
                >
                  <Text style={styles.eyeIcon}>
                    {showConfirmPassword ? "👁" : "👁‍🗨"}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.passwordRequirements}>
                <Text
                  style={[
                    styles.requirementText,
                    newPassword.length >= 6 && styles.requirementMet,
                  ]}
                >
                  ✓ Mínimo 6 caracteres
                </Text>
                <Text
                  style={[
                    styles.requirementText,
                    newPassword === confirmPassword &&
                    newPassword.length > 0 &&
                    styles.requirementMet,
                  ]}
                >
                  ✓ Las contraseñas coinciden
                </Text>
              </View>
            </>
          )}
        </View>

        {/* Botón principal */}
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={
            step === 1
              ? handleSendCode
              : step === 2
                ? handleVerifyCode
                : handleResetPassword
          }
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.buttonText}>
              {step === 1
                ? "Enviar Código"
                : step === 2
                  ? "Verificar Código"
                  : "Establecer Nueva Contraseña"}
            </Text>
          )}
        </TouchableOpacity>

        {/* Botón secundario */}
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.secondaryButtonText}>
            {step === 1 ? "Volver a Login" : "Cancelar"}
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  keyboardView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1089ff",
  },

  // Header
  headerContainer: {
    marginBottom: 32,
    marginTop: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },

  // Progress
  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginBottom: 32,
  },
  progressStep: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  progressStepActive: {
    borderColor: "#1089ff",
    backgroundColor: "#1089ff",
  },
  progressStepText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#9CA3AF",
  },
  progressStepTextActive: {
    color: "#FFFFFF",
  },

  // Content
  contentContainer: {
    flex: 1,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 14,
    color: "#1F2937",
    marginBottom: 12,
  },
  passwordInputWrapper: {
    position: "relative",
    marginBottom: 12,
  },
  passwordInput: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    paddingRight: 44,
    fontSize: 14,
    color: "#1F2937",
  },
  eyeButton: {
    position: "absolute",
    right: 12,
    top: 12,
    padding: 4,
  },
  eyeIcon: {
    fontSize: 18,
  },
  helperText: {
    fontSize: 12,
    color: "#059669",
    marginBottom: 8,
  },
  resendLink: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1089ff",
    textDecorationLine: "underline",
  },
  passwordRequirements: {
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    padding: 12,
    marginTop: 16,
  },
  requirementText: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 6,
  },
  requirementMet: {
    color: "#059669",
    fontWeight: "600",
  },

  // Buttons
  button: {
    backgroundColor: "#1089ff",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    shadowColor: "#1089ff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#6B7280",
  },
});