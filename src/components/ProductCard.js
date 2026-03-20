import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function ProductCard({ item, onEdit, onDelete }) {
  const stockBajo = Number(item.cantidad) <= 3;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.name}>{item.nombre}</Text>
        {stockBajo ? <Text style={styles.badge}>Stock bajo</Text> : null}
      </View>

      <Text style={styles.meta}>Categoria: {item.categoria}</Text>
      <Text style={styles.meta}>Precio: ${Number(item.precio).toFixed(2)}</Text>
      <Text style={styles.meta}>Cantidad: {item.cantidad}</Text>

      <View style={styles.actions}>
        <Pressable style={[styles.button, styles.editButton]} onPress={onEdit}>
          <Text style={styles.buttonText}>Editar</Text>
        </Pressable>
        <Pressable style={[styles.button, styles.deleteButton]} onPress={onDelete}>
          <Text style={styles.buttonText}>Eliminar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#dce5ef",
    padding: 14,
    marginBottom: 10
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    gap: 8
  },
  name: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1f2937",
    flexShrink: 1
  },
  badge: {
    backgroundColor: "#ffd6a5",
    color: "#9a3412",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    fontSize: 12,
    overflow: "hidden"
  },
  meta: {
    color: "#475569",
    marginBottom: 4
  },
  actions: {
    marginTop: 8,
    flexDirection: "row",
    gap: 8
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center"
  },
  editButton: {
    backgroundColor: "#2c6e49"
  },
  deleteButton: {
    backgroundColor: "#b00020"
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "700"
  }
});
