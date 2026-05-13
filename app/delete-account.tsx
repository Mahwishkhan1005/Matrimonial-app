import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
    Alert,
    Animated,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import TopNavBar from "../components/TopNavBar";
import { useAuth } from "../context/AuthContext";

const DeleteAccount = () => {
  const router = useRouter();
  const { logout } = useAuth();

  const [confirmText, setConfirmText] = useState("");

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Warning icon pulse animation
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );
    pulseLoop.start();

    return () => pulseLoop.stop();
  }, [fadeAnim, slideAnim, pulseAnim]);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleDelete = () => {
    dismissKeyboard();

    if (confirmText !== "DELETE") {
      Alert.alert(
        "Action Required",
        "Please type DELETE to confirm account removal.",
      );
      return;
    }

    Alert.alert(
      "Final Confirmation",
      "Are you absolutely sure? This action cannot be undone and all your data will be permanently erased.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes, Delete Everything",
          style: "destructive",
          onPress: async () => {
            // Log the user out and redirect to the login screen
            await logout();
            router.replace("/");
          },
        },
      ],
    );
  };

  const WarningBullet = ({ text }: { text: string }) => (
    <View className="flex-row items-center mb-3 pr-4">
      <View className="w-6 h-6 rounded-full bg-red-100 items-center justify-center mr-3">
        <Ionicons name="close" size={14} color="#ef4444" />
      </View>
      <Text className="text-gray-600 font-medium text-sm">{text}</Text>
    </View>
  );

  return (
    <View className="flex-1 bg-[#F0F7FA]">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <TopNavBar title="Delete Account" />

        <TouchableWithoutFeedback onPress={dismissKeyboard}>
          <ScrollView
            className="flex-1 px-6 pt-6"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
            keyboardShouldPersistTaps="handled"
          >
            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }}
            >
              {/* Warning Header */}
              <View className="items-center mb-8 mt-4">
                <Animated.View
                  style={{ transform: [{ scale: pulseAnim }] }}
                  className="w-24 h-24 rounded-full bg-red-50 items-center justify-center border border-red-100 mb-6 shadow-sm shadow-red-100"
                >
                  <Ionicons name="warning-outline" size={48} color="#ef4444" />
                </Animated.View>
                <Text className="text-[#333] text-2xl font-RoyalBold text-center tracking-wide">
                  We're sorry to see you go.
                </Text>
                <Text className="text-gray-500 font-medium text-sm text-center mt-3 px-2">
                  Deleting your account is permanent. Please read the
                  information below carefully before proceeding.
                </Text>
              </View>

              {/* Data Loss Warning Box */}
              <View className="bg-white p-6 rounded-[30px] border border-red-100 mb-8 shadow-md shadow-red-50">
                <Text className="text-red-500 text-sm font-RoyalBold uppercase tracking-wider mb-4 border-b border-red-50 pb-3">
                  What you will lose:
                </Text>

                <WarningBullet text="Your profile, photos, and personal details" />
                <WarningBullet text="All your matches and conversation history" />
                <WarningBullet text="Any active Premium Membership subscriptions" />
                <WarningBullet text="Your saved preferences and viewed contacts" />
              </View>

              {/* Confirmation Input Box */}
              <View className="bg-white p-6 rounded-[30px] border border-gray-200 mb-8 shadow-sm shadow-blue-50">
                <Text className="text-gray-700 text-sm font-bold mb-4">
                  To confirm deletion, please type{" "}
                  <Text className="text-red-500 font-black tracking-widest">
                    DELETE
                  </Text>{" "}
                  below:
                </Text>
                <View className="h-14 bg-red-50/50 rounded-2xl border border-red-100 px-5 justify-center">
                  <TextInput
                    className="flex-1 text-[#333] font-bold text-base tracking-widest"
                    value={confirmText}
                    onChangeText={setConfirmText}
                    placeholder="Type DELETE"
                    placeholderTextColor="rgba(239, 68, 68, 0.4)"
                    autoCapitalize="characters"
                    autoCorrect={false}
                  />
                </View>
              </View>

              {/* Action Buttons */}
              <View className="flex-row gap-4 mb-6">
                <TouchableOpacity
                  activeOpacity={0.8}
                  className="flex-1 bg-white h-14 rounded-2xl justify-center items-center border border-blue-100 shadow-sm"
                  onPress={() => router.back()}
                >
                  <Text className="text-[#2D89B5] font-black text-sm uppercase tracking-wider">
                    Keep Account
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  className={`flex-1 h-14 rounded-2xl justify-center items-center flex-row gap-2 shadow-sm ${
                    confirmText === "DELETE"
                      ? "bg-red-500 shadow-red-200"
                      : "bg-red-200"
                  }`}
                  onPress={handleDelete}
                  disabled={confirmText !== "DELETE"}
                >
                  <Ionicons
                    name="trash-outline"
                    size={20}
                    color={
                      confirmText === "DELETE"
                        ? "#FFF"
                        : "rgba(255,255,255,0.6)"
                    }
                  />
                  <Text
                    className={`font-extrabold text-sm tracking-widest uppercase ${
                      confirmText === "DELETE" ? "text-white" : "text-white/70"
                    }`}
                  >
                    Delete
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
};

export default DeleteAccount;
