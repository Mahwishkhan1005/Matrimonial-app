import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  LayoutAnimation,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import api from "../axios/axiosInterceptor";

// Enable LayoutAnimation for Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width } = Dimensions.get("window");

const Register = () => {
  const router = useRouter();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");

  const [step, setStep] = useState<1 | 2>(1); // Step 1: Phone, Step 2: OTP
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- STEP 1: Request OTP ---
  const handleSendOTP = async () => {
    if (!phoneNumber) {
      Alert.alert("Required", "Please enter your Phone Number.");
      return;
    }
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      Alert.alert(
        "Invalid Number",
        "Please enter a valid 10-digit phone number.",
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post("/auth/send-otp", {
        phoneNumber: phoneNumber,
      });

      const { verified, message } = response.data;

      if (verified) {
        // If verified is true, show a popup with options to go to Create Profile or Login
        Alert.alert(
          "Already Verified",
          message || "Phone Number Already Verified",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Login",
              onPress: () => router.replace("/"), // Assuming your index/login page is "/"
            },
            {
              text: "Create Profile",
              onPress: () =>
                router.replace({
                  pathname: "/create-profile",
                  params: { phoneNumber: phoneNumber },
                }),
            },
          ],
        );
      } else {
        // If verified is false, OTP was sent successfully. Move to Step 2.
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setStep(2);
        Alert.alert(
          "OTP Sent",
          message || `An OTP has been sent to +91 ${phoneNumber}`,
        );
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data ||
        "Failed to send OTP.";
      Alert.alert(
        "Error",
        typeof errorMessage === "string" ? errorMessage : "An error occurred.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- STEP 2: Verify OTP ---
  const handleVerifyOTP = async () => {
    if (!otp || otp.length < 4) {
      Alert.alert("Invalid OTP", "Please enter a valid OTP.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post("/auth/verify-otp", {
        phoneNumber: phoneNumber,
        otp: otp,
      });

      // Based on your endpoint, output is 'true' if valid
      if (
        response.data === true ||
        response.data?.success ||
        response.status === 200
      ) {
        // Pass the verified phone number to the profile creation page
        router.replace({
          pathname: "/create-profile",
          params: { phoneNumber: phoneNumber },
        });
      } else {
        Alert.alert("Verification Failed", "Invalid OTP.");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Invalid OTP. Please try again.";
      Alert.alert("Verification Failed", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="flex-1 bg-[#F0F7FA]">
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1 justify-center items-center"
        >
          <View
            style={{ width: width * 0.9 }}
            className="p-10 bg-white rounded-[50px] border-2 border-white shadow-2xl"
          >
            <View className="w-24 h-24 rounded-[30px] bg-[#E91E63] self-center items-center justify-center shadow-xl shadow-pink-200 mb-8 transform rotate-3">
              <Ionicons
                name={step === 1 ? "phone-portrait" : "shield-checkmark"}
                size={40}
                color="white"
              />
            </View>

            <View className="items-center mb-10">
              <Text
                style={{ fontFamily: "RoyalBold" }}
                className="text-[#2D89B5] text-4xl tracking-tighter text-center"
              >
                {step === 1 ? "Get Started" : "Verify Number"}
              </Text>
              <View className="w-12 h-1.5 bg-[#E91E63] rounded-full my-4" />
              <Text className="text-gray-400 text-sm font-medium text-center">
                {step === 1
                  ? "Enter your number to receive an OTP"
                  : `Enter the OTP sent to +91 ${phoneNumber}`}
              </Text>
            </View>

            <View className="w-full">
              {step === 1 && (
                <View>
                  <Text className="text-[#2D89B5] text-[10px] uppercase tracking-[2px] mb-3 ml-1 font-black">
                    Phone Number
                  </Text>
                  <View className="flex-row items-center w-full h-16 bg-blue-50/50 rounded-2xl px-5 border border-blue-50">
                    <Text className="text-[#2D89B5] font-bold text-base mr-3 border-r border-blue-100 pr-3">
                      +91
                    </Text>
                    <TextInput
                      className="flex-1 text-[#333] text-base font-medium"
                      placeholder="98765 43210"
                      placeholderTextColor="rgba(45, 137, 181, 0.3)"
                      value={phoneNumber}
                      onChangeText={setPhoneNumber}
                      keyboardType="phone-pad"
                      maxLength={10}
                    />
                  </View>
                </View>
              )}

              {step === 2 && (
                <View>
                  <Text className="text-[#2D89B5] text-[10px] uppercase tracking-[2px] mb-3 ml-1 font-black text-center">
                    Enter OTP
                  </Text>
                  <View className="flex-row items-center w-full h-16 bg-blue-50/50 rounded-2xl px-5 border border-blue-50">
                    <TextInput
                      className="flex-1 text-[#333] text-2xl font-bold text-center tracking-[10px]"
                      placeholder="------"
                      placeholderTextColor="rgba(45, 137, 181, 0.3)"
                      value={otp}
                      onChangeText={setOtp}
                      keyboardType="number-pad"
                      maxLength={6}
                    />
                  </View>
                </View>
              )}
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={step === 1 ? handleSendOTP : handleVerifyOTP}
              disabled={isSubmitting}
              className={`w-full h-16 rounded-2xl justify-center items-center mt-10 shadow-xl shadow-blue-100 ${
                isSubmitting ? "bg-[#2D89B5]/50" : "bg-[#2D89B5]"
              }`}
            >
              <Text className="text-white font-black text-sm tracking-[3px] uppercase">
                {isSubmitting
                  ? "Processing..."
                  : step === 1
                    ? "Send OTP"
                    : "Verify & Continue"}
              </Text>
            </TouchableOpacity>

            <View className="flex-row justify-center mt-10">
              {step === 2 ? (
                <TouchableOpacity
                  onPress={() => {
                    LayoutAnimation.configureNext(
                      LayoutAnimation.Presets.easeInEaseOut,
                    );
                    setStep(1);
                    setOtp("");
                  }}
                >
                  <Text className="text-gray-400 text-sm font-medium border-b border-gray-300">
                    Change Phone Number
                  </Text>
                </TouchableOpacity>
              ) : (
                <>
                  <Text className="text-gray-400 text-sm font-medium">
                    Already have an account?{" "}
                  </Text>
                  <TouchableOpacity onPress={() => router.back()}>
                    <Text className="text-[#E91E63] text-sm font-black border-b-2 border-pink-100">
                      Sign In
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

export default Register;
