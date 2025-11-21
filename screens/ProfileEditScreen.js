import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Platform,
    StatusBar,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const COLORS = {
    black: "#000000",
    gray: "#D9D9D9",
    white: "#FFFFFF",
    blueLight: "#1089ff",
    red: "#992020",
    blueStrong: "#1089ff",
};

export default function ProfileEditScreen({ route }) {
    const navigation = useNavigation();
    const { userData } = route.params || {};

    const [nombre, setNombre] = useState(userData?.nombre || "Alex Martínez");
    const [correo, setCorreo] = useState(userData?.correo || "124056435@upq.edu.mx");
    const [telefono, setTelefono] = useState(userData?.telefono || "+52 442 2317790");
    const [errorCorreo, setErrorCorreo] = useState("");

    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [currPass, setCurrPass] = useState("");
    const [newPass, setNewPass] = useState("");
    const [confirmPass, setConfirmPass] = useState("");

    const [showCurr, setShowCurr] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [pwError, setPwError] = useState("");
    const [pwOk, setPwOk] = useState("");

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

        navigation.navigate("ProfileView", {
            updatedData: { nombre, correo, telefono },
        });
    };

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

        setPwOk("Contraseña actualizada correctamente.");
        setCurrPass("");
        setNewPass("");
        setConfirmPass("");
        setShowCurr(false);
        setShowNew(false);
        setShowConfirm(false);
    };

    const handleCancelar = () => {
        setErrorCorreo("");
        setShowPasswordForm(false);
        setPwError("");
        setPwOk("");
        navigation.goBack();
    };

    return (
        <View style={styles.safe}>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={handleCancelar}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Text style={styles.backButton}>← Atrás</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Editar Perfil</Text>
                    <View style={{ width: 50 }} />
                </View>

                <View style={styles.content}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatar} />
                    </View>

                    <Text style={styles.fieldLabel}>Nombre</Text>
                    <View style={styles.inputBox}>
                        <TextInput
                            value={nombre}
                            onChangeText={setNombre}
                            style={styles.inputText}
                            placeholder="Ingrese su nombre"
                            placeholderTextColor="#999"
                        />
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
                            placeholder="Ingrese su correo"
                            placeholderTextColor="#999"
                        />
                    </View>
                    {errorCorreo ? (
                        <Text style={styles.errorText}>{errorCorreo}</Text>
                    ) : null}

                    <Text style={[styles.fieldLabel, { marginTop: 14 }]}>Teléfono</Text>
                    <View style={styles.inputBox}>
                        <TextInput
                            value={telefono}
                            onChangeText={setTelefono}
                            style={styles.inputText}
                            keyboardType="phone-pad"
                            placeholder="Ingrese su teléfono"
                            placeholderTextColor="#999"
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.passwordButton, { backgroundColor: COLORS.red }]}
                        onPress={() => setShowPasswordForm((v) => !v)}
                    >
                        <Text style={styles.passwordButtonText}>
                            {showPasswordForm ? "Ocultar" : "Cambiar contraseña"}
                        </Text>
                    </TouchableOpacity>

                    {showPasswordForm && (
                        <View style={styles.pwForm}>
                            <Text style={styles.pwLabel}>Contraseña actual</Text>
                            <View style={[styles.inputBox, styles.inputWrapper]}>
                                <TextInput
                                    value={currPass}
                                    onChangeText={setCurrPass}
                                    secureTextEntry={!showCurr}
                                    style={[styles.inputText, { paddingRight: 36 }]}
                                    placeholder="Ingrese contraseña actual"
                                    placeholderTextColor="#999"
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
                                    placeholder="Ingrese nueva contraseña"
                                    placeholderTextColor="#999"
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
                                    placeholder="Confirme contraseña"
                                    placeholderTextColor="#999"
                                />
                                <TouchableOpacity
                                    onPress={() => setShowConfirm((s) => !s)}
                                    style={styles.eyeBtn}
                                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                >
                                    <Text style={styles.eyeTxt}>
                                        {showConfirm ? "🙈" : "👁️"}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {pwError ? (
                                <Text style={styles.errorText}>{pwError}</Text>
                            ) : null}
                            {pwOk ? <Text style={styles.successText}>{pwOk}</Text> : null}

                            <TouchableOpacity
                                style={styles.changePwBtn}
                                onPress={handleCambiarContrasena}
                            >
                                <Text style={styles.changePwTxt}>Cambiar contraseña</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    <View style={styles.row}>
                        <TouchableOpacity
                            style={[styles.actionBtn, styles.cancelBtn]}
                            onPress={handleCancelar}
                        >
                            <Text style={styles.actionText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.actionBtn, styles.saveBtn]}
                            onPress={handleGuardar}
                        >
                            <Text style={[styles.actionText, { color: COLORS.white }]}>
                                Guardar
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
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
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#E5E5E5",
    },
    backButton: {
        fontSize: 16,
        color: COLORS.blueLight,
        fontWeight: "600",
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: COLORS.black,
    },
    content: {
        paddingHorizontal: 20,
        paddingVertical: 24,
    },
    avatarContainer: {
        alignItems: "center",
        marginBottom: 24,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: COLORS.black,
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
        marginBottom: 8,
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
        marginBottom: 8,
    },
    passwordButtonText: {
        color: COLORS.white,
        fontWeight: "700",
        fontSize: 14,
    },
    pwForm: {
        width: "100%",
        marginTop: 16,
        marginBottom: 16,
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
    row: {
        flexDirection: "row",
        gap: 12,
        marginTop: 20,
        marginBottom: 20,
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
});
