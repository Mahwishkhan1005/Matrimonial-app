import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
    Dimensions,
    FlatList,
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import TopNavBar from "../components/TopNavBar";

const { width } = Dimensions.get("window");
const COLUMN_WIDTH = (width - 48) / 2;

const ALL_PROFILES = [
  // Brides
  {
    id: "b1",
    name: "Bhavya",
    age: 26,
    gender: "female",
    location: "Mumbai",
    image: require("../assets/images/bride1.png"),
  },
  {
    id: "b2",
    name: "Bhargavi",
    age: 26,
    gender: "female",
    location: "Bangalore",
    image: require("../assets/images/bride2.png"),
  },
  {
    id: "b3",
    name: "Harshini",
    age: 26,
    gender: "female",
    location: "Hyderabad",
    image: require("../assets/images/bride3.png"),
  },
  {
    id: "b4",
    name: "Saparya",
    age: 28,
    gender: "female",
    location: "Delhi",
    image: require("../assets/images/bride4.png"),
  },
  {
    id: "b5",
    name: "Divya",
    age: 26,
    gender: "female",
    location: "Pune",
    image: require("../assets/images/bride5.png"),
  },
  {
    id: "b6",
    name: "Teena",
    age: 27,
    gender: "female",
    location: "Chennai",
    image: require("../assets/images/bride6.png"),
  },
  // Grooms
  {
    id: "g1",
    name: "Rahul",
    age: 28,
    gender: "male",
    location: "Mumbai",
    image: require("../assets/images/groom1.png"),
  },
  {
    id: "g2",
    name: "Vikram",
    age: 30,
    gender: "male",
    location: "Bangalore",
    image: require("../assets/images/groom2.png"),
  },
  {
    id: "g3",
    name: "Arjun",
    age: 27,
    gender: "male",
    location: "Hyderabad",
    image: require("../assets/images/groom3.png"),
  },
  {
    id: "g4",
    name: "Sameer",
    age: 29,
    gender: "male",
    location: "Delhi",
    image: require("../assets/images/groom4.png"),
  },
  {
    id: "g5",
    name: "Karan",
    age: 26,
    gender: "male",
    location: "Pune",
    image: require("../assets/images/groom5.png"),
  },
  {
    id: "g6",
    name: "Rohan",
    age: 31,
    gender: "male",
    location: "Chennai",
    image: require("../assets/images/groom6.png"),
  },
];

const SearchProfiles = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGender, setSelectedGender] = useState<
    "all" | "male" | "female"
  >("all");

  const filteredProfiles = useMemo(() => {
    return ALL_PROFILES.filter((profile) => {
      const matchesQuery =
        profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGender =
        selectedGender === "all" || profile.gender === selectedGender;
      return matchesQuery && matchesGender;
    });
  }, [searchQuery, selectedGender]);

  const renderItem = ({ item }: { item: (typeof ALL_PROFILES)[0] }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() =>
        router.push({
          pathname: "/profiledetails",
          params: { gender: item.gender },
        })
      }
      style={{ width: COLUMN_WIDTH, height: COLUMN_WIDTH * 1.4 }}
      className="m-1.5 rounded-[20px] overflow-hidden border border-[#C5A059]/10"
    >
      <Image
        source={item.image}
        style={{ width: "100%", height: "100%" }}
        resizeMode="cover"
      />
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.8)"]}
        className="absolute inset-0 justify-end p-3"
      >
        <Text
          style={{ fontFamily: "RoyalBold" }}
          className="text-white text-lg"
        >
          {item.name}
        </Text>
        <View className="flex-row items-center justify-between">
          <Text
            style={{ fontFamily: "RoyalBold" }}
            className="text-white/80 text-xs"
          >
            {item.age} Yrs • {item.location}
          </Text>
          <Ionicons
            name={item.gender === "male" ? "male" : "female"}
            size={12}
            color="#C5A059"
          />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-[#010302]">
      {/* Universal Top Nav Bar */}
      <TopNavBar title="Search Profiles" />

      {/* Search & Filter Controls */}
      <View className="bg-[#0B2B1F] px-6 py-4 border-b border-[#C5A059]/20">
        {/* Search Bar */}
        <View className="bg-black/40 flex-row items-center px-4 py-3 rounded-2xl border border-[#C5A059]/20">
          <Ionicons name="search" size={20} color="#C5A059" />
          <TextInput
            className="flex-1 ml-3 text-white text-base"
            placeholder="Search by name or location..."
            placeholderTextColor="rgba(255,255,255,0.3)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={18} color="#C5A059" />
            </TouchableOpacity>
          )}
        </View>

        {/* Filters */}
        <View className="flex-row mt-4">
          {(["all", "male", "female"] as const).map((gender) => (
            <TouchableOpacity
              key={gender}
              onPress={() => setSelectedGender(gender)}
              className={`px-6 py-2 rounded-full mr-2 border ${
                selectedGender === gender
                  ? "bg-[#C5A059] border-[#C5A059]"
                  : "bg-transparent border-[#C5A059]/20"
              }`}
            >
              <Text
                className={`text-xs font-bold uppercase ${
                  selectedGender === gender ? "text-black" : "text-white/60"
                }`}
              >
                {gender}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={filteredProfiles}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ padding: 12 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center mt-20">
            <Ionicons
              name="search-outline"
              size={80}
              color="#C5A059"
              opacity={0.2}
            />
            <Text className="text-white/40 mt-4 text-lg">
              No profiles found
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default SearchProfiles;
