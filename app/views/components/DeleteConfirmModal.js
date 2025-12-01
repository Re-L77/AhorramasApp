import React from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import { styles } from '../styles/transactionStyles';

export function DeleteConfirmModal({
  visible,
  itemCategoria,
  onClose,
  onConfirm,
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.deleteModalOverlay}>
        <View style={styles.deleteModalContent}>
          <View style={styles.deleteIconContainer}>
            <Text style={styles.deleteIcon}>🗑️</Text>
          </View>
          <Text style={styles.deleteModalTitle}>Eliminar Transacción</Text>
          <Text style={styles.deleteModalText}>
            ¿Estás seguro de que quieres eliminar la transacción de{"\n"}
            <Text style={{ fontWeight: "700" }}>"{itemCategoria}"</Text>?
          </Text>

          <View style={styles.deleteModalFooter}>
            <TouchableOpacity
              style={styles.deleteCancelButton}
              onPress={onClose}
            >
              <Text style={styles.deleteCancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteConfirmButton}
              onPress={onConfirm}
            >
              <Text style={styles.deleteConfirmButtonText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
