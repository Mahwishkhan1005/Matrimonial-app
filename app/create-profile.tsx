import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
    Alert,
    Animated,
    FlatList,
    Keyboard,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";
import api from "../axios/axiosInterceptor";

const initialFormState = {
  surname: "",
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  profileCreatedFor: "MYSELF",
  gender: "MALE",
  birthDay: "DD",
  birthMonth: "MMM",
  birthYear: "YYYY",
  birthHour: "HH",
  birthMinute: "MM",
  birthPeriod: "AM",
  birthPlace: "",
  height: "5.5 Ft",
  weight: "60 Kgs",
  complexion: "FAIR_MEDIUM",
  maritalStatus: "UNMARRIED",
  gothram: "",
  star: "I_DONT_KNOW",
  padam: "",
  raasi: "I_DONT_KNOW",
};

// 1. MOVED OUTSIDE: CustomInput
const CustomInput = ({
  label,
  value,
  onChangeText,
  icon,
  placeholder,
  isPassword = false,
  showPassword,
  setShowPassword,
}: any) => (
  <View className="mb-5">
    <Text className="text-[#2D89B5] text-xs font-RoyalBold mb-2 ml-1">
      {label} *
    </Text>
    <View className="flex-row items-center bg-blue-50/50 rounded-2xl border border-blue-100 overflow-hidden h-14">
      <View className="w-12 h-full justify-center items-center bg-[#2D89B5]/10">
        <Ionicons name={icon} size={20} color="#2D89B5" />
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
        secureTextEntry={isPassword && !showPassword}
        autoCapitalize={isPassword ? "none" : "words"}
      />
      {isPassword && (
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          className="px-4"
        >
          <Ionicons
            name={showPassword ? "eye-outline" : "eye-off-outline"}
            size={20}
            color="#2D89B5"
          />
        </TouchableOpacity>
      )}
    </View>
  </View>
);

// 2. MOVED OUTSIDE: CustomDropdown
const CustomDropdown = ({
  label,
  value,
  options,
  field,
  icon,
  onSelect,
  insets,
}: any) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find((opt: any) => opt.value === value);
  const displayLabel = selectedOption ? selectedOption.label : value;

  return (
    <View className="mb-5">
      {label && (
        <Text className="text-[#2D89B5] text-xs font-RoyalBold mb-2 ml-1">
          {label}
        </Text>
      )}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          Keyboard.dismiss();
          setIsOpen(true);
        }}
        className="bg-blue-50/50 rounded-2xl border border-blue-100 overflow-hidden h-14"
      >
        <View className="flex-row items-center h-full">
          <View className="w-12 h-full justify-center items-center bg-[#2D89B5]/10">
            <Ionicons name={icon} size={20} color="#2D89B5" />
          </View>
          <View className="flex-1 flex-row justify-between items-center px-4">
            <Text
              className="text-[#333] text-base font-medium"
              numberOfLines={1}
            >
              {displayLabel}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#2D89B5" />
          </View>
        </View>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          className="flex-1 bg-black/60"
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View className="flex-1 justify-end">
            <View
              className="bg-white rounded-t-3xl max-h-[60%] shadow-2xl"
              style={{ paddingBottom: Math.max(insets?.bottom || 0, 16) }}
            >
              <FlatList
                data={options}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    className="p-4 border-b border-blue-50"
                    onPress={() => {
                      onSelect(field, item.value);
                      setIsOpen(false);
                    }}
                  >
                    <Text className="text-[#333] text-base font-medium">
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

// 3. MOVED OUTSIDE: SectionDivider
const SectionDivider = ({ title }: any) => (
  <View className="flex-row items-center my-6">
    <View className="flex-1 h-[1px] bg-[#2D89B5]/20" />
    <Text className="text-[#E91E63] text-xs font-RoyalBold mx-4 uppercase tracking-wider">
      {title}
    </Text>
    <View className="flex-1 h-[1px] bg-[#2D89B5]/20" />
  </View>
);

const CreateProfile = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { phoneNumber } = useLocalSearchParams();
  const scrollViewRef = useRef<ScrollView>(null);

  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

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
  }, []);

  const dropdownOptions = {
    profileCreatedFor: [
      { label: "Myself", value: "MYSELF" },
      { label: "Son", value: "SON" },
      { label: "Daughter", value: "DAUGHTER" },
      { label: "Brother", value: "BROTHER" },
      { label: "Sister", value: "SISTER" },
      { label: "Relative", value: "RELATIVE" },
      { label: "Friend", value: "FRIEND" },
    ],
    gender: [
      { label: "Male", value: "MALE" },
      { label: "Female", value: "FEMALE" },
    ],
    maritalStatus: [
      { label: "Unmarried", value: "UNMARRIED" },
      { label: "Divorced", value: "DIVORCED" },
      { label: "Widow", value: "WIDOW" },
      { label: "Widower", value: "WIDOWER" },
    ],
    complexion: [
      { label: "Dark", value: "DARK" },
      { label: "Fair Medium", value: "FAIR_MEDIUM" },
      { label: "Fair White", value: "FAIR_WHITE" },
      { label: "Wheatish", value: "WHEATISH" },
      { label: "Wheatish Brown", value: "WHEATISH_BROWN" },
      { label: "Wheatish Medium", value: "WHEATISH_MEDIUM" },
    ],
    raasi: [
      { label: "I Don't Know", value: "I_DONT_KNOW" },
      { label: "Dhanu (ధనుస్సు)", value: "DHANU" },
      { label: "Kanya (కన్య)", value: "KANYA" },
      { label: "Karka (కర్కాటకం)", value: "KARKA" },
      { label: "Kumbha (కుంభం)", value: "KUMBHA" },
      { label: "Makara (మకరం)", value: "MAKARA" },
      { label: "Meena (మీనం)", value: "MEENA" },
      { label: "Mesha (మేషం)", value: "MESHA" },
      { label: "Mithuna (మిధునం)", value: "MITHUNA" },
      { label: "Simha (సింహం)", value: "SIMHA" },
      { label: "Tula (తులా)", value: "TULA" },
      { label: "Vrishabha (వృషభం)", value: "VRISHABHA" },
      { label: "Vrishchika (వృశ్చికం)", value: "VRISHCHIKA" },
    ],
    star: [
      { label: "I Don't Know", value: "I_DONT_KNOW" },
      { label: "Anuradha (అనురాధ)", value: "ANURADHA" },
      { label: "Arudra (ఆర్ద్ర)", value: "ARUDRA" },
      { label: "Ashlesha (ఆశ్లేష)", value: "ASHLESHA" },
      { label: "Ashwini (అశ్విని)", value: "ASHWINI" },
      { label: "Bharani (భరణి)", value: "BHARANI" },
      { label: "Chitra (చిత్త)", value: "CHITRA" },
      { label: "Dhanishta (ధనిష్ట)", value: "DHANISHTA" },
      { label: "Hasta (హస్త)", value: "HASTA" },
      { label: "Jyeshtha (జ్యేష్ట)", value: "JYESHTHA" },
      { label: "Krittika (కృత్తిక)", value: "KRITTIKA" },
      { label: "Magha (మఘ)", value: "MAGHA" },
      { label: "Mrigashira (మృగశిర)", value: "MRIGASHIRA" },
      { label: "Mula (మూల)", value: "MULA" },
      { label: "Punarvasu (పునర్వసు)", value: "PUNARVASU" },
      { label: "Purva Ashadha (పూర్వాషాఢ)", value: "PURVA_ASHADHA" },
      { label: "Purva Bhadrapada (పూర్వాభాద్ర)", value: "PURVA_BHADRAPADA" },
      { label: "Purva Phalguni (పూర్వ ఫల్గుని)", value: "PURVA_PHALGUNI" },
      { label: "Pushya (పుష్యమి)", value: "PUSHYA" },
      { label: "Revathi (రేవతి)", value: "REVATHI" },
      { label: "Rohini (రోహిణి)", value: "ROHINI" },
      { label: "Shatabhisha (శతభిష)", value: "SHATABHISHA" },
      { label: "Shravana (శ్రవణ)", value: "SHRAVANA" },
      { label: "Swati (స్వాతి)", value: "SWATI" },
      { label: "Uttara Ashadha (ఉత్తరాషాఢ)", value: "UTTARA_ASHADHA" },
      { label: "Uttara Bhadrapada (ఉత్తరాభాద్ర)", value: "UTTARA_BHADRAPADA" },
      { label: "Uttara Phalguni (ఉత్తర ఫల్గుని)", value: "UTTARA_PHALGUNI" },
      { label: "Vishakha (విశాఖ)", value: "VISHAKHA" },
    ],
    birthDay: Array.from({ length: 31 }, (_, i) => ({
      label: (i + 1).toString(),
      value: (i + 1).toString(),
    })),
    birthMonth: Array.from({ length: 12 }, (_, i) => ({
      label: (i + 1).toString(),
      value: (i + 1).toString(),
    })),
    birthYear: Array.from({ length: 50 }, (_, i) => ({
      label: (2006 - i).toString(),
      value: (2006 - i).toString(),
    })),
    birthHour: Array.from({ length: 12 }, (_, i) => ({
      label: (i + 1).toString(),
      value: (i + 1).toString(),
    })),
    birthMinute: Array.from({ length: 60 }, (_, i) => ({
      label: i.toString().padStart(2, "0"),
      value: i.toString(),
    })),
    birthPeriod: [
      { label: "AM", value: "AM" },
      { label: "PM", value: "PM" },
    ],
    height: [
      "4.0 Ft",
      "4.5 Ft",
      "5.0 Ft",
      "5.5 Ft",
      "6.0 Ft",
      "6.5 Ft",
      "7.0 Ft",
    ].map((v) => ({ label: v, value: v })),
    weight: ["40 Kgs", "50 Kgs", "60 Kgs", "70 Kgs", "80 Kgs", "90 Kgs"].map(
      (v) => ({ label: v, value: v }),
    ),
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const dismissKeyboard = () => Keyboard.dismiss();

  const handleSignup = async () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.birthPlace
    ) {
      Alert.alert("Missing Fields", "Please fill in all required fields.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      Alert.alert("Mismatch", "Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        surname: formData.surname,
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        profileCreatedFor: formData.profileCreatedFor,
        gender: formData.gender,
        birthDay: parseInt(formData.birthDay) || 1,
        birthMonth: parseInt(formData.birthMonth) || 1,
        birthYear: parseInt(formData.birthYear) || 2000,
        birthHour: parseInt(formData.birthHour) || 12,
        birthMinute: parseInt(formData.birthMinute) || 0,
        birthPeriod: formData.birthPeriod,
        birthPlace: formData.birthPlace,
        height: formData.height,
        weight: formData.weight,
        complexion: formData.complexion,
        maritalStatus: formData.maritalStatus,
        gothram: formData.gothram,
        star: formData.star,
        padam: formData.padam,
        raasi: formData.raasi,
      };

      await api.post(`/auth/signup/${phoneNumber}`, payload);

      Alert.alert("Success", "User registered successfully!", [
        { text: "Login Now", onPress: () => router.replace("/") },
      ]);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data ||
        "Registration failed.";
      Alert.alert(
        "Error",
        typeof errorMessage === "string"
          ? errorMessage
          : "Could not complete registration.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F0F7FA]" edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <LinearGradient
          colors={["#2D89B5", "#1A6B8C"]}
          className="border-b border-[#2D89B5]/30"
        >
          <View className="h-16 flex-row items-center px-6">
            <TouchableOpacity onPress={() => router.back()} className="mr-4">
              <Ionicons name="arrow-back" size={24} color="#FFF" />
            </TouchableOpacity>
            <Text
              style={{ fontFamily: "RoyalBold" }}
              className="text-white text-2xl tracking-wide"
            >
              Complete Profile
            </Text>
          </View>
        </LinearGradient>

        <TouchableWithoutFeedback onPress={dismissKeyboard}>
          <ScrollView
            ref={scrollViewRef}
            className="flex-1 px-6"
            contentContainerStyle={{ paddingBottom: 40 }}
          >
            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }}
            >
              <View className="bg-white p-6 rounded-[30px] border border-white mt-6 mb-8 shadow-lg shadow-blue-100">
                <SectionDivider title="Account Security" />
                <CustomInput
                  label="Email"
                  value={formData.email}
                  onChangeText={(t: any) => updateField("email", t)}
                  icon="mail"
                  placeholder="user@email.com"
                />
                <CustomInput
                  label="Password"
                  value={formData.password}
                  onChangeText={(t: any) => updateField("password", t)}
                  icon="lock-closed"
                  placeholder="••••••••"
                  isPassword
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                />
                <CustomInput
                  label="Confirm Password"
                  value={formData.confirmPassword}
                  onChangeText={(t: any) => updateField("confirmPassword", t)}
                  icon="checkmark-circle"
                  placeholder="••••••••"
                  isPassword
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                />

                <SectionDivider title="Personal Info" />
                <CustomInput
                  label="First Name"
                  value={formData.name}
                  onChangeText={(t: any) => updateField("name", t)}
                  icon="person"
                  placeholder="Name"
                />
                <CustomInput
                  label="Surname"
                  value={formData.surname}
                  onChangeText={(t: any) => updateField("surname", t)}
                  icon="people"
                  placeholder="Surname"
                />
                <CustomDropdown
                  label="Profile For"
                  value={formData.profileCreatedFor}
                  options={dropdownOptions.profileCreatedFor}
                  field="profileCreatedFor"
                  icon="ribbon"
                  onSelect={updateField}
                  insets={insets}
                />
                <CustomDropdown
                  label="Gender"
                  value={formData.gender}
                  options={dropdownOptions.gender}
                  field="gender"
                  icon="male-female"
                  onSelect={updateField}
                  insets={insets}
                />

                <SectionDivider title="Birth Details" />
                <View className="flex-row justify-between gap-3 mb-5">
                  <View className="flex-1">
                    <CustomDropdown
                      value={formData.birthDay}
                      options={dropdownOptions.birthDay}
                      field="birthDay"
                      icon="calendar"
                      onSelect={updateField}
                      insets={insets}
                    />
                  </View>
                  <View className="flex-1">
                    <CustomDropdown
                      value={formData.birthMonth}
                      options={dropdownOptions.birthMonth}
                      field="birthMonth"
                      icon="calendar"
                      onSelect={updateField}
                      insets={insets}
                    />
                  </View>
                  <View className="flex-1">
                    <CustomDropdown
                      value={formData.birthYear}
                      options={dropdownOptions.birthYear}
                      field="birthYear"
                      icon="calendar"
                      onSelect={updateField}
                      insets={insets}
                    />
                  </View>
                </View>
                <View className="flex-row justify-between gap-3 mb-5">
                  <View className="flex-1">
                    <CustomDropdown
                      value={formData.birthHour}
                      options={dropdownOptions.birthHour}
                      field="birthHour"
                      icon="time"
                      onSelect={updateField}
                      insets={insets}
                    />
                  </View>
                  <View className="flex-1">
                    <CustomDropdown
                      value={formData.birthMinute}
                      options={dropdownOptions.birthMinute}
                      field="birthMinute"
                      icon="time"
                      onSelect={updateField}
                      insets={insets}
                    />
                  </View>
                  <View className="flex-1">
                    <CustomDropdown
                      value={formData.birthPeriod}
                      options={dropdownOptions.birthPeriod}
                      field="birthPeriod"
                      icon="time"
                      onSelect={updateField}
                      insets={insets}
                    />
                  </View>
                </View>
                <CustomInput
                  label="Birth Place"
                  value={formData.birthPlace}
                  onChangeText={(t: any) => updateField("birthPlace", t)}
                  icon="location"
                  placeholder="City"
                />

                <SectionDivider title="Attributes" />
                <View className="flex-row gap-3">
                  <View className="flex-1">
                    <CustomDropdown
                      label="Height"
                      value={formData.height}
                      options={dropdownOptions.height}
                      field="height"
                      icon="resize"
                      onSelect={updateField}
                      insets={insets}
                    />
                  </View>
                  <View className="flex-1">
                    <CustomDropdown
                      label="Weight"
                      value={formData.weight}
                      options={dropdownOptions.weight}
                      field="weight"
                      icon="fitness"
                      onSelect={updateField}
                      insets={insets}
                    />
                  </View>
                </View>
                <CustomDropdown
                  label="Complexion"
                  value={formData.complexion}
                  options={dropdownOptions.complexion}
                  field="complexion"
                  icon="color-palette"
                  onSelect={updateField}
                  insets={insets}
                />
                <CustomDropdown
                  label="Marital Status"
                  value={formData.maritalStatus}
                  options={dropdownOptions.maritalStatus}
                  field="maritalStatus"
                  icon="heart"
                  onSelect={updateField}
                  insets={insets}
                />

                <SectionDivider title="Astrology" />
                <CustomInput
                  label="Gothram"
                  value={formData.gothram}
                  onChangeText={(t: any) => updateField("gothram", t)}
                  icon="leaf"
                  placeholder="Enter Gothram"
                />
                <CustomDropdown
                  label="Star / Nakshatra"
                  value={formData.star}
                  options={dropdownOptions.star}
                  field="star"
                  icon="star"
                  onSelect={updateField}
                  insets={insets}
                />
                <CustomInput
                  label="Padam"
                  value={formData.padam}
                  onChangeText={(t: any) => updateField("padam", t)}
                  icon="git-branch"
                  placeholder="Padam (1 to 4)"
                />
                <CustomDropdown
                  label="Raasi"
                  value={formData.raasi}
                  options={dropdownOptions.raasi}
                  field="raasi"
                  icon="moon"
                  onSelect={updateField}
                  insets={insets}
                />
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                className={`w-full h-14 rounded-2xl justify-center items-center shadow-lg shadow-blue-100 ${
                  isSubmitting ? "bg-[#2D89B5]/50" : "bg-[#2D89B5]"
                }`}
                onPress={handleSignup}
                disabled={isSubmitting}
              >
                <Text className="text-white font-black text-sm tracking-[3px] uppercase">
                  {isSubmitting ? "Registering..." : "Complete Registration"}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreateProfile;
