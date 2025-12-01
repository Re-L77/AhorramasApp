import React, { useState, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useRoute, useNavigation } from "@react-navigation/native";
import HomeScreen from '../views/screens/HomeScreen';
import TransactionsScreen from '../views/screens/TransactionsScreen';
import BudgetScreen from '../views/screens/BudgetScreen';
import NotificationsScreen from '../views/screens/NotificationsScreen';
import ProfileStack from "./ProfileStack";
import { CustomBottomTab } from "./CustomBottomTab";
import { useAuth } from '../hooks/useAuth';
import { Notification } from '../models/Notification';
import { eventBus } from '../services/EventBus';

const Tab = createBottomTabNavigator();

export default function MainTabs({ route: routeParams }) {
  const userId = routeParams?.params?.userId;
  const { usuario } = useAuth();
  const [notificationCount, setNotificationCount] = useState(0);
  const route = useRoute();
  const navigation = useNavigation();

  // Cargar conteo de notificaciones al iniciar
  useEffect(() => {
    if (usuario?.id) {
      cargarConteoNotificaciones();
    }
  }, [usuario?.id]);

  // Escuchar cambios en params cuando se actualiza desde NotificationsScreen
  useEffect(() => {
    if (route?.params?.unreadCount !== undefined) {
      setNotificationCount(route.params.unreadCount);
    }
  }, [route?.params?.notificationsUpdated]);

  // Recargar conteo cada vez que se enfoca en la navegación
  useEffect(() => {
    const unsubscribe = navigation?.addListener?.('focus', () => {
      if (usuario?.id) {
        cargarConteoNotificaciones();
      }
    });
    return () => unsubscribe?.();
  }, [usuario?.id, navigation]);

  // Escuchar eventos de notificaciones actualizadas desde eventBus
  useEffect(() => {
    const unsubscribe = eventBus.on('notificationsUpdated', () => {
      if (usuario?.id) {
        cargarConteoNotificaciones();
      }
    });
    return unsubscribe;
  }, [usuario?.id]);

  const cargarConteoNotificaciones = async () => {
    try {
      if (!usuario?.id) return;
      const notificaciones = await Notification.obtenerNotificacionesUsuario(usuario.id);
      if (Array.isArray(notificaciones)) {
        const noLeidas = notificaciones.filter(n => n.leida === 0).length;
        setNotificationCount(noLeidas);
      }
    } catch (error) {
      console.error('Error cargando conteo de notificaciones:', error);
    }
  };

  return (
    <Tab.Navigator
      initialRouteName="Inicio"
      screenOptions={({ route }) => ({
        headerShown: false,
      })}
      tabBar={(props) => <CustomBottomTab {...props} notificationCount={notificationCount} />}
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
