import React, { useState } from "react";
import { Alert } from "react-native";
import AuthForm from "../components/AuthForm";
import { useAuth } from "../contexts/AuthContext";

function mapFirebaseAuthError(code) {
  switch (code) {
    case "auth/invalid-email":
      return "El correo no tiene un formato valido.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Correo o contraseña incorrectos.";
    case "auth/too-many-requests":
      return "Demasiados intentos. Intenta mas tarde.";
    default:
      return "No se pudo iniciar sesion. Intenta de nuevo.";
  }
}

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password.trim()) {
  setError("Completa correo y contraseña.");
  return;
}

if (password.length < 6) {
  setError("La contraseña debe tener al menos 6 caracteres.");
  return;
}

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError("Ingresa un correo valido.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await login(cleanEmail, password);
    } catch (e) {
      const msg = mapFirebaseAuthError(e?.code);
      setError(msg);
      // Alert.alert("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm
  title="Bienvenido"
  subtitle="Accede a tu inventario personal"
  email={email}
  password={password}
  onChangeEmail={setEmail}
  onChangePassword={setPassword}
  onSubmit={handleSubmit}
  submitLabel="Entrar"
  error={error}
  showAvatar
  footerText="No tienes cuenta?"
  footerActionLabel="Registrate"
  onFooterAction={() => navigation.navigate("Registro")}
  loading={loading}
  disabled={loading}
/>
  );
}
