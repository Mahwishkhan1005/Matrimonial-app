import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
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
import { useAuth } from "../context/AuthContext";
const { width } = Dimensions.get("window");

const Profile = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [showSupportModal, setShowSupportModal] = useState(false);

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
    <View className="flex-1 bg-[#010302]">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header/Hero Section */}
        <LinearGradient
          colors={["#0B2B1F", "#010302"]}
          className="pt-12 pb-8 px-6 items-center"
          style={{ paddingTop: insets.top + 20 }}
        >
          <View className="relative">
            <View className="w-32 h-32 rounded-full border-2 border-[#C5A059] p-1">
              <Image
                source={require("../assets/images/groom1.png")}
                className="w-full h-full rounded-full"
                resizeMode="cover"
              />
            </View>
            <TouchableOpacity
              className="absolute bottom-0 right-0 bg-[#C5A059] w-10 h-10 rounded-full items-center justify-center border-4 border-[#010302]"
              onPress={() => router.push("/photosEdit")}
            >
              <Ionicons name="camera" size={18} color="#000" />
            </TouchableOpacity>
          </View>

          <Text
            style={{ fontFamily: "RoyalBold" }}
            className="text-white text-2xl mt-4"
          >
            {user?.name || "Mahwish Khan"}
          </Text>
          <Text className="text-[#C5A059] text-sm uppercase tracking-widest mt-1">
            Premium Member
          </Text>

          {/* Stats Row */}
          <View className="flex-row justify-around w-full mt-8 bg-[#0B2B1F]/40 p-5 rounded-[30px] border border-[#C5A059]/10">
            {profileStats.map((stat, index) => (
              <View key={index} className="items-center">
                <Text
                  style={{ fontFamily: "RoyalBold" }}
                  className="text-[#C5A059] text-xl"
                >
                  {stat.value}
                </Text>
                <Text className="text-white/40 text-[10px] uppercase tracking-tighter">
                  {stat.label}
                </Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* Profile Completion Card */}
        <View className="px-6 mb-8">
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push("/edit-profile")}
            className="bg-[#0B2B1F] p-5 rounded-3xl border border-[#C5A059]/20 flex-row items-center justify-between"
          >
            <View className="flex-1 mr-4">
              <Text
                style={{ fontFamily: "RoyalBold" }}
                className="text-white text-lg"
              >
                Complete Your Profile
              </Text>
              <Text className="text-white/60 text-xs mt-1">
                A complete profile gets 5x more interests.
              </Text>
              <View className="h-1.5 bg-black/40 rounded-full mt-3 overflow-hidden">
                <View className="h-full bg-[#C5A059] w-[65%]" />
              </View>
            </View>
            <View className="bg-[#C5A059] w-10 h-10 rounded-full items-center justify-center">
              <Ionicons name="arrow-forward" size={20} color="#000" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        <View className="px-6 mb-10">
          <Text className="text-white/40 text-xs uppercase tracking-widest mb-4 ml-2">
            Account Settings
          </Text>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() =>
                item.onPress ? item.onPress() : router.push(item.route as any)
              }
              className="flex-row items-center bg-[#0B2B1F]/20 p-5 rounded-2xl mb-3 border border-[#C5A059]/10"
            >
              <View className="bg-[#C5A059]/10 p-2 rounded-xl">
                <Ionicons name={item.icon as any} size={20} color="#C5A059" />
              </View>
              <Text className="text-white text-base ml-4 flex-1">
                {item.label}
              </Text>
              <Ionicons name="chevron-forward" size={18} color="#C5A059/40" />
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            onPress={handleLogout}
            className="flex-row items-center bg-red-900/10 p-5 rounded-2xl mt-4 border border-red-900/20"
          >
            <View className="bg-red-900/20 p-2 rounded-xl">
              <Ionicons name="log-out-outline" size={20} color="#ff4444" />
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
        <View className="flex-1 justify-end bg-black/80">
          <View className="bg-[#0B2B1F] rounded-t-[40px] p-8 border-t border-[#C5A059]/30">
            <View className="flex-row justify-between items-center mb-6">
              <View>
                <Text className="text-white/60 text-xs uppercase tracking-widest">
                  Connect with us
                </Text>
                <Text
                  style={{ fontFamily: "RoyalBold" }}
                  className="text-white text-2xl"
                >
                  Help & Support
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowSupportModal(false)}
                className="bg-white/10 p-2 rounded-full"
              >
                <Ionicons name="close" size={20} color="#C5A059" />
              </TouchableOpacity>
            </View>

            <View className="space-y-4">
              <TouchableOpacity className="flex-row items-center bg-black/20 p-5 rounded-2xl border border-[#C5A059]/10 mb-3">
                <View className="bg-[#C5A059]/10 p-3 rounded-xl">
                  <Ionicons name="mail-outline" size={24} color="#C5A059" />
                </View>
                <View className="ml-4">
                  <Text className="text-white/40 text-[10px] uppercase font-bold">
                    Email Us
                  </Text>
                  <Text className="text-white text-base">
                    support@eternalpartner.com
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity className="flex-row items-center bg-black/20 p-5 rounded-2xl border border-[#C5A059]/10 mb-3">
                <View className="bg-[#C5A059]/10 p-3 rounded-xl">
                  <Ionicons name="call-outline" size={24} color="#C5A059" />
                </View>
                <View className="ml-4">
                  <Text className="text-white/40 text-[10px] uppercase font-bold">
                    Call Us
                  </Text>
                  <Text className="text-white text-base">+91 98765 43210</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity className="flex-row items-center bg-black/20 p-5 rounded-2xl border border-[#C5A059]/10">
                <View className="bg-[#C5A059]/10 p-3 rounded-xl">
                  <Ionicons
                    name="chatbubbles-outline"
                    size={24}
                    color="#C5A059"
                  />
                </View>
                <View className="ml-4">
                  <Text className="text-white/40 text-[10px] uppercase font-bold">
                    Live Chat
                  </Text>
                  <Text className="text-white text-base">
                    Start a conversation
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <Text className="text-white/30 text-[10px] text-center mt-8">
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
