import React from "react";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native";

const AddModal = ({
  visible,
  editingZikr,
  nameInput,
  targetInput,
  setNameInput, // was: called nameInput(text) directly
  setTargetInput, // was: called targetInput(text) directly
  onClose, // was: called visible(false) directly
  handleSave,
  handleDelete,
}) => {
  const handleChangeName = (text) => {
    nameInput(text);
  };
  const handleChangeTarget = (text) => {
    targetInput(text);
  };
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalBox}>
          <Text style={styles.title}>
            {editingZikr ? "Edit Zikr" : "Add Zikr"}
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Zikr name"
            value={nameInput}
            onChangeText={setNameInput}
          />
          <TextInput
            style={styles.input}
            placeholder="Zikr target"
            value={targetInput}
            onChangeText={setTargetInput}
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.canselButton} onPress={onClose}>
              <Text>Cansel</Text>
            </TouchableOpacity>
            {editingZikr && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDelete}
              >
                <Text>Delete</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalBox: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: "100%",
    marginTop: 0,
  },
  canselButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
});
