import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Href, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import TopNavBar from "../components/TopNavBar";
import { useAuth } from "../context/AuthContext";

const { width, height } = Dimensions.get("window");

const Dashboard = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Initial animations
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

    // Continuous pulse animation for CTA buttons
    Animated.loop(
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
    ).start();

    // Rotating animation for decorative elements
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
    ).start();
  }, []);

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  type ActionItem = {
    label: string;
    icon: string;
    color: string;
    route: Href; // <--- This tells TS it's a valid Expo route!
  };

  const actionItems: ActionItem[] = [
    {
      label: "Edit Profile",
      icon: "person-outline",
      color: "#C5A059",
      route: "/edit-profile",
    },
    {
      label: "Viewed Contacts",
      icon: "eye-outline",
      color: "#C5A059",
      route: "/contacts",
    },
    {
      label: "Edit Photos",
      icon: "camera-outline",
      color: "#C5A059",
      route: "/photosEdit",
    },
    {
      label: "Membership",
      icon: "card-outline",
      color: "#C5A059",
      route: "/membership",
    },
    // {
    //   label: "Payments",
    //   icon: "receipt-outline",
    //   color: "#C5A059",
    //   route: "/payments",
    // },
    {
      label: "Search Profiles",
      icon: "search-outline",
      color: "#C5A059",
      route: "/search",
    },
  ];

  const membershipPlans = [
    {
      name: "Basic",
      price: "₹999",
      duration: "3 months",
      features: ["View 50 profiles", "Send 20 interests", "Basic support"],
    },
    {
      name: "Premium",
      price: "₹1,999",
      duration: "6 months",
      features: [
        "Unlimited profiles",
        "Send 100 interests",
        "Priority support",
        "Featured listing",
      ],
    },
    {
      name: "Elite",
      price: "₹3,499",
      duration: "12 months",
      features: [
        "Everything in Premium",
        "Dedicated matchmaker",
        "Profile verification",
        "Top ranking",
      ],
    },
  ];

  // Add the type definition object after the props
  const StatCard = ({
    value,
    label,
    icon,
    delay = 0,
  }: {
    value: string;
    label: string;
    icon: any; // Using 'any' here to avoid complex Ionicons typing, or use 'string'
    delay?: number;
  }) => {
    const statFadeAnim = useRef(new Animated.Value(0)).current;
    const statScaleAnim = useRef(new Animated.Value(0.5)).current;

    // ... rest of the component stays exactly the same

    useEffect(() => {
      setTimeout(() => {
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
    }, []);

    return (
      <Animated.View
        style={{
          opacity: statFadeAnim,
          transform: [{ scale: statScaleAnim }],
          alignItems: "center",
        }}
      >
        <View className="items-center">
          <Ionicons name={icon} size={24} color="#C5A059" />
          <Text className="text-white text-3xl font-bold mt-2">{value}</Text>
          <Text className="text-white/50 text-[10px] uppercase tracking-widest mt-1">
            {label}
          </Text>
        </View>
      </Animated.View>
    );
  };

  return (
    <View className="flex-1 bg-[#010302]">
      <TopNavBar title="Dashboard" />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Hero Image Header Section with Parallax Effect */}
        <ImageBackground
          source={require("../assets/images/dashboard.jpg")}
          style={{ width: "100%", height: 380 }}
          imageStyle={{ opacity: 0.7 }}
        >
          <LinearGradient
            colors={["transparent", "rgba(1,3,2,0.9)", "#010302"]}
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
                    className="text-[#C5A059] text-lg tracking-wide"
                  >
                    Welcome back,
                  </Text>
                  <Text
                    style={{ fontFamily: "RoyalBold" }}
                    className="text-white text-3xl mt-1 tracking-wider"
                  >
                    {user?.name || "Eternal Partner"}
                  </Text>
                </View>
                <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                  <TouchableOpacity
                    className="bg-[#C5A059] px-4 py-2 rounded-full flex-row items-center"
                    onPress={() => router.push("/edit-profile")}
                  >
                    <Ionicons name="sparkles" size={16} color="#000" />
                    <Text className="text-black text-xs font-bold ml-2">
                      Complete Profile
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              </View>

              {/* Profile Completion Bar */}
              <View className="mt-6">
                <View className="flex-row justify-between mb-2">
                  <Text className="text-white/60 text-xs">
                    Profile Strength
                  </Text>
                  <Text className="text-[#C5A059] text-xs font-bold">65%</Text>
                </View>
                <View className="h-2 bg-[#0B2B1F] rounded-full overflow-hidden">
                  <Animated.View
                    className="h-full bg-[#C5A059] rounded-full"
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
          {/* Quick Search Cards with Hover/Animation */}
          <View className="flex-row justify-between mb-8">
            <TouchableOpacity
              style={{ width: width * 0.42 }}
              className="bg-[#0B2B1F] p-5 rounded-3xl border border-[#C5A059]/20 items-center shadow-lg"
              activeOpacity={0.8}
              //   onPress={() => router.push("/groom-profiles")}
            >
              <Animated.View
                style={{
                  transform: [{ scale: pulseAnim }],
                }}
              >
                <View className="bg-[#C5A059]/10 p-3 rounded-full mb-2 border border-[#C5A059]/20">
                  <Ionicons name="male-outline" size={32} color="#C5A059" />
                </View>
              </Animated.View>
              <Text
                style={{ fontFamily: "RoyalBold" }}
                className="text-white text-lg"
              >
                Groom
              </Text>
              <Text className="text-[#C5A059] text-[10px] font-bold uppercase tracking-widest mt-1">
                2,345 Profiles
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ width: width * 0.42 }}
              className="bg-[#0B2B1F] p-5 rounded-3xl border border-[#C5A059]/20 items-center shadow-lg"
              activeOpacity={0.8}
              //   onPress={() => router.push("/bride-profiles")}
            >
              <Animated.View
                style={{
                  transform: [{ scale: pulseAnim }],
                }}
              >
                <View className="bg-[#C5A059]/10 p-3 rounded-full mb-2 border border-[#C5A059]/20">
                  <Ionicons name="female-outline" size={32} color="#C5A059" />
                </View>
              </Animated.View>
              <Text
                style={{ fontFamily: "RoyalBold" }}
                className="text-white text-lg"
              >
                Bride
              </Text>
              <Text className="text-[#C5A059] text-[10px] font-bold uppercase tracking-widest mt-1">
                1,892 Profiles
              </Text>
            </TouchableOpacity>
          </View>

          {/* Profile Status Section with Animated Stats */}
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            }}
          >
            <View className="bg-[#0B2B1F]/40 p-6 rounded-[30px] border border-[#C5A059]/10 mb-8 backdrop-blur-sm">
              <View className="flex-row justify-between items-center mb-4">
                <Text
                  style={{ fontFamily: "RoyalBold" }}
                  className="text-[#C5A059] text-xl uppercase tracking-widest"
                >
                  Profile Status
                </Text>
                <Animated.View
                  style={{
                    transform: [{ rotate: rotateInterpolate }],
                  }}
                >
                  <Ionicons name="sync-outline" size={20} color="#C5A059" />
                </Animated.View>
              </View>
              <View className="flex-row justify-around">
                <StatCard
                  value="24"
                  label="Eligible"
                  icon="heart-outline"
                  delay={100}
                />
                <View className="w-[1px] h-12 bg-[#C5A059]/20" />
                <StatCard
                  value="8"
                  label="Viewed"
                  icon="eye-outline"
                  delay={200}
                />
                <View className="w-[1px] h-12 bg-[#C5A059]/20" />
                <StatCard
                  value="12"
                  label="Interested"
                  icon="chatbubble-outline"
                  delay={300}
                />
              </View>
            </View>
          </Animated.View>

          {/* Feature Action Grid with Animation */}
          <View className="flex-row flex-wrap justify-between pb-10">
            {actionItems.map((item, index) => {
              const itemFadeAnim = useRef(new Animated.Value(0)).current;
              const itemScaleAnim = useRef(new Animated.Value(0.8)).current;

              useEffect(() => {
                setTimeout(() => {
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
              }, []);

              return (
                <Animated.View
                  key={index}
                  style={{
                    opacity: itemFadeAnim,
                    transform: [{ scale: itemScaleAnim }],
                  }}
                >
                  <TouchableOpacity
                    style={{ width: width * 0.27 }}
                    className="bg-[#0B2B1F] aspect-square rounded-[20px] border border-[#C5A059]/10 items-center justify-center mb-4 shadow-sm"
                    activeOpacity={0.7}
                    onPress={() => router.push(item.route)}
                  >
                    <Animated.View
                      style={{
                        transform: [{ scale: pulseAnim }],
                      }}
                    >
                      <View className="bg-[#C5A059]/10 p-2.5 rounded-full mb-2 border border-[#C5A059]/10">
                        <Ionicons
                          name={item.icon as any}
                          size={24}
                          color="#C5A059"
                        />
                      </View>
                    </Animated.View>
                    <Text className="text-white/80 text-[9px] text-center font-bold uppercase tracking-tighter px-1 mt-1">
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>

          {/* Membership Promo Banner */}
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            <LinearGradient
              colors={["#0B2B1F", "#0A1C14"]}
              className="rounded-3xl p-6 mb-8 border border-[#C5A059]/20"
            >
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-[#C5A059] text-xs font-bold uppercase tracking-wider">
                    Limited Time Offer
                  </Text>
                  <Text className="text-white text-xl font-bold mt-2">
                    Upgrade to Premium
                  </Text>
                  <Text className="text-white/60 text-xs mt-1">
                    Get 50% off on annual plan
                  </Text>
                  <TouchableOpacity className="mt-4 bg-[#C5A059] px-6 py-2 rounded-full self-start">
                    <Text className="text-black font-bold text-xs uppercase">
                      Claim Offer
                    </Text>
                  </TouchableOpacity>
                </View>
                <Animated.View
                  style={{
                    transform: [{ rotate: rotateInterpolate }],
                  }}
                >
                  <Ionicons
                    name="diamond-outline"
                    size={60}
                    color="#C5A059"
                    opacity={0.3}
                  />
                </Animated.View>
              </View>
            </LinearGradient>
          </Animated.View>
        </View>
      </ScrollView>

      {/* Enhanced Bottom Tab Bar with Animations */}
      <Animated.View
        style={{
          transform: [{ translateY: slideAnim }],
        }}
      >
        <View className="flex-row bg-[#0A1C14] border-t border-[#C5A059]/20 py-4 px-8 justify-between items-center shadow-2xl">
          <TouchableOpacity className="items-center">
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <Ionicons name="home" size={24} color="#C5A059" />
            </Animated.View>
            <Text className="text-[#C5A059] text-[10px] mt-1 font-bold tracking-wider">
              Home
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="items-center opacity-50">
            <Ionicons name="search" size={24} color="#FFF" />
            <Text className="text-white text-[10px] mt-1 font-bold tracking-wider">
              Search
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="items-center opacity-50">
            <Ionicons name="heart-outline" size={24} color="#FFF" />
            <Text className="text-white text-[10px] mt-1 font-bold tracking-wider">
              Matches
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="items-center opacity-50">
            <Ionicons name="card" size={24} color="#FFF" />
            <Text className="text-white text-[10px] mt-1 font-bold tracking-wider">
              Plans
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="items-center opacity-50">
            <Ionicons name="person-outline" size={24} color="#FFF" />
            <Text className="text-white text-[10px] mt-1 font-bold tracking-wider">
              Profile
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Floating Action Button */}
      <Animated.View
        style={{
          position: "absolute",
          bottom: 80,
          right: 20,
          transform: [{ scale: pulseAnim }],
        }}
      ></Animated.View>
    </View>
  );
};

export default Dashboard;
