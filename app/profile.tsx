import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import api from "../axios/axiosInterceptor";
import { useAuth } from "../context/AuthContext";
const { width } = Dimensions.get("window");

const Profile = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get("/user/profile");
      setProfileData(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/");
  };

  const profileStats = [
    { label: "Matches", value: "42", icon: "heart-outline" },
    { label: "Views", value: "1.2k", icon: "eye-outline" },
    { label: "Interests", value: "15", icon: "paper-plane-outline" },
  ];

  const menuItems = [
    { label: "Edit Profile", icon: "person-outline", route: "/edit-profile" },
    { label: "My Photos", icon: "camera-outline", route: "/photosEdit" },
    { label: "Partner Preferences", icon: "options-outline", route: "/search" },
    {
      label: "Help & Support",
      icon: "help-circle-outline",
      onPress: () => setShowSupportModal(true),
    },
  ];

  return (
    <View className="flex-1 bg-[#F0F7FA]">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header/Hero Section */}
        <LinearGradient
          colors={["#2D89B5", "#1E5F7E"]}
          className="pb-12 px-6 items-center rounded-b-[50px] shadow-xl"
          style={{ paddingTop: insets.top + 20 }}
        >
          <View className="relative">
            <View className="w-32 h-32 rounded-full border-4 border-white/30 p-1">
              <Image
                source={
                  profileData?.images && profileData.images.length > 0
                    ? { uri: profileData.images[0] }
                    : require("../assets/images/groom1.png")
                }
                className="w-full h-full rounded-full"
                resizeMode="cover"
              />
            </View>
            <TouchableOpacity
              className="absolute bottom-0 right-0 bg-[#E91E63] w-10 h-10 rounded-full items-center justify-center border-4 border-[#2D89B5] shadow-lg"
              onPress={() => router.push("/photosEdit")}
            >
              <Ionicons name="camera" size={18} color="#FFF" />
            </TouchableOpacity>
          </View>

          <Text
            style={{ fontFamily: "RoyalBold" }}
            className="text-white text-3xl mt-4"
          >
            {profileData?.name || user?.name || "User"}
          </Text>
          <View className="bg-white/20 px-4 py-1 rounded-full mt-2 border border-white/30">
            <Text className="text-white text-[10px] font-bold uppercase tracking-[2px]">
              Premium Member
            </Text>
          </View>

          {/* Stats Row */}
          <View className="flex-row justify-around w-full mt-8 bg-white/10 p-5 rounded-[30px] border border-white/20">
            {profileStats.map((stat, index) => (
              <View key={index} className="items-center">
                <Text
                  style={{ fontFamily: "RoyalBold" }}
                  className="text-white text-xl"
                >
                  {stat.value}
                </Text>
                <Text className="text-white/60 text-[10px] uppercase tracking-tighter">
                  {stat.label}
                </Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* Profile Completion Card */}
        <View className="px-6 mb-8 -mt-6">
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push("/edit-profile")}
            className="bg-white p-6 rounded-[32px] border border-blue-50 flex-row items-center justify-between shadow-xl"
          >
            <View className="flex-1 mr-4">
              <Text
                style={{ fontFamily: "RoyalBold" }}
                className="text-[#2D89B5] text-lg"
              >
                Profile Strength
              </Text>
              <Text className="text-gray-400 text-xs mt-1">
                Get 5x more interests by completing your profile.
              </Text>
              <View className="h-2 bg-blue-50 rounded-full mt-4 overflow-hidden">
                <View className="h-full bg-[#E91E63] w-[65%]" />
              </View>
            </View>
            <View className="bg-[#E91E63] w-12 h-12 rounded-2xl items-center justify-center shadow-lg shadow-pink-200">
              <Ionicons name="arrow-forward" size={24} color="#FFF" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        <View className="px-6 mb-10">
          <Text className="text-[#2D89B5] text-xs font-bold uppercase tracking-[2px] mb-4 ml-2">
            Account Settings
          </Text>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() =>
                item.onPress ? item.onPress() : router.push(item.route as any)
              }
              className="flex-row items-center bg-white p-5 rounded-2xl mb-3 border border-blue-50 shadow-sm"
            >
              <View className="bg-[#2D89B5] p-2.5 rounded-xl shadow-sm shadow-blue-200">
                <Ionicons name={item.icon as any} size={20} color="white" />
              </View>
              <Text className="text-gray-700 text-base ml-4 flex-1 font-semibold">
                {item.label}
              </Text>
              <Ionicons
                name="chevron-forward"
                size={18}
                color="#2D89B5"
                opacity={0.3}
              />
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            onPress={handleLogout}
            className="flex-row items-center bg-white p-5 rounded-2xl mt-4 border border-red-50 shadow-sm"
          >
            <View className="bg-red-500 p-2.5 rounded-xl shadow-sm shadow-red-200">
              <Ionicons name="log-out-outline" size={20} color="white" />
            </View>
            <Text className="text-[#ff4444] text-base ml-4 font-bold">
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Help & Support Modal */}
      <Modal
        visible={showSupportModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSupportModal(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-[40px] p-8 border-t border-gray-100 shadow-2xl">
            <View className="flex-row justify-between items-center mb-6">
              <View>
                <Text className="text-gray-400 text-xs uppercase tracking-widest">
                  Connect with us
                </Text>
                <Text
                  style={{ fontFamily: "RoyalBold" }}
                  className="text-[#2D89B5] text-2xl"
                >
                  Help & Support
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowSupportModal(false)}
                className="bg-gray-100 p-2 rounded-full"
              >
                <Ionicons name="close" size={20} color="#2D89B5" />
              </TouchableOpacity>
            </View>

            <View className="space-y-4">
              <TouchableOpacity className="flex-row items-center bg-gray-50 p-5 rounded-2xl border border-gray-100 mb-3 shadow-sm">
                <View className="bg-[#E91E63]/10 p-3 rounded-xl">
                  <Ionicons name="mail-outline" size={24} color="#E91E63" />
                </View>
                <View className="ml-4">
                  <Text className="text-gray-400 text-[10px] uppercase font-bold">
                    Email Us
                  </Text>
                  <Text className="text-gray-800 text-base">
                    support@weddingbells.com
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity className="flex-row items-center bg-gray-50 p-5 rounded-2xl border border-gray-100 mb-3 shadow-sm">
                <View className="bg-[#2D89B5]/10 p-3 rounded-xl">
                  <Ionicons name="call-outline" size={24} color="#2D89B5" />
                </View>
                <View className="ml-4">
                  <Text className="text-gray-400 text-[10px] uppercase font-bold">
                    Call Us
                  </Text>
                  <Text className="text-gray-800 text-base">
                    +91 98765 43210
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity className="flex-row items-center bg-gray-50 p-5 rounded-2xl border border-gray-100 shadow-sm">
                <View className="bg-[#E91E63]/10 p-3 rounded-xl">
                  <Ionicons
                    name="chatbubbles-outline"
                    size={24}
                    color="#E91E63"
                  />
                </View>
                <View className="ml-4">
                  <Text className="text-gray-400 text-[10px] uppercase font-bold">
                    Live Chat
                  </Text>
                  <Text className="text-gray-800 text-base">
                    Start a conversation
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <Text className="text-gray-400 text-[10px] text-center mt-8">
              Our support team is available from 10:00 AM to 08:00 PM (IST).
            </Text>
            <View style={{ height: insets.bottom + 20 }} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Profile;
