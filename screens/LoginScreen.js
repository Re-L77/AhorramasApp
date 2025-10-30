import React from "react";
import { View, Text, TextInput, Button } from "react-native";

export default function LoginScreen() {
  return (
    <View>
      <Text>Iniciar Sesión</Text>
      <TextInput placeholder="Correo Electrónico" />
      <TextInput placeholder="Contraseña" secureTextEntry />
      <Button title="Entrar" onPress={() => {}} />
    </View>
  );
}
