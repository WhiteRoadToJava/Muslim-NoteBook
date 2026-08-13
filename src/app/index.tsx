import { StyleSheet } from "react-native";
import { SafeAreaView, Text, FlatList, View, TouchableOpacity, Modal, Alert, TextInput, Button} from "react-native";
import { useState, useEffect } from "react";
import { loadZikrs, incrementZikr, addZikr, updateZikr, deleteZikr} from "../storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen() {
  const [zikrs, setZikrs] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    const data = await loadZikrs();
    setZikrs(data);
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      let data = await loadZikrs();
      if (data.length === 0) {
        await addZikr("SubhanAllah", 33);
        await addZikr("Alhamdulillah", 33);
        await addZikr("Allahu Akbar", 34);
        data = await loadZikrs();
      }
      setZikrs(data);
      setLoading(false);
    })();
  }, []);

  const handleTap = async (id) => {
    const updated = await incrementZikr(id);
    setZikrs(updated);
  };

  const renderItem = ({ item }) => {
    const progress = Math.min(item.count / item.target, 1);
    const done = item.count >= item.target;
    return (
      <TouchableOpacity
        style={[styles.card, done && styles.cardDone]}
        onPress={() => handleTap(item.id)}
      >
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.count}>
          {item.count} / {item.target}
        </Text>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Zikrs</Text>
      <FlatList
        data={zikrs}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
  },
  list: {
    padding: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 14,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardDone: {
    backgroundColor: "#e6f7ec",
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  count: {
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
  },
  progressTrack: {
    height: 8,
    backgroundColor: "#eee",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#2e8b57",
  },
});