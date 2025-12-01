// App.js
import React, { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "./app/config/AuthContext";
import RootNavigator from "./app/navigation/RootNavigator";
import { DatabaseService } from "./app/config/DatabaseService";

export default function App() {
  useEffect(() => {
    // Inicializar la base de datos cuando la app carga
    const initDB = async () => {
      try {
        const result = await DatabaseService.inicializarBaseDatos();
        if (result.success) {
          const mode = result.mode === 'sqlite' ? 'SQLite' : 'localStorage';
          console.log(`✅ Base de datos inicializada (Modo: ${mode})`);
        } else {
          console.warn("⚠️ Error al inicializar base de datos:", result.error);
        }
      } catch (error) {
        console.error("❌ Error crítico al inicializar BD:", error);
      }
    };

    initDB();
  }, []);

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
