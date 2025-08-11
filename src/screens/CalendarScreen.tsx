import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Calendar } from "react-native-calendars";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import moment from "moment";

import { useTask } from "../context/TaskContext";
import TaskCard from "../components/TaskCard";

const CalendarScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { state, getTasksByDate } = useTask();
  const [selectedDate, setSelectedDate] = useState(
    moment().format("YYYY-MM-DD")
  );

  const getMarkedDates = () => {
    const marked: any = {};

    state.tasks.forEach((task) => {
      const date = task.date;
      if (!marked[date]) {
        marked[date] = {
          marked: true,
          dotColor: task.completed ? "#10b981" : "#6366f1",
        };
      } else {
        // If multiple tasks on same date, use different color
        marked[date].dotColor = "#f59e0b";
      }
    });

    // Mark selected date
    if (marked[selectedDate]) {
      marked[selectedDate].selected = true;
      marked[selectedDate].selectedColor = "#6366f1";
    } else {
      marked[selectedDate] = {
        selected: true,
        selectedColor: "#6366f1",
      };
    }

    return marked;
  };

  const selectedDateTasks = getTasksByDate(selectedDate);
  const completedTasks = selectedDateTasks.filter((task) => task.completed);
  const pendingTasks = selectedDateTasks.filter((task) => !task.completed);

  const handleDayPress = (day: any) => {
    setSelectedDate(day.dateString);
  };

  const handleTaskPress = (task: any) => {
    navigation.navigate("TaskDetail", { task });
  };

  const handleToggleTask = async (taskId: string) => {
    // This will be handled by the TaskCard component
  };

  const handleDeleteTask = (taskId: string) => {
    // This will be handled by the TaskCard component
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

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#6366f1", "#8b5cf6"]} style={styles.header}>
        <Text style={styles.headerTitle}>Calendar</Text>
        <Text style={styles.headerSubtitle}>View your tasks by date</Text>
      </LinearGradient>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="list-outline" size={24} color="#6366f1" />
          <Text style={styles.statNumber}>{stats.totalTasks}</Text>
          <Text style={styles.statLabel}>Total Tasks</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="checkmark-circle-outline" size={24} color="#10b981" />
          <Text style={styles.statNumber}>{stats.completedTasks}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="time-outline" size={24} color="#f59e0b" />
          <Text style={styles.statNumber}>{stats.pendingTasks}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="trending-up-outline" size={24} color="#8b5cf6" />
          <Text style={styles.statNumber}>{stats.completionRate}%</Text>
          <Text style={styles.statLabel}>Success Rate</Text>
        </View>
      </View>

      <View style={styles.calendarContainer}>
        <Calendar
          onDayPress={handleDayPress}
          markedDates={getMarkedDates()}
          theme={{
            backgroundColor: "#ffffff",
            calendarBackground: "#ffffff",
            textSectionTitleColor: "#1f2937",
            selectedDayBackgroundColor: "#6366f1",
            selectedDayTextColor: "#ffffff",
            todayTextColor: "#6366f1",
            dayTextColor: "#1f2937",
            textDisabledColor: "#d1d5db",
            dotColor: "#6366f1",
            selectedDotColor: "#ffffff",
            arrowColor: "#6366f1",
            monthTextColor: "#1f2937",
            indicatorColor: "#6366f1",
            textDayFontWeight: "500",
            textMonthFontWeight: "bold",
            textDayHeaderFontWeight: "600",
            textDayFontSize: 16,
            textMonthFontSize: 18,
            textDayHeaderFontSize: 14,
          }}
        />
      </View>

      <View style={styles.tasksContainer}>
        <View style={styles.dateHeader}>
          <Text style={styles.dateTitle}>
            {moment(selectedDate).format("dddd, MMMM Do, YYYY")}
          </Text>
          <Text style={styles.taskCount}>
            {selectedDateTasks.length} task
            {selectedDateTasks.length !== 1 ? "s" : ""}
          </Text>
        </View>

        <ScrollView
          style={styles.tasksList}
          showsVerticalScrollIndicator={false}
        >
          {selectedDateTasks.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={60} color="#d1d5db" />
              <Text style={styles.emptyTitle}>No tasks for this date</Text>
              <Text style={styles.emptySubtitle}>
                Tap the + button to add a task for{" "}
                {moment(selectedDate).format("MMM DD")}
              </Text>
            </View>
          ) : (
            <>
              {pendingTasks.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Pending Tasks</Text>
                  {pendingTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onPress={() => handleTaskPress(task)}
                      onToggle={() => handleToggleTask(task.id)}
                      onDelete={() => handleDeleteTask(task.id)}
                    />
                  ))}
                </View>
              )}

              {completedTasks.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Completed Tasks</Text>
                  {completedTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onPress={() => handleTaskPress(task)}
                      onToggle={() => handleToggleTask(task.id)}
                      onDelete={() => handleDeleteTask(task.id)}
                    />
                  ))}
                </View>
              )}
            </>
          )}
        </ScrollView>
      </View>
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
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 20,
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
  calendarContainer: {
    backgroundColor: "#ffffff",
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
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
  tasksContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
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
  dateHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  dateTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 4,
  },
  taskCount: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
  },
  tasksList: {
    flex: 1,
    padding: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6b7280",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 12,
  },
});

export default CalendarScreen;
