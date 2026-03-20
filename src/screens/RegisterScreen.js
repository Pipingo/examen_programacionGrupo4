import React, { useState } from "react";
import { Alert } from "react-native";
import AuthForm from "../components/AuthForm";
import { useAuth } from "../contexts/AuthContext";

function mapFirebaseAuthError(code) {
  switch (code) {
    case "auth/email-already-in-use":
      return "Ese correo ya esta registrado.";
    case "auth/invalid-email":
      return "El correo no tiene un formato valido.";
    case "auth/weak-password":
      return "La contraseña debe tener al menos 6 caracteres.";
    default:
      return "No se pudo crear la cuenta. Intenta de nuevo.";
  }
}

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password.trim()) {
      setError("Completa correo y contraseña.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError("Ingresa un correo valido.");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
  setError("Las contraseñas no coinciden.");
  return;
}

    setError("");
    setLoading(true);

    try {
      await register(cleanEmail, password);
    } catch (e) {
      const msg = mapFirebaseAuthError(e?.code);
      setError(msg);
      Alert.alert("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm
      title="Crear cuenta"
      email={email}
      password={password}
      onChangeEmail={(text) => setEmail(text.trim())}
      onChangePassword={setPassword}
      confirmPassword={confirmPassword}
onChangeConfirmPassword={setConfirmPassword}
      onSubmit={handleSubmit}
      submitLabel="Registrarme"
      error={error}
      footerText="Ya tienes cuenta?"
      footerActionLabel="Iniciar sesion"
      onFooterAction={() => navigation.navigate("Login")}
      loading={loading}
    />
  );
}
