import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import api from "../axios/axiosInterceptor";
import TopNavBar from "../components/TopNavBar";

const { width } = Dimensions.get("window");

const SearchProfiles = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedProfile, setSearchedProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchedProfile(null);
      setErrorMsg("");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");
    setSearchedProfile(null);

    try {
      // Make the API call to fetch by Profile ID
      const response = await api.get(`/user/profile/${searchQuery.trim()}`);
      const data = response.data;

      // Calculate approximate age from birthYear
      const currentYear = new Date().getFullYear();
      const age = data.birthYear ? currentYear - data.birthYear : "N/A";

      // Map the full backend JSON to our state
      setSearchedProfile({
        ...data,
        age: age,
        allImages: data.images || [],
      });
    } catch (error: any) {
      console.error("Search Error:", error);
      setErrorMsg(
        error.response?.data?.message ||
          "Profile not found. Please check the ID.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchedProfile(null);
    setErrorMsg("");
  };

  // Reusable component for showing individual detail rows
  const DetailRow = ({
    icon,
    label,
    value,
  }: {
    icon: any;
    label: string;
    value: string;
  }) => (
    <View className="flex-row items-center py-3 border-b border-blue-50/50 last:border-0">
      <View className="w-10 h-10 rounded-full bg-blue-50 items-center justify-center mr-4">
        <Ionicons name={icon} size={18} color="#2D89B5" />
      </View>
      <View className="flex-1">
        <Text className="text-[#2D89B5] text-[10px] uppercase font-black tracking-widest mb-0.5">
          {label}
        </Text>
        <Text className="text-gray-700 font-medium text-base">
          {value || "Not Specified"}
        </Text>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-[#F0F7FA]">
      {/* Universal Top Nav Bar */}
      <TopNavBar title="Search Profiles" />

      {/* Search Controls (Pinned at top) */}
      <View className="bg-white px-6 py-4 border-b border-blue-100 shadow-sm z-10">
        <Text className="text-[#2D89B5] text-xs font-bold uppercase tracking-wider mb-2 ml-1">
          Find a specific match
        </Text>
        <View className="bg-blue-50/50 flex-row items-center px-4 py-3 rounded-2xl border border-blue-100">
          <Ionicons name="search" size={20} color="#2D89B5" />
          <TextInput
            className="flex-1 ml-3 text-[#333] text-base font-medium"
            placeholder="Enter Profile ID (e.g. MATRI87285C)"
            placeholderTextColor="rgba(45, 137, 181, 0.4)"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="characters"
            autoCorrect={false}
            returnKeyType="search"
            onSubmitEditing={handleSearch}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} className="p-1">
              <Ionicons name="close-circle" size={18} color="#2D89B5" />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          onPress={handleSearch}
          disabled={isLoading || !searchQuery.trim()}
          className={`mt-4 py-3 rounded-xl items-center flex-row justify-center shadow-md ${
            searchQuery.trim()
              ? "bg-[#2D89B5] shadow-blue-200"
              : "bg-[#2D89B5]/50"
          }`}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <>
              <Ionicons name="search" size={16} color="#FFF" />
              <Text className="text-white font-black ml-2 uppercase tracking-widest text-sm">
                Search Profile
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Results Area */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 24, paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        {isLoading && (
          <View className="mt-20 items-center justify-center">
            <ActivityIndicator size="large" color="#2D89B5" />
            <Text className="text-[#2D89B5] mt-4 font-bold">
              Fetching profile details...
            </Text>
          </View>
        )}

        {!isLoading && !searchedProfile && (
          <View className="items-center justify-center mt-12">
            {errorMsg ? (
              <>
                <View className="w-20 h-20 rounded-full bg-red-50 justify-center items-center mb-4 border border-red-100">
                  <Ionicons
                    name="alert-circle-outline"
                    size={40}
                    color="#ef4444"
                  />
                </View>
                <Text className="text-red-500 text-center font-medium px-6 text-base">
                  {errorMsg}
                </Text>
              </>
            ) : (
              <>
                <View className="w-24 h-24 rounded-full bg-blue-50 justify-center items-center mb-4">
                  <Ionicons
                    name="id-card-outline"
                    size={40}
                    color="#2D89B5"
                    opacity={0.5}
                  />
                </View>
                <Text
                  style={{ fontFamily: "RoyalBold" }}
                  className="text-[#2D89B5] text-2xl tracking-wide"
                >
                  Ready to Search
                </Text>
                <Text className="text-gray-400 mt-2 text-sm text-center px-8 font-medium">
                  Enter a Profile ID above to see all their details right here.
                </Text>
              </>
            )}
          </View>
        )}

        {/* --- FULL PROFILE VIEW --- */}
        {!isLoading && searchedProfile && (
          <View>
            {/* Image Gallery */}
            {searchedProfile.allImages &&
            searchedProfile.allImages.length > 0 ? (
              <View className="rounded-[30px] overflow-hidden bg-white shadow-xl shadow-blue-100 mb-6 border-4 border-white h-96">
                <ScrollView
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                >
                  {searchedProfile.allImages.map(
                    (img: string, index: number) => (
                      <Image
                        key={index}
                        source={{ uri: img }}
                        style={{ width: width - 48 - 8, height: "100%" }} // Adjusted for padding & border
                        resizeMode="cover"
                      />
                    ),
                  )}
                </ScrollView>
                {/* Image Counter Badge */}
                {searchedProfile.allImages.length > 1 && (
                  <View className="absolute bottom-4 right-4 bg-black/60 px-3 py-1.5 rounded-full">
                    <Text className="text-white text-xs font-bold">
                      {searchedProfile.allImages.length} Photos
                    </Text>
                  </View>
                )}
              </View>
            ) : (
              <View className="rounded-[30px] h-64 bg-blue-50 items-center justify-center mb-6 border-4 border-white shadow-lg">
                <Ionicons
                  name="person"
                  size={80}
                  color="#2D89B5"
                  opacity={0.2}
                />
                <Text className="text-[#2D89B5]/50 font-bold mt-2">
                  No Images Uploaded
                </Text>
              </View>
            )}

            {/* Basic Info Header */}
            <View className="bg-white p-6 rounded-[30px] mb-6 shadow-lg shadow-blue-100 border border-blue-50">
              <View className="flex-row justify-between items-start">
                <View className="flex-1">
                  <Text
                    style={{ fontFamily: "RoyalBold" }}
                    className="text-[#2D89B5] text-3xl"
                  >
                    {searchedProfile.name} {searchedProfile.surname}
                  </Text>
                  <Text className="text-[#E91E63] text-sm font-black tracking-widest mt-1">
                    {searchedProfile.profileId}
                  </Text>
                </View>
                <View className="w-12 h-12 rounded-full bg-pink-50 items-center justify-center ml-2 border border-pink-100">
                  <Ionicons
                    name={searchedProfile.gender === "MALE" ? "male" : "female"}
                    size={24}
                    color="#E91E63"
                  />
                </View>
              </View>

              <View className="flex-row mt-4 pt-4 border-t border-blue-50">
                <View className="flex-1 flex-row items-center">
                  <Ionicons name="calendar-outline" size={16} color="#9CA3AF" />
                  <Text className="text-gray-600 font-bold ml-2">
                    {searchedProfile.age} Years
                  </Text>
                </View>
                <View className="flex-1 flex-row items-center">
                  <Ionicons name="location-outline" size={16} color="#9CA3AF" />
                  <Text className="text-gray-600 font-bold ml-2">
                    {searchedProfile.birthPlace}
                  </Text>
                </View>
              </View>
            </View>

            {/* Contact Information */}
            <View className="bg-white p-6 rounded-[30px] mb-6 shadow-lg shadow-blue-100 border border-blue-50">
              <Text
                style={{ fontFamily: "RoyalBold" }}
                className="text-[#2D89B5] text-xl mb-4"
              >
                Contact Details
              </Text>
              <DetailRow
                icon="call"
                label="Phone Number"
                value={searchedProfile.phoneNumber}
              />
              <DetailRow
                icon="mail"
                label="Email Address"
                value={searchedProfile.email}
              />
              <DetailRow
                icon="person"
                label="Profile Created For"
                value={searchedProfile.profileCreatedFor}
              />
            </View>

            {/* Physical Attributes */}
            <View className="bg-white p-6 rounded-[30px] mb-6 shadow-lg shadow-blue-100 border border-blue-50">
              <Text
                style={{ fontFamily: "RoyalBold" }}
                className="text-[#2D89B5] text-xl mb-4"
              >
                Personal Details
              </Text>
              <DetailRow
                icon="body"
                label="Height"
                value={searchedProfile.height}
              />
              <DetailRow
                icon="scale"
                label="Weight"
                value={searchedProfile.weight}
              />
              <DetailRow
                icon="color-palette"
                label="Complexion"
                value={searchedProfile.complexion}
              />
              <DetailRow
                icon="heart"
                label="Marital Status"
                value={searchedProfile.maritalStatus}
              />
            </View>

            {/* Astrological / Religious Details */}
            <View className="bg-white p-6 rounded-[30px] mb-6 shadow-lg shadow-blue-100 border border-blue-50">
              <Text
                style={{ fontFamily: "RoyalBold" }}
                className="text-[#2D89B5] text-xl mb-4"
              >
                Religious Details
              </Text>
              <DetailRow
                icon="moon"
                label="Raasi"
                value={searchedProfile.raasi}
              />
              <DetailRow
                icon="star"
                label="Star"
                value={searchedProfile.star}
              />
              <DetailRow
                icon="analytics"
                label="Padam"
                value={searchedProfile.padam}
              />
              <DetailRow
                icon="flower"
                label="Gothram"
                value={searchedProfile.gothram}
              />
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default SearchProfiles;
