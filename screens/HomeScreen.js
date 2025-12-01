import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { PieChart, BarChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRoute, useFocusEffect } from "@react-navigation/native";
import { TransactionController } from "../controllers/TransactionController";
import { BudgetController } from "../controllers/BudgetController";

const screenWidth = Dimensions.get("window").width;

// Colores para las categorías (iguales a BudgetScreen)
const colors = {
  Comida: "#F97316",
  Transporte: "#06B6D4",
  Hogar: "#8B5CF6",
  Servicios: "#EC4899",
  Educación: "#10B981",
  Ahorro: "#6366F1",
};

const dataPie = [
  {
    name: "Hogar",
    population: 40,
    color: colors.Hogar,
    legendFontColor: "#1F2937",
    legendFontSize: 13,
  },
  {
    name: "Servicios",
    population: 20,
    color: colors.Servicios,
    legendFontColor: "#1F2937",
    legendFontSize: 13,
  },
  {
    name: "Entretenimiento",
    population: 15,
    color: colors.Educación,
    legendFontColor: "#1F2937",
    legendFontSize: 13,
  },
  {
    name: "Educación",
    population: 15,
    color: colors.Comida,
    legendFontColor: "#1F2937",
    legendFontSize: 13,
  },
  {
    name: "Ahorro",
    population: 10,
    color: colors.Ahorro,
    legendFontColor: "#1F2937",
    legendFontSize: 13,
  },
];

const dataBar = {
  labels: ["Ingresos", "Gastos"],
  datasets: [
    {
      data: [6000, 5000],
      colors: [(opacity = 1) => colors.Hogar, (opacity = 1) => colors.Comida],
    },
  ],
};

const chartConfig = {
  backgroundGradientFrom: "#FFFFFF",
  backgroundGradientTo: "#FFFFFF",
  color: (opacity = 1) => `rgba(31, 41, 55, ${opacity})`,
  barPercentage: 0.6,
  decimalPlaces: 0,
  strokeWidth: 2,
};

const DATA = [{ id: "1", title: "Item 1" }];

export default function HomeScreen() {
  const [expandedChart, setExpandedChart] = useState("pie");
  const [cargando, setCargando] = useState(true);
  const [balanceTotal, setBalanceTotal] = useState(0);
  const [totalIngresos, setTotalIngresos] = useState(0);
  const [totalGastos, setTotalGastos] = useState(0);
  const [dataPie, setDataPie] = useState([]);
  const [dataBar, setDataBar] = useState({
    labels: ["Ingresos", "Gastos"],
    datasets: [
      {
        data: [0, 0],
        colors: [(opacity = 1) => "#6366F1", (opacity = 1) => "#F97316"],
      },
    ],
  });
  const route = useRoute();
  const userId = route.params?.userId;

  useEffect(() => {
    cargarDatos();
  }, [userId]);

  useFocusEffect(
    React.useCallback(() => {
      // Recargar datos cada vez que la pantalla obtiene el foco
      cargarDatos();
    }, [userId])
  );

  const cargarDatos = async () => {
    try {
      setCargando(true);
      console.log('Cargando datos para userId:', userId);

      // Obtener transacciones del usuario
      const resultadoTransacciones = await TransactionController.obtenerTransacciones(userId);
      console.log('Resultado transacciones:', resultadoTransacciones);

      // Obtener presupuestos del usuario
      const resultadoPresupuestos = await BudgetController.obtenerPresupuestos(userId);

      if (resultadoTransacciones.success && resultadoTransacciones.transacciones) {
        const transacciones = resultadoTransacciones.transacciones;

        // Calcular totales
        let ingresos = 0;
        let gastos = 0;
        const categoriaGastos = {};

        transacciones.forEach((trans) => {
          if (trans.tipo === "ingreso") {
            ingresos += trans.monto;
          } else {
            gastos += trans.monto;
            const categoria = trans.categoria || "Otros";
            categoriaGastos[categoria] = (categoriaGastos[categoria] || 0) + trans.monto;
          }
        });

        const balance = ingresos - gastos;

        setTotalIngresos(ingresos);
        setTotalGastos(gastos);
        setBalanceTotal(balance);

        // Actualizar gráfico de barras
        setDataBar({
          labels: ["Ingresos", "Gastos"],
          datasets: [
            {
              data: [ingresos, gastos],
              colors: [(opacity = 1) => "#10B981", (opacity = 1) => "#F97316"],
            },
          ],
        });

        // Construir datos para gráfico de pastel
        const pieData = Object.entries(categoriaGastos).map(([categoria, monto]) => ({
          name: categoria,
          population: monto,
          color: colors[categoria] || "#6366F1",
          legendFontColor: "#1F2937",
          legendFontSize: 13,
        }));

        setDataPie(pieData.length > 0 ? pieData : [
          {
            name: "Sin gastos",
            population: 1,
            color: "#E5E7EB",
            legendFontColor: "#1F2937",
            legendFontSize: 13,
          },
        ]);
      }

      setCargando(false);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      setCargando(false);
    }
  }; return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={DATA}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <>
            {/* Header Card - Minimalista */}
            <View style={styles.headerCard}>
              <Text style={styles.headerGreeting}>📊 Resumen</Text>

              {/* Balance Principal - Lo más importante */}
              <View style={styles.balanceContainer}>
                <Text style={styles.balanceLabel}>Balance Total</Text>
                <Text style={styles.balanceAmount}>${balanceTotal.toFixed(2)}</Text>
              </View>

              {/* Stats Esenciales - Solo 2 items */}
              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <Text style={styles.statIcon}>📈</Text>
                  <Text style={styles.statAmountIncome}>+${totalIngresos.toFixed(2)}</Text>
                  <Text style={styles.statLabel}>Ingresos</Text>
                </View>

                <View style={styles.statCard}>
                  <Text style={styles.statIcon}>📉</Text>
                  <Text style={styles.statAmountExpense}>-${totalGastos.toFixed(2)}</Text>
                  <Text style={styles.statLabel}>Gastos</Text>
                </View>
              </View>
            </View>

            {/* Chart Toggle - Limpio y simple */}
            <View style={styles.chartsContainer}>
              {cargando ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#1089ff" />
                </View>
              ) : (
                <>
                  <View style={styles.chartToggleContainer}>
                    <TouchableOpacity
                      style={[
                        styles.chartToggleBtn,
                        expandedChart === "pie" && styles.chartToggleBtnActive,
                      ]}
                      onPress={() => setExpandedChart("pie")}
                    >
                      <Text
                        style={[
                          styles.chartToggleBtnText,
                          expandedChart === "pie" && styles.chartToggleBtnTextActive,
                        ]}
                      >
                        {expandedChart === "pie" ? "● Distribución" : "○ Distribución"}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.chartToggleBtn,
                        expandedChart === "bar" && styles.chartToggleBtnActive,
                      ]}
                      onPress={() => setExpandedChart("bar")}
                    >
                      <Text
                        style={[
                          styles.chartToggleBtnText,
                          expandedChart === "bar" && styles.chartToggleBtnTextActive,
                        ]}
                      >
                        {expandedChart === "bar" ? "● Comparativa" : "○ Comparativa"}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Pie Chart */}
                  {expandedChart === "pie" && dataPie.length > 0 && (
                    <View style={styles.chartSection}>
                      <View style={styles.chartWrapper}>
                        <PieChart
                          data={dataPie}
                          width={screenWidth - 60}
                          height={200}
                          chartConfig={chartConfig}
                          accessor={"population"}
                          backgroundColor={"transparent"}
                          paddingLeft={"10"}
                          absolute
                        />
                      </View>
                    </View>
                  )}

                  {/* Bar Chart */}
                  {expandedChart === "bar" && (
                    <View style={styles.chartSection}>
                      <View style={styles.chartWrapper}>
                        <BarChart
                          data={dataBar}
                          width={screenWidth - 60}
                          height={200}
                          yAxisLabel="$"
                          chartConfig={chartConfig}
                          verticalLabelRotation={0}
                          showValuesOnTopOfBars
                          fromZero
                        />
                      </View>
                    </View>
                  )}
                </>
              )}
            </View>
          </>
        }
        renderItem={() => null}
        scrollEnabled={true}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  listContainer: {
    paddingBottom: 80,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 100,
  },

  // Header Card - Minimalista
  headerCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 15,
    marginTop: 15,
    marginBottom: 15,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  headerGreeting: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 12,
  },

  // Balance Container - Lo más importante
  balanceContainer: {
    backgroundColor: "#1089ff",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  balanceLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(255,255,255,0.9)",
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  // Stats Grid - Solo 2 items limpios
  statsGrid: {
    flexDirection: "row",
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#6B7280",
    marginTop: 4,
  },
  statAmountIncome: {
    fontSize: 14,
    fontWeight: "700",
    color: "#059669",
  },
  statAmountExpense: {
    fontSize: 14,
    fontWeight: "700",
    color: "#DC2626",
  },

  // Charts Container
  chartsContainer: {
    marginHorizontal: 15,
    marginBottom: 20,
  },
  chartToggleContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  chartToggleBtn: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    alignItems: "center",
  },
  chartToggleBtnActive: {
    backgroundColor: "#1089ff",
    borderColor: "#1089ff",
  },
  chartToggleBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1F2937",
  },
  chartToggleBtnTextActive: {
    color: "#FFFFFF",
    fontWeight: "900",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },

  // Chart Section
  chartSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  chartWrapper: {
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    padding: 8,
  },
});
