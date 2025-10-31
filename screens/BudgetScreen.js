// screens/BudgetScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Platform,
  SafeAreaView,
  Modal,
  TextInput,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

let WebIcons;
if (Platform.OS === "web") {
  WebIcons = require("react-icons/io5");
}

export default function BudgetScreen() {
  const [data, setData] = useState([
    { id: "1", categoria: "Comida", usado: 300, limite: 500 },
    { id: "2", categoria: "Transporte", usado: 120, limite: 300 },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [nuevaCategoria, setNuevaCategoria] = useState("");
  const [nuevoUsado, setNuevoUsado] = useState("");
  const [nuevoLimite, setNuevoLimite] = useState("");

  const agregarPresupuesto = () => {
    if (!nuevaCategoria || !nuevoLimite) return;
    const nuevo = {
      id: Date.now().toString(),
      categoria: nuevaCategoria,
      usado: parseFloat(nuevoUsado) || 0,
      limite: parseFloat(nuevoLimite),
    };
    setData([...data, nuevo]);
    setModalVisible(false);
    setNuevaCategoria("");
    setNuevoUsado("");
    setNuevoLimite("");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Presupuestos</Text>

        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const progreso = (item.usado / item.limite) * 100;
            return (
              <View style={styles.card}>
                <View style={styles.row}>
                  <Text style={styles.categoria}>{item.categoria}</Text>
                  <Text style={styles.monto}>
                    ${item.usado} / ${item.limite}
                  </Text>
                </View>

                <View style={styles.progressContainer}>
                  <View
                    style={[
                      styles.progressBar,
                      { width: `${progreso}%`, backgroundColor: "#1089ff" },
                    ]}
                  />
                </View>
              </View>
            );
          }}
        />

        {/* 🟦 Botón flotante */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setModalVisible(true)}
        >
          {Platform.OS === "web" ? (
            WebIcons?.IoAddCircleOutline ? (
              <WebIcons.IoAddCircleOutline size={28} color="#fff" />
            ) : (
              <Text style={{ color: "#fff", fontSize: 28 }}>＋</Text>
            )
          ) : (
            <Ionicons name="add" size={28} color="#fff" />
          )}
        </TouchableOpacity>

        {/* 🪟 Modal para agregar presupuesto */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Nuevo Presupuesto</Text>

              <TextInput
                style={styles.input}
                placeholder="Categoría"
                value={nuevaCategoria}
                onChangeText={setNuevaCategoria}
              />
              <TextInput
                style={styles.input}
                placeholder="Monto usado (opcional)"
                keyboardType="numeric"
                value={nuevoUsado}
                onChangeText={setNuevoUsado}
              />
              <TextInput
                style={styles.input}
                placeholder="Límite"
                keyboardType="numeric"
                value={nuevoLimite}
                onChangeText={setNuevoLimite}
              />

              <View style={styles.modalButtons}>
                <Pressable
                  style={[styles.modalButton, { backgroundColor: "#1089ff" }]}
                  onPress={agregarPresupuesto}
                >
                  <Text style={styles.modalButtonText}>Guardar</Text>
                </Pressable>

                <Pressable
                  style={[styles.modalButton, { backgroundColor: "#aaa" }]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.modalButtonText}>Cancelar</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f4f6fb" },
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 15, color: "#333" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
  },
  row: { flexDirection: "row", justifyContent: "space-between" },
  categoria: { fontSize: 16, fontWeight: "600", color: "#333" },
  monto: { fontSize: 14, color: "#666" },
  progressContainer: {
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    marginTop: 10,
  },
  progressBar: { height: "100%", borderRadius: 5 },
  fab: {
    position: "absolute",
    bottom: 25,
    right: 25,
    backgroundColor: "#1089ff",
    width: 55,
    height: 55,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  // 🪟 Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  modalButtonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
});
