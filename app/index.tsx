import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// 1. Import your custom API instance (Adjust path if you put it in a different folder)
import api from "../axios/axiosInterceptor";
// Import the custom hook from your context folder
import { useAuth } from "../context/AuthContext";

const { width } = Dimensions.get("window");

const MatrimonialLogin = () => {
  const router = useRouter();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Access auth state and methods from AuthProvider
  const { login, user, isLoading } = useAuth();

  // Persistence Logic: If a user session is found in history, redirect to dashboard
  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/dashboard");
    }
  }, [user, isLoading]);

  const handleSignIn = async () => {
    // 1. Basic Empty Check
    if (!phoneNumber || !password) {
      Alert.alert(
        "Required Fields",
        "Please enter both Phone Number and Password.",
      );
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
      // Make the API Call
      const response = await api.post("/auth/login", {
        phoneNumber: phoneNumber,
        password: password,
      });

      // 2. BULLETPROOF TOKEN EXTRACTION
      let token = null;

      // If the backend returns just the raw string token
      if (typeof response.data === "string") {
        token = response.data;
      }
      // If the backend returns a JSON object
      else if (typeof response.data === "object") {
        // Checks common key names for tokens
        token =
          response.data?.token ||
          response.data?.jwt ||
          response.data?.accessToken ||
          response.data?.data?.token ||
          response.data?.data;
      }

      if (token) {
        // 3. Decode the JWT to get the Profile ID (sub)
        // JWTs are split into 3 parts by periods. The middle part is the data payload.
        let profileId = "Unknown";
        try {
          const base64Url = token.split(".")[1];
          const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split("")
              .map(function (c) {
                return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
              })
              .join(""),
          );
          const decoded = JSON.parse(jsonPayload);

          // Your token uses "sub" for the Profile ID (e.g. MATRI87285C)
          profileId = decoded.sub || "Unknown";
        } catch (e) {
          console.log("Could not decode token, using fallback Profile ID");
        }

        // Store the token in local storage
        await AsyncStorage.setItem("userToken", token);

        // Update the AuthContext state with the decoded Profile ID
        await login({
          phoneNumber: phoneNumber,
          profileId: profileId,
          role: "USER",
        });

        // Redirect to Dashboard
        router.replace("/dashboard");
      } else {
        Alert.alert(
          "Login Failed",
          "Backend responded, but the token format was not recognized.",
        );
        console.log("Unrecognized backend response:", response.data);
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data ||
        "Failed to connect to the server. Please try again.";
      Alert.alert(
        "Error",
        typeof errorMessage === "string" ? errorMessage : "Invalid credentials",
      );
      console.error("Login Error:", error);
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
            {/* Header Icon */}
            <View className="w-24 h-24 rounded-[30px] bg-[#2D89B5] self-center items-center justify-center shadow-xl shadow-blue-200 mb-8 transform -rotate-6">
              <Ionicons name="heart" size={40} color="white" />
            </View>

            <View className="items-center mb-10">
              <Text
                style={{ fontFamily: "RoyalBold" }}
                className="text-[#2D89B5] text-4xl tracking-tighter"
              >
                Eternal Partner
              </Text>
              <View className="w-12 h-1.5 bg-[#E91E63] rounded-full my-4" />
              <Text className="text-gray-400 text-sm font-medium">
                Find your perfect match today
              </Text>
            </View>

            <View className="w-full">
              {/* Phone Number Input */}
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

              {/* Password Input with Eye Icon Toggle */}
              <View className="mt-5">
                <Text className="text-[#2D89B5] text-[10px] uppercase tracking-[2px] mb-3 ml-1 font-black">
                  Security Key
                </Text>
                <View className="flex-row items-center w-full h-16 bg-blue-50/50 rounded-2xl px-5 border border-blue-50">
                  <TextInput
                    className="flex-1 text-[#333] font-medium"
                    placeholder="••••••••"
                    placeholderTextColor="rgba(45, 137, 181, 0.3)"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    className="bg-white p-2 rounded-xl shadow-sm"
                  >
                    <Ionicons
                      name={showPassword ? "eye" : "eye-off"}
                      size={18}
                      color="#2D89B5"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleSignIn}
              disabled={isSubmitting}
              className={`w-full h-16 rounded-2xl justify-center items-center mt-10 shadow-xl shadow-blue-100 ${
                isSubmitting ? "bg-[#2D89B5]/50" : "bg-[#2D89B5]"
              }`}
            >
              <Text className="text-white font-black text-sm tracking-[3px] uppercase">
                {isSubmitting ? "Verifying..." : "Sign In"}
              </Text>
            </TouchableOpacity>

            <View className="flex-row justify-center mt-10">
              <Text className="text-gray-400 text-sm font-medium">
                New to the platform?{" "}
              </Text>
              <TouchableOpacity onPress={() => router.push("/register")}>
                <Text className="text-[#E91E63] text-sm font-black border-b-2 border-pink-100">
                  Join Free
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

export default MatrimonialLogin;
