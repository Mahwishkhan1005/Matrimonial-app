import { Drawer } from "expo-router/drawer";
import SideDrawer from "../components/SideDrawer";
import { AuthProvider } from "../context/AuthContext";
import "./globals.css";
 
export default function RootLayout() {
  return (
    <AuthProvider>
      <Drawer
        // Uses your custom sidebar UI
        drawerContent={() => <SideDrawer />}
        // Prevents the back button from returning to the login screen
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
 
        {/* Your Dashboard and other screens */}
        <Drawer.Screen name="dashboard" />
        <Drawer.Screen name="edit-profile" />
        <Drawer.Screen name="contacts" />
        <Drawer.Screen name="membership" />
        <Drawer.Screen name="search" />
        {/* If you created the payments file as well, you can uncomment the line below */}
        {/* <Drawer.Screen name="payments" /> */}
      </Drawer>
    </AuthProvider>
  );
}
