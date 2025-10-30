import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AuthStack from "./AuthStack";
import MainTabs from "./MainTabs";

export default function RootNavigator() {
  const userLogged = false; // cambiar a estado global (Redux, Context o AsyncStorage)

  return (
    <NavigationContainer>
      {userLogged ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}
