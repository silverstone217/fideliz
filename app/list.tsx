import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Pressable,
} from "react-native";
import React, { useMemo, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { useTransactionState } from "../lib/store";
import { TextSize } from "../constants/Size";
import {
  convertToFCD,
  convertToUSD,
  getAmountByCurrencyAndDate,
} from "../utils/functions";
import { TransactionType } from "../types";
import DateTimePicker from "@react-native-community/datetimepicker";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const ListTransactions = () => {
  const { setTransactions, transactions } = useTransactionState();
  const [searchByDate, setSearchByDate] = useState<Date | null>(null);
  const [show, setShow] = useState(false);

  const filteredTrans = useMemo(() => {
    if (!searchByDate) return transactions; // Si pas de date, afficher toutes les transactions

    return transactions.filter((transaction: TransactionType) => {
      const transactionDate = new Date(transaction.createdAt);
      transactionDate.setHours(0, 0, 0, 0); // Réinitialiser l'heure pour comparer uniquement la date
      const searchDate = new Date(searchByDate!);
      searchDate.setHours(0, 0, 0, 0); // Réinitialiser l'heure pour comparer uniquement la date

      return transactionDate.getTime() === searchDate.getTime();
    });
  }, [transactions, searchByDate]);

  const onChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || new Date();
    setSearchByDate(currentDate);
    setShow(false);
  };

  const showDatepicker = () => {
    setShow(true);
  };

  const getTotalUSDByDate = useMemo(() => {
    if (!searchByDate) return 0;
    return getAmountByCurrencyAndDate("USD", filteredTrans, "d");
  }, [searchByDate, filteredTrans]);

  const getTotalFCDByDate = useMemo(() => {
    if (!searchByDate) return 0;
    return getAmountByCurrencyAndDate("FCD", filteredTrans, "d");
  }, [searchByDate, filteredTrans]);

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredTrans}
        keyExtractor={(item) => item.createdAt.toLocaleString()}
        ListFooterComponent={null}
        refreshing={false}
        onEndReached={null}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          gap: 15,
        }}
        ListEmptyComponent={
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text style={{ color: "dimgray" }}>
              Aucune transaction disponible
            </Text>
          </View>
        }
        renderItem={({ item, index }) => (
          <View
            style={{
              gap: 5,
              backgroundColor: index % 2 === 0 ? "#C7D2E7" : "#eef",
              padding: 10,
              borderRadius: 5,
              shadowColor: "#000000",
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.16,
              shadowRadius: 1.51,
              elevation: 2,
            }}
          >
            <Text>+(243)-{item.number}</Text>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                gap: 20,
              }}
            >
              <Text
                style={{
                  fontSize: TextSize.md,
                  fontWeight: "600",
                  color: item.amount > 1 ? "green" : "tomato",
                }}
              >
                {item.points} <Text>Pt{item.points > 1 ? "s" : ""}</Text>
              </Text>
              <Text
                style={{
                  fontSize: TextSize.md,
                  fontWeight: "600",
                }}
              >
                {item.currency === "USD"
                  ? convertToUSD(item.amount)
                  : convertToFCD(item.amount)}
              </Text>
            </View>
            <Text
              style={{
                fontSize: 10,
                opacity: 0.6,
              }}
            >
              {new Date(item.createdAt).toLocaleDateString("fr-FR")}
            </Text>
          </View>
        )}
        ListHeaderComponent={() => (
          <View style={{ gap: 15 }}>
            <View
              style={{ flexDirection: "row", gap: 10, alignItems: "center" }}
            >
              <TouchableOpacity onPress={showDatepicker} style={{ flex: 1 }}>
                <View
                  style={{
                    height: 40,
                    borderColor: "gray",
                    borderWidth: 1,
                    padding: 10,
                    borderRadius: 5,
                  }}
                >
                  <Text>
                    {searchByDate
                      ? new Date(searchByDate).toLocaleDateString("fr-FR")
                      : "Sélectionner une date"}
                  </Text>
                </View>
              </TouchableOpacity>

              {searchByDate && (
                <Pressable
                  style={{ padding: 5, borderWidth: 1, borderRadius: 2.5 }}
                  onPress={() => setSearchByDate(null)}
                >
                  <MaterialIcons name="clear" size={25} color="tomato" />
                </Pressable>
              )}
            </View>

            {searchByDate && (
              <View
                style={{
                  padding: 10,
                  borderRadius: 10,
                  width: "100%",
                  backgroundColor: "rgba(90,90,90,0.5)",
                  gap: 10,
                }}
              >
                <Text style={{ color: "white" }}>Total</Text>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 15,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "600",
                      fontSize: TextSize.xl,
                    }}
                  >
                    {convertToUSD(getTotalUSDByDate)}
                  </Text>
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "600",
                      fontSize: TextSize.xl,
                    }}
                  >
                    {convertToFCD(getTotalFCDByDate)}
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}
      />

      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={searchByDate || new Date()}
          mode={"date"}
          is24Hour={true}
          onChange={onChange}
        />
      )}

      <StatusBar
        style={Platform.OS === "android" ? "dark" : "light"}
        animated
      />
    </View>
  );
};

export default ListTransactions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 30,
  },
});
