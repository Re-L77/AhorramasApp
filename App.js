import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

// Importar tus pantallas
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
import TransactionsScreen from "./screens/TransactionsScreen";
import BudgetScreen from "./screens/BudgetScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Barra inferior (tabs)
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: "#f8f8f8", paddingBottom: 4 },
        tabBarActiveTintColor: "#0066cc",
        tabBarInactiveTintColor: "gray",
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Inicio") iconName = "home";
          else if (route.name === "Transacciones") iconName = "list";
          else if (route.name === "Presupuestos") iconName = "wallet";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Inicio" component={HomeScreen} />
      <Tab.Screen name="Transacciones" component={TransactionsScreen} />
      <Tab.Screen name="Presupuestos" component={BudgetScreen} />
    </Tab.Navigator>
  );
}

// Navegación principal (stack)
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Inicia con el login */}
        <Stack.Screen name="Login-" component={LoginScreen} />
        <Stack.Screen name="Register-" component={RegisterScreen} />
        {/* Cuando el usuario inicia sesión */}
        <Stack.Screen name="MainTabs" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
