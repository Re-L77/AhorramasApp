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
  ScrollView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BarChart } from "react-native-chart-kit";

let WebIcons;
if (Platform.OS === "web") {
  WebIcons = require("react-icons/io5");
}

const screenWidth = Dimensions.get("window").width;

export default function BudgetScreen() {
  const [data, setData] = useState([
    { id: "1", categoria: "Comida", usado: 300, limite: 500 },
    { id: "2", categoria: "Transporte", usado: 120, limite: 300 },
    { id: "3", categoria: "Hogar", usado: 400, limite: 600 },
    { id: "4", categoria: "Servicios", usado: 250, limite: 400 },
    { id: "5", categoria: "Educación", usado: 150, limite: 300 },
    { id: "6", categoria: "Ahorro", usado: 200, limite: 500 },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [nuevaCategoria, setNuevaCategoria] = useState("");
  const [nuevoUsado, setNuevoUsado] = useState("");
  const [nuevoLimite, setNuevoLimite] = useState("");
  const [error, setError] = useState(""); // 🔹 Para mostrar mensajes de validación

  const agregarPresupuesto = () => {
    // 🔸 Validaciones básicas
    if (!nuevaCategoria.trim()) {
      setError("Por favor, ingresa una categoría.");
      return;
    }
    if (!nuevoLimite.trim() || isNaN(nuevoLimite)) {
      setError("Por favor, ingresa un límite válido.");
      return;
    }

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
    setError(""); // limpia error al guardar
  };

  // 🎨 Datos para el gráfico de barras
  const barData = {
    labels: data.map((item) => item.categoria),
    datasets: [
      {
        data: data.map((item) => item.usado),
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    color: (opacity = 1) => `rgba(16, 137, 255, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.6,
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Presupuestos</Text>

        {/* 🧾 Lista de categorías */}
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

        {/* 📊 Gráfico resumen */}
        <Text style={styles.subtitle}>Comparación de uso</Text>
        <BarChart
          data={barData}
          width={screenWidth - 20}
          height={280}
          yAxisLabel="$"
          fromZero
          chartConfig={chartConfig}
          showValuesOnTopOfBars
          style={{ marginVertical: 10, borderRadius: 12 }}
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

              {/* 🔴 Mensaje de error si falta algo */}
              {error ? (
                <Text style={styles.errorText}>{error}</Text>
              ) : null}

                <TextInput
                  style={styles.input}
                  placeholder="Categoría"
                  placeholderTextColor="#888"
                  value={nuevaCategoria}
                  onChangeText={(text) => {
                    setNuevaCategoria(text);
                    setError("");
                  }}
                />

                <TextInput
                  style={styles.input}
                  placeholder="Monto usado"
                  placeholderTextColor="#888"
                  keyboardType="numeric"
                  value={nuevoUsado}
                  onChangeText={(text) => {
                    setNuevoUsado(text);
                    setError("");
                  }}
                />

                <TextInput
                  style={styles.input}
                  placeholder="Límite mensual"
                  placeholderTextColor="#888"
                  keyboardType="numeric"
                  value={nuevoLimite}
                  onChangeText={(text) => {
                    setNuevoLimite(text);
                    setError("");
                  }}
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
                  onPress={() => {
                    setModalVisible(false);
                    setError("");
                  }}
                >
                  <Text style={styles.modalButtonText}>Cancelar</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f4f6fb" },
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 15, color: "#333" },
  subtitle: { fontSize: 18, fontWeight: "bold", marginTop: 15, color: "#333" },
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
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 8,
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
