import { Drawer } from "expo-router/drawer";
import "react-native-gesture-handler"; // MUST be at the very top!
import { GestureHandlerRootView } from "react-native-gesture-handler";
import SideDrawer from "../components/SideDrawer";
import { AuthProvider } from "../context/AuthContext";
import "./globals.css";

export default function RootLayout() {
  return (
    // FIX: This wrapper prevents the blank screen
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <Drawer
          // FIX: Pass props down to prevent silent React Navigation errors
          drawerContent={() => <SideDrawer />}
          backBehavior="history"
          screenOptions={{
            headerShown: false,
            drawerStyle: { width: "80%" },
          }}
        >
          {/* Your Login Screen (hidden from standard drawer menus) */}
          <Drawer.Screen
            name="index"
            options={{ drawerItemStyle: { display: "none" } }}
          />

          {/* Main App Screens */}
          <Drawer.Screen name="dashboard" />
          <Drawer.Screen name="edit-profile" />
          <Drawer.Screen name="contacts" />
          <Drawer.Screen name="photosEdit" />
          <Drawer.Screen name="membership" />
          <Drawer.Screen name="payments" />
          <Drawer.Screen name="search" />

          {/* Profile & Match Screens (FIX: Added all missing screens) */}
          <Drawer.Screen name="groomprofiles" />
          <Drawer.Screen name="brideprofiles" />
          <Drawer.Screen name="profiledetails" />
          <Drawer.Screen name="quick-match" />

          {/* SideDrawer Specific Screens */}
          <Drawer.Screen name="about" />
          <Drawer.Screen name="change-password" />
          <Drawer.Screen name="delete-account" />
        </Drawer>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
