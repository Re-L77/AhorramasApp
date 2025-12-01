import React from "react";
import {
  View,
  Text,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
  TextInput,
  Platform,
} from "react-native";
import { styles } from '../styles/transactionStyles';

export function TransactionFormModal({
  visible,
  modalType,
  formData,
  errors,
  onChangeCategoria,
  onChangeMonto,
  onChangeTipo,
  onChangeIcono,
  onChangeDescripcion,
  onClose,
  onSave,
  getIconoByCategoria,
  presupuestos = [],
}) {
  return (
    <Modal
      visible={visible && (modalType === "nueva" || modalType === "editar")}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalContainer}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {modalType === "nueva"
                  ? "➕ Nueva Transacción"
                  : "✏️ Editar Transacción"}
              </Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* Tipo */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Tipo</Text>
                <View style={styles.typeButtonsRow}>
                  {["Ingreso", "Gasto"].map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.typeButton,
                        formData.tipo === type && styles.typeButtonActive,
                      ]}
                      onPress={() => onChangeTipo(type)}
                    >
                      <Text
                        style={[
                          styles.typeButtonText,
                          formData.tipo === type && styles.typeButtonTextActive,
                        ]}
                      >
                        {type === "Ingreso" ? "💰 Ingreso" : "💸 Gasto"}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Categoría */}
              <View style={styles.formGroup}>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>Categoría</Text>
                  {errors.categoria ? (
                    <Text style={styles.errorText}>{errors.categoria}</Text>
                  ) : null}
                </View>
                {presupuestos && presupuestos.length > 0 ? (
                  <View style={styles.categoriasContainer}>
                    {presupuestos.map((presupuesto) => (
                      <TouchableOpacity
                        key={presupuesto.id}
                        style={[
                          styles.categoriaButton,
                          formData.categoria === presupuesto.categoria && styles.categoriaButtonActive,
                        ]}
                        onPress={() => onChangeCategoria(presupuesto.categoria)}
                      >
                        <Text style={styles.categoriaButtonText}>
                          {presupuesto.categoria}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : (
                  <Text style={styles.noPresupuestosText}>
                    No hay presupuestos disponibles
                  </Text>
                )}
              </View>

              {/* Monto */}
              <View style={styles.formGroup}>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>Monto</Text>
                  {errors.monto && (
                    <Text style={styles.errorText}>{errors.monto}</Text>
                  )}
                </View>
                <View
                  style={[
                    styles.montoInputContainer,
                    errors.monto && styles.montoInputContainerError,
                  ]}
                >
                  <Text style={styles.currencySymbol}>$</Text>
                  <TextInput
                    style={styles.montoInput}
                    placeholder="0.00"
                    value={formData.monto}
                    onChangeText={onChangeMonto}
                    keyboardType="decimal-pad"
                    placeholderTextColor="#D1D5DB"
                  />
                </View>
              </View>

              {/* Descripción */}
              <View style={styles.formGroup}>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>Descripción (Opcional)</Text>
                  <Text style={styles.charCount}>
                    {(formData.descripcion || "").length}/100
                  </Text>
                </View>
                <TextInput
                  style={[styles.input, styles.descriptionInput]}
                  placeholder="Ej: Compras en el supermercado..."
                  value={formData.descripcion || ""}
                  onChangeText={onChangeDescripcion}
                  placeholderTextColor="#D1D5DB"
                  maxLength={100}
                  multiline
                  numberOfLines={3}
                />
              </View>

              {/* Icono */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Icono (Opcional)</Text>
                <View style={styles.emojiDisplayRow}>
                  <Text style={styles.emojiDisplay}>
                    {formData.icono || (getIconoByCategoria ? getIconoByCategoria(formData.categoria) : "💰")}
                  </Text>
                  <Text style={styles.emojiDisplayLabel}>
                    {formData.icono ? "Personalizado" : formData.categoria || "Automático"}
                  </Text>
                </View>
                <Text style={styles.helperText}>Selecciona uno o deja en blanco para automático</Text>
                <View style={styles.emojiGrid}>
                  {["💰", "💼", "🍔", "🚕", "💻", "🎬", "💊", "🏪", "⛽", "🏠", "📚", "👕", "💡", "🎵"].map(
                    (emoji) => (
                      <TouchableOpacity
                        key={emoji}
                        style={[
                          styles.emojiButton,
                          formData.icono === emoji && styles.emojiButtonActive,
                        ]}
                        onPress={() => onChangeIcono(emoji)}
                      >
                        <Text style={styles.emoji}>{emoji}</Text>
                      </TouchableOpacity>
                    )
                  )}
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={onSave}>
                <Text style={styles.saveButtonText}>
                  {modalType === "nueva" ? "Crear" : "Guardar"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
