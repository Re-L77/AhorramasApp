import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export function CustomBottomTab({ state, descriptors, navigation }) {
  const activeIndex = state.index;

  return (
    <View style={styles.container}>
      <View style={styles.tabsRow}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              preventDefault: () => {},
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const getIcon = (name) => {
            if (name === "Inicio") return "home";
            if (name === "Transacciones") return "card";
            if (name === "Presupuestos") return "pie-chart";
            if (name === "Perfil") return "settings";
            return "circle";
          };

          return (
            <TouchableOpacity
              key={route.key}
              style={[styles.tabButton, isFocused && styles.tabButtonActive]}
              onPress={onPress}
              activeOpacity={0.7}
            >
              <Ionicons
                name={getIcon(route.name)}
                size={isFocused ? 28 : 22}
                color={isFocused ? "#FFFFFF" : "#9CA3AF"}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    paddingBottom: 0,
    paddingHorizontal: 0,
  },
  tabsRow: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 8,
    paddingVertical: 12,
    shadowColor: "#1089ff",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
    justifyContent: "space-around",
    alignItems: "center",
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 18,
  },
  tabButtonActive: {
    backgroundColor: "#1089ff",
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 0,
  },
});
