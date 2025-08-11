import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import moment from "moment";
import * as Haptics from "expo-haptics";

import { useTask } from "../context/TaskContext";
import { useNotification } from "../context/NotificationContext";
import { Task } from "../context/TaskContext";

const TaskDetailScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const { task } = route.params;
  const { updateTask, deleteTask } = useTask();
  const { scheduleNotification, cancelNotification } = useNotification();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "#ef4444";
      case "medium":
        return "#f59e0b";
      case "low":
        return "#10b981";
      default:
        return "#6b7280";
    }
  };

  const getPriorityGradient = (priority: string) => {
    switch (priority) {
      case "high":
        return ["#ef4444", "#dc2626"];
      case "medium":
        return ["#f59e0b", "#d97706"];
      case "low":
        return ["#10b981", "#059669"];
      default:
        return ["#6b7280", "#4b5563"];
    }
  };

  const handleToggleComplete = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const updatedTask = { ...task, completed: !task.completed };
    await updateTask(updatedTask);
  };

  const handleToggleReminder = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const updatedTask = { ...task, reminder: !task.reminder };

    if (updatedTask.reminder) {
      await scheduleNotification(updatedTask);
    } else {
      await cancelNotification(task.id);
    }

    await updateTask(updatedTask);
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Task",
      "Are you sure you want to delete this task? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            await cancelNotification(task.id);
            await deleteTask(task.id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleEdit = () => {
    navigation.navigate("AddTask", { task });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <LinearGradient
            colors={getPriorityGradient(task.priority)}
            style={styles.priorityBadge}
          >
            <Text style={styles.priorityText}>
              {task.priority.toUpperCase()}
            </Text>
          </LinearGradient>

          <Text style={[styles.title, task.completed && styles.completedTitle]}>
            {task.title}
          </Text>

          {task.description && (
            <Text
              style={[
                styles.description,
                task.completed && styles.completedText,
              ]}
            >
              {task.description}
            </Text>
          )}
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <View style={styles.detailIcon}>
              <Ionicons name="calendar-outline" size={20} color="#6366f1" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Date</Text>
              <Text
                style={[
                  styles.detailValue,
                  task.completed && styles.completedText,
                ]}
              >
                {moment(task.date).format("dddd, MMMM Do, YYYY")}
              </Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <View style={styles.detailIcon}>
              <Ionicons name="time-outline" size={20} color="#6366f1" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Time</Text>
              <Text
                style={[
                  styles.detailValue,
                  task.completed && styles.completedText,
                ]}
              >
                {moment(task.time, "HH:mm").format("h:mm A")}
              </Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <View style={styles.detailIcon}>
              <Ionicons name="folder-outline" size={20} color="#6366f1" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Category</Text>
              <Text
                style={[
                  styles.detailValue,
                  task.completed && styles.completedText,
                ]}
              >
                {task.category}
              </Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <View style={styles.detailIcon}>
              <Ionicons
                name="notifications-outline"
                size={20}
                color="#6366f1"
              />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Reminder</Text>
              <Text
                style={[
                  styles.detailValue,
                  task.completed && styles.completedText,
                ]}
              >
                {task.reminder ? "Enabled" : "Disabled"}
              </Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <View style={styles.detailIcon}>
              <Ionicons
                name="checkmark-circle-outline"
                size={20}
                color="#6366f1"
              />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Status</Text>
              <Text
                style={[
                  styles.detailValue,
                  task.completed && styles.completedText,
                ]}
              >
                {task.completed ? "Completed" : "Pending"}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.toggleButton]}
            onPress={handleToggleComplete}
          >
            <Ionicons
              name={task.completed ? "refresh-outline" : "checkmark-outline"}
              size={24}
              color={task.completed ? "#f59e0b" : "#10b981"}
            />
            <Text
              style={[
                styles.actionButtonText,
                { color: task.completed ? "#f59e0b" : "#10b981" },
              ]}
            >
              {task.completed ? "Mark Incomplete" : "Mark Complete"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.reminderButton]}
            onPress={handleToggleReminder}
          >
            <Ionicons
              name={
                task.reminder
                  ? "notifications-off-outline"
                  : "notifications-outline"
              }
              size={24}
              color="#6366f1"
            />
            <Text style={[styles.actionButtonText, { color: "#6366f1" }]}>
              {task.reminder ? "Disable Reminder" : "Enable Reminder"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={handleEdit}
          >
            <Ionicons name="create-outline" size={24} color="#8b5cf6" />
            <Text style={[styles.actionButtonText, { color: "#8b5cf6" }]}>
              Edit Task
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={handleDelete}
          >
            <Ionicons name="trash-outline" size={24} color="#ef4444" />
            <Text style={[styles.actionButtonText, { color: "#ef4444" }]}>
              Delete Task
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: "#ffffff",
    marginBottom: 16,
  },
  priorityBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 16,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#ffffff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
    lineHeight: 32,
  },
  completedTitle: {
    textDecorationLine: "line-through",
    color: "#9ca3af",
  },
  description: {
    fontSize: 16,
    color: "#6b7280",
    lineHeight: 24,
  },
  completedText: {
    color: "#9ca3af",
  },
  detailsContainer: {
    backgroundColor: "#ffffff",
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    color: "#1f2937",
    fontWeight: "600",
  },
  actionsContainer: {
    padding: 20,
    gap: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  toggleButton: {
    borderColor: "#d1fae5",
    backgroundColor: "#f0fdf4",
  },
  reminderButton: {
    borderColor: "#e0e7ff",
    backgroundColor: "#f8fafc",
  },
  editButton: {
    borderColor: "#f3e8ff",
    backgroundColor: "#faf5ff",
  },
  deleteButton: {
    borderColor: "#fee2e2",
    backgroundColor: "#fef2f2",
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});

export default TaskDetailScreen;
