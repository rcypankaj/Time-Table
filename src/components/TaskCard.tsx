import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Task } from "../context/TaskContext";
import * as Haptics from "expo-haptics";

interface TaskCardProps {
  task: Task;
  onPress: () => void;
  onToggle: () => void;
  onDelete: () => void;
}

const { width } = Dimensions.get("window");

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onPress,
  onToggle,
  onDelete,
}) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

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

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const handleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onToggle();
  };

  const handleDelete = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    onDelete();
  };

  return (
    <Animated.View
      style={[styles.container, { transform: [{ scale: scaleAnim }] }]}
    >
      <TouchableOpacity
        style={styles.card}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={
            task.completed ? ["#f3f4f6", "#e5e7eb"] : ["#ffffff", "#f9fafb"]
          }
          style={styles.gradient}
        >
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Text
                style={[styles.title, task.completed && styles.completedTitle]}
                numberOfLines={2}
              >
                {task.title}
              </Text>
              <View style={styles.priorityContainer}>
                <LinearGradient
                  colors={getPriorityGradient(task.priority)}
                  style={styles.priorityBadge}
                >
                  <Text style={styles.priorityText}>
                    {task.priority.toUpperCase()}
                  </Text>
                </LinearGradient>
              </View>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  task.completed && styles.completedToggle,
                ]}
                onPress={handleToggle}
              >
                <Ionicons
                  name={task.completed ? "checkmark-circle" : "ellipse-outline"}
                  size={24}
                  color={task.completed ? "#10b981" : "#6b7280"}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDelete}
              >
                <Ionicons name="trash-outline" size={20} color="#ef4444" />
              </TouchableOpacity>
            </View>
          </View>

          {task.description && (
            <Text
              style={[
                styles.description,
                task.completed && styles.completedText,
              ]}
              numberOfLines={2}
            >
              {task.description}
            </Text>
          )}

          <View style={styles.footer}>
            <View style={styles.timeContainer}>
              <Ionicons name="time-outline" size={16} color="#6b7280" />
              <Text
                style={[
                  styles.timeText,
                  task.completed && styles.completedText,
                ]}
              >
                {task.time}
              </Text>
            </View>

            <View style={styles.categoryContainer}>
              <Ionicons name="folder-outline" size={16} color="#6b7280" />
              <Text
                style={[
                  styles.categoryText,
                  task.completed && styles.completedText,
                ]}
              >
                {task.category}
              </Text>
            </View>

            {task.reminder && (
              <View style={styles.reminderContainer}>
                <Ionicons
                  name="notifications-outline"
                  size={16}
                  color="#6366f1"
                />
                <Text style={styles.reminderText}>Reminder</Text>
              </View>
            )}

            {task.isRecurring && (
              <View style={styles.recurringContainer}>
                <Ionicons name="repeat-outline" size={16} color="#8b5cf6" />
                <Text style={styles.recurringText}>
                  {task.recurringDays.length === 7
                    ? "Daily"
                    : task.recurringDays.length === 1
                    ? "Weekly"
                    : `${task.recurringDays.length} days`}
                </Text>
              </View>
            )}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  card: {
    borderRadius: 16,
    overflow: "hidden",
  },
  gradient: {
    padding: 16,
    minHeight: 100,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 4,
  },
  completedTitle: {
    textDecorationLine: "line-through",
    color: "#9ca3af",
  },
  priorityContainer: {
    alignSelf: "flex-start",
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#ffffff",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  toggleButton: {
    padding: 4,
  },
  completedToggle: {
    opacity: 0.8,
  },
  deleteButton: {
    padding: 4,
  },
  description: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
    marginBottom: 12,
  },
  completedText: {
    color: "#9ca3af",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  timeText: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
  },
  categoryContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  categoryText: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
  },
  reminderContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  reminderText: {
    fontSize: 12,
    color: "#6366f1",
    fontWeight: "500",
  },
  recurringContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  recurringText: {
    fontSize: 12,
    color: "#8b5cf6",
    fontWeight: "500",
  },
});

export default TaskCard;
