import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
    Animated,
    Dimensions,
    FlatList,
    Image,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TopNavBar from "../components/TopNavBar";

const { width } = Dimensions.get("window");
const COLUMN_WIDTH = (width - 48) / 2; // 24px padding on sides, 12px gap

const BRIDE_PROFILES = [
  {
    id: "1",
    name: "Bhavya",
    age: 26,
    status: "Recently Active",
    image: require("../assets/images/bride1.png"),
  },
  {
    id: "2",
    name: "Bhargavi",
    age: 26,
    status: "Recently Active",
    image: require("../assets/images/bride2.png"),
  },
  {
    id: "3",
    name: "Harshini",
    age: 26,
    status: "Recently Active",
    image: require("../assets/images/bride3.png"),
  },
  {
    id: "4",
    name: "Saparya",
    age: 28,
    status: "Recently Active",
    image: require("../assets/images/bride4.png"),
  },
  {
    id: "5",
    name: "Divya",
    age: 26,
    status: "Recently Active",
    image: require("../assets/images/bride5.png"),
  },
  {
    id: "6",
    name: "Teena",
    age: 27,
    status: "Recently Active",
    image: require("../assets/images/bride6.png"),
  },
  {
    id: "7",
    name: "Ananya",
    age: 25,
    status: "Recently Active",
    image: require("../assets/images/bride1.png"),
  },
  {
    id: "8",
    name: "Meera",
    age: 29,
    status: "Recently Active",
    image: require("../assets/images/bride2.png"),
  },
  {
    id: "9",
    name: "Pooja",
    age: 27,
    status: "Recently Active",
    image: require("../assets/images/bride3.png"),
  },
  {
    id: "10",
    name: "Sneha",
    age: 24,
    status: "Recently Active",
    image: require("../assets/images/bride4.png"),
  },
  {
    id: "11",
    name: "Kirti",
    age: 28,
    status: "Recently Active",
    image: require("../assets/images/bride5.png"),
  },
  {
    id: "12",
    name: "Riya",
    age: 26,
    status: "Recently Active",
    image: require("../assets/images/bride6.png"),
  },
];

const BrideProfiles = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const renderItem = ({ item }: { item: (typeof BRIDE_PROFILES)[0] }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() =>
        router.push({
          pathname: "/profiledetails",
          params: { gender: "female" },
        })
      }
      style={{ width: COLUMN_WIDTH, height: COLUMN_WIDTH * 1.4 }}
      className="m-1.5 rounded-[24px] overflow-hidden border-2 border-white shadow-xl bg-white"
    >
      <Image
        source={item.image}
        style={{ width: "100%", height: "100%" }}
        resizeMode="cover"
      />
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.8)"]}
        className="absolute inset-0 justify-end p-4"
      >
        <Text
          style={{ fontFamily: "RoyalBold" }}
          className="text-white text-lg"
        >
          {item.name}
        </Text>
        <Text
          style={{ fontFamily: "RoyalBold" }}
          className="text-white/80 text-xs"
        >
          {item.age} Yrs
        </Text>
        <View className="flex-row items-center mt-1">
          <View className="w-2 h-2 rounded-full bg-green-500 mr-1.5" />
          <Text className="text-white/60 text-[10px] font-bold">
            {item.status}
          </Text>
        </View>
      </LinearGradient>

      <TouchableOpacity className="absolute bottom-3 right-3 bg-[#E91E63] w-10 h-10 rounded-2xl items-center justify-center shadow-lg shadow-pink-200">
        <Ionicons name="heart" size={20} color="white" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-[#F0F7FA]">
      {/* Header */}
      <TopNavBar title="Brides Profiles" />

      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <FlatList
          data={BRIDE_PROFILES}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={{ padding: 12 }}
          showsVerticalScrollIndicator={false}
        />
      </Animated.View>
    </View>
  );
};

export default BrideProfiles;
