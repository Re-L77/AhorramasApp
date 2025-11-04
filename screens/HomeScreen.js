import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions, FlatList } from "react-native";
import { PieChart, BarChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";

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
    legendFontColor: "#333",
    legendFontSize: 14,
  },
  {
    name: "Servicios",
    population: 20,
    color: colors.Servicios,
    legendFontColor: "#333",
    legendFontSize: 14,
  },
  {
    name: "Entretenimiento",
    population: 15,
    color: colors.Educación,
    legendFontColor: "#333",
    legendFontSize: 14,
  },
  {
    name: "Educación",
    population: 15,
    color: colors.Comida,
    legendFontColor: "#333",
    legendFontSize: 14,
  },
  {
    name: "Ahorro",
    population: 10,
    color: colors.Ahorro,
    legendFontColor: "#333",
    legendFontSize: 14,
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
  backgroundGradientFrom: "#fff",
  backgroundGradientTo: "#fff",
  color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
  barPercentage: 0.5,
  decimalPlaces: 0,
};

const DATA = [{ id: "1", title: "Item 1" }];

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={DATA}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <>
            {/* Header Card */}
            <View style={styles.headerCard}>
              <Text style={styles.headerTitle}>📊 Resumen General</Text>

              {/* Balance Highlight */}
              <View style={styles.balanceContainer}>
                <Text style={styles.balanceLabel}>Balance Total</Text>
                <Text style={styles.balanceAmount}>$1,000.00</Text>
              </View>

              {/* Stats */}
              <View style={styles.statsRow}>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>Ingresos</Text>
                  <Text style={[styles.statAmount, { color: "#059669" }]}>
                    $6,000.00
                  </Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>Gastos</Text>
                  <Text style={[styles.statAmount, { color: "#DC2626" }]}>
                    $5,000.00
                  </Text>
                </View>
              </View>
            </View>

            {/* 🥧 Gráfico de pastel */}
            <View style={styles.chartSection}>
              <Text style={styles.chartTitle}>Distribución de Gastos</Text>
              <PieChart
                data={dataPie}
                width={screenWidth - 30}
                height={220}
                chartConfig={chartConfig}
                accessor={"population"}
                backgroundColor={"transparent"}
                paddingLeft={"10"}
                absolute
              />

              {/* 📊 Leyenda */}
              <View style={styles.legendContainer}>
                {dataPie.map((item) => (
                  <View key={item.name} style={styles.legendItem}>
                    <View
                      style={[
                        styles.legendColor,
                        { backgroundColor: item.color },
                      ]}
                    />
                    <Text style={styles.legendText}>{item.name}</Text>
                    <Text style={styles.legendPercent}>{item.population}%</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* 📈 Gráfico de barras */}
            <View style={styles.chartSection}>
              <Text style={styles.chartTitle}>Ingresos vs Gastos</Text>
              <BarChart
                data={dataBar}
                width={screenWidth - 30}
                height={250}
                yAxisLabel="$"
                chartConfig={chartConfig}
                verticalLabelRotation={0}
                showValuesOnTopOfBars
                fromZero
              />
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
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  listContainer: { paddingBottom: 20 },

  // Header Card
  headerCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 15,
    marginTop: 15,
    marginBottom: 15,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 12,
  },
  balanceContainer: {
    marginBottom: 14,
  },
  balanceLabel: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1089ff",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
  },
  statAmount: {
    fontSize: 16,
    fontWeight: "600",
  },

  // Chart Sections
  chartSection: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 15,
    marginBottom: 15,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 12,
  },

  // Legend
  legendContainer: {
    width: "100%",
    marginTop: 16,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    justifyContent: "space-between",
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 10,
  },
  legendText: {
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  legendPercent: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
});
