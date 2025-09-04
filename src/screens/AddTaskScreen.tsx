import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker"; // ✅ Native Picker
import moment from "moment";
import * as Haptics from "expo-haptics";

import { useTask } from "../context/TaskContext";
import { useNotification } from "../context/NotificationContext";
import DaySelector from "../components/DaySelector";

const AddTaskScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { addTask } = useTask();
  const { scheduleNotification, requestPermissions } = useNotification();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [category, setCategory] = useState("Personal");
  const [reminder, setReminder] = useState(true);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringDays, setRecurringDays] = useState<number[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const categories = [
    { label: "Personal", value: "Personal" },
    { label: "Work", value: "Work" },
    { label: "Health", value: "Health" },
    { label: "Education", value: "Education" },
    { label: "Shopping", value: "Shopping" },
    { label: "Travel", value: "Travel" },
    { label: "Other", value: "Other" },
  ];

  const priorities = [
    { label: "Low Priority", value: "low" },
    { label: "Medium Priority", value: "medium" },
    { label: "High Priority", value: "high" },
  ];

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a task title");
      return;
    }

    if (isRecurring && recurringDays.length === 0) {
      Alert.alert(
        "Error",
        "Please select at least one day for recurring tasks"
      );
      return;
    }

    if (
      date < new Date() &&
      moment(date).format("YYYY-MM-DD") !== moment().format("YYYY-MM-DD")
    ) {
      Alert.alert("Error", "Cannot set tasks for past dates");
      return;
    }

    try {
      if (reminder) {
        const hasPermission = await requestPermissions();
        if (!hasPermission) {
          Alert.alert(
            "Notification Permission",
            "Please enable notifications to receive task reminders",
            [
              { text: "Cancel", style: "cancel" },
              { text: "Settings", onPress: () => {} },
            ]
          );
        }
      }

      const taskData = {
        title: title.trim(),
        description: description.trim(),
        date: moment(date).format("YYYY-MM-DD"),
        time: moment(time).format("HH:mm"),
        priority,
        category,
        completed: false,
        reminder,
        isRecurring,
        recurringDays,
      };

      await addTask(taskData);

      // Schedule notification if reminder is enabled
      if (reminder) {
        const task = {
          ...taskData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await scheduleNotification(task);
      }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Failed to save task. Please try again.");
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setTime(selectedTime);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Add New Task</Text>
            <Text style={styles.headerSubtitle}>
              Create a new task with details
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Task Title *</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Enter task title"
                placeholderTextColor="#9ca3af"
                maxLength={100}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Enter task description (optional)"
                placeholderTextColor="#9ca3af"
                multiline
                numberOfLines={4}
                maxLength={500}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>Date</Text>
                <TouchableOpacity
                  style={styles.pickerButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={styles.pickerText}>
                    {moment(date).format("MMM DD, YYYY")}
                  </Text>
                  <Ionicons name="calendar-outline" size={20} color="#6b7280" />
                </TouchableOpacity>
              </View>

              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>Time</Text>
                <TouchableOpacity
                  style={styles.pickerButton}
                  onPress={() => setShowTimePicker(true)}
                >
                  <Text style={styles.pickerText}>
                    {moment(time).format("HH:mm")}
                  </Text>
                  <Ionicons name="time-outline" size={20} color="#6b7280" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>Priority</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={priority}
                    onValueChange={(value) => setPriority(value)}
                    style={styles.picker}
                  >
                    {priorities.map((item) => (
                      <Picker.Item
                        key={item.value}
                        label={item.label}
                        value={item.value}
                      />
                    ))}
                  </Picker>
                </View>
              </View>

              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>Category</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={category}
                    onValueChange={(value) => setCategory(value)}
                    style={styles.picker}
                  >
                    {categories.map((item) => (
                      <Picker.Item
                        key={item.value}
                        label={item.label}
                        value={item.value}
                      />
                    ))}
                  </Picker>
                </View>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <TouchableOpacity
                style={styles.reminderToggle}
                onPress={() => setReminder(!reminder)}
              >
                <View style={styles.reminderContent}>
                  <Ionicons
                    name={reminder ? "notifications" : "notifications-off"}
                    size={24}
                    color={reminder ? "#6366f1" : "#9ca3af"}
                  />
                  <View style={styles.reminderTextContainer}>
                    <Text style={styles.reminderTitle}>Enable Reminder</Text>
                    <Text style={styles.reminderSubtitle}>
                      Get notified 5 minutes before task time
                    </Text>
                  </View>
                </View>
                <View style={[styles.toggle, reminder && styles.toggleActive]}>
                  <View
                    style={[
                      styles.toggleThumb,
                      reminder && styles.toggleThumbActive,
                    ]}
                  />
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <TouchableOpacity
                style={styles.reminderToggle}
                onPress={() => setIsRecurring(!isRecurring)}
              >
                <View style={styles.reminderContent}>
                  <Ionicons
                    name={isRecurring ? "repeat" : "repeat-outline"}
                    size={24}
                    color={isRecurring ? "#6366f1" : "#9ca3af"}
                  />
                  <View style={styles.reminderTextContainer}>
                    <Text style={styles.reminderTitle}>Recurring Task</Text>
                    <Text style={styles.reminderSubtitle}>
                      Repeat this task on selected days
                    </Text>
                  </View>
                </View>
                <View
                  style={[styles.toggle, isRecurring && styles.toggleActive]}
                >
                  <View
                    style={[
                      styles.toggleThumb,
                      isRecurring && styles.toggleThumbActive,
                    ]}
                  />
                </View>
              </TouchableOpacity>
            </View>

            {isRecurring && (
              <DaySelector
                selectedDays={recurringDays}
                onDayToggle={(day) => {
                  setRecurringDays((prev) =>
                    prev.includes(day)
                      ? prev.filter((d) => d !== day)
                      : [...prev, day]
                  );
                }}
              />
            )}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <LinearGradient
              colors={["#6366f1", "#8b5cf6"]}
              style={styles.saveButtonGradient}
            >
              <Text style={styles.saveButtonText}>Save Task</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={handleDateChange}
            minimumDate={new Date()}
          />
        )}

        {showTimePicker && (
          <DateTimePicker
            value={time}
            mode="time"
            display="default"
            onChange={handleTimeChange}
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#6b7280",
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#1f2937",
    backgroundColor: "#ffffff",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  pickerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
  },
  pickerText: {
    fontSize: 16,
    color: "#1f2937",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    backgroundColor: "#ffffff",
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
    color: "#1f2937",
  },
  reminderToggle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  reminderContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  reminderTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
  reminderSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 2,
  },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#d1d5db",
    padding: 2,
  },
  toggleActive: {
    backgroundColor: "#6366f1",
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#ffffff",
  },
  toggleThumbActive: {
    transform: [{ translateX: 22 }],
  },
  footer: {
    flexDirection: "row",
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    backgroundColor: "#ffffff",
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#ffffff",
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6b7280",
  },
  saveButton: {
    flex: 2,
    borderRadius: 12,
    overflow: "hidden",
  },
  saveButtonGradient: {
    paddingVertical: 16,
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
});

export default AddTaskScreen;
