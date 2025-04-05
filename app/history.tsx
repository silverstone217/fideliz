import { FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useClientsState, useShopState } from "../lib/store";
import { primary } from "../constants/Colors";
import { TextSize } from "../constants/Size";
import AntDesign from "@expo/vector-icons/AntDesign";

const HistoryScreen = () => {
  const { shop, setShop } = useShopState();
  const { clients, setClients } = useClientsState();

  if (!shop || !clients) {
    return null;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={clients}
        keyExtractor={(item) => item.number}
        renderItem={({ item, index }) => (
          <View
            style={[
              styles.item,
              { backgroundColor: index % 2 === 0 ? "#778899" : primary },
            ]}
          >
            <Text style={styles.number}>
              {" "}
              <AntDesign name="user" size={24} color="white" />
              --- {item.number}
            </Text>
            <Text style={styles.points}>{item.points} points</Text>
            <Text style={styles.createdAt}>
              {new Date(item.createdAt).toLocaleString("fr-FR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
          </View>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 20,
        }}
        style={{
          width: "100%",
        }}
        ListEmptyComponent={
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text>Aucun client enregistré pour le moment.</Text>
          </View>
        }
        ListFooterComponent={null}
        refreshing={false}
        onEndReached={null}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
    width: "100%",
  },
  item: {
    backgroundColor: primary,
    padding: 15,
    width: "100%",
    borderRadius: 10,
    elevation: 2,
    marginBottom: 10,
    gap: 5,
  },
  number: {
    fontSize: TextSize.md,
    fontWeight: "500",
    color: "white",
  },
  points: {
    fontSize: TextSize.xxl,
    color: "white",
  },
  createdAt: {
    fontSize: TextSize.sm,
    color: "lightgray",
  },
});
