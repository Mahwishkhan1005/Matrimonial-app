import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { useNavigation, useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";

const TopNavBar = ({
  title,
  showBack = false,
}: {
  title: string;
  showBack?: boolean;
}) => {
  const navigation = useNavigation();
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace("/");
  };

  return (
    // SafeAreaView automatically handles the exact notch/status bar height natively
    <SafeAreaView edges={["top"]} className="bg-[#0A1C14]">
      <View className="flex-row items-center justify-between px-6 py-4 border-b border-[#C5A059]/20 shadow-md">
        {/* Left Area: Back Button (Optional) & Hamburger Menu */}
        <View className="flex-row items-center w-24 gap-4">
          {showBack && (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={26} color="#C5A059" />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          >
            <Ionicons name="menu-outline" size={30} color="#C5A059" />
          </TouchableOpacity>
        </View>

        {/* Center Area: Title */}
        <Text
          style={{ fontFamily: "RoyalBold" }}
          className="text-white text-xl tracking-wide flex-1 text-center"
          numberOfLines={1}
        >
          {title}
        </Text>

        {/* Right Area: Logout Button */}
        <View className="w-24 items-end">
          <TouchableOpacity
            onPress={handleLogout}
            className="bg-[#C5A059]/10 p-2 rounded-full border border-[#C5A059]/30"
          >
            <Ionicons name="log-out-outline" size={22} color="#C5A059" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default TopNavBar;
