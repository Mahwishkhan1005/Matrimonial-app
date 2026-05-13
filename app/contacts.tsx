import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TopNavBar from "../components/TopNavBar";

const { width } = Dimensions.get("window");
const COLUMN_WIDTH = (width - 48) / 2;

// Mock data for liked/viewed bride profiles
const VIEWED_PROFILES = [
  {
    id: "1",
    name: "Bhavya",
    age: 26,
    status: "Viewed today",
    timeAgo: "2 hours ago",
    location: "Hyderabad",
    occupation: "Software Engineer",
    image: require("../assets/images/bride1.png"),
  },
  {
    id: "2",
    name: "Harshini",
    age: 26,
    status: "Viewed yesterday",
    timeAgo: "Yesterday",
    location: "Bangalore",
    occupation: "Doctor",
    image: require("../assets/images/bride3.png"),
  },
  {
    id: "3",
    name: "Divya",
    age: 26,
    status: "Viewed 2 days ago",
    timeAgo: "2 days ago",
    location: "Chennai",
    occupation: "Architect",
    image: require("../assets/images/bride5.png"),
  },
  {
    id: "4",
    name: "Riya",
    age: 26,
    status: "Viewed 1 week ago",
    timeAgo: "1 week ago",
    location: "Mumbai",
    occupation: "Marketing Manager",
    image: require("../assets/images/bride6.png"),
  },
];

// Extracted FilterChip to prevent re-renders
const FilterChip = ({
  label,
  value,
  selectedFilter,
  setSelectedFilter,
}: any) => (
  <TouchableOpacity
    onPress={() => setSelectedFilter(value)}
    className={`px-4 py-2 rounded-full ${
      selectedFilter === value
        ? "bg-[#2D89B5] border border-[#2D89B5]"
        : "bg-white border border-blue-100 shadow-sm shadow-blue-50"
    }`}
  >
    <Text
      className={`${
        selectedFilter === value ? "text-white" : "text-[#2D89B5]"
      } text-xs font-bold`}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

const ProfileCard = ({
  item,
  index,
}: {
  item: (typeof VIEWED_PROFILES)[0];
  index: number;
}) => {
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
        delay: index * 100,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
        delay: index * 100,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={{
        opacity: opacityAnim,
        transform: [{ scale: scaleAnim }],
        width: COLUMN_WIDTH,
      }}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => console.log("Navigate to profile", item.id)}
        className="m-1.5 rounded-[20px] overflow-hidden border border-blue-50 bg-white shadow-md shadow-blue-100"
      >
        <View style={{ height: COLUMN_WIDTH * 1.3, position: "relative" }}>
          <Image
            source={item.image}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.85)"]}
            className="absolute inset-0 justify-end p-3"
          >
            <Text
              style={{ fontFamily: "RoyalBold" }}
              className="text-white text-lg"
            >
              {item.name}
            </Text>
            <View className="flex-row items-center mt-1">
              <Ionicons name="location-outline" size={12} color="#2D89B5" />
              <Text className="text-white/90 text-[10px] ml-1 font-medium">
                {item.location}
              </Text>
              <View className="w-1 h-1 rounded-full bg-white/60 mx-2" />
              <Text className="text-white/90 text-[10px] font-medium">
                {item.age} Yrs
              </Text>
            </View>
            <View className="flex-row items-center mt-1">
              <Ionicons name="briefcase-outline" size={10} color="#2D89B5" />
              <Text className="text-white/80 text-[9px] ml-1 font-medium">
                {item.occupation}
              </Text>
            </View>
          </LinearGradient>

          {/* Status Badge - Pink Accent */}
          <View className="absolute top-3 left-3 bg-[#E91E63]/95 px-2 py-1 rounded-full flex-row items-center shadow-sm">
            <Ionicons name="time-outline" size={10} color="#FFF" />
            <Text className="text-white text-[8px] font-black tracking-wider ml-1">
              {item.status.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Bottom Action Buttons */}
        <View className="flex-row justify-between p-3 border-t border-blue-50 bg-blue-50/30">
          <TouchableOpacity
            className="flex-1 flex-row items-center justify-center gap-1"
            onPress={() => console.log("Send interest", item.id)}
          >
            <Ionicons name="heart" size={16} color="#E91E63" />
            <Text className="text-[#E91E63] text-[10px] font-bold uppercase">
              Interest
            </Text>
          </TouchableOpacity>
          <View className="w-[1px] h-6 bg-blue-100" />
          <TouchableOpacity
            className="flex-1 flex-row items-center justify-center gap-1"
            onPress={() => console.log("Contact", item.id)}
          >
            <Ionicons name="chatbubble-outline" size={16} color="#2D89B5" />
            <Text className="text-[#2D89B5] text-[10px] font-bold uppercase">
              Message
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const Contacts = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const stats = {
    total: VIEWED_PROFILES.length,
    today: VIEWED_PROFILES.filter((p) => p.status === "Viewed today").length,
    interest: 3,
  };

  return (
    <View className="flex-1 bg-[#F0F7FA]">
      {/* Header */}
      <View className="bg-white px-6 pb-4 border-b border-blue-100 shadow-sm z-10">
        <TopNavBar title="Viewed Contacts" />

        {/* Stats Cards */}
        <View className="flex-row justify-between mt-4 gap-3">
          <View className="flex-1 bg-white rounded-xl p-3 border border-blue-50 shadow-sm shadow-blue-100 items-center">
            <Text className="text-gray-400 text-[9px] font-bold uppercase tracking-wider">
              Total Views
            </Text>
            <Text className="text-[#2D89B5] text-2xl font-black mt-1">
              {stats.total}
            </Text>
          </View>
          <View className="flex-1 bg-white rounded-xl p-3 border border-blue-50 shadow-sm shadow-blue-100 items-center">
            <Text className="text-gray-400 text-[9px] font-bold uppercase tracking-wider">
              Today
            </Text>
            <Text className="text-[#2D89B5] text-2xl font-black mt-1">
              {stats.today}
            </Text>
          </View>
          <View className="flex-1 bg-white rounded-xl p-3 border border-pink-50 shadow-sm shadow-pink-100 items-center">
            <Text className="text-gray-400 text-[9px] font-bold uppercase tracking-wider">
              Interests
            </Text>
            <Text className="text-[#E91E63] text-2xl font-black mt-1">
              {stats.interest}
            </Text>
          </View>
        </View>

        {/* Filter Chips */}
        <View className="flex-row gap-2 mt-4">
          <FilterChip
            label="All"
            value="all"
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
          />
          <FilterChip
            label="Recent"
            value="recent"
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
          />
          <FilterChip
            label="Oldest"
            value="oldest"
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
          />
        </View>
      </View>

      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <FlatList
          data={VIEWED_PROFILES}
          renderItem={({ item, index }) => (
            <ProfileCard item={item} index={index} />
          )}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={{ padding: 12, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#2D89B5"
              colors={["#2D89B5"]}
            />
          }
          ListHeaderComponent={() => (
            <View className="mb-2">
              <Text className="text-gray-500 font-medium text-xs ml-2">
                {VIEWED_PROFILES.length} profiles found
              </Text>
            </View>
          )}
          ListEmptyComponent={() => (
            <View className="flex-1 justify-center items-center mt-20">
              <View className="bg-blue-50 p-6 rounded-full shadow-sm">
                <Ionicons
                  name="heart-dislike-outline"
                  size={64}
                  color="#2D89B5"
                  opacity={0.8}
                />
              </View>
              <Text className="text-[#2D89B5] mt-4 text-center font-bold text-base">
                No viewed contacts yet
              </Text>
              <Text className="text-gray-400 text-center font-medium text-xs mt-2">
                Profiles you view will appear here
              </Text>
            </View>
          )}
        />
      </Animated.View>
    </View>
  );
};

export default Contacts;
