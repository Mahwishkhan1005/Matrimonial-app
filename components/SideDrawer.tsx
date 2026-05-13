import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";

const SideDrawer = () => {
  const router = useRouter();
  const { user, logout } = useAuth();

  const menuItems = [
    { label: "Dashboard", icon: "home-outline", route: "/dashboard" },
    { label: "About Community", icon: "chatbubbles-outline", route: "/about" },
    {
      label: "Initial Details Edit",
      icon: "create-outline",
      route: "/edit-profile",
    },
    {
      label: "Upload Photos Edit",
      icon: "image-outline",
      route: "/photosEdit",
    },
    { label: "Groom Profiles", icon: "male-outline", route: "/groomprofiles" },
    {
      label: "Bride Profiles",
      icon: "female-outline",
      route: "/brideprofiles",
    },
    {
      label: "Change Password",
      icon: "key-outline",
      route: "/change-password",
    },
    {
      label: "Delete Profile",
      icon: "trash-outline",
      route: "/delete-account",
    },
  ];

  const handleSignOut = async () => {
    await logout();
    router.replace("/");
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F0F7FA]">
      {/* Header Section */}
      <View className="p-6 border-b border-blue-100 bg-white shadow-sm">
        <Text
          style={{ fontFamily: "RoyalBold" }}
          className="text-[#2D89B5] text-xl"
        >
          Profile Id: {user?.profileId || "PF27765"}
        </Text>
      </View>

      {/* Menu Items */}
      <ScrollView
        className="flex-1 px-4 mt-4"
        showsVerticalScrollIndicator={false}
      >
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => router.push(item.route as any)}
            className="flex-row items-center p-4 mb-3 bg-white rounded-xl border border-blue-50 shadow-sm shadow-blue-100"
          >
            <Ionicons name={item.icon as any} size={20} color="#2D89B5" />
            <Text className="text-[#333] ml-4 font-bold">{item.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Sign Out Button */}
      <TouchableOpacity
        onPress={handleSignOut}
        className="m-6 bg-[#E91E63] p-4 rounded-xl items-center flex-row justify-center shadow-lg shadow-pink-200"
      >
        <Ionicons name="log-out-outline" size={20} color="#FFF" />
        <Text className="text-white font-black ml-2 uppercase tracking-widest">
          Sign Out
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default SideDrawer;
