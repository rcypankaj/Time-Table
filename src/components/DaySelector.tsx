import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

interface DaySelectorProps {
  selectedDays: number[];
  onDayToggle: (day: number) => void;
  disabled?: boolean;
}

const DaySelector: React.FC<DaySelectorProps> = ({
  selectedDays,
  onDayToggle,
  disabled = false,
}) => {
  const days = [
    { label: "Sun", value: 0, fullName: "Sunday" },
    { label: "Mon", value: 1, fullName: "Monday" },
    { label: "Tue", value: 2, fullName: "Tuesday" },
    { label: "Wed", value: 3, fullName: "Wednesday" },
    { label: "Thu", value: 4, fullName: "Thursday" },
    { label: "Fri", value: 5, fullName: "Friday" },
    { label: "Sat", value: 6, fullName: "Saturday" },
  ];

  const handleDayPress = (day: number) => {
    if (disabled) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onDayToggle(day);
  };

  const isAllDaysSelected = selectedDays.length === 7;
  const isNoDaysSelected = selectedDays.length === 0;

  const handleSelectAll = () => {
    if (disabled) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (isAllDaysSelected) {
      // Deselect all days
      days.forEach((day) => {
        if (selectedDays.includes(day.value)) {
          onDayToggle(day.value);
        }
      });
    } else {
      // Select all days
      days.forEach((day) => {
        if (!selectedDays.includes(day.value)) {
          onDayToggle(day.value);
        }
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>Repeat Days</Text>
        <TouchableOpacity
          style={[
            styles.selectAllButton,
            isAllDaysSelected && styles.selectAllButtonActive,
            disabled && styles.disabledButton,
          ]}
          onPress={handleSelectAll}
          disabled={disabled}
        >
          <Text
            style={[
              styles.selectAllText,
              isAllDaysSelected && styles.selectAllTextActive,
              disabled && styles.disabledText,
            ]}
          >
            {isAllDaysSelected ? "Clear All" : "Select All"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.daysContainer}>
        {days.map((day) => {
          const isSelected = selectedDays.includes(day.value);
          return (
            <TouchableOpacity
              key={day.value}
              style={[
                styles.dayButton,
                isSelected && styles.dayButtonSelected,
                disabled && styles.disabledButton,
              ]}
              onPress={() => handleDayPress(day.value)}
              disabled={disabled}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.dayText,
                  isSelected && styles.dayTextSelected,
                  disabled && styles.disabledText,
                ]}
              >
                {day.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {selectedDays.length > 0 && (
        <View style={styles.selectedDaysInfo}>
          <Ionicons
            name="information-circle-outline"
            size={16}
            color="#6b7280"
          />
          <Text style={styles.selectedDaysText}>
            {selectedDays.length === 7
              ? "Every day"
              : selectedDays.length === 1
              ? `Every ${
                  days.find((d) => d.value === selectedDays[0])?.fullName
                }`
              : `Selected ${selectedDays.length} days`}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  selectAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#ffffff",
  },
  selectAllButtonActive: {
    backgroundColor: "#6366f1",
    borderColor: "#6366f1",
  },
  selectAllText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6b7280",
  },
  selectAllTextActive: {
    color: "#ffffff",
  },
  daysContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  dayButton: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    minHeight: 44,
  },
  dayButtonSelected: {
    backgroundColor: "#6366f1",
    borderColor: "#6366f1",
  },
  dayText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
  },
  dayTextSelected: {
    color: "#ffffff",
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.5,
  },
  selectedDaysInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    paddingHorizontal: 4,
  },
  selectedDaysText: {
    fontSize: 14,
    color: "#6b7280",
    marginLeft: 6,
    fontStyle: "italic",
  },
});

export default DaySelector;
