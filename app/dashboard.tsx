import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Href, useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  BackHandler,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TopNavBar from "../components/TopNavBar";
import { useAuth } from "../context/AuthContext";

const { width, height } = Dimensions.get("window");

type ActionItemType = {
  label: string;
  icon: string;
  color: string;
  route: Href;
};

// 1. EXTRACTED: StatCard is now safely outside the main component
const StatCard = ({ value, label, icon, delay = 0 }: any) => {
  const statFadeAnim = useRef(new Animated.Value(0)).current;
  const statScaleAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(statFadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(statScaleAnim, {
          toValue: 1,
          friction: 6,
          useNativeDriver: true,
        }),
      ]).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, statFadeAnim, statScaleAnim]);

  return (
    <Animated.View
      style={{
        opacity: statFadeAnim,
        transform: [{ scale: statScaleAnim }],
        alignItems: "center",
      }}
    >
      <View className="items-center">
        <Ionicons name={icon} size={24} color="#2D89B5" />
        <Text className="text-[#2D89B5] text-3xl font-bold mt-2">{value}</Text>
        <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">
          {label}
        </Text>
      </View>
    </Animated.View>
  );
};

// 2. EXTRACTED: ActionCard fixes the "Hooks inside a map loop" error
const ActionCard = ({
  item,
  index,
  pulseAnim,
}: {
  item: ActionItemType;
  index: number;
  pulseAnim: Animated.Value;
}) => {
  const router = useRouter();
  const itemFadeAnim = useRef(new Animated.Value(0)).current;
  const itemScaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(itemFadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(itemScaleAnim, {
          toValue: 1,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    }, index * 100);

    return () => clearTimeout(timer);
  }, [index, itemFadeAnim, itemScaleAnim]);

  return (
    <Animated.View
      style={{
        opacity: itemFadeAnim,
        transform: [{ scale: itemScaleAnim }],
      }}
    >
      <TouchableOpacity
        style={{ width: width * 0.27 }}
        className="bg-white aspect-square rounded-[20px] border border-blue-50 items-center justify-center mb-4 shadow-md shadow-blue-100"
        activeOpacity={0.7}
        onPress={() => router.push(item.route)}
      >
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <View className="bg-blue-50 p-2.5 rounded-full mb-2 border border-blue-100">
            <Ionicons name={item.icon as any} size={24} color={item.color} />
          </View>
        </Animated.View>
        <Text className="text-[#333] text-[9px] text-center font-bold uppercase tracking-tighter px-1 mt-1">
          {item.label}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const Dashboard = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.exp),
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    );
    pulseLoop.start();

    const rotateLoop = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
    );
    rotateLoop.start();

    return () => {
      pulseLoop.stop();
      rotateLoop.stop();
    };
  }, [fadeAnim, slideAnim, scaleAnim, pulseAnim, rotateAnim]);

  // Handle Android Hardware Back Button to exit app from dashboard ONLY when focused
  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        Alert.alert("Exit App", "Are you sure you want to exit the app?", [
          {
            text: "Cancel",
            onPress: () => null,
            style: "cancel",
          },
          { text: "YES", onPress: () => BackHandler.exitApp() },
        ]);
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction,
      );

      return () => backHandler.remove();
    }, []),
  );

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const actionItems: ActionItemType[] = [
    {
      label: "Edit Profile",
      icon: "person-outline",
      color: "#2D89B5",
      route: "/edit-profile",
    },
    {
      label: "Viewed Contacts",
      icon: "eye-outline",
      color: "#2D89B5",
      route: "/contacts",
    },
    {
      label: "Edit Photos",
      icon: "camera-outline",
      color: "#2D89B5",
      route: "/photosEdit",
    },
    {
      label: "Membership",
      icon: "card-outline",
      color: "#2D89B5",
      route: "/membership",
    },
    {
      label: "Payments",
      icon: "receipt-outline",
      color: "#2D89B5",
      route: "/payments" as any,
    },
    {
      label: "Search Profiles",
      icon: "search-outline",
      color: "#2D89B5",
      route: "/search",
    },
  ];

  return (
    <View className="flex-1 bg-[#F0F7FA]">
      <TopNavBar title="Dashboard" />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Hero Image Header Section */}
        <ImageBackground
          source={require("../assets/images/image1.png")}
          style={{ width: "100%", height: 380 }}
          imageStyle={{ opacity: 0.9 }}
        >
          <LinearGradient
            colors={["transparent", "rgba(240,247,250,0.8)", "#F0F7FA"]}
            locations={[0.4, 0.7, 1]}
            className="flex-1 justify-end pb-8 px-6 pt-12"
          >
            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }}
            >
              <View className="flex-row justify-between items-end">
                <View>
                  <Text
                    style={{ fontFamily: "RoyalMediumItalic" }}
                    className="text-[#E91E63] font-bold text-lg tracking-wide"
                  >
                    Welcome back,
                  </Text>
                  <Text
                    style={{ fontFamily: "RoyalBold" }}
                    className="text-[#2D89B5] text-3xl mt-1 tracking-wider"
                  >
                    {user?.name || "Eternal Partner"}
                  </Text>
                </View>
                <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                  <TouchableOpacity
                    className="bg-[#E91E63] px-4 py-2 rounded-full flex-row items-center shadow-md shadow-pink-200"
                    onPress={() => router.push("/edit-profile")}
                  >
                    <Ionicons name="sparkles" size={16} color="#FFF" />
                    <Text className="text-white text-xs font-bold ml-2">
                      Complete Profile
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              </View>

              {/* Profile Completion Bar */}
              <View className="mt-6">
                <View className="flex-row justify-between mb-2">
                  <Text className="text-gray-500 font-medium text-xs">
                    Profile Strength
                  </Text>
                  <Text className="text-[#E91E63] text-xs font-black">65%</Text>
                </View>
                <View className="h-2 bg-blue-100 rounded-full overflow-hidden">
                  <Animated.View
                    className="h-full bg-[#2D89B5] rounded-full"
                    style={{
                      width: "65%",
                      transform: [{ scaleX: scaleAnim }],
                    }}
                  />
                </View>
              </View>
            </Animated.View>
          </LinearGradient>
        </ImageBackground>

        {/* Dashboard Body Content */}
        <View className="px-6 mt-2">
          {/* Quick Search Cards */}
          <View className="flex-row justify-between mb-8">
            <TouchableOpacity
              style={{ width: width * 0.42 }}
              className="bg-white p-5 rounded-3xl border border-blue-50 items-center shadow-lg shadow-blue-100"
              activeOpacity={0.8}
              onPress={() => router.push("/groomprofiles")}
            >
              <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <View className="bg-blue-50 p-3 rounded-full mb-2 border border-blue-100">
                  <Ionicons name="male-outline" size={32} color="#2D89B5" />
                </View>
              </Animated.View>
              <Text
                style={{ fontFamily: "RoyalBold" }}
                className="text-[#2D89B5] text-lg"
              >
                Groom
              </Text>
              <Text className="text-[#E91E63] text-[10px] font-bold uppercase tracking-widest mt-1">
                2,345 Profiles
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ width: width * 0.42 }}
              className="bg-white p-5 rounded-3xl border border-blue-50 items-center shadow-lg shadow-blue-100"
              activeOpacity={0.8}
              onPress={() => router.push("/brideprofiles" as Href)}
            >
              <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <View className="bg-blue-50 p-3 rounded-full mb-2 border border-blue-100">
                  <Ionicons name="female-outline" size={32} color="#2D89B5" />
                </View>
              </Animated.View>
              <Text
                style={{ fontFamily: "RoyalBold" }}
                className="text-[#2D89B5] text-lg"
              >
                Bride
              </Text>
              <Text className="text-[#E91E63] text-[10px] font-bold uppercase tracking-widest mt-1">
                1,892 Profiles
              </Text>
            </TouchableOpacity>
          </View>

          {/* Profile Status Section */}
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            }}
          >
            <View className="bg-white p-6 rounded-[30px] border border-blue-50 mb-8 shadow-lg shadow-blue-100">
              <View className="flex-row justify-between items-center mb-4">
                <Text
                  style={{ fontFamily: "RoyalBold" }}
                  className="text-[#2D89B5] text-xl uppercase tracking-widest"
                >
                  Profile Status
                </Text>
                <Animated.View
                  style={{ transform: [{ rotate: rotateInterpolate }] }}
                >
                  <Ionicons name="sync-outline" size={20} color="#E91E63" />
                </Animated.View>
              </View>
              <View className="flex-row justify-around">
                <StatCard
                  value="24"
                  label="Eligible"
                  icon="heart-outline"
                  delay={100}
                />
                <View className="w-[1px] h-12 bg-blue-100" />
                <StatCard
                  value="8"
                  label="Viewed"
                  icon="eye-outline"
                  delay={200}
                />
                <View className="w-[1px] h-12 bg-blue-100" />
                <StatCard
                  value="12"
                  label="Interested"
                  icon="chatbubble-outline"
                  delay={300}
                />
              </View>
            </View>
          </Animated.View>

          {/* Feature Action Grid */}
          <View className="flex-row flex-wrap justify-between pb-10">
            {actionItems.map((item, index) => (
              <ActionCard
                key={index}
                item={item}
                index={index}
                pulseAnim={pulseAnim}
              />
            ))}
          </View>

          {/* Promo Banner */}
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            <LinearGradient
              colors={["#2D89B5", "#1A6B8C"]}
              className="rounded-3xl p-6 mb-8 border border-blue-300 shadow-xl shadow-blue-200"
            >
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-pink-200 text-xs font-bold uppercase tracking-wider">
                    Limited Time Offer
                  </Text>
                  <Text className="text-white text-xl font-bold mt-2">
                    Upgrade to Premium
                  </Text>
                  <Text className="text-blue-100 text-xs font-medium mt-1">
                    Get 50% off on annual plan
                  </Text>
                  <TouchableOpacity className="mt-4 bg-[#E91E63] px-6 py-2 rounded-full self-start shadow-md shadow-pink-900/50">
                    <Text className="text-white font-bold text-xs uppercase">
                      Claim Offer
                    </Text>
                  </TouchableOpacity>
                </View>
                <Animated.View
                  style={{ transform: [{ rotate: rotateInterpolate }] }}
                >
                  <Ionicons
                    name="diamond-outline"
                    size={60}
                    color="#FFF"
                    opacity={0.3}
                  />
                </Animated.View>
              </View>
            </LinearGradient>
          </Animated.View>
        </View>
      </ScrollView>

      {/* Bottom Tab Bar */}
      <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
        <View
          className="flex-row bg-white border-t border-blue-50 pt-4 px-8 justify-between items-center shadow-2xl"
          style={{ paddingBottom: Math.max(insets.bottom, 16) + 10 }}
        >
          <TouchableOpacity className="items-center">
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <Ionicons name="home" size={24} color="#E91E63" />
            </Animated.View>
            <Text className="text-[#E91E63] text-[10px] mt-1 font-bold tracking-wider">
              Home
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="items-center opacity-80"
            onPress={() => router.push("/search")}
          >
            <Ionicons name="search" size={24} color="#9CA3AF" />
            <Text className="text-gray-400 text-[10px] mt-1 font-bold tracking-wider">
              Search
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="items-center opacity-80"
            onPress={() => router.push("/profile")}
          >
            <Ionicons name="person-outline" size={24} color="#9CA3AF" />
            <Text className="text-gray-400 text-[10px] mt-1 font-bold tracking-wider">
              Profile
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

export default Dashboard;
