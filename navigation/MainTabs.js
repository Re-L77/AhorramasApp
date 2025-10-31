// navigation/MainTabs.js
import React from "react";
import { Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import TransactionsScreen from "../screens/TransactionsScreen";
import BudgetScreen from "../screens/BudgetScreen";

// ✅ Cargar íconos web solo si se ejecuta en navegador
let WebIcons;
if (Platform.OS === "web") {
  WebIcons = require("react-icons/io5");
}

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: "#f8f8f8", paddingBottom: 5, height: 60 },
        tabBarActiveTintColor: "#1089ff",
        tabBarInactiveTintColor: "gray",
        tabBarIcon: ({ color, size }) => {
          const isTransacciones = route.name === "Transacciones";

          // Nombres de íconos nativos
          const nativeIcon = isTransacciones ? "list-outline" : "wallet-outline";

          // Íconos para navegador (react-icons)
          const WebIcon = isTransacciones
            ? WebIcons?.IoListOutline
            : WebIcons?.IoWalletOutline;

          return Platform.OS === "web" ? (
            WebIcon ? (
              <WebIcon size={size} color={color} />
            ) : (
              <Text style={{ fontSize: size, color }}>{isTransacciones ? "📋" : "💰"}</Text>
            )
          ) : (
            <Ionicons name={nativeIcon} size={size} color={color} />
          );
        },
      })}
    >
      <Tab.Screen name="Presupuesto" component={BudgetScreen} />
    </Tab.Navigator>
  );
}
