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

  // Reusable Component for Password Inputs to keep code clean
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
          <Text className="text-[#C5A059] text-xs font-RoyalBold">{label}</Text>
          <Text className="text-red-500 font-bold ml-1">*</Text>
        </View>
        <View className="flex-row items-center bg-white/5 rounded-2xl border border-[#C5A059]/20 overflow-hidden h-14">
          <View className="w-12 h-full justify-center items-center bg-[#C5A059]/10">
            <Ionicons name="lock-closed-outline" size={20} color="#C5A059" />
          </View>
          <TextInput
            className="flex-1 text-white text-base px-3"
            style={
              Platform.OS === "android"
                ? { paddingVertical: 0, includeFontPadding: false }
                : {}
            }
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="rgba(255, 255, 255, 0.3)"
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
              color="#C5A059"
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-[#010302]">
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
              <View className="w-20 h-20 rounded-full bg-[#C5A059]/10 items-center justify-center border border-[#C5A059]/30 mb-4">
                <Ionicons
                  name="shield-checkmark-outline"
                  size={36}
                  color="#C5A059"
                />
              </View>
              <Text className="text-white text-lg font-RoyalBold text-center">
                Secure Your Account
              </Text>
              <Text className="text-white/50 text-xs text-center mt-2 px-4">
                Please enter your current password to create a new one. Make
                sure it's strong and unique.
              </Text>
            </View>

            <View className="bg-[#12402D]/40 p-6 rounded-[30px] border border-[#C5A059]/20 mb-8 shadow-lg">
              <PasswordInput
                label="Current Password"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                showPassword={showCurrent}
                setShowPassword={setShowCurrent}
                placeholder="Enter current password"
              />

              <View className="h-[1px] w-full bg-[#C5A059]/10 my-2" />

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
                className="flex-1 bg-white/10 h-14 rounded-2xl justify-center items-center border border-[#C5A059]/20"
                onPress={() => router.back()}
              >
                <Text className="text-white font-bold text-sm uppercase tracking-wider">
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                className="flex-1 bg-[#C5A059] h-14 rounded-2xl justify-center items-center shadow-lg flex-row gap-2"
                onPress={handleUpdatePassword}
              >
                <Ionicons
                  name="checkmark-circle-outline"
                  size={20}
                  color="#0B2B1F"
                />
                <Text className="text-[#0B2B1F] font-extrabold text-sm tracking-widest uppercase">
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
