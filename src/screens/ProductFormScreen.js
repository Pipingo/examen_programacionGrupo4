import React, { useMemo, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../services/firebase";

function validateProduct({ nombre, precio, cantidad, categoria }) {
  if (!nombre.trim() || !precio.trim() || !cantidad.trim() || !categoria.trim()) {
    return "Todos los campos son obligatorios.";
  }

  const parsedPrice = Number(precio);
  const parsedQty = Number(cantidad);

  if (Number.isNaN(parsedPrice) || parsedPrice <= 0) {
    return "El precio debe ser un numero mayor a 0.";
  }

  if (!Number.isInteger(parsedQty) || parsedQty < 0) {
    return "La cantidad debe ser un numero entero mayor o igual a 0.";
  }

  return "";
}

export default function ProductFormScreen({ navigation, route }) {
  const editingProduct = route.params?.product;
  const { user } = useAuth();

  const initialValues = useMemo(
    () => ({
      nombre: editingProduct?.nombre ?? "",
      precio: editingProduct?.precio?.toString?.() ?? "",
      cantidad: editingProduct?.cantidad?.toString?.() ?? "",
      categoria: editingProduct?.categoria ?? ""
    }),
    [editingProduct]
  );

  const [nombre, setNombre] = useState(initialValues.nombre);
  const [precio, setPrecio] = useState(initialValues.precio);
  const [cantidad, setCantidad] = useState(initialValues.cantidad);
  const [categoria, setCategoria] = useState(initialValues.categoria);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    const validationError = validateProduct({ nombre, precio, cantidad, categoria });

    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setLoading(true);

    const payload = {
      nombre: nombre.trim(),
      precio: Number(precio),
      cantidad: Number(cantidad),
      categoria: categoria.trim(),
      user_id: user.uid,
      updatedAt: serverTimestamp()
    };

    try {
      if (editingProduct?.id) {
        await updateDoc(doc(db, "productos", editingProduct.id), payload);
      } else {
        await addDoc(collection(db, "productos"), {
          ...payload,
          createdAt: serverTimestamp()
        });
      }

      navigation.goBack();
    } catch (e) {
      let msg = "No se pudo guardar el producto.";

      if (e?.code === "permission-denied") {
        msg = "Sin permisos para guardar. Revisa reglas de Firestore.";
      }

      setError(msg);
      Alert.alert("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nombre</Text>
      <TextInput
        style={styles.input}
        value={nombre}
        onChangeText={setNombre}
        placeholder="Ej: Teclado mecanico"
      />

      <Text style={styles.label}>Precio</Text>
      <TextInput
        style={styles.input}
        value={precio}
        onChangeText={setPrecio}
        placeholder="Ej: 25.99"
        keyboardType="decimal-pad"
      />

      <Text style={styles.label}>Cantidad</Text>
      <TextInput
        style={styles.input}
        value={cantidad}
        onChangeText={setCantidad}
        placeholder="Ej: 10"
        keyboardType="number-pad"
      />

      <Text style={styles.label}>Categoria</Text>
      <TextInput
        style={styles.input}
        value={categoria}
        onChangeText={setCategoria}
        placeholder="Ej: Perifericos"
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable style={styles.button} onPress={handleSave} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Guardando..." : "Guardar"}</Text>
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
  label: {
    color: "#334155",
    marginBottom: 6,
    fontWeight: "600"
  },
  input: {
    borderWidth: 1,
    borderColor: "#d2dce7",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12
  },
  error: {
    color: "#b00020",
    marginBottom: 8
  },
  button: {
    backgroundColor: "#2c6e49",
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "700"
  }
});
