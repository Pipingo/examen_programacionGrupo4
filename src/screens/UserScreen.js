import React, { useMemo, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { updatePassword, updateProfile } from "firebase/auth";
import { useAuth } from "../contexts/AuthContext";

export default function UserScreen() {
  const { user, logout } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName ?? "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL ?? "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const joinedAt = useMemo(() => {
    const creationTime = user?.metadata?.creationTime;

    if (!creationTime) {
      return "No disponible";
    }

    return new Date(creationTime).toLocaleString();
  }, [user?.metadata?.creationTime, refreshKey]);

  const avatarLetter = useMemo(() => {
    const base = (user?.displayName || user?.email || "U").trim();
    return base.charAt(0).toUpperCase();
  }, [user?.displayName, user?.email, refreshKey]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      Alert.alert("Error", "No se pudo cerrar sesion.");
    }
  };

  const handleSaveProfile = async () => {
    const cleanName = displayName.trim();
    const cleanPhoto = photoURL.trim();

    if (!user) {
      return;
    }

    if (cleanPhoto && !/^https?:\/\//i.test(cleanPhoto)) {
      Alert.alert("Error", "La URL de foto debe iniciar con http:// o https://.");
      return;
    }

    setSavingProfile(true);

    try {
      await updateProfile(user, {
        displayName: cleanName || null,
        photoURL: cleanPhoto || null
      });
      await user.reload();
      setRefreshKey((prev) => prev + 1);
      Alert.alert("Listo", "Perfil actualizado.");
    } catch {
      Alert.alert("Error", "No se pudo actualizar el perfil.");
    } finally {
      setSavingProfile(false);
    }
  };

  const mapPasswordError = (code) => {
    switch (code) {
      case "auth/weak-password":
        return "La nueva contrasena es muy debil.";
      case "auth/requires-recent-login":
        return "Por seguridad debes volver a iniciar sesion para cambiar la contrasena.";
      default:
        return "No se pudo cambiar la contrasena.";
    }
  };

  const handleChangePassword = async () => {
    const cleanPassword = newPassword.trim();

    if (!user) {
      return;
    }

    if (cleanPassword.length < 6) {
      Alert.alert("Error", "La contrasena debe tener al menos 6 caracteres.");
      return;
    }

    if (cleanPassword !== confirmPassword.trim()) {
      Alert.alert("Error", "La confirmacion no coincide.");
      return;
    }

    setSavingPassword(true);

    try {
      await updatePassword(user, cleanPassword);
      setNewPassword("");
      setConfirmPassword("");
      Alert.alert("Listo", "Contrasena actualizada.");
    } catch (e) {
      Alert.alert("Error", mapPasswordError(e?.code));
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.title}>Tu cuenta</Text>

        <View style={styles.profileHeader}>
          {user?.photoURL ? (
            <Image source={{ uri: user.photoURL }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarLetter}>{avatarLetter}</Text>
            </View>
          )}

          <View style={styles.profileTextWrap}>
            <Text style={styles.profileName}>{user?.displayName || "Sin nombre"}</Text>
            <Text style={styles.profileEmail}>{user?.email ?? "Sin correo"}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Fecha de registro</Text>
          <Text style={styles.value}>{joinedAt}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>UID</Text>
          <Text numberOfLines={1} style={styles.value}>
            {user?.uid ?? "No disponible"}
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Editar perfil</Text>

        <Text style={styles.label}>Nombre</Text>
        <TextInput
          value={displayName}
          onChangeText={setDisplayName}
          placeholder="Tu nombre"
          style={styles.input}
        />

        <Text style={styles.label}>URL de foto</Text>
        <TextInput
          value={photoURL}
          onChangeText={setPhotoURL}
          placeholder="https://..."
          autoCapitalize="none"
          style={styles.input}
        />

        <Pressable
          style={[styles.primaryButton, savingProfile ? styles.buttonDisabled : null]}
          onPress={handleSaveProfile}
          disabled={savingProfile}
        >
          <Text style={styles.primaryButtonText}>
            {savingProfile ? "Guardando..." : "Guardar perfil"}
          </Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Cambiar contrasena</Text>

        <Text style={styles.label}>Nueva contrasena</Text>
        <TextInput
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="Minimo 6 caracteres"
          secureTextEntry
          style={styles.input}
        />

        <Text style={styles.label}>Confirmar contrasena</Text>
        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Repite la contrasena"
          secureTextEntry
          style={styles.input}
        />

        <Pressable
          style={[styles.primaryButton, savingPassword ? styles.buttonDisabled : null]}
          onPress={handleChangePassword}
          disabled={savingPassword}
        >
          <Text style={styles.primaryButtonText}>
            {savingPassword ? "Actualizando..." : "Actualizar contrasena"}
          </Text>
        </Pressable>
      </View>

      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Cerrar sesion</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f7fb"
  },
  content: {
    padding: 16,
    paddingBottom: 26
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
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 12
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#e2e8f0"
  },
  avatarFallback: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#0e7490",
    alignItems: "center",
    justifyContent: "center"
  },
  avatarLetter: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 24
  },
  profileTextWrap: {
    flex: 1
  },
  profileName: {
    color: "#0f172a",
    fontWeight: "700",
    fontSize: 16
  },
  profileEmail: {
    color: "#475569",
    marginTop: 2
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
  input: {
    borderWidth: 1,
    borderColor: "#d2dce7",
    borderRadius: 12,
    backgroundColor: "#ffffff",
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12
  },
  primaryButton: {
    backgroundColor: "#0e7490",
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: "center",
    marginTop: 2
  },
  primaryButtonText: {
    color: "#ffffff",
    fontWeight: "700"
  },
  buttonDisabled: {
    opacity: 0.7
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
