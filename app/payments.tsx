import { Ionicons } from "@expo/vector-icons";
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

  const PaymentOption = ({ id, title, icon, subtitle }: any) => {
    const isSelected = selectedMethod === id;

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setSelectedMethod(id)}
        className={`flex-row items-center p-4 mb-4 rounded-2xl border ${
          isSelected
            ? "border-[#C5A059] bg-[#C5A059]/10"
            : "border-[#C5A059]/20 bg-[#0B2B1F]/60"
        }`}
      >
        <View
          className={`w-12 h-12 rounded-full justify-center items-center mr-4 ${
            isSelected ? "bg-[#C5A059]" : "bg-[#C5A059]/10"
          }`}
        >
          <Ionicons
            name={icon}
            size={24}
            color={isSelected ? "#0B2B1F" : "#C5A059"}
          />
        </View>
        <View className="flex-1">
          <Text
            style={{ fontFamily: "RoyalBold" }}
            className="text-white text-base"
          >
            {title}
          </Text>
          {subtitle ? (
            <Text className="text-white/50 text-xs mt-1">{subtitle}</Text>
          ) : null}
        </View>
        <View
          className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
            isSelected ? "border-[#C5A059]" : "border-white/20"
          }`}
        >
          {isSelected ? (
            <View className="w-3 h-3 rounded-full bg-[#C5A059]" />
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-[#010302]">
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
          <Text className="text-[#C5A059] text-xs font-RoyalBold mb-3 ml-1 uppercase tracking-wider">
            Current Checkout
          </Text>
          <View className="bg-gradient-to-r from-[#12402D] to-[#0D3325] p-5 rounded-3xl border border-[#C5A059]/20 mb-8 shadow-xl">
            <View className="flex-row justify-between items-start mb-4 border-b border-[#C5A059]/10 pb-4">
              <View>
                <Text
                  style={{ fontFamily: "RoyalBold" }}
                  className="text-white text-lg"
                >
                  {planDetails.name}
                </Text>
                <Text className="text-white/60 text-sm mt-1">
                  Valid for {planDetails.duration}
                </Text>
              </View>
              <View className="bg-[#C5A059]/20 px-3 py-1 rounded-full">
                <Text className="text-[#C5A059] text-xs font-bold">PRO</Text>
              </View>
            </View>

            <View className="flex-row justify-between mb-2">
              <Text className="text-white/70">Plan Price</Text>
              <Text className="text-white">₹{planDetails.price}</Text>
            </View>
            <View className="flex-row justify-between mb-4">
              <Text className="text-green-400">Special Discount</Text>
              <Text className="text-green-400">- ₹{planDetails.discount}</Text>
            </View>

            <View className="flex-row justify-between items-center border-t border-[#C5A059]/20 pt-4 mt-2">
              <Text
                style={{ fontFamily: "RoyalBold" }}
                className="text-white text-lg"
              >
                Total Amount
              </Text>
              <Text
                style={{ fontFamily: "RoyalBold" }}
                className="text-[#C5A059] text-2xl"
              >
                ₹{planDetails.total}
              </Text>
            </View>
          </View>
          {/* Payment Methods */}
          <Text className="text-[#C5A059] text-xs font-RoyalBold mb-3 ml-1 uppercase tracking-wider">
            Select Payment Method
          </Text>
          <PaymentOption
            id="upi"
            title="UPI (GPay, PhonePe, Paytm)"
            icon="phone-portrait-outline"
            subtitle="Pay directly from your bank account"
          />
          {selectedMethod === "upi" ? (
            <View className="mb-4 -mt-2 ml-4">
              <TextInput
                className="h-12 bg-white/5 rounded-xl px-4 text-white border border-[#C5A059]/20"
                placeholder="Enter UPI ID (e.g. name@okhdfc)"
                placeholderTextColor="rgba(255,255,255,0.3)"
              />
            </View>
          ) : null}
          <PaymentOption
            id="card"
            title="Credit / Debit Card"
            icon="card-outline"
            subtitle="Visa, MasterCard, RuPay accepted"
          />
          <PaymentOption
            id="netbanking"
            title="Net Banking"
            icon="business-outline"
            subtitle="All major Indian banks available"
          />
          {/* Transaction History Section */}
          <View className="mt-8 mb-4 flex-row items-center justify-between">
            <Text className="text-[#C5A059] text-xs font-RoyalBold ml-1 uppercase tracking-wider">
              Payment History
            </Text>
            <TouchableOpacity>
              <Text className="text-white/50 text-xs underline">View All</Text>
            </TouchableOpacity>
          </View>
          {transactionHistory.map((txn, index) => (
            <View
              key={index}
              className="bg-[#0B2B1F]/40 p-4 rounded-2xl border border-[#C5A059]/10 mb-3 flex-row items-center justify-between"
            >
              <View className="flex-row items-center flex-1">
                <View className="w-10 h-10 rounded-full bg-white/5 justify-center items-center mr-3 border border-[#C5A059]/10">
                  <Ionicons name={txn.icon as any} size={18} color="#C5A059" />
                </View>
                <View className="flex-1 pr-2">
                  <Text
                    style={{ fontFamily: "RoyalBold" }}
                    className="text-white text-sm"
                    numberOfLines={1}
                  >
                    {txn.title}
                  </Text>
                  <View className="flex-row items-center mt-1">
                    <Text className="text-white/40 text-[10px] mr-2">
                      {txn.date}
                    </Text>
                    <Text className="text-white/30 text-[10px]">
                      • ID: {txn.id}
                    </Text>
                  </View>
                </View>
              </View>

              <View className="items-end pl-2">
                <Text
                  style={{ fontFamily: "RoyalBold" }}
                  className="text-white text-base mb-1"
                >
                  {txn.amount}
                </Text>
                <View
                  className={`px-2 py-0.5 rounded-full ${
                    txn.status === "Success"
                      ? "bg-green-500/20"
                      : "bg-red-500/20"
                  }`}
                >
                  <Text
                    className={`text-[9px] font-bold uppercase ${
                      txn.status === "Success"
                        ? "text-green-400"
                        : "text-red-400"
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
      <View className="bg-[#0A1C14] border-t border-[#C5A059]/20 p-6 pb-8">
        <View className="flex-row justify-center items-center mb-4">
          <Ionicons name="shield-checkmark" size={16} color="#4ade80" />
          <Text className="text-white/50 text-xs ml-2">
            100% Secure & Encrypted Payment
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          className="w-full bg-[#C5A059] h-14 rounded-2xl justify-center items-center shadow-lg flex-row"
          onPress={() => console.log("Processing Payment...")}
        >
          <Text className="text-[#0B2B1F] font-extrabold text-lg tracking-widest uppercase">
            Pay ₹{planDetails.total}
          </Text>
          <Ionicons
            name="arrow-forward"
            size={20}
            color="#0B2B1F"
            style={{ marginLeft: 8 }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Payments;
