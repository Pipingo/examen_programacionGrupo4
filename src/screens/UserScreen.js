import React from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../contexts/AuthContext";

export default function UserScreen() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      Alert.alert("Error", "No se pudo cerrar sesion.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Tu cuenta</Text>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Correo</Text>
          <Text style={styles.value}>{user?.email ?? "Sin correo"}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>UID</Text>
          <Text style={styles.value} numberOfLines={1}>
            {user?.uid ?? "No disponible"}
          </Text>
        </View>
      </View>

      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Cerrar sesion</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f7fb",
    padding: 16
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#dce5ef",
    marginBottom: 20
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 14
  },
  infoRow: {
    marginBottom: 12
  },
  label: {
    color: "#64748b",
    marginBottom: 2,
    fontSize: 13
  },
  value: {
    color: "#1e293b",
    fontSize: 15
  },
  logoutButton: {
    backgroundColor: "#e11d48",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center"
  },
  logoutText: {
    color: "#ffffff",
    fontWeight: "700"
  }
});
