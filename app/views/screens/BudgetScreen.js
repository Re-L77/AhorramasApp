import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Platform,
  Modal,
  TextInput,
  Pressable,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from '../../hooks/useAuth';
import { Budget } from '../../models/Budget';
import { BudgetController } from '../../controllers/BudgetController';
import { TransactionController } from '../../controllers/TransactionController';
import { Notification } from '../../models/Notification';

let WebIcons;
if (Platform.OS === "web") {
  WebIcons = require("react-icons/io5");
}

const screenWidth = Dimensions.get("window").width;

export default function BudgetScreen() {
  const { usuario } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [nuevaCategoria, setNuevaCategoria] = useState("");
  const [nuevoLimite, setNuevoLimite] = useState("");
  const [error, setError] = useState("");
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [presupuestoAEliminar, setPresupuestoAEliminar] = useState(null);

  useEffect(() => {
    if (usuario?.id) {
      cargarPresupuestos();
    }
  }, [usuario]);

  // Recargar presupuestos cada vez que la pantalla recibe el foco
  useFocusEffect(
    React.useCallback(() => {
      if (usuario?.id) {
        cargarPresupuestos();
      }
    }, [usuario])
  );

  const cargarPresupuestos = async () => {
    try {
      setLoading(true);
      if (!usuario?.id) {
        console.log('Usuario no disponible, esperando...');
        setLoading(false);
        return;
      }

      const ahora = new Date();
      const mes = ahora.getMonth() + 1;
      const año = ahora.getFullYear();

      console.log(`📦 Cargando presupuestos para usuario ${usuario.id}, mes ${mes}/${año}`);

      // Primero cargar los presupuestos
      const presupuestos = await Budget.obtenerPresupuestosUsuario(
        usuario.id,
        mes,
        año
      );

      console.log(`📦 Presupuestos cargados:`, presupuestos.map(p => ({ id: p.id, categoria: p.categoria, montoActual: p.montoActual, montoLimite: p.montoLimite })));

      // Luego intentar recalcular presupuestos (si está disponible)
      try {
        if (TransactionController.recalcularPresupuestos) {
          console.log('🔄 Iniciando recálculo de presupuestos...');
          await TransactionController.recalcularPresupuestos(usuario.id, mes, año);
          console.log('✅ Presupuestos recalculados exitosamente');

          // Recargar los presupuestos después del recálculo
          const presupuestosActualizados = await Budget.obtenerPresupuestosUsuario(
            usuario.id,
            mes,
            año
          );
          console.log(`📦 Presupuestos después del recálculo:`, presupuestosActualizados.map(p => ({ id: p.id, categoria: p.categoria, montoActual: p.montoActual, montoLimite: p.montoLimite })));

          // Transformar datos para la pantalla
          const datosTransformados = presupuestosActualizados.map((p) => ({
            id: p.id?.toString() || Date.now().toString(),
            categoria: p.categoria,
            usado: p.montoActual || 0,
            limite: p.montoLimite,
          }));

          setData(datosTransformados);
        } else {
          // Transformar datos para la pantalla
          const datosTransformados = presupuestos.map((p) => ({
            id: p.id?.toString() || Date.now().toString(),
            categoria: p.categoria,
            usado: p.montoActual || 0,
            limite: p.montoLimite,
          }));

          setData(datosTransformados);
        }
      } catch (recalcErr) {
        console.warn("No se pudo recalcular presupuestos:", recalcErr);

        // Transformar datos para la pantalla sin recalcular
        const datosTransformados = presupuestos.map((p) => ({
          id: p.id?.toString() || Date.now().toString(),
          categoria: p.categoria,
          usado: p.montoActual || 0,
          limite: p.montoLimite,
        }));

        setData(datosTransformados);
      }
    } catch (err) {
      console.error("Error al cargar presupuestos:", err);
      setError("Error al cargar presupuestos");
    } finally {
      setLoading(false);
    }
  };

  const agregarPresupuesto = async () => {
    if (!nuevaCategoria.trim()) {
      setError("Por favor, ingresa una categoría.");
      return;
    }
    if (!nuevoLimite.trim() || isNaN(nuevoLimite)) {
      setError("Por favor, ingresa un límite válido.");
      return;
    }

    try {
      if (!usuario?.id) {
        setError("Usuario no autenticado. Por favor recarga la pantalla.");
        return;
      }

      // Usar BudgetController en lugar de Budget directamente
      const resultado = await BudgetController.crearPresupuesto(
        usuario.id,
        nuevaCategoria.trim(),
        parseFloat(nuevoLimite)
      );

      if (!resultado.success) {
        setError(resultado.error || "Error al crear presupuesto");
        return;
      }

      // Recargar presupuestos
      await cargarPresupuestos();

      // Limpiar modal
      setModalVisible(false);
      setNuevaCategoria("");
      setNuevoLimite("");
      setError("");
    } catch (err) {
      console.error("Error al crear presupuesto:", err);
      setError(err.message || "Error al crear presupuesto");
    }
  };

  const confirmarEliminacion = async () => {
    try {
      if (!presupuestoAEliminar?.id) {
        setError("Error: No se pudo identificar el presupuesto a eliminar");
        return;
      }

      const resultado = await BudgetController.eliminarPresupuesto(
        parseInt(presupuestoAEliminar.id)
      );

      if (!resultado.success) {
        setError(resultado.error || "Error al eliminar presupuesto");
        return;
      }

      // Crear notificación de eliminación
      if (usuario?.id) {
        await Notification.crearNotificacion(
          usuario.id,
          '🗑️ Presupuesto eliminado',
          `Se eliminó el presupuesto de ${presupuestoAEliminar.categoria}`,
          'info',
          new Date().toISOString()
        );
      }

      // Recargar presupuestos
      await cargarPresupuestos();

      // Cerrar modal
      setDeleteModalVisible(false);
      setPresupuestoAEliminar(null);
    } catch (err) {
      console.error("Error al eliminar presupuesto:", err);
      setError(err.message || "Error al eliminar presupuesto");
    }
  };

  // Calcular totales
  const totalUsado = data.reduce((sum, item) => sum + item.usado, 0);
  const totalLimite = data.reduce((sum, item) => sum + item.limite, 0);
  const porcentajeUsado = totalLimite > 0 ? (totalUsado / totalLimite) * 100 : 0;

  // Colores para las categorías
  const colors = {
    Alimentación: "#F97316",
    Transporte: "#06B6D4",
    Servicios: "#8B5CF6",
    Entretenimiento: "#EC4899",
    Educación: "#10B981",
    Ahorro: "#6366F1",
    Hogar: "#8B5CF6",
  };

  const getColorForCategoria = (categoria) => {
    return colors[categoria] || "#1089ff";
  };

  const barData = {
    labels: data.map((item) => item.categoria),
    datasets: [
      {
        data: data.map((item) => item.usado),
      },
    ],
  };

  const pieData = data.map((item) => ({
    name: item.categoria,
    usado: item.usado,
    color: getColorForCategoria(item.categoria),
    legendFontColor: "#1F2937",
    legendFontSize: 12,
  }));

  const chartConfig = {
    backgroundGradientFrom: "#FFFFFF",
    backgroundGradientTo: "#F9FAFB",
    color: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.7,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
    formatYLabel: (value) => `$${parseInt(value)}`,
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading || !usuario?.id ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1089ff" />
          <Text style={styles.loadingText}>
            {!usuario?.id ? "Cargando usuario..." : "Cargando presupuestos..."}
          </Text>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <>
              {/* Header Card */}
              <View style={styles.headerCard}>
                <Text style={styles.headerTitle}>💰 Presupuestos</Text>

                {/* Balance Highlight */}
                <View style={styles.balanceContainer}>
                  <Text style={styles.balanceLabel}>Total Disponible</Text>
                  <Text style={styles.balanceAmount}>
                    ${(totalLimite - totalUsado).toFixed(2)}
                  </Text>
                </View>

                {/* Stats */}
                <View style={styles.statsRow}>
                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Usado</Text>
                    <Text style={[styles.statAmount, { color: "#1089ff" }]}>
                      ${totalUsado.toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Total</Text>
                    <Text style={[styles.statAmount, { color: "#6B7280" }]}>
                      ${totalLimite.toFixed(2)}
                    </Text>
                  </View>
                </View>

                {/* Progreso General */}
                <View style={styles.progressGeneralContainer}>
                  <View style={styles.progressGeneralLabel}>
                    <Text style={styles.progressLabel}>Progreso General</Text>
                    <Text style={styles.progressPercent}>
                      {porcentajeUsado.toFixed(0)}%
                    </Text>
                  </View>
                  <View style={styles.progressBarContainer}>
                    <View
                      style={[
                        styles.progressBarFill,
                        { width: `${Math.min(porcentajeUsado, 100)}%` },
                      ]}
                    />
                  </View>
                </View>
              </View>

              {/* Gráfico de Donitas */}
              {data.length > 0 && (
                <View style={styles.chartContainer}>
                  <View style={styles.chartHeaderRow}>
                    <Text style={styles.chartTitle}>🍰 Distribución de Gastos</Text>
                    <Text style={styles.chartSubtitle}>
                      proporción por categoría
                    </Text>
                  </View>
                  <View style={styles.donutChartWrapper}>
                    <View style={styles.donutContainer}>
                      {data.map((item, index) => {
                        const totalGastos = data.reduce(
                          (sum, d) => sum + d.usado,
                          0
                        );
                        const porcentaje =
                          totalGastos > 0
                            ? (item.usado / totalGastos) * 100
                            : 0;
                        const itemColor = getColorForCategoria(item.categoria);

                        return (
                          <View
                            key={item.id}
                            style={[
                              styles.donutSegment,
                              {
                                backgroundColor: itemColor,
                                width: `${porcentaje}%`,
                              },
                            ]}
                          />
                        );
                      })}
                    </View>
                    <View style={styles.legendContainer}>
                      {data.map((item, index) => {
                        const totalGastos = data.reduce(
                          (sum, d) => sum + d.usado,
                          0
                        );
                        const porcentaje =
                          totalGastos > 0
                            ? (item.usado / totalGastos) * 100
                            : 0;
                        const itemColor = getColorForCategoria(item.categoria);

                        return (
                          <View key={index} style={styles.legendItem}>
                            <View
                              style={[
                                styles.legendDot,
                                { backgroundColor: itemColor },
                              ]}
                            />
                            <Text style={styles.legendText}>
                              {item.categoria}: {porcentaje.toFixed(1)}%
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  </View>
                </View>
              )}
            </>
          }
          renderItem={({ item }) => {
            const progreso = (item.usado / item.limite) * 100;
            const isOverBudget = progreso > 100;
            const itemColor = getColorForCategoria(item.categoria);

            return (
              <View style={styles.budgetCard}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardCategoria}>{item.categoria}</Text>
                  <View style={styles.cardHeaderRight}>
                    <Text
                      style={[
                        styles.cardProgreso,
                        isOverBudget && styles.cardProgresoOver,
                        {
                          borderColor: itemColor,
                          backgroundColor: itemColor + "15",
                        },
                      ]}
                    >
                      {progreso.toFixed(0)}%
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        setPresupuestoAEliminar(item);
                        setDeleteModalVisible(true);
                      }}
                      style={styles.deleteButtonSmall}
                    >
                      <Text style={styles.deleteButtonSmallText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.cardMonto}>
                  <Text style={[styles.cardMontoUsado, { color: itemColor }]}>
                    ${item.usado}
                  </Text>
                  <Text style={styles.cardMontoSeparator}>/</Text>
                  <Text style={styles.cardMontoLimite}>${item.limite}</Text>
                </View>

                <View style={styles.progressContainer}>
                  <View
                    style={[
                      styles.progressBar,
                      {
                        width: `${Math.min(progreso, 100)}%`,
                        backgroundColor: isOverBudget ? "#DC2626" : itemColor,
                      },
                    ]}
                  />
                </View>

                {isOverBudget && (
                  <Text style={styles.overBudgetText}>
                    ⚠️ Excedido por ${(item.usado - item.limite).toFixed(2)}
                  </Text>
                )}
              </View>
            );
          }}
          ListEmptyComponent={
            !loading && data.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  No tienes presupuestos registrados
                </Text>
                <Text style={styles.emptySubtext}>
                  Presiona el botón "+" para crear uno
                </Text>
              </View>
            ) : null
          }
          ListFooterComponent={<View style={{ height: 120 }} />}
          contentContainerStyle={styles.listContainer}
          scrollEnabled={true}
        />
      )}

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.fabText}>➕ Nuevo</Text>
      </TouchableOpacity>

      {/* Modal para agregar presupuesto */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nuevo Presupuesto</Text>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  setError("");
                  setNuevaCategoria("");
                  setNuevoLimite("");
                }}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TextInput
              style={styles.input}
              placeholder="Categoría (ej: Alimentación)"
              placeholderTextColor="#D1D5DB"
              value={nuevaCategoria}
              onChangeText={(text) => {
                setNuevaCategoria(text);
                setError("");
              }}
            />

            <TextInput
              style={styles.input}
              placeholder="Límite mensual ($)"
              placeholderTextColor="#D1D5DB"
              keyboardType="decimal-pad"
              value={nuevoLimite}
              onChangeText={(text) => {
                setNuevoLimite(text);
                setError("");
              }}
            />

            <Text style={styles.infoText}>
              💡 El monto usado se calcula automáticamente desde tus transacciones
            </Text>

            <View style={styles.modalButtons}>
              <Pressable
                style={styles.cancelButton}
                onPress={() => {
                  setModalVisible(false);
                  setError("");
                  setNuevaCategoria("");
                  setNuevoLimite("");
                }}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </Pressable>

              <Pressable
                style={styles.saveButton}
                onPress={agregarPresupuesto}
              >
                <Text style={styles.saveButtonText}>Guardar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de confirmación de eliminación */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.deleteModalOverlay}>
          <View style={styles.deleteModalContent}>
            <Text style={styles.deleteModalTitle}>
              ¿Eliminar presupuesto?
            </Text>
            <Text style={styles.deleteModalMessage}>
              ¿Estás seguro de que deseas eliminar el presupuesto de{" "}
              <Text style={{ fontWeight: "700" }}>
                {presupuestoAEliminar?.categoria}
              </Text>
              ?
            </Text>
            <Text style={styles.deleteModalWarning}>
              Esta acción no se puede deshacer.
            </Text>

            <View style={styles.deleteModalButtons}>
              <Pressable
                style={styles.deleteModalCancel}
                onPress={() => {
                  setDeleteModalVisible(false);
                  setPresupuestoAEliminar(null);
                }}
              >
                <Text style={styles.deleteModalCancelText}>Cancelar</Text>
              </Pressable>

              <Pressable
                style={styles.deleteModalConfirm}
                onPress={confirmarEliminacion}
              >
                <Text style={styles.deleteModalConfirmText}>Eliminar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6B7280",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6B7280",
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 8,
    textAlign: "center",
  },
  listContainer: {
    paddingHorizontal: 12,
    paddingBottom: 100,
  },
  headerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 12,
  },
  balanceContainer: {
    backgroundColor: "#1089ff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  balanceLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(255,255,255,0.8)",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    marginTop: 8,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  statAmount: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 6,
  },
  progressGeneralContainer: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
  },
  progressGeneralLabel: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1089ff",
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#1089ff",
    borderRadius: 4,
  },
  budgetCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    borderWidth: 0.8,
    borderColor: "#F5F5F7",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 3,
    elevation: 0,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardCategoria: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  cardHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  deleteButtonSmall: {
    backgroundColor: "#FEE2E2",
    width: 28,
    height: 28,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButtonSmallText: {
    fontSize: 14,
    color: "#DC2626",
    fontWeight: "700",
  },
  cardProgreso: {
    fontSize: 11,
    fontWeight: "700",
    color: "#0F766E",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: "#7DD3C0",
    backgroundColor: "#ECFDF5",
  },
  cardProgresoOver: {
    color: "#DC2626",
    backgroundColor: "#FEE2E2",
  },
  cardMonto: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  cardMontoUsado: {
    fontSize: 15,
    fontWeight: "700",
  },
  cardMontoSeparator: {
    fontSize: 13,
    color: "#A0A9B8",
  },
  cardMontoLimite: {
    fontSize: 13,
    fontWeight: "600",
    color: "#7B8590",
  },
  progressContainer: {
    height: 5,
    backgroundColor: "#E8E9EB",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 6,
  },
  progressBar: {
    height: "100%",
    borderRadius: 3,
  },
  overBudgetText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#DC2626",
    marginTop: 4,
  },
  chartContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginTop: 18,
    marginBottom: 18,
    marginHorizontal: 2,
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  chartHeaderRow: {
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },
  chartSubtitle: {
    fontSize: 12,
    fontWeight: "500",
    color: "#9CA3AF",
  },
  donutChartWrapper: {
    backgroundColor: "#F9FAFB",
    borderRadius: 14,
    padding: 18,
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
    alignItems: "center",
    gap: 18,
  },
  donutContainer: {
    width: "100%",
    height: 20,
    borderRadius: 10,
    overflow: "hidden",
    flexDirection: "row",
    backgroundColor: "#E8E9EB",
  },
  donutSegment: {
    height: "100%",
  },
  legendContainer: {
    marginTop: 20,
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 16,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#5F6775",
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: Platform.OS === "ios" ? 30 : 20,
    backgroundColor: "#1089ff",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 20,
    shadowColor: "#1089ff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  fabText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
  },
  closeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
  },
  closeButtonText: {
    fontSize: 18,
    color: "#6B7280",
  },
  input: {
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    fontSize: 14,
    color: "#1F2937",
    marginBottom: 12,
  },
  infoText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6B7280",
    marginBottom: 16,
    paddingHorizontal: 4,
    fontStyle: "italic",
  },
  errorText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#DC2626",
    marginBottom: 12,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#6B7280",
  },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#1089ff",
    justifyContent: "center",
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  deleteModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteModalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 20,
    width: "90%",
    maxWidth: 320,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  deleteModalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 12,
  },
  deleteModalMessage: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 8,
    lineHeight: 20,
  },
  deleteModalWarning: {
    fontSize: 12,
    color: "#DC2626",
    marginBottom: 20,
    fontWeight: "500",
  },
  deleteModalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  deleteModalCancel: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteModalCancelText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  deleteModalConfirm: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#DC2626",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteModalConfirmText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});