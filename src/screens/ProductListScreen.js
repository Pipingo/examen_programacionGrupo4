import React, { useEffect, useState } from "react";
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  where
} from "firebase/firestore";
import ProductCard from "../components/ProductCard";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../services/firebase";

export default function ProductListScreen({ navigation }) {
  const { user, logout } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [screenError, setScreenError] = useState("");

  useEffect(() => {
    if (!user?.uid) {
      return;
    }

    const productsRef = collection(db, "productos");
    const q = query(productsRef, where("user_id", "==", user.uid), orderBy("createdAt", "desc"));

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const mapped = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
        setProducts(mapped);
        setLoading(false);
      },
      () => {
        setScreenError("No se pudieron cargar tus productos.");
        setLoading(false);
      }
    );

    return unsub;
  }, [user?.uid]);

  const handleDelete = (id) => {
    Alert.alert("Eliminar", "Seguro que quieres eliminar este producto?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteDoc(doc(db, "productos", id));
          } catch {
            Alert.alert("Error", "No se pudo eliminar el producto.");
          }
        }
      }
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.email}>{user?.email}</Text>
        <Pressable onPress={logout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Salir</Text>
        </Pressable>
      </View>

      {screenError ? <Text style={styles.error}>{screenError}</Text> : null}

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          !loading ? (
            <Text style={styles.emptyText}>No tienes productos aun. Crea el primero.</Text>
          ) : null
        }
        renderItem={({ item }) => (
          <ProductCard
            item={item}
            onEdit={() => navigation.navigate("ProductoForm", { product: item })}
            onDelete={() => handleDelete(item.id)}
          />
        )}
      />

      <Pressable style={styles.fab} onPress={() => navigation.navigate("ProductoForm")}>
        <Text style={styles.fabText}>+ Nuevo</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f7fb"
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#dce5ef"
  },
  email: {
    color: "#334155",
    flex: 1,
    marginRight: 10
  },
  logoutButton: {
    backgroundColor: "#e11d48",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10
  },
  logoutText: {
    color: "#ffffff",
    fontWeight: "700"
  },
  listContent: {
    padding: 14,
    paddingBottom: 90
  },
  emptyText: {
    textAlign: "center",
    color: "#64748b",
    marginTop: 40
  },
  error: {
    color: "#b00020",
    textAlign: "center",
    marginTop: 8
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 20,
    backgroundColor: "#2c6e49",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 999
  },
  fabText: {
    color: "#ffffff",
    fontWeight: "700"
  }
});
