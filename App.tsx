import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import React from "react";

// Screens
import AddTaskScreen from "./src/screens/AddTaskScreen";
import CalendarScreen from "./src/screens/CalendarScreen";
import HomeScreen from "./src/screens/HomeScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import TaskDetailScreen from "./src/screens/TaskDetailScreen";

// Context
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NotificationProvider } from "./src/context/NotificationContext";
import { TaskProvider } from "./src/context/TaskContext";
import { UpdateProvider } from "./src/context/UpdateContext";
import AppProviderContext from "./src/context/AppProviderContext";

// Components
import UpdateNotification from "./src/components/UpdateNotification";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Calendar") {
            iconName = focused ? "calendar" : "calendar-outline";
          } else if (route.name === "Settings") {
            iconName = focused ? "settings" : "settings-outline";
          } else {
            iconName = "help-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#6366f1",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopWidth: 1,
          borderTopColor: "#f3f4f6",
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <AppProviderContext>
        <UpdateProvider>
          <NotificationProvider>
            <TaskProvider>
              <NavigationContainer>
                <StatusBar style="dark" translucent />
                <Stack.Navigator
                  screenOptions={{
                    headerStyle: {
                      backgroundColor: "#6366f1",
                    },
                    headerTintColor: "#fff",
                    headerTitleStyle: {
                      fontWeight: "bold",
                    },
                    headerBackground: () => (
                      <LinearGradient
                        colors={["#6366f1", "#8b5cf6"]}
                        style={{ flex: 1 }}
                      />
                    ),
                  }}
                >
                  <Stack.Screen
                    name="Main"
                    component={TabNavigator}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="AddTask"
                    component={AddTaskScreen}
                    options={{ title: "Add New Task" }}
                  />
                  <Stack.Screen
                    name="TaskDetail"
                    component={TaskDetailScreen}
                    options={{ title: "Task Details" }}
                  />
                </Stack.Navigator>
                <UpdateNotification />
              </NavigationContainer>
            </TaskProvider>
          </NotificationProvider>
        </UpdateProvider>
      </AppProviderContext>
    </SafeAreaProvider>
  );
}
