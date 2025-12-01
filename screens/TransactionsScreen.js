import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Pressable,
  Alert,
  Platform,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

// Importar módulos
import { formatCurrency } from "./utils/formatters";
import { validateCategoria, validateMonto } from "./utils/validations";
import { styles } from "./styles/transactionStyles";
import { TransactionFormModal } from "./components/TransactionFormModal";
import { DeleteConfirmModal } from "./components/DeleteConfirmModal";
import { TransactionListItem } from "./components/TransactionListItem";
import { useAuth } from "../hooks/useAuth";
import { TransactionController } from "../controllers/TransactionController";
import { Transaction } from "../models/Transaction";
import { Notification } from "../models/Notification";
import { Budget } from "../models/Budget";

export default function TransactionsScreen() {
  const { usuario } = useAuth();
  const [transacciones, setTransacciones] = useState([]);
  const [presupuestos, setPresupuestos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("Todos"); // Todos | ingreso | egreso
  const [ordenamiento, setOrdenamiento] = useState("reciente"); // reciente, antiguo, mayorGasto, menorGasto
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  // Estados para modales
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(null); // "nueva", "editar", "eliminar"
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    tipo: "egreso",
    categoria: "",
    monto: "",
    descripcion: "",
  });

  // Estados para errores de validación
  const [errors, setErrors] = useState({
    categoria: "",
    monto: "",
  });

  useEffect(() => {
    if (usuario?.id) {
      cargarTransacciones();
      cargarPresupuestos();
    }
  }, [usuario?.id]);

  useFocusEffect(
    React.useCallback(() => {
      if (usuario?.id) {
        cargarTransacciones();
        cargarPresupuestos();
      }
    }, [usuario?.id])
  );

  const cargarTransacciones = async () => {
    try {
      setLoading(true);
      if (!usuario?.id) {
        console.log('Usuario no disponible');
        setLoading(false);
        return;
      }

      const resultado = await TransactionController.obtenerTransacciones(usuario.id);

      if (resultado.success && Array.isArray(resultado.transacciones)) {
        // Transformar datos para la pantalla
        const datosTransformados = resultado.transacciones.map((t) => ({
          id: t.id,
          tipo: t.tipo === 'ingreso' ? 'Ingreso' : 'Gasto',
          monto: t.monto,
          categoria: t.categoria,
          descripcion: t.descripcion,
          fecha: t.fecha,
          icono: t.icono || getIconoByCategoria(t.categoria),
        }));

        // Ordenar de más reciente a más antigua por defecto
        datosTransformados.sort((a, b) => {
          // Extraer solo la fecha (YYYY-MM-DD) de ambas transacciones
          const fechaA = a.fecha ? a.fecha.split('T')[0] : '';
          const fechaB = b.fecha ? b.fecha.split('T')[0] : '';

          // Comparar fechas
          const compareFecha = fechaB.localeCompare(fechaA);
          if (compareFecha !== 0) {
            return compareFecha;
          }

          // Si las fechas son iguales, ordenar por ID descendente (más nuevas primero)
          return b.id - a.id;
        });

        console.log('📋 Transacciones después de ordenar:', datosTransformados.map(t => ({ id: t.id, fecha: t.fecha.split('T')[0], categoria: t.categoria, monto: t.monto })));
        setTransacciones(datosTransformados);
      } else {
        setTransacciones([]);
      }
    } catch (err) {
      console.error("Error al cargar transacciones:", err);
      setTransacciones([]);
    } finally {
      setLoading(false);
    }
  };

  const cargarPresupuestos = async () => {
    try {
      if (!usuario?.id) return;

      const hoy = new Date();
      const mes = hoy.getMonth() + 1; // getMonth() retorna 0-11
      const año = hoy.getFullYear();

      const resultado = await Budget.obtenerPresupuestosUsuario(usuario.id, mes, año);
      if (Array.isArray(resultado)) {
        setPresupuestos(resultado);
      } else {
        setPresupuestos([]);
      }
    } catch (err) {
      console.error("Error al cargar presupuestos:", err);
      setPresupuestos([]);
    }
  };

  const getIconoByCategoria = (categoria) => {
    const iconos = {
      'Alimentación': '🍔',
      'Transporte': '🚕',
      'Servicios': '💡',
      'Entretenimiento': '🎬',
      'Educación': '📚',
      'Ahorro': '🏦',
      'Hogar': '🏠',
      'Salud': '⚕️',
      'Ropa': '👕',
      'Otros': '📌',
      'Sueldo': '💼',
      'Freelance': '💻',
      'Bonificación': '💰',
      'Inversiones': '📈',
      'Comida': '🍔',
      'Cine': '🎬',
      'Farmacia': '💊',
      'Gasolina': '⛽',
      'Medicina': '💊',
      'Restaurante': '🍽️',
      'Medicinas': '💊',
      'Reembolso': '💸',
    };
    return iconos[categoria] || '💰';
  };

  const listaFiltrada = useMemo(() => {
    let resultado = transacciones.filter((t) => {
      // Filtro por tipo
      const porTipo = tipoFiltro === "Todos" || t.tipo === tipoFiltro;
      // Filtro por categoría
      const porCategoria =
        !filtro || t.categoria.toLowerCase().includes(filtro.toLowerCase());
      return porTipo && porCategoria;
    });

    // Aplicar ordenamiento
    if (ordenamiento === "mayorGasto") {
      resultado.sort((a, b) => b.monto - a.monto);
    } else if (ordenamiento === "menorGasto") {
      resultado.sort((a, b) => a.monto - b.monto);
    } else if (ordenamiento === "reciente") {
      // Ordenar por fecha descendente (más reciente primero)
      resultado.sort((a, b) => {
        const fechaA = a.fecha ? a.fecha.split('T')[0] : '';
        const fechaB = b.fecha ? b.fecha.split('T')[0] : '';
        const compareFecha = fechaB.localeCompare(fechaA);
        if (compareFecha !== 0) return compareFecha;
        return b.id - a.id;
      });
    } else if (ordenamiento === "antiguo") {
      // Ordenar por fecha ascendente (más antiguo primero)
      resultado.sort((a, b) => {
        const fechaA = a.fecha ? a.fecha.split('T')[0] : '';
        const fechaB = b.fecha ? b.fecha.split('T')[0] : '';
        const compareFecha = fechaA.localeCompare(fechaB);
        if (compareFecha !== 0) return compareFecha;
        return a.id - b.id;
      });
    }

    return resultado;
  }, [transacciones, filtro, tipoFiltro, ordenamiento]);

  const totals = useMemo(() => {
    let ingresos = 0;
    let gastos = 0;
    transacciones.forEach((t) => {
      if (t.tipo === "Ingreso") ingresos += Number(t.monto) || 0;
      if (t.tipo === "Gasto") gastos += Number(t.monto) || 0;
    });
    return {
      ingresos,
      gastos,
      balance: ingresos - gastos,
    };
  }, [transacciones]);

  const handleDelete = (id, categoria) => {
    setEditingItem({ id, categoria });
    setModalType("eliminar");
    setModalVisible(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      tipo: item.tipo === 'Ingreso' ? 'ingreso' : 'egreso',
      categoria: item.categoria,
      monto: item.monto.toString(),
      descripcion: item.descripcion || "",
      icono: item.icono || null,
    });
    setModalType("editar");
    setModalVisible(true);
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setFormData({
      tipo: "egreso",
      categoria: "",
      monto: "",
      descripcion: "",
      icono: null,
    });
    setModalType("nueva");
    setModalVisible(true);
    setErrors({ categoria: "", monto: "" });
  };

  const handleCategoriaChange = (text) => {
    setFormData({ ...formData, categoria: text });
    // Ya no necesitamos validar aquí porque el usuario selecciona de una lista
    setErrors({ ...errors, categoria: "" });
  };

  const handleMontoChange = (text) => {
    setFormData({ ...formData, monto: text });
    const error = validateMonto(text);
    setErrors({ ...errors, monto: error });
  };

  const handleSaveTransaction = async () => {
    // Validar campos
    const errorMonto = validateMonto(formData.monto);

    // Validar que se seleccionó una categoría
    const errorCategoria = !formData.categoria ? "Debe seleccionar una categoría" : "";

    setErrors({
      categoria: errorCategoria,
      monto: errorMonto,
    });

    // Si hay errores, mostrar alerta y no proceder
    if (errorCategoria || errorMonto) {
      const mensajes = [];
      if (errorCategoria) mensajes.push(`- ${errorCategoria}`);
      if (errorMonto) mensajes.push(`- ${errorMonto}`);
      Alert.alert("❌ Errores en el formulario", mensajes.join("\n"));
      return;
    }

    try {
      if (!usuario?.id) {
        Alert.alert("Error", "Usuario no autenticado");
        return;
      }

      // El icono se determina automáticamente por la categoría
      const iconoFinal = getIconoByCategoria(formData.categoria);

      if (editingItem) {
        // Editar transacción existente
        const resultado = await TransactionController.actualizarTransaccion(
          editingItem.id,
          formData.tipo,
          parseFloat(formData.monto),
          formData.descripcion,
          formData.categoria,
          formData.icono || null
        );

        if (!resultado.success) {
          Alert.alert("Error", resultado.error || "Error al actualizar transacción");
          return;
        }

        // Crear notificación de actualización
        await Notification.crearNotificacion(
          usuario.id,
          '✏️ Transacción actualizada',
          `Se actualizó la transacción de ${formData.categoria} a $${formData.monto}`,
          'info',
          new Date().toISOString()
        );
      } else {
        // Crear nueva transacción
        const resultado = await TransactionController.crearTransaccion(
          usuario.id,
          formData.tipo,
          parseFloat(formData.monto),
          formData.descripcion,
          formData.categoria,
          formData.icono || null
        );

        if (!resultado.success) {
          Alert.alert("Error", resultado.error || "Error al crear transacción");
          return;
        }
      }

      // Recargar transacciones
      await cargarTransacciones();

      setModalVisible(false);
      setFormData({
        tipo: "egreso",
        categoria: "",
        monto: "",
        descripcion: "",
        icono: null,
      });
      setEditingItem(null);
    } catch (err) {
      console.error("Error al guardar transacción:", err);
      Alert.alert("Error", err.message || "Error al guardar transacción");
    }
  };

  const handleConfirmDelete = async () => {
    try {
      if (!usuario?.id || !editingItem?.id) {
        Alert.alert("Error", "No se pudo identificar la transacción a eliminar");
        return;
      }

      const resultado = await TransactionController.eliminarTransaccion(
        editingItem.id,
        usuario.id
      );

      if (!resultado.success) {
        Alert.alert("Error", resultado.error || "Error al eliminar transacción");
        return;
      }

      // Crear notificación de eliminación
      await Notification.crearNotificacion(
        usuario.id,
        '🗑️ Transacción eliminada',
        `Se eliminó la transacción de ${editingItem.categoria} por $${editingItem.monto}`,
        'info',
        new Date().toISOString()
      );

      // Recargar transacciones
      await cargarTransacciones();

      setModalVisible(false);
      setEditingItem(null);
    } catch (err) {
      console.error("Error al eliminar transacción:", err);
      Alert.alert("Error", err.message || "Error al eliminar transacción");
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <View style={styles.loadingCard}>
          <ActivityIndicator size={50} color="#1089ff" />
          <Text style={styles.loadingText}>Cargando transacciones...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={listaFiltrada}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={
          <>
            {/* Header Card */}
            <View style={styles.headerCard}>
              <Text
                style={{ fontSize: 28, fontWeight: "700", color: "#1F2937" }}
              >
                💳 Transacciones
              </Text>

              {/* Balance Highlight */}
              <View style={styles.balanceContainer}>
                <Text style={styles.balanceLabel}>Balance Total</Text>
                <Text style={styles.balanceAmount}>
                  {formatCurrency(totals.balance)}
                </Text>
              </View>

              {/* Stats */}
              <View style={styles.statsRow}>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>Ingresos</Text>
                  <Text style={[styles.statAmount, { color: "#059669" }]}>
                    {formatCurrency(totals.ingresos)}
                  </Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>Gastos</Text>
                  <Text style={[styles.statAmount, { color: "#DC2626" }]}>
                    {formatCurrency(totals.gastos)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <TextInput
                placeholder="🔍 Buscar categoría..."
                placeholderTextColor="#D1D5DB"
                style={styles.searchInput}
                value={filtro}
                onChangeText={setFiltro}
              />
              <Pressable
                onPress={() => {
                  setFiltro("");
                  setTipoFiltro("Todos");
                  setOrdenamiento("reciente");
                }}
                style={styles.clearButton}
              >
                <Text style={{ fontSize: 16, color: "#6B7280" }}>✕</Text>
              </Pressable>
            </View>

            {/* Filter Buttons */}
            <View style={styles.filterRow}>
              {["Todos", "Ingreso", "Gasto"].map((t) => (
                <TouchableOpacity
                  key={t}
                  onPress={() => setTipoFiltro(t)}
                  style={[
                    styles.filterButton,
                    tipoFiltro === t && styles.filterButtonActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterText,
                      tipoFiltro === t && styles.filterTextActive,
                    ]}
                  >
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Sort Buttons */}
            <View style={styles.sortContainer}>
              <Text style={styles.sortLabel}>Ordenar por:</Text>
              <View style={styles.sortButtonsRow}>
                {[
                  { key: "reciente", label: "📅 Reciente" },
                  { key: "antiguo", label: "📅 Antiguo" },
                  { key: "mayorGasto", label: "📈 Mayor" },
                  { key: "menorGasto", label: "📉 Menor" },
                ].map(({ key, label }) => (
                  <TouchableOpacity
                    key={key}
                    onPress={() => setOrdenamiento(key)}
                    style={[
                      styles.sortButton,
                      ordenamiento === key && styles.sortButtonActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.sortButtonText,
                        ordenamiento === key && styles.sortButtonTextActive,
                      ]}
                    >
                      {label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No hay transacciones que coincidan
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TransactionListItem
            item={item}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
        contentContainerStyle={styles.listContainer}
        scrollEnabled={true}
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        onPress={handleAddNew}
        style={styles.floatingButton}
        activeOpacity={0.8}
      >
        <Text style={styles.floatingButtonText}>+ Nueva</Text>
      </TouchableOpacity>

      {/* MODALES */}
      {/* Modal Nueva/Editar Transacción */}
      <TransactionFormModal
        visible={
          modalVisible && (modalType === "nueva" || modalType === "editar")
        }
        modalType={modalType}
        formData={{ ...formData, tipo: formData.tipo === 'ingreso' ? 'Ingreso' : 'Gasto' }}
        errors={errors}
        onChangeTipo={(tipo) => setFormData({ ...formData, tipo: tipo === 'Ingreso' ? 'ingreso' : 'egreso' })}
        onChangeCategoria={handleCategoriaChange}
        onChangeMonto={handleMontoChange}
        onChangeIcono={(icono) => setFormData({ ...formData, icono })}
        onChangeDescripcion={(descripcion) => setFormData({ ...formData, descripcion })}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveTransaction}
        getIconoByCategoria={getIconoByCategoria}
        presupuestos={presupuestos}
      />

      {/* Modal Confirmar Eliminación */}
      <DeleteConfirmModal
        visible={modalVisible && modalType === "eliminar"}
        itemCategoria={editingItem?.categoria}
        onClose={() => setModalVisible(false)}
        onConfirm={handleConfirmDelete}
      />
    </SafeAreaView>
  );
}
