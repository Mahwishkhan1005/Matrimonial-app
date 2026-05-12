import { Drawer } from "expo-router/drawer";
import SideDrawer from "../components/SideDrawer";
import { AuthProvider } from "../context/AuthContext";
import "./globals.css";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Drawer
        drawerContent={() => <SideDrawer />}
        screenOptions={{
          headerShown: false,
          drawerStyle: { width: "80%" },
        }}
      >
        <Drawer.Screen
          name="index"
          options={{ drawerItemStyle: { display: "none" } }}
        />
        <Drawer.Screen name="dashboard" />
      </Drawer>
    </AuthProvider>
  );
}
