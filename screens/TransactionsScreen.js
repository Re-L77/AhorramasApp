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
} from "react-native";
import { useNavigation } from "@react-navigation/native";

// Importar módulos
import { formatCurrency } from "./utils/formatters";
import { validateCategoria, validateMonto } from "./utils/validations";
import { styles } from "./styles/transactionStyles";
import { TransactionFormModal } from "./components/TransactionFormModal";
import { DeleteConfirmModal } from "./components/DeleteConfirmModal";
import { TransactionListItem } from "./components/TransactionListItem";

export default function TransactionsScreen() {
  const [transacciones, setTransacciones] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("Todos"); // Todos | Ingreso | Gasto
  const [ordenamiento, setOrdenamiento] = useState("reciente"); // reciente, antiguo, mayorGasto, menorGasto
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  // Estados para modales
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(null); // "nueva", "editar", "eliminar"
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    tipo: "Gasto",
    categoria: "",
    monto: "",
    icono: "💰",
  });

  // Estados para errores de validación
  const [errors, setErrors] = useState({
    categoria: "",
    monto: "",
  });

  useEffect(() => {
    // Simulación — aquí irá el fetch al backend FastAPI
    const data = [
      { id: 1, tipo: "Ingreso", monto: 1200, categoria: "Sueldo", icono: "💼" },
      { id: 2, tipo: "Gasto", monto: 300, categoria: "Comida", icono: "🍔" },
      {
        id: 3,
        tipo: "Gasto",
        monto: 50.5,
        categoria: "Transporte",
        icono: "🚕",
      },
      {
        id: 4,
        tipo: "Ingreso",
        monto: 200,
        categoria: "Freelance",
        icono: "💻",
      },
      { id: 5, tipo: "Gasto", monto: 120, categoria: "Cine", icono: "🎬" },
      {
        id: 6,
        tipo: "Gasto",
        monto: 85.75,
        categoria: "Farmacia",
        icono: "💊",
      },
    ];

    // Simular retraso
    setTimeout(() => {
      setTransacciones(data);
      setLoading(false);
    }, 50);
  }, []);

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
      resultado.sort((a, b) => b.id - a.id); // Newer IDs are more recent
    } else if (ordenamiento === "antiguo") {
      resultado.sort((a, b) => a.id - b.id);
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
      tipo: item.tipo,
      categoria: item.categoria,
      monto: item.monto.toString(),
      icono: item.icono,
    });
    setModalType("editar");
    setModalVisible(true);
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setFormData({
      tipo: "Gasto",
      categoria: "",
      monto: "",
      icono: "💰",
    });
    setModalType("nueva");
    setModalVisible(true);
    setErrors({ categoria: "", monto: "" });
  };

  const handleCategoriaChange = (text) => {
    setFormData({ ...formData, categoria: text });
    const error = validateCategoria(text);
    setErrors({ ...errors, categoria: error });
  };

  const handleMontoChange = (text) => {
    setFormData({ ...formData, monto: text });
    const error = validateMonto(text);
    setErrors({ ...errors, monto: error });
  };

  const handleSaveTransaction = () => {
    // Validar campos
    const errorCategoria = validateCategoria(formData.categoria);
    const errorMonto = validateMonto(formData.monto);

    setErrors({
      categoria: errorCategoria,
      monto: errorMonto,
    });

    // Si hay errores, mostrar alerta y no proceder
    if (errorCategoria || errorMonto) {
      const mensajes = [];
      if (errorCategoria) mensajes.push(`• ${errorCategoria}`);
      if (errorMonto) mensajes.push(`• ${errorMonto}`);
      Alert.alert("❌ Errores en el formulario", mensajes.join("\n"));
      return;
    }

    if (editingItem) {
      // Editar transacción existente
      setTransacciones(
        transacciones.map((t) =>
          t.id === editingItem.id
            ? {
                ...t,
                tipo: formData.tipo,
                categoria: formData.categoria,
                monto: parseFloat(formData.monto),
                icono: formData.icono,
              }
            : t
        )
      );
    } else {
      // Crear nueva transacción
      const newTransaction = {
        id: Math.max(...transacciones.map((t) => t.id), 0) + 1,
        tipo: formData.tipo,
        categoria: formData.categoria,
        monto: parseFloat(formData.monto),
        icono: formData.icono,
      };
      setTransacciones([...transacciones, newTransaction]);
    }

    setModalVisible(false);
    setFormData({
      tipo: "Gasto",
      categoria: "",
      monto: "",
      icono: "💰",
    });
    setEditingItem(null);
  };

  const handleConfirmDelete = () => {
    setTransacciones(transacciones.filter((t) => t.id !== editingItem.id));
    setModalVisible(false);
    setEditingItem(null);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingCard}>
          <ActivityIndicator size={50} color="#1089ff" />
          <Text style={styles.loadingText}>Cargando transacciones...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Transaction List with Header */}
      {listaFiltrada.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No hay transacciones que coincidan
          </Text>
        </View>
      ) : (
        <FlatList
          data={listaFiltrada}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={
            <>
              {/* Header Card */}
              <View style={styles.headerCard}>
                <Text style={{ fontSize: 28, fontWeight: "700", color: "#1F2937" }}>
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
      )}

      {/* Floating Action Button */}
      <TouchableOpacity
        onPress={handleAddNew}
        style={styles.floatingButton}
        activeOpacity={0.8}
      >
        <Text style={styles.floatingButtonText}>➕ Nueva</Text>
      </TouchableOpacity>

      {/* MODALES */}
      {/* Modal Nueva/Editar Transacción */}
      <TransactionFormModal
        visible={
          modalVisible && (modalType === "nueva" || modalType === "editar")
        }
        modalType={modalType}
        formData={formData}
        errors={errors}
        onChangeTipo={(tipo) => setFormData({ ...formData, tipo })}
        onChangeCategoria={handleCategoriaChange}
        onChangeMonto={handleMontoChange}
        onChangeIcono={(icono) => setFormData({ ...formData, icono })}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveTransaction}
      />

      {/* Modal Confirmar Eliminación */}
      <DeleteConfirmModal
        visible={modalVisible && modalType === "eliminar"}
        itemCategoria={editingItem?.categoria}
        onClose={() => setModalVisible(false)}
        onConfirm={handleConfirmDelete}
      />
    </View>
  );
}
