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

// ✅ Create a separate component for each item
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
        className="m-1.5 rounded-[20px] overflow-hidden border border-[#C5A059]/20 bg-[#0B2B1F] shadow-lg"
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
              <Ionicons name="location-outline" size={12} color="#C5A059" />
              <Text className="text-white/70 text-[10px] ml-1">
                {item.location}
              </Text>
              <View className="w-1 h-1 rounded-full bg-white/40 mx-2" />
              <Text className="text-white/70 text-[10px]">{item.age} Yrs</Text>
            </View>
            <View className="flex-row items-center mt-1">
              <Ionicons name="briefcase-outline" size={10} color="#C5A059" />
              <Text className="text-white/60 text-[9px] ml-1">
                {item.occupation}
              </Text>
            </View>
          </LinearGradient>

          {/* Status Badge */}
          <View className="absolute top-3 left-3 bg-[#C5A059]/90 px-2 py-1 rounded-full flex-row items-center">
            <Ionicons name="time-outline" size={10} color="#0B2B1F" />
            <Text className="text-[#0B2B1F] text-[8px] font-bold ml-1">
              {item.status.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Bottom Action Buttons */}
        <View className="flex-row justify-between p-3 border-t border-[#C5A059]/10">
          <TouchableOpacity
            className="flex-1 flex-row items-center justify-center gap-1"
            onPress={() => console.log("Send interest", item.id)}
          >
            <Ionicons name="heart" size={16} color="#C5A059" />
            <Text className="text-[#C5A059] text-[10px] font-bold">
              Interest
            </Text>
          </TouchableOpacity>
          <View className="w-[1px] h-6 bg-[#C5A059]/20" />
          <TouchableOpacity
            className="flex-1 flex-row items-center justify-center gap-1"
            onPress={() => console.log("Contact", item.id)}
          >
            <Ionicons name="chatbubble-outline" size={16} color="#C5A059" />
            <Text className="text-[#C5A059] text-[10px] font-bold">
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

  const FilterChip = ({ label, value }: { label: string; value: string }) => (
    <TouchableOpacity
      onPress={() => setSelectedFilter(value)}
      className={`px-4 py-2 rounded-full ${selectedFilter === value ? "bg-[#C5A059]" : "bg-[#0B2B1F] border border-[#C5A059]/30"}`}
    >
      <Text
        className={`${selectedFilter === value ? "text-[#0B2B1F]" : "text-white"} text-xs font-bold`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-[#010302]">
      {/* Header */}
      <View className="bg-gradient-to-r from-[#0B2B1F] to-[#0D3325] px-6 pb-4 border-b border-[#C5A059]/20">
        <TopNavBar title="Viewed Contacts" />

        {/* Stats Cards */}
        <View className="flex-row justify-between mt-4 gap-3">
          <View className="flex-1 bg-[#0B2B1F]/60 rounded-xl p-3 border border-[#C5A059]/20">
            <Text className="text-white/50 text-[10px] uppercase tracking-wider">
              Total Views
            </Text>
            <Text className="text-[#C5A059] text-2xl font-bold mt-1">
              {stats.total}
            </Text>
          </View>
          <View className="flex-1 bg-[#0B2B1F]/60 rounded-xl p-3 border border-[#C5A059]/20">
            <Text className="text-white/50 text-[10px] uppercase tracking-wider">
              Today
            </Text>
            <Text className="text-[#C5A059] text-2xl font-bold mt-1">
              {stats.today}
            </Text>
          </View>
          <View className="flex-1 bg-[#0B2B1F]/60 rounded-xl p-3 border border-[#C5A059]/20">
            <Text className="text-white/50 text-[10px] uppercase tracking-wider">
              Interests
            </Text>
            <Text className="text-[#C5A059] text-2xl font-bold mt-1">
              {stats.interest}
            </Text>
          </View>
        </View>

        {/* Filter Chips */}
        <View className="flex-row gap-2 mt-4">
          <FilterChip label="All" value="all" />
          <FilterChip label="Recent" value="recent" />
          <FilterChip label="Oldest" value="oldest" />
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
              tintColor="#C5A059"
              colors={["#C5A059"]}
            />
          }
          ListHeaderComponent={() => (
            <View className="mb-2">
              <Text className="text-white/50 text-xs ml-2">
                {VIEWED_PROFILES.length} profiles found
              </Text>
            </View>
          )}
          ListEmptyComponent={() => (
            <View className="flex-1 justify-center items-center mt-20">
              <View className="bg-[#C5A059]/10 p-6 rounded-full">
                <Ionicons
                  name="heart-dislike-outline"
                  size={64}
                  color="#C5A059"
                  opacity={0.5}
                />
              </View>
              <Text className="text-white/50 mt-4 text-center font-bold text-base">
                No viewed contacts yet
              </Text>
              <Text className="text-white/30 text-center text-xs mt-2">
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
