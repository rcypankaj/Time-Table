import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useUpdate } from "../context/UpdateContext";
import * as Haptics from "expo-haptics";

const { width } = Dimensions.get("window");

const UpdateNotification: React.FC = () => {
  const { state, downloadAndInstallUpdate, dismissUpdate } = useUpdate();

  const handleUpdatePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    downloadAndInstallUpdate();
  };

  const handleDismiss = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    dismissUpdate();
  };

  if (!state.isUpdateAvailable) {
    return null;
  }

  return (
    <Modal
      visible={state.isUpdateAvailable}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <LinearGradient
            colors={["#6366f1", "#8b5cf6"]}
            style={styles.gradient}
          >
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <Ionicons
                  name="cloud-download-outline"
                  size={32}
                  color="#ffffff"
                />
              </View>
              <Text style={styles.title}>Update Available</Text>
              <Text style={styles.subtitle}>
                A new version of the app is ready to download
              </Text>
            </View>

            <View style={styles.content}>
              <View style={styles.featureList}>
                <View style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                  <Text style={styles.featureText}>
                    Bug fixes and improvements
                  </Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                  <Text style={styles.featureText}>Enhanced performance</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                  <Text style={styles.featureText}>New features</Text>
                </View>
              </View>

              {state.error && (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle" size={16} color="#ef4444" />
                  <Text style={styles.errorText}>{state.error}</Text>
                </View>
              )}

              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.dismissButton}
                  onPress={handleDismiss}
                  disabled={state.isDownloading || state.isInstalling}
                >
                  <Text style={styles.dismissButtonText}>Later</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.updateButton}
                  onPress={handleUpdatePress}
                  disabled={state.isDownloading || state.isInstalling}
                >
                  <LinearGradient
                    colors={["#ffffff", "#f8fafc"]}
                    style={styles.updateButtonGradient}
                  >
                    {state.isDownloading || state.isInstalling ? (
                      <View style={styles.loadingContainer}>
                        <ActivityIndicator size="small" color="#6366f1" />
                        <Text style={styles.updateButtonText}>
                          {state.isDownloading
                            ? "Downloading..."
                            : "Installing..."}
                        </Text>
                      </View>
                    ) : (
                      <View style={styles.updateButtonContent}>
                        <Ionicons name="download" size={20} color="#6366f1" />
                        <Text style={styles.updateButtonText}>Update Now</Text>
                      </View>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  container: {
    width: width - 40,
    maxWidth: 400,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  gradient: {
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#e0e7ff",
    textAlign: "center",
    lineHeight: 22,
  },
  content: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 20,
  },
  featureList: {
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: "#ffffff",
    marginLeft: 12,
    flex: 1,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    color: "#fca5a5",
    marginLeft: 8,
    flex: 1,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  dismissButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
  },
  dismissButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  updateButton: {
    flex: 2,
    borderRadius: 12,
    overflow: "hidden",
  },
  updateButtonGradient: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  updateButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  updateButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6366f1",
  },
});

export default UpdateNotification;
