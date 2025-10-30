import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TransactionsScreen from "../screens/TransactionsScreen";
import BudgetsScreen from "../screens/BudgetsScreen";
import ChartsScreen from "../screens/ChartsScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Transacciones" component={TransactionsScreen} />
      <Tab.Screen name="Presupuestos" component={BudgetsScreen} />
      <Tab.Screen name="Gráficas" component={ChartsScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
