import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { formatCurrency } from "../utils/formatters";
import { styles } from "../styles/transactionStyles";

export function TransactionListItem({ item, onEdit, onDelete }) {
  return (
    <View style={styles.transactionItemContainer}>
      <TouchableOpacity
        style={styles.transactionItem}
        onPress={() => onEdit(item)}
        activeOpacity={0.6}
      >
        <View style={styles.transactionLeft}>
          <View style={styles.transactionIcon}>
            <Text style={{ fontSize: 20 }}>{item.icono}</Text>
          </View>
          <View style={styles.transactionDetails}>
            <Text style={styles.transactionCategory}>{item.categoria}</Text>
            <Text style={styles.transactionType}>{item.tipo}</Text>
          </View>
        </View>

        <View style={styles.transactionRight}>
          <Text
            style={[
              styles.transactionAmount,
              {
                color: item.tipo === "Ingreso" ? "#10B981" : "#EF4444",
              },
            ]}
          >
            {item.tipo === "Ingreso" ? "+" : "-"} {formatCurrency(item.monto)}
          </Text>
          <View
            style={[
              styles.transactionBadge,
              {
                backgroundColor:
                  item.tipo === "Ingreso" ? "#D1FAE5" : "#FEE2E2",
              },
            ]}
          >
            <Text
              style={[
                styles.transactionBadgeText,
                {
                  color: item.tipo === "Ingreso" ? "#059669" : "#DC2626",
                },
              ]}
            >
              {item.tipo}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Acciones - Editar y Eliminar */}
      <View style={styles.transactionActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onEdit(item)}
        >
          <Text style={styles.actionButtonText}>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => onDelete(item.id, item.categoria)}
        >
          <Text style={[styles.actionButtonText, styles.deleteButtonText]}>
            🗑️
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
