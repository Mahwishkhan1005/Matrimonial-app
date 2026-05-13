import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
  const { gender } = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  const isMale = gender === "male";
  const photos = isMale ? GROOM_PHOTOS : BRIDE_PHOTOS;

  const [mainImage, setMainImage] = useState(photos[0]);

  useEffect(() => {
    setMainImage(photos[0]);
  }, [gender]);

  const thumbnails = photos;

  return (
    <View className="flex-1 bg-[#F0F7FA]">
      {/* Header */}
      <View
        style={{ paddingTop: insets.top + 10 }}
        className="bg-white px-6 pb-4 flex-row items-center border-b border-blue-100 shadow-sm"
      >
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
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
              source={mainImage}
              className="w-full h-80 rounded-2xl bg-blue-50"
              resizeMode="cover"
            />
          </View>
          <View className="w-20 justify-between">
            {thumbnails.map((img, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => setMainImage(img)}
                className="mb-2"
              >
                <Image
                  source={img}
                  className={`w-20 h-24 rounded-xl border-2 ${
                    mainImage === img ? "border-[#E91E63]" : "border-blue-100"
                  }`}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Dropdowns */}
        <AccordionItem
          title="Initial Details"
          content={
            <View>
              <DetailRow
                label="Name"
                value={isMale ? "Rahul Verma" : "Bhavya Sharma"}
              />
              <DetailRow label="Age" value="26 Years" />
              <DetailRow label="Height" value={"5'4\""} />
              <DetailRow label="Diet" value="Vegetarian" />
              <DetailRow label="Language" value="Hindi, English" />
            </View>
          }
        />

        <AccordionItem
          title="Family Details"
          isLocked={true}
          onUnlock={() => router.push("/membership")}
          content={
            <View>
              <DetailRow label="Father" value="Business Owner" />
              <DetailRow label="Mother" value="Homemaker" />
              <DetailRow label="Siblings" value="1 Brother (Married)" />
              <DetailRow label="Family Type" value="Nuclear Family" />
              <DetailRow label="Status" value="Middle Class" />
            </View>
          }
        />

        <AccordionItem
          title="Contact Details"
          isLocked={true}
          onUnlock={() => router.push("/membership")}
          content={
            <View>
              <DetailRow label="Mobile" value="+91 98765 43210" />
              <DetailRow
                label="Email"
                value={isMale ? "rahul.v@example.com" : "bhavya.s@example.com"}
              />
              <DetailRow label="Location" value="Mumbai, Maharashtra" />
              <DetailRow label="Timing" value="10:00 AM - 08:00 PM" />
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
      className="text-[#2D89B5] text-sm"
    >
      {value}
    </Text>
  </View>
);

export default ProfileDetails;
