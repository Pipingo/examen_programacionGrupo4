import React, { useEffect, useMemo, useState } from "react";
import { Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where
} from "firebase/firestore";
import ProductCard from "../components/ProductCard";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../services/firebase";

export default function ProductListScreen({ navigation }) {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [screenError, setScreenError] = useState("");
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    if (!user?.uid) {
      return;
    }

    const productsRef = collection(db, "productos");
    const q = query(productsRef, where("user_id", "==", user.uid));

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const mapped = snapshot.docs
          .map((item) => ({ id: item.id, ...item.data() }))
          .sort((a, b) => {
            const aSec = a?.createdAt?.seconds ?? 0;
            const bSec = b?.createdAt?.seconds ?? 0;
            return bSec - aSec;
          });

        setScreenError("");
        setProducts(mapped);
        setLoading(false);
      },
      (error) => {
        if (error?.code === "permission-denied") {
          setScreenError("Sin permisos para leer productos. Revisa reglas de Firestore.");
        } else {
          setScreenError("No se pudieron cargar tus productos.");
        }
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

  const categories = useMemo(() => {
    const unique = new Set(
      products
        .map((item) => item?.categoria?.trim())
        .filter((item) => item)
    );

    return ["Todas", ...Array.from(unique).sort((a, b) => a.localeCompare(b))];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const normalizedName = searchText.trim().toLowerCase();
    const parsedMin = minPrice.trim() ? Number(minPrice) : null;
    const parsedMax = maxPrice.trim() ? Number(maxPrice) : null;

    return products.filter((item) => {
      const nameMatch = normalizedName
        ? item?.nombre?.toLowerCase?.().includes(normalizedName)
        : true;

      const categoryMatch =
        selectedCategory === "Todas" ? true : item?.categoria === selectedCategory;

      const priceValue = Number(item?.precio);
      const minMatch = parsedMin === null || Number.isNaN(parsedMin) ? true : priceValue >= parsedMin;
      const maxMatch = parsedMax === null || Number.isNaN(parsedMax) ? true : priceValue <= parsedMax;

      return nameMatch && categoryMatch && minMatch && maxMatch;
    });
  }, [products, searchText, selectedCategory, minPrice, maxPrice]);

  const hasActiveFilters =
    searchText.trim() || selectedCategory !== "Todas" || minPrice.trim() || maxPrice.trim();

  const handleClearFilters = () => {
    setSearchText("");
    setSelectedCategory("Todas");
    setMinPrice("");
    setMaxPrice("");
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.email}>{user?.email}</Text>
        <Pressable
          onPress={() => navigation.navigate("Usuario")}
          style={styles.accountButton}
        >
          <Text style={styles.accountText}>Mi cuenta</Text>
        </Pressable>
      </View>

      {screenError ? <Text style={styles.error}>{screenError}</Text> : null}

      <View style={styles.filtersCard}>
        <Text style={styles.filtersTitle}>Buscar y filtrar</Text>

        <TextInput
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Buscar por nombre"
          style={styles.searchInput}
        />

        <View style={styles.categoryRow}>
          {categories.map((category) => (
            <Pressable
              key={category}
              onPress={() => setSelectedCategory(category)}
              style={[
                styles.categoryChip,
                selectedCategory === category ? styles.categoryChipActive : null
              ]}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  selectedCategory === category ? styles.categoryChipTextActive : null
                ]}
              >
                {category}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.priceRow}>
          <TextInput
            value={minPrice}
            onChangeText={setMinPrice}
            placeholder="Precio min"
            keyboardType="decimal-pad"
            style={[styles.searchInput, styles.priceInput]}
          />
          <TextInput
            value={maxPrice}
            onChangeText={setMaxPrice}
            placeholder="Precio max"
            keyboardType="decimal-pad"
            style={[styles.searchInput, styles.priceInput]}
          />
        </View>

        <View style={styles.filterFooter}>
          <Text style={styles.resultText}>{filteredProducts.length} resultados</Text>
          {hasActiveFilters ? (
            <Pressable onPress={handleClearFilters}>
              <Text style={styles.clearText}>Limpiar filtros</Text>
            </Pressable>
          ) : null}
        </View>
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          !loading ? (
            <Text style={styles.emptyText}>
              {hasActiveFilters
                ? "No hay productos que coincidan con tus filtros."
                : "No tienes productos aun. Crea el primero."}
            </Text>
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
  accountButton: {
    backgroundColor: "#334155",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10
  },
  accountText: {
    color: "#ffffff",
    fontWeight: "700"
  },
  listContent: {
    padding: 14,
    paddingBottom: 90
  },
  filtersCard: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#dce5ef",
    borderRadius: 12,
    marginHorizontal: 14,
    marginTop: 12,
    padding: 12
  },
  filtersTitle: {
    color: "#1f2937",
    fontWeight: "700",
    marginBottom: 10
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#d2dce7",
    borderRadius: 10,
    backgroundColor: "#ffffff",
    paddingHorizontal: 10,
    paddingVertical: 9,
    marginBottom: 10
  },
  categoryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 10
  },
  categoryChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#eef2f7"
  },
  categoryChipActive: {
    backgroundColor: "#2c6e49"
  },
  categoryChipText: {
    color: "#334155",
    fontWeight: "600"
  },
  categoryChipTextActive: {
    color: "#ffffff"
  },
  priceRow: {
    flexDirection: "row",
    gap: 8
  },
  priceInput: {
    flex: 1
  },
  filterFooter: {
    marginTop: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  resultText: {
    color: "#475569"
  },
  clearText: {
    color: "#0e7490",
    fontWeight: "700"
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
