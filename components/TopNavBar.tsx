import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { useNavigation, useRouter } from "expo-router";
import React, { useState } from "react";
import { Animated, Modal, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import api from "../axios/axiosInterceptor";
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
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const scaleAnim = useState(new Animated.Value(0))[0];

  const handleLogout = async () => {
    setShowLogoutModal(false);

    try {
      // Call the backend logout endpoint
      await api.post("/user/logout");
    } catch (error) {
      console.error("Backend logout error:", error);
      // We continue with local logout even if the server call fails
    } finally {
      // Clear local auth context/tokens and redirect
      await logout();
      router.replace("/");
    }
  };

  const showLogoutConfirmation = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
    setShowLogoutModal(true);
  };

  return (
    <>
      <SafeAreaView edges={["top"]} className="bg-white">
        <View className="flex-row items-center justify-between px-6 py-4 border-b border-[#2D89B5]/20 shadow-md bg-white">
          {/* Left Area: Back Button & Hamburger Menu */}
          <View className="flex-row items-center gap-4">
            {showBack && (
              <TouchableOpacity
                onPress={() => router.back()}
                className="w-10 h-10 rounded-full bg-[#2D89B5]/10 justify-center items-center active:opacity-70"
                activeOpacity={0.7}
              >
                <Ionicons name="arrow-back" size={22} color="#2D89B5" />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
              className="w-10 h-10 rounded-full bg-[#2D89B5]/10 justify-center items-center active:opacity-70"
              activeOpacity={0.7}
            >
              <Ionicons name="menu-outline" size={24} color="#2D89B5" />
            </TouchableOpacity>
          </View>

          {/* Center Area: Title */}
          <View className="flex-1 mx-4">
            <Text
              style={{ fontFamily: "RoyalBold" }}
              className="text-[#2D89B5] text-xl tracking-wide text-center"
              numberOfLines={1}
            >
              {title}
            </Text>
            {/* Decorative underline for title */}
            <View className="w-12 h-0.5 bg-[#2D89B5]/30 rounded-full self-center mt-1" />
          </View>

          {/* Right Area: Logout Button */}
          <View>
            <TouchableOpacity
              onPress={showLogoutConfirmation}
              className="w-10 h-10 rounded-full bg-[#E91E63]/10 justify-center items-center border border-[#E91E63]/20 active:opacity-70"
              activeOpacity={0.7}
            >
              <Ionicons name="log-out-outline" size={20} color="#E91E63" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      {/* Custom Logout Confirmation Modal */}
      <Modal
        visible={showLogoutModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View className="flex-1 bg-black/70 justify-center items-center">
          <Animated.View
            style={{
              transform: [{ scale: scaleAnim }],
            }}
            className="bg-white rounded-3xl p-6 mx-6 w-[85%] border border-[#2D89B5]/30 shadow-xl"
          >
            {/* Modal Header */}
            <View className="items-center mb-4">
              <View className="w-16 h-16 rounded-full bg-[#E91E63]/15 justify-center items-center mb-3">
                <Ionicons name="log-out-outline" size={32} color="#E91E63" />
              </View>
              <Text
                style={{ fontFamily: "RoyalBold" }}
                className="text-gray-800 text-xl text-center"
              >
                Logout Confirmation
              </Text>
              <View className="w-12 h-0.5 bg-[#2D89B5]/30 rounded-full mt-2" />
            </View>

            {/* Modal Body */}
            <Text className="text-gray-600 text-center text-base mt-2 mb-6">
              Are you sure you want to logout? You will need to login again to
              access your account.
            </Text>

            {/* Modal Actions */}
            <View className="flex-row gap-3">
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setShowLogoutModal(false)}
                className="flex-1 bg-gray-100 py-3 rounded-xl border border-gray-200"
              >
                <Text className="text-gray-700 text-center font-bold text-sm uppercase tracking-wider">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleLogout}
                className="flex-1 bg-[#E91E63] py-3 rounded-xl shadow-lg"
              >
                <View className="flex-row items-center justify-center gap-2">
                  <Ionicons name="log-out-outline" size={18} color="#FFF" />
                  <Text className="text-white text-center font-bold text-sm uppercase tracking-wider">
                    Logout
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
};

export default TopNavBar;