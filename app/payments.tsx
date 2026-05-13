import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import TopNavBar from "../components/TopNavBar";

const { width } = Dimensions.get("window");

// Moved outside to prevent re-rendering and keyboard dismissal issues
const PaymentOption = ({
  id,
  title,
  icon,
  subtitle,
  selectedMethod,
  setSelectedMethod,
}: any) => {
  const isSelected = selectedMethod === id;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => setSelectedMethod(id)}
      className={`flex-row items-center p-4 mb-4 rounded-2xl border shadow-sm ${
        isSelected
          ? "border-[#2D89B5] bg-blue-50"
          : "border-blue-100 bg-white shadow-blue-50"
      }`}
    >
      <View
        className={`w-12 h-12 rounded-full justify-center items-center mr-4 ${
          isSelected ? "bg-[#2D89B5]" : "bg-blue-50 border border-blue-100"
        }`}
      >
        <Ionicons
          name={icon}
          size={24}
          color={isSelected ? "#FFF" : "#2D89B5"}
        />
      </View>
      <View className="flex-1">
        <Text
          style={{ fontFamily: "RoyalBold" }}
          className="text-[#333] text-base"
        >
          {title}
        </Text>
        {subtitle ? (
          <Text className="text-gray-500 font-medium text-xs mt-1">
            {subtitle}
          </Text>
        ) : null}
      </View>
      <View
        className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
          isSelected ? "border-[#2D89B5]" : "border-gray-300"
        }`}
      >
        {isSelected ? (
          <View className="w-3 h-3 rounded-full bg-[#2D89B5]" />
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

const Payments = () => {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState("upi");

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Mock plan data for checkout
  const planDetails = {
    name: "Premium Membership",
    duration: "6 Months",
    price: "1,999",
    discount: "500",
    total: "1,499",
  };

  // Mock data for Payment History
  const transactionHistory = [
    {
      id: "TXN10092",
      title: "Premium Upgrade (Annual)",
      date: "12 May 2026",
      amount: "₹2,999",
      status: "Success",
      icon: "diamond-outline",
    },
    {
      id: "TXN09843",
      title: "Offer Claimed - Profile Boost",
      date: "04 Apr 2026",
      amount: "₹299",
      status: "Success",
      icon: "flash-outline",
    },
    {
      id: "TXN08321",
      title: "Monthly Basic Plan",
      date: "10 Jan 2026",
      amount: "₹999",
      status: "Expired",
      icon: "calendar-outline",
    },
  ];

  return (
    <View className="flex-1 bg-[#F0F7FA]">
      {/* Header */}
      <TopNavBar title="Payments" />

      <ScrollView
        className="flex-1 px-6 pt-6"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
        >
          {/* Order Summary Card */}
          <Text className="text-[#2D89B5] text-xs font-RoyalBold mb-3 ml-1 uppercase tracking-wider">
            Current Checkout
          </Text>
          <LinearGradient
            colors={["#2D89B5", "#1A6B8C"]}
            className="p-5 rounded-3xl border border-blue-300 mb-8 shadow-xl shadow-blue-200"
          >
            <View className="flex-row justify-between items-start mb-4 border-b border-white/20 pb-4">
              <View>
                <Text
                  style={{ fontFamily: "RoyalBold" }}
                  className="text-white text-lg"
                >
                  {planDetails.name}
                </Text>
                <Text className="text-blue-100 font-medium text-sm mt-1">
                  Valid for {planDetails.duration}
                </Text>
              </View>
              <View className="bg-white/20 px-3 py-1 rounded-full border border-white/30">
                <Text className="text-white text-xs font-black">PRO</Text>
              </View>
            </View>

            <View className="flex-row justify-between mb-2">
              <Text className="text-blue-50 font-medium">Plan Price</Text>
              <Text className="text-white font-bold">₹{planDetails.price}</Text>
            </View>
            <View className="flex-row justify-between mb-4">
              <Text className="text-pink-200 font-bold">Special Discount</Text>
              <Text className="text-pink-200 font-bold">
                - ₹{planDetails.discount}
              </Text>
            </View>

            <View className="flex-row justify-between items-center border-t border-white/20 pt-4 mt-2">
              <Text
                style={{ fontFamily: "RoyalBold" }}
                className="text-white text-lg"
              >
                Total Amount
              </Text>
              <Text
                style={{ fontFamily: "RoyalBold" }}
                className="text-white text-2xl"
              >
                ₹{planDetails.total}
              </Text>
            </View>
          </LinearGradient>
          {/* Payment Methods */}
          <Text className="text-[#2D89B5] text-xs font-RoyalBold mb-3 ml-1 uppercase tracking-wider">
            Select Payment Method
          </Text>
          <PaymentOption
            id="upi"
            title="UPI (GPay, PhonePe, Paytm)"
            icon="phone-portrait-outline"
            subtitle="Pay directly from your bank account"
            selectedMethod={selectedMethod}
            setSelectedMethod={setSelectedMethod}
          />
          {selectedMethod === "upi" ? (
            <View className="mb-4 -mt-2 ml-4">
              <TextInput
                className="h-14 bg-white rounded-2xl px-4 text-[#333] border border-blue-100 shadow-sm shadow-blue-50 font-medium"
                placeholder="Enter UPI ID (e.g. name@okhdfc)"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          ) : null}
          <PaymentOption
            id="card"
            title="Credit / Debit Card"
            icon="card-outline"
            subtitle="Visa, MasterCard, RuPay accepted"
            selectedMethod={selectedMethod}
            setSelectedMethod={setSelectedMethod}
          />
          <PaymentOption
            id="netbanking"
            title="Net Banking"
            icon="business-outline"
            subtitle="All major Indian banks available"
            selectedMethod={selectedMethod}
            setSelectedMethod={setSelectedMethod}
          />
          {/* Transaction History Section */}
          <View className="mt-8 mb-4 flex-row items-center justify-between">
            <Text className="text-[#2D89B5] text-xs font-RoyalBold ml-1 uppercase tracking-wider">
              Payment History
            </Text>
            <TouchableOpacity>
              <Text className="text-[#E91E63] font-bold text-xs underline">
                View All
              </Text>
            </TouchableOpacity>
          </View>
          {transactionHistory.map((txn, index) => (
            <View
              key={index}
              className="bg-white p-4 rounded-2xl border border-blue-50 mb-3 flex-row items-center justify-between shadow-sm shadow-blue-50"
            >
              <View className="flex-row items-center flex-1">
                <View className="w-10 h-10 rounded-full bg-blue-50 justify-center items-center mr-3 border border-blue-100">
                  <Ionicons name={txn.icon as any} size={18} color="#2D89B5" />
                </View>
                <View className="flex-1 pr-2">
                  <Text
                    style={{ fontFamily: "RoyalBold" }}
                    className="text-[#333] text-sm"
                    numberOfLines={1}
                  >
                    {txn.title}
                  </Text>
                  <View className="flex-row items-center mt-1">
                    <Text className="text-gray-400 font-medium text-[10px] mr-2">
                      {txn.date}
                    </Text>
                    <Text className="text-gray-400 font-medium text-[10px]">
                      • ID: {txn.id}
                    </Text>
                  </View>
                </View>
              </View>

              <View className="items-end pl-2">
                <Text
                  style={{ fontFamily: "RoyalBold" }}
                  className="text-[#333] text-base mb-1"
                >
                  {txn.amount}
                </Text>
                <View
                  className={`px-2 py-0.5 rounded-full ${
                    txn.status === "Success" ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  <Text
                    className={`text-[9px] font-bold uppercase tracking-wider ${
                      txn.status === "Success"
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {txn.status}
                  </Text>
                </View>
              </View>
            </View>
          ))}
          <View className="h-24" /> {/* Bottom Padding */}
        </Animated.View>
      </ScrollView>

      {/* Sticky Bottom Payment Button */}
      <View className="bg-white border-t border-blue-100 p-6 pb-8">
        <View className="flex-row justify-center items-center mb-4">
          <Ionicons name="shield-checkmark" size={16} color="#4ade80" />
          <Text className="text-gray-500 font-medium text-xs ml-2">
            100% Secure & Encrypted Payment
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          className="w-full bg-[#E91E63] h-14 rounded-2xl justify-center items-center shadow-lg shadow-pink-200 flex-row"
          onPress={() => console.log("Processing Payment...")}
        >
          <Text className="text-white font-extrabold text-lg tracking-widest uppercase">
            Pay ₹{planDetails.total}
          </Text>
          <Ionicons
            name="arrow-forward"
            size={20}
            color="#FFF"
            style={{ marginLeft: 8 }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Payments;
