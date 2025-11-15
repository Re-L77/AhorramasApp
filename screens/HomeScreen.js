import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { PieChart, BarChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

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
  color: (opacity = 1) => rgba(31, 41, 55, ${opacity}),
  barPercentage: 0.6,
  decimalPlaces: 0,
  strokeWidth: 2,
};

const DATA = [{ id: "1", title: "Item 1" }];

export default function HomeScreen() {
  const [expandedChart, setExpandedChart] = useState("pie");

  return (
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
                <Text style={styles.balanceAmount}>$1,000.00</Text>
              </View>

              {/* Stats Esenciales - Solo 2 items */}
              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <Text style={styles.statIcon}>📈</Text>
                  <Text style={styles.statAmountIncome}>+$6,000</Text>
                  <Text style={styles.statLabel}>Ingresos</Text>
                </View>

                <View style={styles.statCard}>
                  <Text style={styles.statIcon}>📉</Text>
                  <Text style={styles.statAmountExpense}>-$5,000</Text>
                  <Text style={styles.statLabel}>Gastos</Text>
                </View>
              </View>
            </View>

            {/* Chart Toggle - Limpio y simple */}
            <View style={styles.chartsContainer}>
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
              {expandedChart === "pie" && (
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