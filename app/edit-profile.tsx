import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import api from "../axios/axiosInterceptor";
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
  introduceYourSelf: "",
  nativePlace: "",
  education: "Select",
  educationInDetail: "",
  profession: "",
  annualIncome: "",
  // Family Fields
  fatherName: "",
  fatherOccupation: "",
  motherName: "",
  motherOccupation: "",
  familyType: "Select",
  familyStatus: "Select",
  familyValues: "Select",
  brothersCount: "0",
  brothersMarried: "0",
  sistersCount: "0",
  sistersMarried: "0",
  familyLocation: "",
  familyIncome: "",
  ownHouse: "Select",
  caste: "",
  subCaste: "",
  religion: "",
  aboutFamily: "",
  // Contact Fields
  phoneNumber: "",
  alternatePhoneNumber: "",
  address: "",
  city: "",
  state: "",
  country: "",
  pincode: "",
};

// 1. CustomInput
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
        <Text className="text-[#2D89B5] text-xs font-RoyalBold">{label}</Text>
        {required && <Text className="text-[#E91E63] font-bold ml-1">*</Text>}
      </View>
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
          keyboardType={keyboardType}
        />
      </View>
    </View>
  );
};

// 2. CustomDropdown
const CustomDropdown = ({
  label,
  value,
  required = false,
  options,
  field,
  icon,
  onSelect,
  insets,
}: any) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View className="mb-5">
      {label && (
        <View className="mb-2 ml-1 flex-row">
          <Text className="text-[#2D89B5] text-xs font-RoyalBold">{label}</Text>
          {required && <Text className="text-[#E91E63] font-bold ml-1">*</Text>}
        </View>
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
              className={`text-base font-medium ${
                value === "Select" ||
                value === "DD" ||
                value === "MMM" ||
                value === "YYYY" ||
                value === "HH" ||
                value === "MM" ||
                value === "AM/PM"
                  ? "text-gray-400"
                  : "text-[#333]"
              }`}
            >
              {value}
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
        statusBarTranslucent={true}
      >
        <TouchableOpacity
          className="flex-1 bg-black/60"
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View className="flex-1 justify-end">
            <Animated.View
              className="bg-white rounded-t-3xl max-h-[60%] shadow-2xl"
              style={{ paddingBottom: Math.max(insets?.bottom || 0, 16) }}
            >
              <View className="p-4 border-b border-blue-50 flex-row justify-between items-center">
                <Text className="text-[#2D89B5] text-lg font-RoyalBold uppercase tracking-wider">
                  Select {label || field}
                </Text>
                <TouchableOpacity
                  onPress={() => setIsOpen(false)}
                  className="bg-blue-50 p-2 rounded-full"
                >
                  <Ionicons name="close" size={20} color="#2D89B5" />
                </TouchableOpacity>
              </View>
              <FlatList
                data={options}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    className="p-4 border-b border-blue-50"
                    onPress={() => {
                      onSelect(field, item);
                      setIsOpen(false);
                    }}
                  >
                    <Text className="text-[#333] text-base font-medium">
                      {item}
                    </Text>
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

// 3. SectionDivider
const SectionDivider = ({ title }: any) => (
  <View className="flex-row items-center my-6">
    <View className="flex-1 h-[1px] bg-[#2D89B5]/20" />
    <Text className="text-[#E91E63] text-xs font-RoyalBold mx-4 uppercase tracking-wider text-center">
      {title}
    </Text>
    <View className="flex-1 h-[1px] bg-[#2D89B5]/20" />
  </View>
);

const EditProfile = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Form State
  const [formData, setFormData] = useState(initialFormState);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    familyType: ["Nuclear", "Joint", "Extended"],
    familyStatus: ["Middle Class", "Upper Middle Class", "Rich", "Affluent"],
    familyValues: ["Orthodox", "Traditional", "Moderate", "Liberal"],
    ownHouse: ["Yes", "No"],
    countOptions: ["0", "1", "2", "3", "4", "5", "6"],
    education: [
      "BTECH",
      "MTECH",
      "DEGREE",
      "MBA",
      "MCA",
      "MBBS",
      "BDS",
      "INTERMEDIATE",
      "DIPLOMA",
      "PHD",
      "CA",
      "IAS",
      "IPS",
      "SSC",
      "OTHER",
    ],
  };

  // Format Helper for ENUMS (UPPER_MIDDLE_CLASS -> Upper Middle Class)
  const formatEnumToLabel = (str: string) => {
    if (!str) return "Select";
    if (str.toUpperCase() === "MYSELF") return "Self";
    return str
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");
  };

  // Fetch Existing Profile, Contact & Family Data
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchAllData = async () => {
        setIsLoading(true);
        try {
          // Fetch all three endpoints in parallel
          const [profileRes, familyRes, contactRes] = await Promise.allSettled([
            api.get("/user/profile"),
            api.get("/user/family/details"),
            api.get("/contact/details"),
          ]);

          let newFormData = { ...initialFormState };

          // Handle Profile Data
          if (profileRes.status === "fulfilled" && profileRes.value.data) {
            const pData = profileRes.value.data;
            newFormData = {
              ...newFormData,
              surname: pData.surname || "",
              name: pData.name || "",
              email: pData.email || "",
              profileCreatedFor: formatEnumToLabel(pData.profileCreatedFor),
              gender: formatEnumToLabel(pData.gender),
              dobDay: pData.birthDay ? pData.birthDay.toString() : "DD",
              dobMonth: pData.birthMonth
                ? dropdownOptions.dobMonth[pData.birthMonth - 1] || "MMM"
                : "MMM",
              dobYear: pData.birthYear ? pData.birthYear.toString() : "YYYY",
              tobHour: pData.birthHour ? pData.birthHour.toString() : "HH",
              tobMinute:
                pData.birthMinute !== undefined && pData.birthMinute !== null
                  ? pData.birthMinute.toString().padStart(2, "0")
                  : "MM",
              tobAmPm: pData.birthPeriod
                ? pData.birthPeriod.toUpperCase()
                : "AM/PM",
              birthPlace: pData.birthPlace || "",
              height: pData.height || "Select",
              weight: pData.weight || "Select",
              complexion: formatEnumToLabel(pData.complexion),
              maritalStatus: formatEnumToLabel(pData.maritalStatus),
              gothram: pData.gothram || "",
              star: formatEnumToLabel(pData.star),
              padam: pData.padam || "",
              raasi: formatEnumToLabel(pData.raasi),
              introduceYourSelf: pData.introduceYourSelf || "",
              nativePlace: pData.nativePlace || "",
              education: pData.education || "Select",
              educationInDetail: pData.educationInDetail || "",
              profession: pData.profession || "",
              annualIncome: pData.annualIncome || "",
            };
          }

          // Handle Family Data
          if (familyRes.status === "fulfilled" && familyRes.value.data) {
            const fData = familyRes.value.data;
            newFormData = {
              ...newFormData,
              fatherName: fData.fatherName || "",
              fatherOccupation: fData.fatherOccupation || "",
              motherName: fData.motherName || "",
              motherOccupation: fData.motherOccupation || "",
              familyType: formatEnumToLabel(fData.familyType),
              familyStatus: formatEnumToLabel(fData.familyStatus),
              familyValues: formatEnumToLabel(fData.familyValues),
              brothersCount:
                fData.brothersCount !== undefined &&
                fData.brothersCount !== null
                  ? fData.brothersCount.toString()
                  : "0",
              brothersMarried:
                fData.brothersMarried !== undefined &&
                fData.brothersMarried !== null
                  ? fData.brothersMarried.toString()
                  : "0",
              sistersCount:
                fData.sistersCount !== undefined && fData.sistersCount !== null
                  ? fData.sistersCount.toString()
                  : "0",
              sistersMarried:
                fData.sistersMarried !== undefined &&
                fData.sistersMarried !== null
                  ? fData.sistersMarried.toString()
                  : "0",
              familyLocation: fData.familyLocation || "",
              familyIncome: fData.familyIncome || "",
              ownHouse:
                fData.ownHouse !== undefined && fData.ownHouse !== null
                  ? fData.ownHouse
                    ? "Yes"
                    : "No"
                  : "Select",
              caste: fData.caste || "",
              subCaste: fData.subCaste || "",
              religion: fData.religion || "",
              aboutFamily: fData.aboutFamily || "",
            };
          }

          // Handle Contact Data
          if (contactRes.status === "fulfilled" && contactRes.value.data) {
            const cData = contactRes.value.data;
            newFormData = {
              ...newFormData,
              phoneNumber: cData.phoneNumber || "",
              alternatePhoneNumber: cData.alternatePhoneNumber || "",
              address: cData.address || "",
              city: cData.city || "",
              state: cData.state || "",
              country: cData.country || "",
              pincode: cData.pincode || "",
              // Use email from contact if profile didn't have it
              email: newFormData.email || cData.email || "",
            };
          }

          if (isActive) {
            setFormData(newFormData);
          }
        } catch (error) {
          console.error("Failed to load details:", error);
          if (isActive) setFormData(initialFormState);
        } finally {
          if (isActive) setIsLoading(false);
        }
      };

      fetchAllData();

      return () => {
        isActive = false;
      };
    }, []),
  );

  const handleUpdateProfile = async () => {
    // Validation for Enum Fields
    const mandatoryEnumFields = [
      { key: "profileCreatedFor", label: "Profile Created For" },
      { key: "gender", label: "Gender" },
      { key: "complexion", label: "Complexion" },
      { key: "maritalStatus", label: "Marital Status" },
      { key: "star", label: "Star" },
      { key: "raasi", label: "Raasi" },
      { key: "education", label: "Education" },
      { key: "familyType", label: "Family Type" },
      { key: "familyStatus", label: "Family Status" },
      { key: "familyValues", label: "Family Values" },
      { key: "ownHouse", label: "Own House" },
    ];

    for (const field of mandatoryEnumFields) {
      if (
        !formData[field.key as keyof typeof formData] ||
        formData[field.key as keyof typeof formData] === "Select"
      ) {
        Alert.alert(
          "Selection Required",
          `Please select a value for ${field.label}`,
        );
        setIsSubmitting(false);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const monthIndex =
        dropdownOptions.dobMonth.indexOf(formData.dobMonth) + 1;

      // Helper to format Label to ENUM (Upper Middle Class -> UPPER_MIDDLE_CLASS)
      const formatLabelToEnum = (str: string) => {
        if (!str || str === "Select") return null;
        return str.toUpperCase().replace(/ /g, "_");
      };

      // 1. Profile Update Payload
      const profilePayload = {
        surname: formData.surname,
        name: formData.name,
        email: formData.email,
        profileCreatedFor:
          formData.profileCreatedFor === "Select" ||
          formData.profileCreatedFor === "Self"
            ? "MYSELF"
            : formData.profileCreatedFor.toUpperCase(),
        gender:
          formData.gender === "Select" ? null : formData.gender.toUpperCase(),
        birthDay: formData.dobDay === "DD" ? null : parseInt(formData.dobDay),
        birthMonth: formData.dobMonth === "MMM" ? null : monthIndex,
        birthYear:
          formData.dobYear === "YYYY" ? null : parseInt(formData.dobYear),
        birthHour:
          formData.tobHour === "HH" ? null : parseInt(formData.tobHour),
        birthMinute:
          formData.tobMinute === "MM" ? null : parseInt(formData.tobMinute),
        birthPeriod:
          formData.tobAmPm === "AM/PM" ? null : formData.tobAmPm.toUpperCase(),
        birthPlace: formData.birthPlace,
        height: formData.height === "Select" ? null : formData.height,
        weight: formData.weight === "Select" ? null : formData.weight,
        complexion: formatLabelToEnum(formData.complexion),
        maritalStatus: formatLabelToEnum(formData.maritalStatus),
        gothram: formData.gothram,
        star: formatLabelToEnum(formData.star),
        padam: formData.padam,
        raasi: formatLabelToEnum(formData.raasi),
        introduceYourSelf: formData.introduceYourSelf,
        nativePlace: formData.nativePlace,
        education: formData.education === "Select" ? null : formData.education,
        educationInDetail: formData.educationInDetail,
        profession: formData.profession,
        annualIncome: formData.annualIncome,
      };

      // 2. Family Details Payload
      const familyPayload = {
        fatherName: formData.fatherName,
        fatherOccupation: formData.fatherOccupation,
        motherName: formData.motherName,
        motherOccupation: formData.motherOccupation,
        familyType: formatLabelToEnum(formData.familyType),
        familyStatus: formatLabelToEnum(formData.familyStatus),
        familyValues: formatLabelToEnum(formData.familyValues),
        brothersCount: parseInt(formData.brothersCount) || 0,
        brothersMarried: parseInt(formData.brothersMarried) || 0,
        sistersCount: parseInt(formData.sistersCount) || 0,
        sistersMarried: parseInt(formData.sistersMarried) || 0,
        familyLocation: formData.familyLocation,
        nativePlace: formData.nativePlace,
        familyIncome: formData.familyIncome,
        ownHouse: formData.ownHouse === "Yes",
        caste: formData.caste,
        subCaste: formData.subCaste,
        religion: formData.religion,
        aboutFamily: formData.aboutFamily,
      };

      // 3. Contact Details Payload
      const contactPayload = {
        phoneNumber: formData.phoneNumber,
        alternatePhoneNumber: formData.alternatePhoneNumber,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        pincode: formData.pincode,
      };

      // Execute all requests concurrently
      await Promise.all([
        api.put("/user/update/profile", profilePayload),
        api.post("/user/family", familyPayload),
        api.post("/contact/details/post", contactPayload),
      ]);

      Alert.alert("Success", "All details updated successfully!");
      router.back();
    } catch (error: any) {
      console.error("Update error:", error);
      Alert.alert(
        "Update Failed",
        error.response?.data?.message ||
          "Could not update details. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <View className="flex-1 bg-[#F0F7FA]">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <TopNavBar title="Edit Profile" />

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
              <View className="bg-white p-5 rounded-3xl border border-blue-50 mt-4 mb-6 shadow-md shadow-blue-100">
                <View className="flex-row justify-between items-center mb-3">
                  <Text className="text-[#2D89B5] text-sm font-RoyalBold">
                    Profile Completion
                  </Text>
                  <Text className="text-[#E91E63] text-xs font-bold">50%</Text>
                </View>
                <View className="h-2 bg-blue-50 rounded-full overflow-hidden">
                  <Animated.View
                    className="h-full bg-[#E91E63] rounded-full"
                    style={{ width: "50%" }}
                  />
                </View>
                <Text className="text-gray-500 font-medium text-xs mt-3">
                  Complete your profile to get better matches
                </Text>
              </View>

              {/* Main Form Card */}
              <View className="bg-white p-6 rounded-[30px] border border-blue-50 mb-8 shadow-lg shadow-blue-100">
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
                  label="Introduce Yourself"
                  value={formData.introduceYourSelf}
                  onChangeText={(text: any) =>
                    updateField("introduceYourSelf", text)
                  }
                  icon="chatbubble-ellipses-outline"
                  placeholder="A short bio about yourself"
                />

                <CustomDropdown
                  label="Profile Created For"
                  value={formData.profileCreatedFor}
                  required={true}
                  options={dropdownOptions.profileCreatedFor}
                  field="profileCreatedFor"
                  icon="people-outline"
                  onSelect={updateField}
                  insets={insets}
                />

                <CustomDropdown
                  label="Gender"
                  value={formData.gender}
                  required={true}
                  options={dropdownOptions.gender}
                  field="gender"
                  icon="male-female-outline"
                  onSelect={updateField}
                  insets={insets}
                />

                <SectionDivider title="Contact Information" />

                <CustomInput
                  label="Phone Number"
                  value={formData.phoneNumber}
                  onChangeText={(text: any) => updateField("phoneNumber", text)}
                  required
                  icon="call-outline"
                  placeholder="Primary phone number"
                  keyboardType="phone-pad"
                />

                <CustomInput
                  label="Alternate Phone Number"
                  value={formData.alternatePhoneNumber}
                  onChangeText={(text: any) =>
                    updateField("alternatePhoneNumber", text)
                  }
                  icon="call-outline"
                  placeholder="Secondary phone number"
                  keyboardType="phone-pad"
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

                <CustomInput
                  label="Address"
                  value={formData.address}
                  onChangeText={(text: any) => updateField("address", text)}
                  icon="map-outline"
                  placeholder="House No, Street, Landmark"
                />

                <View className="flex-row gap-3">
                  <View className="flex-1">
                    <CustomInput
                      label="City"
                      value={formData.city}
                      onChangeText={(text: any) => updateField("city", text)}
                      icon="business-outline"
                      placeholder="e.g. Mumbai"
                    />
                  </View>
                  <View className="flex-1">
                    <CustomInput
                      label="State"
                      value={formData.state}
                      onChangeText={(text: any) => updateField("state", text)}
                      icon="map-outline"
                      placeholder="e.g. Maharashtra"
                    />
                  </View>
                </View>

                <View className="flex-row gap-3">
                  <View className="flex-1">
                    <CustomInput
                      label="Country"
                      value={formData.country}
                      onChangeText={(text: any) => updateField("country", text)}
                      icon="globe-outline"
                      placeholder="e.g. India"
                    />
                  </View>
                  <View className="flex-1">
                    <CustomInput
                      label="Pincode"
                      value={formData.pincode}
                      onChangeText={(text: any) => updateField("pincode", text)}
                      icon="location-outline"
                      placeholder="e.g. 400001"
                      keyboardType="number-pad"
                    />
                  </View>
                </View>

                <SectionDivider title="Birth & Location Details" />

                <Text className="text-[#2D89B5] text-xs font-RoyalBold mb-2 ml-1">
                  Date of Birth
                </Text>
                <View className="flex-row justify-between gap-3 mb-5">
                  <View className="flex-1">
                    <CustomDropdown
                      value={formData.dobDay}
                      options={dropdownOptions.dobDay}
                      field="dobDay"
                      icon="calendar-outline"
                      onSelect={updateField}
                      insets={insets}
                    />
                  </View>
                  <View className="flex-1">
                    <CustomDropdown
                      value={formData.dobMonth}
                      options={dropdownOptions.dobMonth}
                      field="dobMonth"
                      icon="calendar-outline"
                      onSelect={updateField}
                      insets={insets}
                    />
                  </View>
                  <View className="flex-1">
                    <CustomDropdown
                      value={formData.dobYear}
                      options={dropdownOptions.dobYear}
                      field="dobYear"
                      icon="calendar-outline"
                      onSelect={updateField}
                      insets={insets}
                    />
                  </View>
                </View>

                <Text className="text-[#2D89B5] text-xs font-RoyalBold mb-2 ml-1">
                  Time of Birth
                </Text>
                <View className="flex-row justify-between gap-3 mb-5">
                  <View className="flex-1">
                    <CustomDropdown
                      value={formData.tobHour}
                      options={dropdownOptions.tobHour}
                      field="tobHour"
                      icon="time-outline"
                      onSelect={updateField}
                      insets={insets}
                    />
                  </View>
                  <View className="flex-1">
                    <CustomDropdown
                      value={formData.tobMinute}
                      options={dropdownOptions.tobMinute}
                      field="tobMinute"
                      icon="time-outline"
                      onSelect={updateField}
                      insets={insets}
                    />
                  </View>
                  <View className="flex-1">
                    <CustomDropdown
                      value={formData.tobAmPm}
                      options={dropdownOptions.tobAmPm}
                      field="tobAmPm"
                      icon="time-outline"
                      onSelect={updateField}
                      insets={insets}
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

                <CustomInput
                  label="Native Place"
                  value={formData.nativePlace}
                  onChangeText={(text: any) => updateField("nativePlace", text)}
                  icon="home-outline"
                  placeholder="Your native city or town"
                />

                <SectionDivider title="Education & Career" />

                <CustomDropdown
                  label="Education"
                  value={formData.education}
                  required={true}
                  options={dropdownOptions.education}
                  field="education"
                  icon="school-outline"
                  onSelect={updateField}
                  insets={insets}
                />

                <CustomInput
                  label="Education in Detail"
                  value={formData.educationInDetail}
                  onChangeText={(text: any) =>
                    updateField("educationInDetail", text)
                  }
                  icon="book-outline"
                  placeholder="e.g. Computer Science Engineering"
                />

                <CustomInput
                  label="Profession"
                  value={formData.profession}
                  onChangeText={(text: any) => updateField("profession", text)}
                  icon="briefcase-outline"
                  placeholder="e.g. Software Engineer"
                />

                <CustomInput
                  label="Annual Income"
                  value={formData.annualIncome}
                  onChangeText={(text: any) =>
                    updateField("annualIncome", text)
                  }
                  icon="cash-outline"
                  placeholder="e.g. 5 LPA"
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
                      icon="fitness-outline"
                      onSelect={updateField}
                      insets={insets}
                    />
                  </View>
                </View>

                <CustomDropdown
                  label="Complexion"
                  value={formData.complexion}
                  required={true}
                  options={dropdownOptions.complexion}
                  field="complexion"
                  icon="color-palette-outline"
                  onSelect={updateField}
                  insets={insets}
                />

                <CustomDropdown
                  label="Marital Status"
                  value={formData.maritalStatus}
                  required={true}
                  options={dropdownOptions.maritalStatus}
                  field="maritalStatus"
                  icon="heart-outline"
                  onSelect={updateField}
                  insets={insets}
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
                      required={true}
                      options={dropdownOptions.star}
                      field="star"
                      icon="star-outline"
                      onSelect={updateField}
                      insets={insets}
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
                      required={true}
                      options={dropdownOptions.raasi}
                      field="raasi"
                      icon="moon-outline"
                      onSelect={updateField}
                      insets={insets}
                    />
                  </View>
                </View>

                <SectionDivider title="Family & Background Details" />

                <CustomInput
                  label="Father's Name"
                  value={formData.fatherName}
                  onChangeText={(text: any) => updateField("fatherName", text)}
                  icon="person-outline"
                  placeholder="Enter Father's Name"
                />

                <CustomInput
                  label="Father's Occupation"
                  value={formData.fatherOccupation}
                  onChangeText={(text: any) =>
                    updateField("fatherOccupation", text)
                  }
                  icon="briefcase-outline"
                  placeholder="e.g. Business, Retired"
                />

                <CustomInput
                  label="Mother's Name"
                  value={formData.motherName}
                  onChangeText={(text: any) => updateField("motherName", text)}
                  icon="person-outline"
                  placeholder="Enter Mother's Name"
                />

                <CustomInput
                  label="Mother's Occupation"
                  value={formData.motherOccupation}
                  onChangeText={(text: any) =>
                    updateField("motherOccupation", text)
                  }
                  icon="home-outline"
                  placeholder="e.g. Homemaker, Teacher"
                />

                <View className="flex-row gap-3">
                  <View className="flex-1">
                    <CustomDropdown
                      label="No. of Brothers"
                      value={formData.brothersCount}
                      options={dropdownOptions.countOptions}
                      field="brothersCount"
                      icon="people-outline"
                      onSelect={updateField}
                      insets={insets}
                    />
                  </View>
                  <View className="flex-1">
                    <CustomDropdown
                      label="Brothers Married"
                      value={formData.brothersMarried}
                      options={dropdownOptions.countOptions}
                      field="brothersMarried"
                      icon="checkmark-circle-outline"
                      onSelect={updateField}
                      insets={insets}
                    />
                  </View>
                </View>

                <View className="flex-row gap-3">
                  <View className="flex-1">
                    <CustomDropdown
                      label="No. of Sisters"
                      value={formData.sistersCount}
                      options={dropdownOptions.countOptions}
                      field="sistersCount"
                      icon="people-outline"
                      onSelect={updateField}
                      insets={insets}
                    />
                  </View>
                  <View className="flex-1">
                    <CustomDropdown
                      label="Sisters Married"
                      value={formData.sistersMarried}
                      options={dropdownOptions.countOptions}
                      field="sistersMarried"
                      icon="checkmark-circle-outline"
                      onSelect={updateField}
                      insets={insets}
                    />
                  </View>
                </View>

                <View className="flex-row gap-3">
                  <View className="flex-1">
                    <CustomInput
                      label="Religion"
                      value={formData.religion}
                      onChangeText={(text: any) =>
                        updateField("religion", text)
                      }
                      icon="book-outline"
                      placeholder="e.g. Hindu"
                    />
                  </View>
                  <View className="flex-1">
                    <CustomInput
                      label="Caste"
                      value={formData.caste}
                      onChangeText={(text: any) => updateField("caste", text)}
                      icon="shield-checkmark-outline"
                      placeholder="e.g. OC, BC"
                    />
                  </View>
                </View>

                <CustomInput
                  label="Sub-Caste (Optional)"
                  value={formData.subCaste}
                  onChangeText={(text: any) => updateField("subCaste", text)}
                  icon="shield-outline"
                  placeholder="e.g. Reddy, Kamma"
                />

                <CustomDropdown
                  label="Family Type"
                  value={formData.familyType}
                  required={true}
                  options={dropdownOptions.familyType}
                  field="familyType"
                  icon="home-outline"
                  onSelect={updateField}
                  insets={insets}
                />

                <CustomDropdown
                  label="Family Status"
                  value={formData.familyStatus}
                  required={true}
                  options={dropdownOptions.familyStatus}
                  field="familyStatus"
                  icon="stats-chart-outline"
                  onSelect={updateField}
                  insets={insets}
                />

                <CustomDropdown
                  label="Family Values"
                  value={formData.familyValues}
                  required={true}
                  options={dropdownOptions.familyValues}
                  field="familyValues"
                  icon="rose-outline"
                  onSelect={updateField}
                  insets={insets}
                />

                <CustomInput
                  label="Family Location"
                  value={formData.familyLocation}
                  onChangeText={(text: any) =>
                    updateField("familyLocation", text)
                  }
                  icon="location-outline"
                  placeholder="e.g. Hyderabad"
                />

                <View className="flex-row gap-3">
                  <View className="flex-1">
                    <CustomInput
                      label="Family Income"
                      value={formData.familyIncome}
                      onChangeText={(text: any) =>
                        updateField("familyIncome", text)
                      }
                      icon="cash-outline"
                      placeholder="e.g. 10 LPA"
                    />
                  </View>
                  <View className="flex-1">
                    <CustomDropdown
                      label="Own House"
                      value={formData.ownHouse}
                      required={true}
                      options={dropdownOptions.ownHouse}
                      field="ownHouse"
                      icon="home-outline"
                      onSelect={updateField}
                      insets={insets}
                    />
                  </View>
                </View>

                <CustomInput
                  label="About Family"
                  value={formData.aboutFamily}
                  onChangeText={(text: any) => updateField("aboutFamily", text)}
                  icon="chatbubble-ellipses-outline"
                  placeholder="Write a few lines about your family"
                />
              </View>

              {/* Action Buttons */}
              <View className="flex-row gap-4 mb-6">
                <TouchableOpacity
                  activeOpacity={0.8}
                  className="flex-1 bg-white h-14 rounded-2xl justify-center items-center border border-blue-100 shadow-sm"
                  onPress={() => router.back()}
                  disabled={isSubmitting}
                >
                  <Text className="text-[#2D89B5] font-black text-sm uppercase tracking-wider">
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  className="flex-1 bg-[#2D89B5] h-14 rounded-2xl justify-center items-center shadow-md shadow-blue-200 flex-row gap-2"
                  onPress={handleUpdateProfile}
                  disabled={isSubmitting || isLoading}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color="#FFF" size="small" />
                  ) : (
                    <>
                      <Ionicons name="save-outline" size={20} color="#FFF" />
                      <Text className="text-white font-extrabold text-sm tracking-widest uppercase">
                        Save Details
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>

              {/* Progress Indicator */}
              <View className="flex-row justify-center gap-2 mb-8">
                <View className="w-2 h-2 rounded-full bg-[#2D89B5]"></View>
                <View className="w-2 h-2 rounded-full bg-[#2D89B5]"></View>
                <View className="w-2 h-2 rounded-full bg-[#2D89B5]"></View>
                <View className="w-2 h-2 rounded-full bg-blue-200"></View>
              </View>
            </Animated.View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
};

export default EditProfile;
