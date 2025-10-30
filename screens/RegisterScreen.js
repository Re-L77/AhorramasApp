import React from "react";
import { View, Text, TextInput, Button } from "react-native";
export default function RegisterScreen() {
  return (
    <View>
      <Text>Registro de Usuario</Text>
      <TextInput placeholder="Nombre de Usuario" />
      <TextInput placeholder="Correo Electrónico" />
      <TextInput placeholder="Contraseña" secureTextEntry />
      <Button title="Registrar" onPress={() => {}} />
    </View>
  );
}
