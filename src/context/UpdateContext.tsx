import React, { createContext, useContext, useEffect, useState } from "react";
import * as Updates from "expo-updates";
import { Alert, Platform } from "react-native";

interface UpdateState {
  isUpdateAvailable: boolean;
  isDownloading: boolean;
  isInstalling: boolean;
  updateInfo: any | null;
  error: string | null;
}

interface UpdateContextType {
  state: UpdateState;
  checkForUpdates: () => Promise<void>;
  downloadAndInstallUpdate: () => Promise<void>;
  dismissUpdate: () => void;
}

const UpdateContext = createContext<UpdateContextType | undefined>(undefined);

export const UpdateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<UpdateState>({
    isUpdateAvailable: false,
    isDownloading: false,
    isInstalling: false,
    updateInfo: null,
    error: null,
  });

  useEffect(() => {
    // Check for updates on app start
    checkForUpdates();
  }, []);

  const checkForUpdates = async () => {
    try {
      // Skip update check in development
      if (__DEV__) {
        console.log("Skipping update check in development mode");
        return;
      }

      setState((prev) => ({ ...prev, error: null }));

      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        setState((prev) => ({
          ...prev,
          isUpdateAvailable: true,
          updateInfo: update,
        }));
      }
    } catch (error: any) {
      console.error("Error checking for updates:", error);
      setState((prev) => ({
        ...prev,
        error: error.message || "Failed to check for updates",
      }));
    }
  };

  const downloadAndInstallUpdate = async () => {
    try {
      setState((prev) => ({ ...prev, isDownloading: true, error: null }));

      // Download the update
      const downloadResult = await Updates.fetchUpdateAsync();

      if (downloadResult.isNew) {
        setState((prev) => ({
          ...prev,
          isDownloading: false,
          isInstalling: true,
        }));

        // Show alert before restarting
        Alert.alert(
          "Update Ready",
          "The update has been downloaded. The app will restart to apply the update.",
          [
            {
              text: "Restart Now",
              onPress: () => {
                Updates.reloadAsync();
              },
            },
            {
              text: "Later",
              style: "cancel",
              onPress: () => {
                setState((prev) => ({
                  ...prev,
                  isInstalling: false,
                  isUpdateAvailable: false,
                }));
              },
            },
          ]
        );
      } else {
        setState((prev) => ({
          ...prev,
          isDownloading: false,
          isUpdateAvailable: false,
        }));
      }
    } catch (error: any) {
      console.error("Error downloading update:", error);
      setState((prev) => ({
        ...prev,
        isDownloading: false,
        error: error.message || "Failed to download update",
      }));
    }
  };

  const dismissUpdate = () => {
    setState((prev) => ({
      ...prev,
      isUpdateAvailable: false,
      updateInfo: null,
    }));
  };

  return (
    <UpdateContext.Provider
      value={{
        state,
        checkForUpdates,
        downloadAndInstallUpdate,
        dismissUpdate,
      }}
    >
      {children}
    </UpdateContext.Provider>
  );
};

export const useUpdate = () => {
  const context = useContext(UpdateContext);
  if (context === undefined) {
    throw new Error("useUpdate must be used within an UpdateProvider");
  }
  return context;
};
