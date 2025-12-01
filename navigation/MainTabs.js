import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import TransactionsScreen from "../screens/TransactionsScreen";
import BudgetScreen from "../screens/BudgetScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import ProfileStack from "./ProfileStack";
import { CustomBottomTab } from "./CustomBottomTab";

const Tab = createBottomTabNavigator();

export default function MainTabs({ route }) {
  const userId = route?.params?.userId;

  return (
    <Tab.Navigator
      initialRouteName="Inicio"
      screenOptions={({ route }) => ({
        headerShown: false,
      })}
      tabBar={(props) => <CustomBottomTab {...props} />}
    >
      <Tab.Screen
        name="Inicio"
        component={HomeScreen}
        initialParams={{ userId }}
      />
      <Tab.Screen
        name="Transacciones"
        component={TransactionsScreen}
        initialParams={{ userId }}
      />
      <Tab.Screen
        name="Presupuestos"
        component={BudgetScreen}
        initialParams={{ userId }}
      />
      <Tab.Screen
        name="Notificaciones"
        component={NotificationsScreen}
        initialParams={{ userId }}
      />
      <Tab.Screen
        name="Perfil"
        component={ProfileStack}
        initialParams={{ userId }}
      />
    </Tab.Navigator>
  );
}
