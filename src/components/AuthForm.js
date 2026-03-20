import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function AuthForm({
  title,
  email,
  password,
  onChangeEmail,
  onChangePassword,
  onSubmit,
  submitLabel,
  error,
  footerText,
  footerActionLabel,
  onFooterAction,
  loading
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <TextInput
        value={email}
        onChangeText={onChangeEmail}
        placeholder="correo@ejemplo.com"
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />

      <TextInput
        value={password}
        onChangeText={onChangePassword}
        placeholder="Contraseña"
        secureTextEntry
        style={styles.input}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable onPress={onSubmit} disabled={loading} style={styles.button}>
        <Text style={styles.buttonText}>{loading ? "Procesando..." : submitLabel}</Text>
      </Pressable>

      <View style={styles.footerRow}>
        <Text style={styles.footerText}>{footerText}</Text>
        <Pressable onPress={onFooterAction}>
          <Text style={styles.footerAction}>{footerActionLabel}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f4f7fb"
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
    color: "#1f2937"
  },
  input: {
    borderWidth: 1,
    borderColor: "#d2dce7",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
    backgroundColor: "#ffffff"
  },
  error: {
    color: "#b00020",
    marginBottom: 10
  },
  button: {
    backgroundColor: "#2c6e49",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 16
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "700"
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6
  },
  footerText: {
    color: "#4b5563"
  },
  footerAction: {
    color: "#2c6e49",
    fontWeight: "700"
  }
});
