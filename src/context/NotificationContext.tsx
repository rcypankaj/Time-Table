import React, { createContext, useContext, useEffect, useState } from "react";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { Task } from "./TaskContext";

interface NotificationContextType {
  expoPushToken: string | undefined;
  notification: Notifications.Notification | null;
  scheduleNotification: (task: Task) => Promise<void>;
  cancelNotification: (taskId: string) => Promise<void>;
  requestPermissions: () => Promise<boolean>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>();
  const [notification, setNotification] =
    useState<Notifications.Notification | null>(null);

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        setNotification(notification);
      }
    );

    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  const registerForPushNotificationsAsync = async (): Promise<
    string | undefined
  > => {
    let token;

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
    } else {
      alert("Must use physical device for Push Notifications");
    }

    return token;
  };

  const requestPermissions = async (): Promise<boolean> => {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === "granted";
  };

  const scheduleNotification = async (task: Task): Promise<void> => {
    if (!task.reminder) return;

    const taskDate = new Date(`${task.date}T${task.time}`);
    const now = new Date();

    // Schedule notification 15 minutes before task time
    const notificationTime = new Date(taskDate.getTime() - 15 * 60 * 1000);

    if (notificationTime > now) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Task Reminder: ${task.title}`,
          body:
            task.description ||
            `Your task "${task.title}" is starting in 15 minutes`,
          data: { taskId: task.id },
          sound: true,
        },
        trigger: {
          date: notificationTime,
        },
      });

      // Also schedule a notification at the exact task time
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Task Starting: ${task.title}`,
          body: `It's time for your task "${task.title}"`,
          data: { taskId: task.id },
          sound: true,
        },
        trigger: {
          date: taskDate,
        },
      });
    }
  };

  const cancelNotification = async (taskId: string): Promise<void> => {
    const scheduledNotifications =
      await Notifications.getAllScheduledNotificationsAsync();
    const notificationsToCancel = scheduledNotifications.filter(
      (notification) => notification.content.data?.taskId === taskId
    );

    for (const notification of notificationsToCancel) {
      await Notifications.cancelScheduledNotificationAsync(
        notification.identifier
      );
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        expoPushToken,
        notification,
        scheduleNotification,
        cancelNotification,
        requestPermissions,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};
