import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
    Keyboard,
    Modal,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../hooks/useAuth";
import { UserController } from "../controllers/UserController";

export default function ProfileEditScreen({ route }) {
    const navigation = useNavigation();
    const { usuario } = useAuth();
    const { userData } = route.params || {};

    const [nombre, setNombre] = useState(userData?.nombre || "");
    const [correo, setCorreo] = useState(userData?.correo || "");
    const [telefono, setTelefono] = useState(userData?.telefono || "");
    const [errorCorreo, setErrorCorreo] = useState("");

    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [currPass, setCurrPass] = useState("");
    const [newPass, setNewPass] = useState("");
    const [confirmPass, setConfirmPass] = useState("");

    const [showCurr, setShowCurr] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [pwError, setPwError] = useState("");
    const [pwOk, setPwOk] = useState("");

    const [loading, setLoading] = useState(false);

    // Detectar cambios en los campos
    const hasChanges =
        nombre !== (userData?.nombre || "") ||
        correo !== (userData?.correo || "") ||
        telefono !== (userData?.telefono || "");

    const validarCorreo = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleGuardar = async () => {
        Keyboard.dismiss();

        if (!nombre.trim()) {
            setErrorCorreo("Por favor, ingrese su nombre.");
            return;
        }
        if (!validarCorreo(correo)) {
            setErrorCorreo("Por favor, ingrese un correo electrónico válido.");
            return;
        }
        setErrorCorreo("");

        // Guardar en BD
        setLoading(true);
        const resultado = await UserController.actualizarPerfil(
            usuario.id,
            nombre,
            correo,
            telefono
        );
        setLoading(false);

        if (resultado.success) {
            Alert.alert("Éxito", "Perfil actualizado correctamente.", [
                {
                    text: "OK",
                    onPress: () => {
                        navigation.navigate("ProfileView", {
                            updatedData: { nombre, correo, telefono },
                        });
                    },
                },
            ]);
        } else {
            Alert.alert("Error", resultado.error || "No se pudo actualizar el perfil");
        }
    };

    const handleCambiarContrasena = async () => {
        Keyboard.dismiss();
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

        // Cambiar contraseña en BD
        setLoading(true);
        const resultado = await UserController.cambiarContraseña(
            usuario.id,
            currPass,
            newPass,
            confirmPass
        );
        setLoading(false);

        if (resultado.success) {
            setPwOk("Contraseña actualizada correctamente.");
            setCurrPass("");
            setNewPass("");
            setConfirmPass("");
            setShowCurr(false);
            setShowNew(false);
            setShowConfirm(false);

            setTimeout(() => {
                closePasswordModal();
            }, 2000);
        } else {
            setPwError(resultado.error || "Error al cambiar la contraseña");
        }
    };

    const handleCancelar = () => {
        navigation.goBack();
    };

    const closePasswordModal = () => {
        setCurrPass("");
        setNewPass("");
        setConfirmPass("");
        setPwError("");
        setPwOk("");
        setShowPasswordModal(false);
    };

    return (
        <>
            <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleCancelar} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                        <Ionicons name="chevron-back" size={28} color="#1089ff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Editar Perfil</Text>
                    <View style={{ width: 28 }} />
                </View>

                {/* Content */}
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#1089ff" />
                    </View>
                ) : (
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                        <View style={styles.avatarSection}>
                            <View style={styles.avatar}>
                                <Ionicons name="person-circle" size={80} color="#1089ff" />
                            </View>
                        </View>

                        {/* Form Section */}
                        <View style={styles.formSection}>
                            <Text style={styles.sectionTitle}>Información Personal</Text>

                            {/* Nombre */}
                            <View style={styles.fieldGroup}>
                                <Text style={styles.fieldLabel}>Nombre Completo</Text>
                                <View style={styles.inputWrapper}>
                                    <Ionicons name="person" size={18} color="#9CA3AF" style={styles.inputIcon} />
                                    <TextInput
                                        value={nombre}
                                        onChangeText={setNombre}
                                        style={styles.input}
                                        placeholder="Ingrese su nombre"
                                        placeholderTextColor="#D1D5DB"
                                    />
                                </View>
                            </View>

                            {/* Correo */}
                            <View style={styles.fieldGroup}>
                                <Text style={styles.fieldLabel}>Correo Electrónico</Text>
                                <View style={styles.inputWrapper}>
                                    <Ionicons name="mail" size={18} color="#9CA3AF" style={styles.inputIcon} />
                                    <TextInput
                                        value={correo}
                                        onChangeText={(text) => {
                                            setCorreo(text);
                                            setErrorCorreo("");
                                        }}
                                        style={styles.input}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        placeholder="correo@example.com"
                                        placeholderTextColor="#D1D5DB"
                                    />
                                </View>
                                {errorCorreo ? (
                                    <View style={styles.errorBox}>
                                        <Ionicons name="alert-circle" size={14} color="#DC2626" />
                                        <Text style={styles.errorText}>{errorCorreo}</Text>
                                    </View>
                                ) : null}
                            </View>

                            {/* Teléfono */}
                            <View style={styles.fieldGroup}>
                                <Text style={styles.fieldLabel}>Teléfono</Text>
                                <View style={styles.inputWrapper}>
                                    <Ionicons name="call" size={18} color="#9CA3AF" style={styles.inputIcon} />
                                    <TextInput
                                        value={telefono}
                                        onChangeText={setTelefono}
                                        style={styles.input}
                                        keyboardType="phone-pad"
                                        placeholder="+52 442 2317790"
                                        placeholderTextColor="#D1D5DB"
                                    />
                                </View>
                            </View>
                        </View>

                        {/* Cambiar Contraseña */}
                        <View style={styles.formSection}>
                            <Text style={styles.sectionTitle}>Seguridad</Text>
                            <TouchableOpacity
                                style={styles.securityButton}
                                onPress={() => setShowPasswordModal(true)}
                            >
                                <View style={styles.securityButtonContent}>
                                    <View style={[styles.iconBox, { backgroundColor: "#D1FAE5" }]}>
                                        <Ionicons name="lock-closed" size={20} color="#059669" />
                                    </View>
                                    <View style={styles.securityButtonText}>
                                        <Text style={styles.securityButtonTitle}>Cambiar Contraseña</Text>
                                        <Text style={styles.securityButtonDesc}>Actualiza tu contraseña</Text>
                                    </View>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
                            </TouchableOpacity>
                        </View>

                        {/* Action Buttons */}
                        <View style={styles.actionButtons}>
                            <TouchableOpacity
                                style={[styles.actionBtn, styles.cancelBtn]}
                                onPress={handleCancelar}
                            >
                                <Text style={styles.cancelText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.actionBtn, styles.saveBtn, !hasChanges && styles.disabledBtn]}
                                onPress={handleGuardar}
                                disabled={!hasChanges}
                            >
                                <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                                <Text style={styles.saveText}>Guardar Cambios</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                )}
            </SafeAreaView>

            {/* Modal Cambiar Contraseña */}
            <Modal
                visible={showPasswordModal}
                transparent={true}
                animationType="slide"
                onRequestClose={closePasswordModal}
            >
                <SafeAreaView style={styles.modalContainer}>
                    {/* Modal Header */}
                    <View style={styles.modalHeader}>
                        <TouchableOpacity onPress={closePasswordModal} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                            <Ionicons name="close" size={28} color="#1089ff" />
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>Cambiar Contraseña</Text>
                        <View style={{ width: 28 }} />
                    </View>

                    {/* Modal Content */}
                    <ScrollView contentContainerStyle={styles.modalContent}>
                        <View style={styles.modalFormSection}>
                            {/* Contraseña Actual */}
                            <View style={styles.fieldGroup}>
                                <Text style={styles.fieldLabel}>Contraseña Actual</Text>
                                <View style={styles.inputWrapper}>
                                    <Ionicons name="lock-closed" size={18} color="#9CA3AF" style={styles.inputIcon} />
                                    <TextInput
                                        value={currPass}
                                        onChangeText={setCurrPass}
                                        secureTextEntry={!showCurr}
                                        style={[styles.input, { paddingRight: 40 }]}
                                        placeholder="Contraseña actual"
                                        placeholderTextColor="#D1D5DB"
                                    />
                                    <TouchableOpacity
                                        onPress={() => setShowCurr((s) => !s)}
                                        style={styles.eyeBtn}
                                    >
                                        <Ionicons name={showCurr ? "eye-off" : "eye"} size={18} color="#9CA3AF" />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Nueva Contraseña */}
                            <View style={styles.fieldGroup}>
                                <Text style={styles.fieldLabel}>Nueva Contraseña</Text>
                                <View style={styles.inputWrapper}>
                                    <Ionicons name="lock-closed" size={18} color="#9CA3AF" style={styles.inputIcon} />
                                    <TextInput
                                        value={newPass}
                                        onChangeText={setNewPass}
                                        secureTextEntry={!showNew}
                                        style={[styles.input, { paddingRight: 40 }]}
                                        placeholder="Nueva contraseña"
                                        placeholderTextColor="#D1D5DB"
                                    />
                                    <TouchableOpacity
                                        onPress={() => setShowNew((s) => !s)}
                                        style={styles.eyeBtn}
                                    >
                                        <Ionicons name={showNew ? "eye-off" : "eye"} size={18} color="#9CA3AF" />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Confirmar Contraseña */}
                            <View style={styles.fieldGroup}>
                                <Text style={styles.fieldLabel}>Confirmar Contraseña</Text>
                                <View style={styles.inputWrapper}>
                                    <Ionicons name="lock-closed" size={18} color="#9CA3AF" style={styles.inputIcon} />
                                    <TextInput
                                        value={confirmPass}
                                        onChangeText={setConfirmPass}
                                        secureTextEntry={!showConfirm}
                                        style={[styles.input, { paddingRight: 40 }]}
                                        placeholder="Confirmar contraseña"
                                        placeholderTextColor="#D1D5DB"
                                    />
                                    <TouchableOpacity
                                        onPress={() => setShowConfirm((s) => !s)}
                                        style={styles.eyeBtn}
                                    >
                                        <Ionicons name={showConfirm ? "eye-off" : "eye"} size={18} color="#9CA3AF" />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {pwError ? (
                                <View style={styles.errorBox}>
                                    <Ionicons name="alert-circle" size={14} color="#DC2626" />
                                    <Text style={styles.errorText}>{pwError}</Text>
                                </View>
                            ) : null}
                            {pwOk ? (
                                <View style={styles.successBox}>
                                    <Ionicons name="checkmark-circle" size={14} color="#059669" />
                                    <Text style={styles.successText}>{pwOk}</Text>
                                </View>
                            ) : null}

                            {/* Modal Actions */}
                            <View style={styles.modalActions}>
                                <TouchableOpacity
                                    style={[styles.actionBtn, styles.cancelBtn]}
                                    onPress={closePasswordModal}
                                >
                                    <Text style={styles.cancelText}>Cancelar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.actionBtn, styles.saveBtn]}
                                    onPress={handleCambiarContrasena}
                                >
                                    <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                                    <Text style={styles.saveText}>Cambiar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9FAFB",
    },
    safeArea: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: "#FFFFFF",
        borderBottomWidth: 1,
        borderBottomColor: "#F3F4F6",
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "800",
        color: "#1F2937",
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    avatarSection: {
        alignItems: "center",
        marginVertical: 24,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
    },
    formSection: {
        backgroundColor: "#FFFFFF",
        marginHorizontal: 0,
        marginBottom: 16,
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: "700",
        color: "#6B7280",
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    toggleBtn: {
        width: 36,
        height: 36,
        alignItems: "center",
        justifyContent: "center",
    },
    fieldGroup: {
        marginBottom: 18,
    },
    fieldLabel: {
        fontSize: 13,
        fontWeight: "700",
        color: "#1F2937",
        marginBottom: 8,
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1.5,
        borderColor: "#E5E7EB",
        borderRadius: 12,
        paddingHorizontal: 12,
        backgroundColor: "#F9FAFB",
    },
    inputIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        height: 48,
        fontSize: 14,
        color: "#1F2937",
        fontWeight: "500",
    },
    eyeBtn: {
        padding: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    errorBox: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FEE2E2",
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 8,
        marginTop: 8,
        gap: 8,
    },
    errorText: {
        fontSize: 12,
        color: "#DC2626",
        fontWeight: "600",
        flex: 1,
    },
    successBox: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#DCFCE7",
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 8,
        marginTop: 8,
        gap: 8,
    },
    successText: {
        fontSize: 12,
        color: "#059669",
        fontWeight: "600",
        flex: 1,
    },
    pwForm: {
        borderTopWidth: 1,
        borderTopColor: "#F3F4F6",
        paddingTop: 16,
    },
    changePwBtn: {
        backgroundColor: "#1089ff",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 12,
        borderRadius: 12,
        marginTop: 16,
        gap: 8,
        shadowColor: "#1089ff",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
    },
    changePwTxt: {
        color: "#FFFFFF",
        fontWeight: "700",
        fontSize: 14,
    },
    actionButtons: {
        flexDirection: "row",
        gap: 12,
        marginHorizontal: 0,
        marginBottom: 20,
    },
    actionBtn: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: 8,
    },
    cancelBtn: {
        backgroundColor: "#F3F4F6",
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    cancelText: {
        fontWeight: "700",
        color: "#6B7280",
        fontSize: 15,
    },
    saveBtn: {
        backgroundColor: "#1089ff",
        shadowColor: "#1089ff",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 3,
    },
    saveText: {
        fontWeight: "700",
        color: "#FFFFFF",
        fontSize: 15,
    },
    disabledBtn: {
        opacity: 0.5,
    },

    // Security Button
    securityButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 14,
        paddingHorizontal: 12,
        borderWidth: 1.5,
        borderColor: "#E5E7EB",
        borderRadius: 12,
        backgroundColor: "#F9FAFB",
    },
    securityButtonContent: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    iconBox: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    securityButtonText: {
        flex: 1,
    },
    securityButtonTitle: {
        fontSize: 15,
        fontWeight: "600",
        color: "#1F2937",
        marginBottom: 2,
    },
    securityButtonDesc: {
        fontSize: 12,
        color: "#9CA3AF",
    },

    // Modal Styles
    modalContainer: {
        flex: 1,
        backgroundColor: "#F9FAFB",
    },
    modalHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: "#FFFFFF",
        borderBottomWidth: 1,
        borderBottomColor: "#F3F4F6",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "800",
        color: "#1F2937",
    },
    modalContent: {
        paddingHorizontal: 16,
        paddingVertical: 20,
        paddingBottom: 40,
    },
    modalFormSection: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    modalActions: {
        flexDirection: "row",
        gap: 12,
        marginTop: 20,
    },
});