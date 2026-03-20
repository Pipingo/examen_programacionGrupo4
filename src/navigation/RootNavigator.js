import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../contexts/AuthContext";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import ProductListScreen from "../screens/ProductListScreen";
import ProductFormScreen from "../screens/ProductFormScreen";

const Stack = createNativeStackNavigator();

function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#2c6e49" />
      <Text style={styles.loadingText}>Cargando...</Text>
    </View>
  );
}

export default function RootNavigator() {
  const { user, initializing } = useAuth();

  if (initializing) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator>
      {user ? (
        <>
          <Stack.Screen
            name="Productos"
            component={ProductListScreen}
            options={{ headerTitle: "Mi inventario" }}
          />
          <Stack.Screen
            name="ProductoForm"
            component={ProductFormScreen}
            options={({ route }) => ({
              headerTitle: route.params?.product ? "Editar producto" : "Nuevo producto"
            })}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerTitle: "Iniciar sesión" }}
          />
          <Stack.Screen
            name="Registro"
            component={RegisterScreen}
            options={{ headerTitle: "Crear cuenta" }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f4f7fb"
  },
  loadingText: {
    marginTop: 12,
    color: "#425466",
    fontSize: 16
  }
});
