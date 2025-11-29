// App.js
import React, { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import RootNavigator from "./navigation/RootNavigator";
import { DatabaseService } from "./database/DatabaseService";

export default function App() {
  useEffect(() => {
    // Inicializar la base de datos cuando la app carga
    DatabaseService.inicializarBaseDatos().then((result) => {
      if (result.success) {
        console.log("✅ Base de datos inicializada correctamente");
      } else {
        console.error("❌ Error al inicializar base de datos:", result.error);
      }
    });
  }, []);

  return (
    <SafeAreaProvider>
      <RootNavigator />
    </SafeAreaProvider>
  );
}
