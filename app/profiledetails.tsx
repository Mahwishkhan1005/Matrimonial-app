import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import api from "../axios/axiosInterceptor";

const { width } = Dimensions.get("window");

const BRIDE_PHOTOS = [
  require("../assets/images/bride1.png"),
  require("../assets/images/bride2.png"),
  require("../assets/images/bride3.png"),
];

const GROOM_PHOTOS = [
  require("../assets/images/groom1.png"),
  require("../assets/images/groom2.png"),
  require("../assets/images/groom3.png"),
];

const AccordionItem = ({
  title,
  content,
  isLocked = false,
  onUnlock,
}: {
  title: string;
  content: React.ReactNode;
  isLocked?: boolean;
  onUnlock?: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View className="mb-4">
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setIsOpen(!isOpen)}
        className="bg-white p-5 rounded-2xl flex-row justify-between items-center border border-blue-50 shadow-sm shadow-blue-100"
      >
        <View className="flex-row items-center">
          <Text
            style={{ fontFamily: "RoyalBold" }}
            className="text-[#2D89B5] text-lg"
          >
            {title}
          </Text>
          {isLocked && (
            <Ionicons
              name="lock-closed"
              size={16}
              color="#E91E63"
              style={{ marginLeft: 8 }}
            />
          )}
        </View>
        <Ionicons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={20}
          color="#2D89B5"
        />
      </TouchableOpacity>
      {isOpen && (
        <View className="bg-blue-50/50 p-5 rounded-b-2xl -mt-2 border-x border-b border-blue-50">
          {isLocked ? (
            <View className="items-center py-4">
              <Ionicons name="diamond-outline" size={40} color="#E91E63" />
              <Text className="text-[#333] text-sm text-center font-medium mt-2 mb-4">
                Take subscription to view {title.toLowerCase()}
              </Text>
              <TouchableOpacity
                onPress={onUnlock}
                className="bg-[#E91E63] px-6 py-2 rounded-full shadow-sm shadow-pink-200"
              >
                <Text className="text-white font-bold text-xs uppercase tracking-wider">
                  Take Membership
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            content
          )}
        </View>
      )}
    </View>
  );
};

const ProfileDetails = () => {
  const router = useRouter();
  const { profileId, gender } = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  const isMale = (gender as string)?.toLowerCase() === "male";
  const defaultPhotos = isMale ? GROOM_PHOTOS : BRIDE_PHOTOS;

  const [profileData, setProfileData] = useState<any>(null);
  const [contactDetails, setContactDetails] = useState<any>(null);
  const [familyDetails, setFamilyDetails] = useState<any>(null);
  const [userImages, setUserImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState<any>(defaultPhotos[0]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        if (profileId) {
          // If profileId is provided, fetch specific user profile
          const response = await api.get(
            `/user/profile/${String(profileId).trim()}`,
          );
          const data = response.data;

          setProfileData(data);
          // Assuming the specific endpoint might return family and contact details too,
          // or we might need to adjust based on how the backend returns data.
          // For now, let's set them if they exist in the response
          if (data.familyDetails) setFamilyDetails(data.familyDetails);
          if (data.contactDetails) setContactDetails(data.contactDetails);
          if (data.images) setUserImages(data.images);
        } else {
          // Fallback to current user profile (existing logic)
          const [profileRes, contactRes, familyRes, imagesRes] =
            await Promise.allSettled([
              api.get("/user/profile"),
              api.get("/contact/details"),
              api.get("/user/family/details"),
              api.get("/user/images"),
            ]);

          if (profileRes.status === "fulfilled")
            setProfileData(profileRes.value.data);
          if (contactRes.status === "fulfilled")
            setContactDetails(contactRes.value.data);
          if (familyRes.status === "fulfilled")
            setFamilyDetails(familyRes.value.data);
          if (imagesRes.status === "fulfilled")
            setUserImages(imagesRes.value.data || []);
        }
      } catch (error) {
        console.error("Error fetching profile details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [profileId]);

  const calculateAge = (year: number) => {
    if (!year) return "N/A";
    const currentYear = new Date().getFullYear();
    return `${currentYear - year} Years`;
  };

  // Gallery Photos logic - Memoized to prevent unnecessary re-renders
  const galleryImages = useMemo(() => {
    let images: any[] = [];

    // 1. Try images from /user/images endpoint
    if (userImages && userImages.length > 0) {
      images = userImages.map((img) =>
        typeof img === "string"
          ? { uri: img }
          : { uri: img.imageUrl || img.url },
      );
    }
    // 2. Fallback to images array in profileData
    else if (profileData?.images && profileData.images.length > 0) {
      images = profileData.images.map((img: any) =>
        typeof img === "string"
          ? { uri: img }
          : { uri: img.imageUrl || img.url },
      );
    }

    // 3. Fallback to default photos
    if (images.length === 0) {
      images = defaultPhotos;
    }

    return images;
  }, [userImages, profileData, defaultPhotos]);

  // Set the first image as main when gallery changes
  useEffect(() => {
    if (galleryImages && galleryImages.length > 0) {
      setMainImage(galleryImages[0]);
    }
  }, [galleryImages]);

  if (loading) {
    return (
      <View className="flex-1 bg-[#F0F7FA] justify-center items-center">
        <ActivityIndicator size="large" color="#2D89B5" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#F0F7FA]">
      {/* Header */}
      <View
        style={{ paddingTop: insets.top + 10 }}
        className="bg-white px-6 pb-4 flex-row items-center border-b border-blue-100 shadow-sm"
      >
        <TouchableOpacity
          onPress={() => router.replace("/dashboard")}
          className="mr-4"
        >
          <Ionicons name="arrow-back" size={24} color="#2D89B5" />
        </TouchableOpacity>
        <Text
          style={{ fontFamily: "RoyalBold" }}
          className="text-[#2D89B5] text-xl"
        >
          Profile Details
        </Text>
      </View>

      <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
        {/* Gallery Section */}
        <View className="flex-row mb-8 bg-white p-4 rounded-3xl border border-blue-50 shadow-md shadow-blue-100">
          <View className="flex-1 mr-4">
            <Image
              key={mainImage?.uri || String(mainImage)}
              source={mainImage}
              className="w-full h-80 rounded-2xl bg-blue-50"
              resizeMode="cover"
            />
          </View>
          <View className="w-20">
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ maxHeight: 320 }}
            >
              {galleryImages.map((img, idx) => {
                const isSelected =
                  (typeof mainImage === "number" && mainImage === img) ||
                  (typeof mainImage === "object" &&
                    typeof img === "object" &&
                    mainImage?.uri === img?.uri);
                return (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => setMainImage(img)}
                    className="mb-2"
                  >
                    <Image
                      source={img}
                      className={`w-20 h-24 rounded-xl border-2 ${
                        isSelected ? "border-[#E91E63]" : "border-blue-100"
                      }`}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>

        {/* Dropdowns */}
        <AccordionItem
          title="Initial Details"
          content={
            <View>
              <DetailRow
                label="Name"
                value={
                  `${profileData?.name || ""} ${profileData?.surname || ""}`.trim() ||
                  (isMale ? "Rahul Verma" : "Bhavya Sharma")
                }
              />
              <DetailRow
                label="Profile ID"
                value={profileData?.profileId || "N/A"}
              />
              <DetailRow
                label="Age"
                value={calculateAge(profileData?.birthYear)}
              />
              <DetailRow label="Height" value={profileData?.height || "N/A"} />
              <DetailRow label="Weight" value={profileData?.weight || "N/A"} />
              <DetailRow
                label="Complexion"
                value={profileData?.complexion || "N/A"}
              />
              <DetailRow
                label="Marital Status"
                value={profileData?.maritalStatus || "N/A"}
              />
              <DetailRow
                label="Education"
                value={profileData?.education || "N/A"}
              />
              <DetailRow
                label="Profession"
                value={profileData?.profession || "N/A"}
              />
              <DetailRow
                label="Annual Income"
                value={profileData?.annualIncome || "N/A"}
              />
            </View>
          }
        />

        <AccordionItem
          title="Horoscope Details"
          content={
            <View>
              <DetailRow
                label="Birth Place"
                value={profileData?.birthPlace || "N/A"}
              />
              <DetailRow
                label="Birth Time"
                value={`${profileData?.birthHour || ""}:${profileData?.birthMinute || ""} ${profileData?.birthPeriod || ""}`}
              />
              <DetailRow
                label="Gothram"
                value={profileData?.gothram || "N/A"}
              />
              <DetailRow label="Star" value={profileData?.star || "N/A"} />
              <DetailRow label="Padam" value={profileData?.padam || "N/A"} />
              <DetailRow label="Raasi" value={profileData?.raasi || "N/A"} />
            </View>
          }
        />

        <AccordionItem
          title="Family Details"
          content={
            <View>
              <DetailRow
                label="Father Name"
                value={familyDetails?.fatherName || "N/A"}
              />
              <DetailRow
                label="Father Occupation"
                value={familyDetails?.fatherOccupation || "N/A"}
              />
              <DetailRow
                label="Mother Name"
                value={familyDetails?.motherName || "N/A"}
              />
              <DetailRow
                label="Mother Occupation"
                value={familyDetails?.motherOccupation || "N/A"}
              />
              <DetailRow
                label="Family Type"
                value={familyDetails?.familyType || "N/A"}
              />
              <DetailRow
                label="Status"
                value={familyDetails?.familyStatus || "N/A"}
              />
              <DetailRow
                label="Values"
                value={familyDetails?.familyValues || "N/A"}
              />
              <DetailRow
                label="Brothers"
                value={`${familyDetails?.brothersCount || 0} (${familyDetails?.brothersMarried || 0} Married)`}
              />
              <DetailRow
                label="Sisters"
                value={`${familyDetails?.sistersCount || 0} (${familyDetails?.sistersMarried || 0} Married)`}
              />
              <DetailRow
                label="Family Location"
                value={familyDetails?.familyLocation || "N/A"}
              />
              <DetailRow
                label="Native Place"
                value={familyDetails?.nativePlace || "N/A"}
              />
              <DetailRow
                label="Income"
                value={familyDetails?.familyIncome || "N/A"}
              />
              <DetailRow
                label="Own House"
                value={familyDetails?.ownHouse ? "Yes" : "No"}
              />
              <DetailRow
                label="Religion"
                value={familyDetails?.religion || "N/A"}
              />
              <DetailRow label="Caste" value={familyDetails?.caste || "N/A"} />
              {familyDetails?.subCaste ? (
                <DetailRow label="Sub Caste" value={familyDetails.subCaste} />
              ) : null}
              <View className="mt-2">
                <Text className="text-gray-500 font-medium text-sm">
                  About Family
                </Text>
                <Text className="text-[#2D89B5] text-sm mt-1 leading-5">
                  {familyDetails?.aboutFamily || "N/A"}
                </Text>
              </View>
            </View>
          }
        />

        <AccordionItem
          title="Contact Details"
          content={
            <View>
              <DetailRow
                label="Mobile"
                value={
                  contactDetails?.phoneNumber ||
                  profileData?.phoneNumber ||
                  "N/A"
                }
              />
              {contactDetails?.alternatePhoneNumber ? (
                <DetailRow
                  label="Alt Mobile"
                  value={contactDetails.alternatePhoneNumber}
                />
              ) : null}
              <DetailRow
                label="Email"
                value={contactDetails?.email || profileData?.email || "N/A"}
              />
              <DetailRow
                label="Location"
                value={
                  `${contactDetails?.address || ""}, ${contactDetails?.city || ""}, ${contactDetails?.state || ""}, ${contactDetails?.country || ""} - ${contactDetails?.pincode || ""}`
                    .replace(/^, /, "")
                    .replace(/ ,/g, "")
                    .replace(/, ,/g, ",")
                    .trim()
                    .replace(/,$/, "") || "N/A"
                }
              />
            </View>
          }
        />
        <View className="h-10" />
      </ScrollView>
    </View>
  );
};

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <View className="flex-row justify-between py-3 border-b border-blue-100">
    <Text className="text-gray-500 font-medium text-sm">{label}</Text>
    <Text
      style={{ fontFamily: "RoyalBold" }}
      className="text-[#2D89B5] text-sm text-right flex-1 ml-4"
    >
      {value}
    </Text>
  </View>
);

export default ProfileDetails;
