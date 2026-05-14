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

import api from "../axios/axiosInterceptor";

const { width } = Dimensions.get("window");
const COLUMN_WIDTH = (width - 48) / 2; // 24px padding on sides, 12px gap

const GroomProfiles = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [profiles, setProfiles] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);

  const fetchProfiles = async () => {
    try {
      const response = await api.get("/user/grooms/all");
      if (response.data && response.data.content) {
        setProfiles(response.data.content);
      }
    } catch (error) {
      console.error("Error fetching groom profiles:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProfiles();
  };

  const calculateAge = (birthYear: number) => {
    if (!birthYear) return "N/A";
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear;
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() =>
        router.push({
          pathname: "/profiledetails",
          params: { profileId: item.profileId, gender: "male" },
        })
      }
      style={{ width: COLUMN_WIDTH, height: COLUMN_WIDTH * 1.4 }}
      className="m-1.5 rounded-[24px] overflow-hidden border-2 border-white shadow-xl bg-white"
    >
      <Image
        source={
          item.images && item.images.length > 0
            ? { uri: item.images[0] }
            : require("../assets/images/groom1.png") // Fallback
        }
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
          {calculateAge(item.birthYear)} Yrs
        </Text>
        <View className="flex-row items-center mt-1">
          <View className="w-2 h-2 rounded-full bg-green-500 mr-1.5" />
          <Text className="text-white/60 text-[10px] font-bold">
            {"Recently Active"}
          </Text>
        </View>
      </LinearGradient>

      <TouchableOpacity className="absolute bottom-3 right-3 bg-[#2D89B5] w-10 h-10 rounded-2xl items-center justify-center shadow-lg shadow-blue-200">
        <Ionicons name="heart" size={20} color="white" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-[#F0F7FA]">
      {/* Header */}
      <TopNavBar title="Grooms Profiles" />

      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        {loading ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-[#2D89B5] font-bold">Loading Profiles...</Text>
          </View>
        ) : (
          <FlatList
            data={profiles}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            contentContainerStyle={{ padding: 12 }}
            showsVerticalScrollIndicator={false}
            onRefresh={onRefresh}
            refreshing={refreshing}
            ListEmptyComponent={
              <View className="flex-1 justify-center items-center py-20">
                <Text className="text-gray-500">No profiles found</Text>
              </View>
            }
          />
        )}
      </Animated.View>
    </View>
  );
};

export default GroomProfiles;