import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";

import { useTask } from "../context/TaskContext";
import { useNotification } from "../context/NotificationContext";
import { useUpdate } from "../context/UpdateContext";

const SettingsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { state, dispatch } = useTask();
  const { requestPermissions } = useNotification();
  const { checkForUpdates, state: updateState } = useUpdate();

  const handleClearAllTasks = () => {
    Alert.alert(
      "Clear All Tasks",
      "Are you sure you want to delete all tasks? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear All",
          style: "destructive",
          onPress: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            dispatch({ type: "SET_TASKS", payload: [] });
            Alert.alert("Success", "All tasks have been cleared.");
          },
        },
      ]
    );
  };

  const handleExportTasks = () => {
    // In a real app, this would export tasks to a file
    Alert.alert(
      "Export Tasks",
      "This feature will be available in the next update."
    );
  };

  const handleImportTasks = () => {
    // In a real app, this would import tasks from a file
    Alert.alert(
      "Import Tasks",
      "This feature will be available in the next update."
    );
  };

  const handleNotificationSettings = async () => {
    const hasPermission = await requestPermissions();
    if (hasPermission) {
      Alert.alert("Notifications", "Notifications are enabled for this app.");
    } else {
      Alert.alert(
        "Notifications",
        "Please enable notifications in your device settings to receive task reminders.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Settings", onPress: () => {} },
        ]
      );
    }
  };

  const handleCheckForUpdates = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await checkForUpdates();
      if (!updateState.isUpdateAvailable) {
        Alert.alert(
          "No Updates",
          "You're using the latest version of the app!"
        );
      }
    } catch (error) {
      Alert.alert(
        "Update Check Failed",
        "Unable to check for updates. Please try again later."
      );
    }
  };

  const handleAbout = () => {
    Alert.alert(
      "About Task Reminder",
      "Task Reminder v1.0.0\n\nA beautiful and intuitive task management app to help you stay organized and productive.\n\nFeatures:\n• Create and manage tasks\n• Set reminders and notifications\n• Calendar view\n• Priority levels\n• Categories\n• Progress tracking\n• Recurring tasks\n• OTA updates",
      [{ text: "OK" }]
    );
  };

  const getTaskStats = () => {
    const totalTasks = state.tasks.length;
    const completedTasks = state.tasks.filter((task) => task.completed).length;
    const pendingTasks = totalTasks - completedTasks;
    const completionRate =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return { totalTasks, completedTasks, pendingTasks, completionRate };
  };

  const stats = getTaskStats();

  const settingsItems = [
    {
      title: "Notifications",
      subtitle: "Manage notification preferences",
      icon: "notifications-outline",
      onPress: handleNotificationSettings,
      showArrow: true,
    },
    {
      title: "Check for Updates",
      subtitle: "Check for app updates",
      icon: "cloud-download-outline",
      onPress: handleCheckForUpdates,
      showArrow: true,
    },
    {
      title: "Export Tasks",
      subtitle: "Export your tasks to a file",
      icon: "download-outline",
      onPress: handleExportTasks,
      showArrow: true,
    },
    {
      title: "Import Tasks",
      subtitle: "Import tasks from a file",
      icon: "upload-outline",
      onPress: handleImportTasks,
      showArrow: true,
    },
    {
      title: "Clear All Tasks",
      subtitle: "Delete all tasks permanently",
      icon: "trash-outline",
      onPress: handleClearAllTasks,
      showArrow: false,
      destructive: true,
    },
    {
      title: "About",
      subtitle: "App information and version",
      icon: "information-circle-outline",
      onPress: handleAbout,
      showArrow: true,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#6366f1", "#8b5cf6"]} style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSubtitle}>Manage your app preferences</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="list-outline" size={24} color="#6366f1" />
            <Text style={styles.statNumber}>{stats.totalTasks}</Text>
            <Text style={styles.statLabel}>Total Tasks</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons
              name="checkmark-circle-outline"
              size={24}
              color="#10b981"
            />
            <Text style={styles.statNumber}>{stats.completedTasks}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="trending-up-outline" size={24} color="#8b5cf6" />
            <Text style={styles.statNumber}>{stats.completionRate}%</Text>
            <Text style={styles.statLabel}>Success Rate</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          {settingsItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.settingItem,
                item.destructive && styles.destructiveItem,
              ]}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View style={styles.settingIcon}>
                <Ionicons
                  name={item.icon as any}
                  size={24}
                  color={item.destructive ? "#ef4444" : "#6366f1"}
                />
              </View>
              <View style={styles.settingContent}>
                <Text
                  style={[
                    styles.settingTitle,
                    item.destructive && styles.destructiveText,
                  ]}
                >
                  {item.title}
                </Text>
                <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
              </View>
              {item.showArrow && (
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={item.destructive ? "#ef4444" : "#9ca3af"}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Information</Text>
          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Version</Text>
              <Text style={styles.infoValue}>1.0.0</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Build</Text>
              <Text style={styles.infoValue}>2024.1.0</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Platform</Text>
              <Text style={styles.infoValue}>React Native</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Made with ❤️ for better productivity
          </Text>
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
  header: {
    padding: 20,
    paddingBottom: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#e0e7ff",
  },
  content: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 30,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  destructiveItem: {
    borderBottomColor: "#fee2e2",
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: "#6b7280",
  },
  destructiveText: {
    color: "#ef4444",
  },
  infoContainer: {
    backgroundColor: "#ffffff",
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  infoLabel: {
    fontSize: 16,
    color: "#6b7280",
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 16,
    color: "#1f2937",
    fontWeight: "600",
  },
  footer: {
    padding: 20,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
  },
});

export default SettingsScreen;
