import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Platform,
  StatusBar,
  TouchableOpacity,
} from "react-native";

const COLORS = {
  black: "#000000",
  gray: "#D9D9D9",
  white: "#FFFFFF",
  blueLight: "#1089ff",
  red: "#992020",
  blueStrong: "#1089ff", // color del boton guardar
};

export default function ProfileScreen() {
  const [isEditing, setIsEditing] = useState(false);
  const [nombre, setNombre] = useState("Alex Martínez");
  const [correo, setCorreo] = useState("124056435@upq.edu.mx");
  const [telefono, setTelefono] = useState("+52 442 2317790");
  const [errorCorreo, setErrorCorreo] = useState("");

  // ----- NUEVO: estado y lógica para cambiar contraseña -----
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currPass, setCurrPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const [showCurr, setShowCurr] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [pwError, setPwError] = useState("");
  const [pwOk, setPwOk] = useState("");

  // Validación correo
  const validarCorreo = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleGuardar = () => {
    if (!validarCorreo(correo)) {
      setErrorCorreo("Por favor, ingrese un correo electrónico válido.");
      return;
    }
    setErrorCorreo("");
    setIsEditing(false);
  };

  // Validación y “submit” del cambio de contraseña 
  const handleCambiarContrasena = () => {
    setPwError("");
    setPwOk("");

    if (!currPass || !newPass || !confirmPass) {
      setPwError("Completa todos los campos.");
      return;
    }
    if (newPass.length < 6) {
      setPwError("La nueva contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (newPass !== confirmPass) {
      setPwError("La confirmación no coincide con la nueva contraseña.");
      return;
    }

    // Aquí iría tu llamada a API/Backend para cambiar la contraseña
    setPwOk("Contraseña actualizada correctamente.");
    setCurrPass("");
    setNewPass("");
    setConfirmPass("");
    setShowCurr(false);
    setShowNew(false);
    setShowConfirm(false);
  };
  // ----------------------------------------------------------

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
          <View className="avatar" style={styles.avatar} />
        </View>

        {/* Contenido dinámico */}
        {!isEditing ? (
          <>
            <Text style={styles.name}>{nombre}</Text>
            <Text style={styles.email}>{correo}</Text>
            <Text style={styles.phone}>{telefono}</Text>

            <TouchableOpacity
              style={styles.editButton}
              onPress={() => {
                setShowPasswordForm(false);
                setIsEditing(true);
              }}
            >
              <Text style={styles.editButtonText}>Editar perfil</Text>
            </TouchableOpacity>

            <TouchableOpacity>
              <Text style={styles.logoutText}>Cerrar sesión</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.editPanel}>
            <Text style={styles.fieldLabel}>Nombre</Text>
            <View style={styles.inputBox}>
              <TextInput value={nombre} onChangeText={setNombre} style={styles.inputText} />
            </View>

            <Text style={[styles.fieldLabel, { marginTop: 14 }]}>Correo electrónico</Text>
            <View style={styles.inputBox}>
              <TextInput
                value={correo}
                onChangeText={(text) => {
                  setCorreo(text);
                  setErrorCorreo("");
                }}
                style={styles.inputText}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            {errorCorreo ? <Text style={styles.errorText}>{errorCorreo}</Text> : null}

            <Text style={[styles.fieldLabel, { marginTop: 14 }]}>Teléfono</Text>
            <View style={styles.inputBox}>
              <TextInput
                value={telefono}
                onChangeText={setTelefono}
                style={styles.inputText}
                keyboardType="phone-pad"
              />
            </View>

            {/* Botón que despliega el formulario de cambio de contraseña */}
            <TouchableOpacity
              style={[styles.passwordButton, { backgroundColor: COLORS.red }]}
              onPress={() => setShowPasswordForm((v) => !v)}
            >
              <Text style={styles.passwordButtonText}>
                {showPasswordForm ? "Ocultar" : "Cambiar contraseña"}
              </Text>
            </TouchableOpacity>

            {/* ----- Nuevo: Formulario de contraseña como en la imagen ----- */}
            {showPasswordForm && (
              <View style={styles.pwForm}>
                <Text style={styles.pwLabel}>Contraseña actual</Text>
                <View style={[styles.inputBox, styles.inputWrapper]}>
                  <TextInput
                    value={currPass}
                    onChangeText={setCurrPass}
                    secureTextEntry={!showCurr}
                    style={[styles.inputText, { paddingRight: 36 }]}
                  />
                  <TouchableOpacity
                    onPress={() => setShowCurr((s) => !s)}
                    style={styles.eyeBtn}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Text style={styles.eyeTxt}>{showCurr ? "🙈" : "👁️"}</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.pwLabel}>Nueva contraseña</Text>
                <View style={[styles.inputBox, styles.inputWrapper]}>
                  <TextInput
                    value={newPass}
                    onChangeText={setNewPass}
                    secureTextEntry={!showNew}
                    style={[styles.inputText, { paddingRight: 36 }]}
                  />
                  <TouchableOpacity
                    onPress={() => setShowNew((s) => !s)}
                    style={styles.eyeBtn}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Text style={styles.eyeTxt}>{showNew ? "🙈" : "👁️"}</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.pwLabel}>Confirmar contraseña</Text>
                <View style={[styles.inputBox, styles.inputWrapper]}>
                  <TextInput
                    value={confirmPass}
                    onChangeText={setConfirmPass}
                    secureTextEntry={!showConfirm}
                    style={[styles.inputText, { paddingRight: 36 }]}
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirm((s) => !s)}
                    style={styles.eyeBtn}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Text style={styles.eyeTxt}>{showConfirm ? "🙈" : "👁️"}</Text>
                  </TouchableOpacity>
                </View>

                {pwError ? <Text style={styles.errorText}>{pwError}</Text> : null}
                {pwOk ? <Text style={styles.successText}>{pwOk}</Text> : null}

                <TouchableOpacity style={styles.changePwBtn} onPress={handleCambiarContrasena}>
                  <Text style={styles.changePwTxt}>Cambiar contraseña</Text>
                </TouchableOpacity>
              </View>
            )}
            {/* ------------------------------------------------------------ */}

            <View style={styles.row}>
              <TouchableOpacity
                style={[styles.actionBtn, styles.cancelBtn]}
                onPress={() => {
                  setErrorCorreo("");
                  setShowPasswordForm(false);
                  setPwError("");
                  setPwOk("");
                  setIsEditing(false);
                }}
              >
                <Text style={styles.actionText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, styles.saveBtn]} onPress={handleGuardar}>
                <Text style={[styles.actionText, { color: COLORS.white }]}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
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
    marginBottom: 8,
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
    marginTop: 8,
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
  editPanel: {
    width: "100%",
    marginTop: 12,
  },
  fieldLabel: {
    fontSize: 13,
    color: COLORS.black,
    fontWeight: "600",
    alignSelf: "flex-start",
    marginLeft: 4,
    marginBottom: 6,
  },
  inputBox: {
    backgroundColor: COLORS.gray,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  inputText: {
    fontSize: 14,
    color: COLORS.black,
    fontWeight: "600",
  },
  passwordButton: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.red,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    marginTop: 18,
  },
  passwordButtonText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 14,
  },
  row: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtn: {
    backgroundColor: "#EDEDED",
  },
  saveBtn: {
    backgroundColor: COLORS.blueStrong,
  },
  actionText: {
    fontWeight: "700",
    color: COLORS.black,
  },
  errorText: {
    color: COLORS.red,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
    fontWeight: "600",
  },
  successText: {
    color: "#2e7d32",
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
    fontWeight: "700",
  },

  // ---- estilos extra para el formulario de contraseña ----
  pwForm: {
    width: "100%",
    marginTop: 16,
  },
  pwLabel: {
    fontSize: 13,
    color: COLORS.black,
    fontWeight: "600",
    alignSelf: "flex-start",
    marginLeft: 4,
    marginTop: 10,
    marginBottom: 6,
  },
  inputWrapper: {
    position: "relative",
  },
  eyeBtn: {
    position: "absolute",
    right: 10,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
  eyeTxt: {
    fontSize: 16,
  },
  changePwBtn: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.blueStrong,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    marginTop: 18,
  },
  changePwTxt: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 14,
  },
});
