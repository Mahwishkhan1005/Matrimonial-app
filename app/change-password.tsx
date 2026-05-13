import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
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

// Moved outside to prevent the keyboard from closing on every keystroke
const PasswordInput = ({
  label,
  value,
  onChangeText,
  showPassword,
  setShowPassword,
  placeholder,
}: any) => {
  return (
    <View className="mb-5">
      <View className="mb-2 ml-1 flex-row">
        <Text className="text-[#2D89B5] text-xs font-RoyalBold">{label}</Text>
        <Text className="text-[#E91E63] font-bold ml-1">*</Text>
      </View>
      <View className="flex-row items-center bg-blue-50/50 rounded-2xl border border-blue-100 overflow-hidden h-14">
        <View className="w-12 h-full justify-center items-center bg-[#2D89B5]/10">
          <Ionicons name="lock-closed-outline" size={20} color="#2D89B5" />
        </View>
        <TextInput
          className="flex-1 text-[#333] text-base px-3 font-medium"
          style={
            Platform.OS === "android"
              ? { paddingVertical: 0, includeFontPadding: false }
              : {}
          }
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="rgba(45, 137, 181, 0.4)"
          secureTextEntry={!showPassword}
          autoCapitalize="none"
        />
        <TouchableOpacity
          className="h-full justify-center px-4"
          onPress={() => setShowPassword(!showPassword)}
        >
          <Ionicons
            name={showPassword ? "eye-outline" : "eye-off-outline"}
            size={20}
            color="#2D89B5"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const ChangePassword = () => {
  const router = useRouter();

  // Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Toggle State for Password Visibility
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleUpdatePassword = () => {
    dismissKeyboard();

    // 1. Check for empty fields
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Required Fields", "Please fill in all password fields.");
      return;
    }

    // 2. Check if new passwords match
    if (newPassword !== confirmPassword) {
      Alert.alert(
        "Mismatch",
        "New password and Confirm password do not match.",
      );
      return;
    }

    // 3. Validate Strict Password Policy (Same as Login Page)
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      Alert.alert(
        "Security Requirement",
        "New password must be at least 8 characters and include:\n• One Uppercase letter\n• One Lowercase letter\n• One Number\n• One Special Character (@, $, !, %, *, ?, &)",
      );
      return;
    }

    // 4. Check if new password is same as old
    if (currentPassword === newPassword) {
      Alert.alert(
        "Invalid Entry",
        "New password cannot be the same as your current password.",
      );
      return;
    }

    // Success State
    Alert.alert("Success", "Your password has been successfully updated.", [
      {
        text: "OK",
        onPress: () => router.back(),
      },
    ]);
  };

  return (
    <View className="flex-1 bg-[#F0F7FA]">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <TopNavBar title="Change Password" />

        <TouchableWithoutFeedback onPress={dismissKeyboard}>
          <ScrollView
            className="flex-1 px-6 pt-6"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
            keyboardShouldPersistTaps="handled"
          >
            <View className="items-center mb-8 mt-4">
              <View className="w-20 h-20 rounded-full bg-[#E91E63]/10 items-center justify-center border border-pink-100 mb-4 shadow-sm">
                <Ionicons
                  name="shield-checkmark-outline"
                  size={36}
                  color="#E91E63"
                />
              </View>
              <Text className="text-[#2D89B5] text-xl font-RoyalBold text-center">
                Secure Your Account
              </Text>
              <Text className="text-gray-500 font-medium text-xs text-center mt-2 px-4">
                Please enter your current password to create a new one. Make
                sure it's strong and unique.
              </Text>
            </View>

            <View className="bg-white p-6 rounded-[30px] border border-blue-50 mb-8 shadow-lg shadow-blue-100">
              <PasswordInput
                label="Current Password"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                showPassword={showCurrent}
                setShowPassword={setShowCurrent}
                placeholder="Enter current password"
              />

              <View className="h-[1px] w-full bg-blue-50 my-2" />

              <View className="mt-4">
                <PasswordInput
                  label="New Password"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  showPassword={showNew}
                  setShowPassword={setShowNew}
                  placeholder="Enter new password"
                />

                <PasswordInput
                  label="Confirm New Password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  showPassword={showConfirm}
                  setShowPassword={setShowConfirm}
                  placeholder="Re-enter new password"
                />
              </View>
            </View>

            <View className="flex-row gap-4 mb-6">
              <TouchableOpacity
                activeOpacity={0.8}
                className="flex-1 bg-white h-14 rounded-2xl justify-center items-center border border-blue-100 shadow-sm"
                onPress={() => router.back()}
              >
                <Text className="text-[#2D89B5] font-black text-sm uppercase tracking-wider">
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                className="flex-1 bg-[#2D89B5] h-14 rounded-2xl justify-center items-center shadow-md shadow-blue-200 flex-row gap-2"
                onPress={handleUpdatePassword}
              >
                <Ionicons
                  name="checkmark-circle-outline"
                  size={20}
                  color="#FFF"
                />
                <Text className="text-white font-black text-sm tracking-widest uppercase">
                  Update
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ChangePassword;
