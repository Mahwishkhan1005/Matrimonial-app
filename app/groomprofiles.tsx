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

const GROOM_PROFILES = [
  {
    id: "1",
    name: "Rahul",
    age: 28,
    status: "Recently Active",
    image: require("../assets/images/groom1.png"),
  },
  {
    id: "2",
    name: "Vikram",
    age: 30,
    status: "Recently Active",
    image: require("../assets/images/groom2.png"),
  },
  {
    id: "3",
    name: "Arjun",
    age: 27,
    status: "Recently Active",
    image: require("../assets/images/groom3.png"),
  },
  {
    id: "4",
    name: "Sameer",
    age: 29,
    status: "Recently Active",
    image: require("../assets/images/groom4.png"),
  },
  {
    id: "5",
    name: "Karan",
    age: 26,
    status: "Recently Active",
    image: require("../assets/images/groom5.png"),
  },
  {
    id: "6",
    name: "Rohan",
    age: 31,
    status: "Recently Active",
    image: require("../assets/images/groom6.png"),
  },
  {
    id: "7",
    name: "Aditya",
    age: 28,
    status: "Recently Active",
    image: require("../assets/images/groom1.png"),
  },
  {
    id: "8",
    name: "Varun",
    age: 27,
    status: "Recently Active",
    image: require("../assets/images/groom2.png"),
  },
  {
    id: "9",
    name: "Siddharth",
    age: 32,
    status: "Recently Active",
    image: require("../assets/images/groom3.png"),
  },
  {
    id: "10",
    name: "Ishan",
    age: 25,
    status: "Recently Active",
    image: require("../assets/images/groom4.png"),
  },
  {
    id: "11",
    name: "Manav",
    age: 30,
    status: "Recently Active",
    image: require("../assets/images/groom5.png"),
  },
  {
    id: "12",
    name: "Kabir",
    age: 29,
    status: "Recently Active",
    image: require("../assets/images/groom6.png"),
  },
];

const GroomProfiles = () => {
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

  const renderItem = ({ item }: { item: (typeof GROOM_PROFILES)[0] }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() =>
        router.push({ pathname: "/profiledetails", params: { gender: "male" } })
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

      <TouchableOpacity className="absolute bottom-3 right-3 bg-[#2D89B5] w-10 h-10 rounded-2xl items-center justify-center shadow-lg shadow-blue-200">
        <Ionicons name="star" size={20} color="white" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-[#F0F7FA]">
      {/* Header */}
      <TopNavBar title="Groom Profiles" />

      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <FlatList
          data={GROOM_PROFILES}
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

export default GroomProfiles;
