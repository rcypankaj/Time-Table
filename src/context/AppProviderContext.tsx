import React from "react";
import { Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AppProviderContext = ({ children }: { children: React.ReactNode }) => {
  const insets = useSafeAreaInsets();
  return (
    <>
      <View
        style={{
          flex: 1,
          paddingBottom: Platform.OS === "android" ? insets.bottom : undefined,
        }}
      >
        {children}
      </View>
    </>
  );
};

export default AppProviderContext;
