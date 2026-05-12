import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TopNavBar from "../components/TopNavBar";

const initialFormState = {
  surname: "",
  name: "",
  email: "",
  profileCreatedFor: "Select",
  gender: "Select",
  dobDay: "DD",
  dobMonth: "MMM",
  dobYear: "YYYY",
  tobHour: "HH",
  tobMinute: "MM",
  tobAmPm: "AM/PM",
  birthPlace: "",
  height: "Select",
  weight: "Select",
  complexion: "Select",
  maritalStatus: "Select",
  gothram: "",
  star: "Select",
  padam: "",
  raasi: "Select",
};
const EditProfile = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets(); // <-- ADDED: Detects safe area limits (notches, nav bars)
  const [showDropdown, setShowDropdown] = useState(null);
  const [activeField, setActiveField] = useState("");
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Form State
  const [formData, setFormData] = useState(initialFormState);

  useFocusEffect(
    useCallback(() => {
      setFormData(initialFormState);
    }, []),
  );

  // Keyboard listeners for Android
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      () => setKeyboardVisible(true),
    );
    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => setKeyboardVisible(false),
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

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
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Dropdown options
  const dropdownOptions = {
    profileCreatedFor: [
      "Self",
      "Son",
      "Daughter",
      "Brother",
      "Sister",
      "Friend",
    ],
    gender: ["Male", "Female", "Other"],
    dobDay: Array.from({ length: 31 }, (_, i) => (i + 1).toString()),
    dobMonth: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    dobYear: Array.from({ length: 50 }, (_, i) => (2024 - i).toString()),
    tobHour: Array.from({ length: 12 }, (_, i) => (i + 1).toString()),
    tobMinute: Array.from({ length: 60 }, (_, i) =>
      i.toString().padStart(2, "0"),
    ),
    tobAmPm: ["AM", "PM"],
    height: [
      "4.0 Ft",
      "4.5 Ft",
      "5.0 Ft",
      "5.5 Ft",
      "6.0 Ft",
      "6.5 Ft",
      "7.0 Ft",
    ],
    weight: [
      "40 Kgs",
      "45 Kgs",
      "50 Kgs",
      "55 Kgs",
      "60 Kgs",
      "65 Kgs",
      "70 Kgs",
      "75 Kgs",
      "80 Kgs",
    ],
    complexion: ["Fair", "Wheatish", "Medium", "Dusky"],
    maritalStatus: ["Unmarried", "Married", "Divorced", "Widowed"],
    star: [
      "Ashwini",
      "Bharani",
      "Krithika",
      "Rohini",
      "Mrigashira",
      "Arudra",
      "Punarvasu",
      "Pushya",
      "Ashlesha",
    ],
    raasi: [
      "Mesha",
      "Vrishabha",
      "Mithuna",
      "Karka",
      "Simha",
      "Kanya",
      "Tula",
      "Vrishchika",
      "Dhanus",
      "Makara",
      "Kumbha",
      "Meena",
    ],
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setShowDropdown(null);
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const CustomInput = ({
    label,
    value,
    onChangeText,
    required = false,
    icon,
    placeholder,
    keyboardType,
  }: any) => {
    return (
      <View className="mb-5">
        <View className="mb-2 ml-1 flex-row">
          <Text className="text-[#C5A059] text-xs font-RoyalBold">{label}</Text>
          {required && <Text className="text-red-500 font-bold ml-1">*</Text>}
        </View>
        <View className="flex-row items-center bg-white/5 rounded-2xl border border-[#C5A059]/20 overflow-hidden h-14">
          <View className="w-12 h-full justify-center items-center bg-[#C5A059]/10">
            <Ionicons name={icon} size={20} color="#C5A059" />
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
            keyboardType={keyboardType}
          />
        </View>
      </View>
    );
  };

  const CustomDropdown = ({
    label,
    value,
    required = false,
    options,
    field,
    icon,
  }: any) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <View className="mb-5">
        {label && (
          <View className="mb-2 ml-1 flex-row">
            <Text className="text-[#C5A059] text-xs font-RoyalBold">
              {label}
            </Text>
            {required && <Text className="text-red-500 font-bold ml-1">*</Text>}
          </View>
        )}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            dismissKeyboard();
            setIsOpen(true);
          }}
          className="bg-white/5 rounded-2xl border border-[#C5A059]/20 overflow-hidden h-14"
        >
          <View className="flex-row items-center h-full">
            <View className="w-12 h-full justify-center items-center bg-[#C5A059]/10">
              <Ionicons name={icon} size={20} color="#C5A059" />
            </View>
            <View className="flex-1 flex-row justify-between items-center px-4">
              <Text
                className={`text-base ${
                  value === "Select" ||
                  value === "DD" ||
                  value === "MMM" ||
                  value === "YYYY" ||
                  value === "HH" ||
                  value === "MM" ||
                  value === "AM/PM"
                    ? "text-white/40"
                    : "text-white"
                }`}
              >
                {value}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#C5A059" />
            </View>
          </View>
        </TouchableOpacity>

        <Modal
          visible={isOpen}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsOpen(false)}
          statusBarTranslucent={true}
        >
          <TouchableOpacity
            className="flex-1 bg-black/80"
            activeOpacity={1}
            onPress={() => setIsOpen(false)}
          >
            <View className="flex-1 justify-end">
              <Animated.View
                className="bg-[#12402D] rounded-t-3xl max-h-[60%]"
                // <-- ADDED: Applies dynamic padding for the bottom Android navigation bar
                style={{ paddingBottom: Math.max(insets.bottom, 16) }}
              >
                <View className="p-4 border-b border-[#C5A059]/20 flex-row justify-between items-center">
                  <Text className="text-[#C5A059] text-lg font-RoyalBold uppercase tracking-wider">
                    Select {label || field}
                  </Text>
                  <TouchableOpacity onPress={() => setIsOpen(false)}>
                    <Ionicons name="close" size={24} color="#C5A059" />
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={options}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      className="p-4 border-b border-[#C5A059]/10"
                      onPress={() => {
                        updateField(field, item);
                        setIsOpen(false);
                      }}
                    >
                      <Text className="text-white text-base">{item}</Text>
                    </TouchableOpacity>
                  )}
                  showsVerticalScrollIndicator={false}
                />
              </Animated.View>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    );
  };

  const SectionDivider = ({ title }: any) => (
    <View className="flex-row items-center my-6">
      <View className="flex-1 h-[1px] bg-[#C5A059]/20" />
      <Text className="text-[#C5A059] text-xs font-RoyalBold mx-4 uppercase tracking-wider">
        {title}
      </Text>
      <View className="flex-1 h-[1px] bg-[#C5A059]/20" />
    </View>
  );

  return (
    <View className="flex-1 bg-[#0B2B1F]">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        {/* Gradient Header */}
        <TopNavBar title="Edit Profile" showBack={true} />

        <TouchableWithoutFeedback onPress={dismissKeyboard}>
          <ScrollView
            ref={scrollViewRef}
            className="flex-1 px-6"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
            keyboardShouldPersistTaps="handled"
          >
            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
              }}
            >
              {/* Profile Completion Card */}
              <View className="bg-gradient-to-r from-[#12402D] to-[#0D3325] p-5 rounded-3xl border border-[#C5A059]/20 mt-4 mb-6 shadow-xl">
                <View className="flex-row justify-between items-center mb-3">
                  <Text className="text-white text-sm font-RoyalBold">
                    Profile Completion
                  </Text>
                  <Text className="text-[#C5A059] text-xs font-bold">30%</Text>
                </View>
                <View className="h-2 bg-[#0B2B1F] rounded-full overflow-hidden">
                  <Animated.View
                    className="h-full bg-[#C5A059] rounded-full"
                    style={{ width: "30%" }}
                  />
                </View>
                <Text className="text-white/50 text-xs mt-3">
                  Complete your profile to get better matches
                </Text>
              </View>

              {/* Main Form Card */}
              <View className="bg-[#12402D]/40 p-6 rounded-[30px] border border-[#C5A059]/20 mb-8 shadow-lg">
                <SectionDivider title="Basic Information" />

                <CustomInput
                  label="Surname"
                  value={formData.surname}
                  onChangeText={(text: any) => updateField("surname", text)}
                  required
                  icon="person-outline"
                  placeholder="Your surname"
                />

                <CustomInput
                  label="Full Name"
                  value={formData.name}
                  onChangeText={(text: any) => updateField("name", text)}
                  required
                  icon="text-outline"
                  placeholder="Your full name"
                />

                <CustomInput
                  label="Email Address"
                  value={formData.email}
                  onChangeText={(text: any) => updateField("email", text)}
                  required
                  icon="mail-outline"
                  placeholder="your@email.com"
                  keyboardType="email-address"
                />

                <CustomDropdown
                  label="Profile Created For"
                  value={formData.profileCreatedFor}
                  required
                  options={dropdownOptions.profileCreatedFor}
                  field="profileCreatedFor"
                  icon="people-outline"
                />

                <CustomDropdown
                  label="Gender"
                  value={formData.gender}
                  required
                  options={dropdownOptions.gender}
                  field="gender"
                  icon="male-female-outline"
                />

                <SectionDivider title="Birth Details" />

                {/* Date of Birth Row */}
                <Text className="text-[#C5A059] text-xs font-RoyalBold mb-2 ml-1">
                  Date of Birth
                </Text>
                <View className="flex-row justify-between gap-3 mb-5">
                  <View className="flex-1">
                    <CustomDropdown
                      value={formData.dobDay}
                      options={dropdownOptions.dobDay}
                      field="dobDay"
                      icon="calendar-outline"
                    />
                  </View>
                  <View className="flex-1">
                    <CustomDropdown
                      value={formData.dobMonth}
                      options={dropdownOptions.dobMonth}
                      field="dobMonth"
                      icon="calendar-outline"
                    />
                  </View>
                  <View className="flex-1">
                    <CustomDropdown
                      value={formData.dobYear}
                      options={dropdownOptions.dobYear}
                      field="dobYear"
                      icon="calendar-outline"
                    />
                  </View>
                </View>

                {/* Time of Birth Row */}
                <Text className="text-[#C5A059] text-xs font-RoyalBold mb-2 ml-1">
                  Time of Birth
                </Text>
                <View className="flex-row justify-between gap-3 mb-5">
                  <View className="flex-1">
                    <CustomDropdown
                      value={formData.tobHour}
                      options={dropdownOptions.tobHour}
                      field="tobHour"
                      icon="time-outline"
                    />
                  </View>
                  <View className="flex-1">
                    <CustomDropdown
                      value={formData.tobMinute}
                      options={dropdownOptions.tobMinute}
                      field="tobMinute"
                      icon="time-outline"
                    />
                  </View>
                  <View className="flex-1">
                    <CustomDropdown
                      value={formData.tobAmPm}
                      options={dropdownOptions.tobAmPm}
                      field="tobAmPm"
                      icon="time-outline"
                    />
                  </View>
                </View>

                <CustomInput
                  label="Birth Place"
                  value={formData.birthPlace}
                  onChangeText={(text: any) => updateField("birthPlace", text)}
                  icon="location-outline"
                  placeholder="City, State, Country"
                />

                <SectionDivider title="Physical Attributes" />

                <View className="flex-row gap-3">
                  <View className="flex-1">
                    <CustomDropdown
                      label="Height"
                      value={formData.height}
                      options={dropdownOptions.height}
                      field="height"
                      icon="resize-outline"
                    />
                  </View>
                  <View className="flex-1">
                    <CustomDropdown
                      label="Weight"
                      value={formData.weight}
                      options={dropdownOptions.weight}
                      field="weight"
                      icon="fitness-outline"
                    />
                  </View>
                </View>

                <CustomDropdown
                  label="Complexion"
                  value={formData.complexion}
                  options={dropdownOptions.complexion}
                  field="complexion"
                  icon="color-palette-outline"
                />

                <CustomDropdown
                  label="Marital Status"
                  value={formData.maritalStatus}
                  options={dropdownOptions.maritalStatus}
                  field="maritalStatus"
                  icon="heart-outline"
                />

                <SectionDivider title="Astrological Details" />

                <View className="flex-row gap-3">
                  <View className="flex-1">
                    <CustomInput
                      label="Gothram"
                      value={formData.gothram}
                      onChangeText={(text: any) => updateField("gothram", text)}
                      icon="leaf-outline"
                      placeholder="Enter Gothram"
                    />
                  </View>
                  <View className="flex-1">
                    <CustomDropdown
                      label="Star / Nakshatra"
                      value={formData.star}
                      options={dropdownOptions.star}
                      field="star"
                      icon="star-outline"
                    />
                  </View>
                </View>

                <View className="flex-row gap-3">
                  <View className="flex-1">
                    <CustomInput
                      label="Padam / Charan"
                      value={formData.padam}
                      onChangeText={(text: any) => updateField("padam", text)}
                      icon="git-branch-outline"
                      placeholder="Enter Padam"
                    />
                  </View>
                  <View className="flex-1">
                    <CustomDropdown
                      label="Raasi"
                      value={formData.raasi}
                      options={dropdownOptions.raasi}
                      field="raasi"
                      icon="moon-outline"
                    />
                  </View>
                </View>
              </View>

              {/* Action Buttons */}
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
                  onPress={() => console.log("Form Data:", formData)}
                >
                  <Ionicons name="save-outline" size={20} color="#0B2B1F" />
                  <Text className="text-[#0B2B1F] font-extrabold text-sm tracking-widest uppercase">
                    Save Details
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Progress Indicator */}
              <View className="flex-row justify-center gap-2 mb-8">
                <View className="w-2 h-2 rounded-full bg-[#C5A059]"></View>
                <View className="w-2 h-2 rounded-full bg-[#C5A059]/30"></View>
                <View className="w-2 h-2 rounded-full bg-[#C5A059]/30"></View>
                <View className="w-2 h-2 rounded-full bg-[#C5A059]/30"></View>
              </View>
            </Animated.View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
};

export default EditProfile;
