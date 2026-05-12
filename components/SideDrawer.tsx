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
    <SafeAreaView className="flex-1 bg-[#010302]">
      <View className="p-6 border-b border-[#C5A059]/20">
        <Text
          style={{ fontFamily: "RoyalBold" }}
          className="text-[#C5A059] text-xl"
        >
          Profile Id: {user?.profileId || "PF27765"}
        </Text>
      </View>

      <ScrollView className="flex-1 px-4 mt-4">
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => router.push(item.route as any)}
            className="flex-row items-center p-4 mb-2 bg-[#0B2B1F]/40 rounded-xl border border-[#C5A059]/10"
          >
            <Ionicons name={item.icon as any} size={20} color="#C5A059" />
            <Text className="text-white/80 ml-4 font-medium">{item.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity
        onPress={handleSignOut}
        className="m-6 bg-[#C5A059] p-4 rounded-xl items-center flex-row justify-center"
      >
        <Ionicons name="log-out-outline" size={20} color="#0B2B1F" />
        <Text className="text-[#0B2B1F] font-bold ml-2 uppercase tracking-widest">
          Sign Out
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default SideDrawer;
