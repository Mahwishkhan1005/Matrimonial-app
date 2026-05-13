import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import api from "../axios/axiosInterceptor";

const SideDrawer = () => {
  const router = useRouter();
  const [profileData, setProfileData] = useState<any>(null);
  const [storedProfileId, setStoredProfileId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

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

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchProfileDetails = async () => {
        setIsLoading(true);
        try {
          // Fetch Profile ID from AsyncStorage as requested
          const asyncProfileId = await AsyncStorage.getItem("profileId");
          if (asyncProfileId && isActive) {
            setStoredProfileId(asyncProfileId);
          }

          // Fetch Full Profile Details from API
          const response = await api.get("/user/profile");
          if (isActive && response.data) {
            setProfileData(response.data);
          }
        } catch (error) {
          console.error("Failed to load drawer profile details:", error);
        } finally {
          if (isActive) setIsLoading(false);
        }
      };

      fetchProfileDetails();

      return () => {
        isActive = false;
      };
    }, []),
  );

  // Safely extract data to display
  const displayName = profileData?.name
    ? `${profileData.name} ${profileData.surname || ""}`.trim()
    : "Loading...";

  // Use AsyncStorage ID if available, otherwise fallback to API ID
  const displayProfileId =
    storedProfileId || profileData?.profileId || "PF27765";
  const displayImage =
    profileData?.images && profileData.images.length > 0
      ? profileData.images[0]
      : null;

  return (
    <SafeAreaView className="flex-1 bg-[#F0F7FA]">
      {/* Dynamic Header Section */}
      <View className="p-6 border-b border-blue-100 bg-white shadow-sm flex-row items-center">
        {isLoading ? (
          <View className="w-16 h-16 rounded-full bg-blue-50 items-center justify-center mr-4">
            <ActivityIndicator size="small" color="#2D89B5" />
          </View>
        ) : displayImage ? (
          <Image
            source={{ uri: displayImage }}
            className="w-16 h-16 rounded-full mr-4 border-2 border-blue-100"
            resizeMode="cover"
          />
        ) : (
          <View className="w-16 h-16 rounded-full bg-blue-50 items-center justify-center mr-4 border border-blue-100">
            <Ionicons name="person" size={32} color="#2D89B5" opacity={0.5} />
          </View>
        )}

        <View className="flex-1">
          <Text
            style={{ fontFamily: "RoyalBold" }}
            className="text-[#2D89B5] text-xl mb-1"
            numberOfLines={1}
          >
            {displayName}
          </Text>
          <View className="bg-[#E91E63]/10 self-start px-2 py-1 rounded-md">
            <Text className="text-[#E91E63] text-[10px] font-black tracking-widest uppercase">
              ID: {displayProfileId}
            </Text>
          </View>
        </View>
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
        {/* Extra padding at bottom for clean scrolling */}
        <View className="h-6" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default SideDrawer;
