import { StyleSheet } from "react-native";
import {
  Text,
  FlatList,
  View,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useState, useEffect } from "react";
import {
  loadZikrs,
  incrementZikr,
  addZikr,
  updateZikr,
  deleteZikr,
  getStreak,
} from "../actions/storage";
import AddModal from "../components/AddModal.jsx";

const ZikrList = ({visibleList, setVisibleList}) => {
  const [zikrs, setZikrs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false); // was true
  const [editingZikr, setEditingZikr] = useState(null);
  const [nameInput, setNameInput] = useState("");
  const [targetInput, setTargetInput] = useState("");

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

  const openAddModal = () => {
    setEditingZikr(null);
    setNameInput("");
    setTargetInput("");
    setModalVisible(true);
  };

  const openEditModal = (zikr) => {
    setEditingZikr(zikr);
    setNameInput(zikr.name);
    setTargetInput(zikr.target.toString());
    setModalVisible(true);
  };

  const handleSave = async () => {
    const trimedName = nameInput.trim();
    const parsedTarget = parseInt(targetInput);

    if (!trimedName) {
      Alert.alert("Name required", "Please enter a name for the zikr.");
      return;
    }
    if (!parsedTarget || parsedTarget <= 0) {
      Alert.alert("Target required", "Please enter a valid target for the zikr.");
      return;
    }
    let updated;
    if (editingZikr) {
      updated = await updateZikr(editingZikr.id, {
        name: trimedName,
        target: parsedTarget,
      });
    } else {
      updated = await addZikr(trimedName, parsedTarget);
    }
    setZikrs(updated);
    setModalVisible(false);
  };

  const handleDelete = async () => {
    if (!editingZikr) return;
    Alert.alert("Delete Zikr", "Are you sure you want to delete this zikr?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const updated = await deleteZikr(editingZikr.id);
          setZikrs(updated);
          setModalVisible(false);
        },
      },
    ]);
  };

  const renderItem = ({ item }) => {
    const progress = Math.min(item.count / item.target, 1);
    const done = item.count >= item.target;
    const streak = getStreak(item);

    return (
      <TouchableOpacity
        style={[styles.card, done && styles.cardDone]}
        onPress={() => handleTap(item.id)}
        onLongPress={() => openEditModal(item)}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.name}>{item.name}</Text>
          {streak > 0 && <Text style={styles.streak}>Streak 🔥: {streak}</Text>}
        </View>
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
      <View style={styles.container}>
        <Text style={styles.title}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Zikrs</Text>
        <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={zikrs}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
      <AddModal
        visible={modalVisible}
        editingZikr={editingZikr}
        nameInput={nameInput}
        targetInput={targetInput}
        setNameInput={setNameInput}
        setTargetInput={setTargetInput}
        onClose={() => setModalVisible(false)}
        handleSave={handleSave}
        handleDelete={handleDelete}
      />
    </View>
  );
};

export default ZikrList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#2e8b57",
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: { color: "#fff", fontSize: 22, lineHeight: 24 },
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
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
  },
  count: {
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
  },
  streak: {
    fontSize: 14,
    color: "#e07b00",
    fontWeight: "600",
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