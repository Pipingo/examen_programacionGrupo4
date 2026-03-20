import React, { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";

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
  loading,
  subtitle,
  showAvatar = false
}) {
  const [focusedField, setFocusedField] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const avatarLetter = useMemo(() => {
    const clean = email?.trim();
    return clean ? clean.charAt(0).toUpperCase() : "U";
  }, [email]);

  return (
    <View style={styles.container}>
      <View style={[styles.blob, styles.blobTop]} />
      <View style={[styles.blob, styles.blobBottom]} />

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
            {showAvatar ? (
              <View style={styles.avatarWrap}>
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarText}>{avatarLetter}</Text>
                </View>
                <Text style={styles.avatarCaption}>Usuario</Text>
              </View>
            ) : null}

            <Text style={styles.title}>{title}</Text>
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}

            <View
              style={[
                styles.inputWrap,
                focusedField === "email" ? styles.inputWrapFocused : null
              ]}
            >
              <TextInput
                value={email}
                onChangeText={onChangeEmail}
                placeholder="correo@ejemplo.com"
                placeholderTextColor="#7a8a9c"
                keyboardType="email-address"
                autoCapitalize="none"
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField("")}
                style={styles.input}
              />
            </View>

            <View
              style={[
                styles.inputWrap,
                styles.passwordWrap,
                focusedField === "password" ? styles.inputWrapFocused : null
              ]}
            >
              <TextInput
                value={password}
                onChangeText={onChangePassword}
                placeholder="Contraseña"
                placeholderTextColor="#7a8a9c"
                secureTextEntry={!showPassword}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField("")}
                style={[styles.input, styles.passwordInput]}
              />
              <Pressable onPress={() => setShowPassword((prev) => !prev)}>
                <Text style={styles.passwordAction}>{showPassword ? "Ocultar" : "Mostrar"}</Text>
              </Pressable>
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Pressable
              onPress={onSubmit}
              disabled={loading}
              style={({ pressed }) => [
                styles.button,
                pressed && !loading ? styles.buttonPressed : null,
                loading ? styles.buttonDisabled : null
              ]}
            >
              <Text style={styles.buttonText}>{loading ? "Procesando..." : submitLabel}</Text>
            </Pressable>

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>{footerText}</Text>
              <Pressable onPress={onFooterAction}>
                <Text style={styles.footerAction}>{footerActionLabel}</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eaf4ff",
    position: "relative"
  },
  keyboardContainer: {
    flex: 1
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20
  },
  blob: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: "#bfdcff"
  },
  blobTop: {
    width: 220,
    height: 220,
    top: -60,
    right: -80,
    opacity: 0.7
  },
  blobBottom: {
    width: 260,
    height: 260,
    bottom: -110,
    left: -110,
    opacity: 0.5
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: "#d7e6f7",
    shadowColor: "#0f172a",
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5
  },
  avatarWrap: {
    alignItems: "center",
    marginBottom: 10
  },
  avatarCircle: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: "#0e7490",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#bde6f1"
  },
  avatarText: {
    color: "#ffffff",
    fontSize: 30,
    fontWeight: "800"
  },
  avatarCaption: {
    color: "#4b5563",
    marginTop: 8,
    fontSize: 12,
    letterSpacing: 0.5,
    textTransform: "uppercase"
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 6,
    color: "#10243e",
    textAlign: "center"
  },
  subtitle: {
    color: "#4b5563",
    textAlign: "center",
    marginBottom: 20
  },
  inputWrap: {
    borderWidth: 1,
    borderColor: "#d2dce7",
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: "#ffffff"
  },
  inputWrapFocused: {
    borderColor: "#0e7490",
    shadowColor: "#0e7490",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2
  },
  passwordWrap: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 12
  },
  input: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#0f172a",
    flex: 1
  },
  passwordInput: {
    paddingRight: 8
  },
  passwordAction: {
    color: "#0e7490",
    fontWeight: "700"
  },
  error: {
    color: "#b00020",
    marginBottom: 10,
    textAlign: "center"
  },
  button: {
    backgroundColor: "#0f766e",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 16
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.95
  },
  buttonDisabled: {
    opacity: 0.7
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
    color: "#0e7490",
    fontWeight: "700"
  }
});
