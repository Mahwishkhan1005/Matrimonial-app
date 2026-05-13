import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TopNavBar from "../components/TopNavBar";

const { width } = Dimensions.get("window");

const PLANS = [
  {
    id: "silver",
    name: "Silver Plan",
    price: "₹1,999",
    duration: "3 Months",
    features: [
      "View 25 Contacts",
      "Send 50 Interests",
      "Direct Message Support",
    ],
    color: "#64748B", // Slate Gray
    icon: "shield-outline",
  },
  {
    id: "gold",
    name: "Gold Plan",
    price: "₹4,499",
    duration: "6 Months",
    features: [
      "View 100 Contacts",
      "Unlimited Interests",
      "Featured Profile",
      "Priority Support",
    ],
    color: "#E91E63", // Accent Pink
    icon: "star-outline",
    popular: true,
  },
  {
    id: "diamond",
    name: "Diamond Plan",
    price: "₹7,999",
    duration: "12 Months",
    features: [
      "Unlimited Everything",
      "Matchmaker Services",
      "Verified Badge",
      "Profile Booster",
    ],
    color: "#2D89B5", // Primary Blue
    icon: "diamond-outline",
  },
];

const PAYMENT_METHODS = [
  { id: "upi", name: "UPI (GPay, PhonePe)", icon: "qr-code-outline" },
  { id: "card", name: "Credit / Debit Card", icon: "card-outline" },
  { id: "wallet", name: "Wallets", icon: "wallet-outline" },
  { id: "netbanking", name: "Net Banking", icon: "business-outline" },
];

const Membership = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedPlan, setSelectedPlan] = useState<(typeof PLANS)[0] | null>(
    null,
  );
  const [showPayment, setShowPayment] = useState(false);

  const handlePlanSelect = (plan: (typeof PLANS)[0]) => {
    setSelectedPlan(plan);
    setShowPayment(true);
  };

  return (
    <View className="flex-1 bg-[#F0F7FA]">
      {/* Header */}
      <TopNavBar title="Membership Plans" />

      <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
        <Text className="text-gray-500 font-medium text-center mb-8 text-sm">
          Choose a plan that fits your journey to find the eternal partner
        </Text>

        {PLANS.map((plan) => (
          <TouchableOpacity
            key={plan.id}
            activeOpacity={0.9}
            onPress={() => handlePlanSelect(plan)}
            className="mb-6 shadow-lg shadow-blue-100"
          >
            <LinearGradient
              colors={["#FFFFFF", "#F4F9FA"]}
              className={`rounded-3xl p-6 border ${
                plan.popular ? "border-[#E91E63]" : "border-blue-100"
              } overflow-hidden`}
            >
              {plan.popular && (
                <View className="absolute top-0 right-0 bg-[#E91E63] px-4 py-1 rounded-bl-2xl shadow-sm shadow-pink-200">
                  <Text className="text-white text-[10px] font-black tracking-wider uppercase">
                    Popular
                  </Text>
                </View>
              )}

              <View className="flex-row justify-between items-start mb-4">
                <View>
                  <View className="flex-row items-center mb-1">
                    <Ionicons
                      name={plan.icon as any}
                      size={20}
                      color={plan.color}
                    />
                    <Text
                      style={{ fontFamily: "RoyalBold" }}
                      className="text-[#2D89B5] text-xl ml-2"
                    >
                      {plan.name}
                    </Text>
                  </View>
                  <Text className="text-[#E91E63] text-sm font-bold">
                    {plan.duration}
                  </Text>
                </View>
                <View className="items-end">
                  <Text
                    style={{ fontFamily: "RoyalBold" }}
                    className="text-[#333] text-2xl"
                  >
                    {plan.price}
                  </Text>
                  <Text className="text-gray-400 font-medium text-[10px]">
                    Tax Included
                  </Text>
                </View>
              </View>

              <View className="h-[1px] bg-blue-50 my-4" />

              {plan.features.map((feature, idx) => (
                <View key={idx} className="flex-row items-center mb-2">
                  <Ionicons name="checkmark-circle" size={16} color="#2D89B5" />
                  <Text className="text-gray-700 font-medium text-sm ml-2">
                    {feature}
                  </Text>
                </View>
              ))}

              <TouchableOpacity
                onPress={() => handlePlanSelect(plan)}
                className={`mt-6 py-3 rounded-2xl items-center shadow-md ${
                  plan.popular
                    ? "bg-[#E91E63] shadow-pink-200"
                    : "bg-[#2D89B5] shadow-blue-200"
                }`}
              >
                <Text className="text-white font-black uppercase tracking-widest">
                  Select Plan
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </TouchableOpacity>
        ))}
        <View className="h-10" />
      </ScrollView>

      {/* Payment Modal */}
      <Modal
        visible={showPayment}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPayment(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-[40px] p-8 shadow-2xl">
            <View className="flex-row justify-between items-center mb-6">
              <View>
                <Text className="text-gray-400 font-bold text-xs uppercase tracking-widest">
                  Confirm Payment
                </Text>
                <Text
                  style={{ fontFamily: "RoyalBold" }}
                  className="text-[#2D89B5] text-2xl"
                >
                  {selectedPlan?.name}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowPayment(false)}
                className="bg-blue-50 p-2 rounded-full"
              >
                <Ionicons name="close" size={20} color="#2D89B5" />
              </TouchableOpacity>
            </View>

            <View className="bg-blue-50/50 p-4 rounded-2xl mb-8 flex-row justify-between items-center border border-blue-100">
              <Text className="text-gray-600 font-bold">Total Amount</Text>
              <Text
                style={{ fontFamily: "RoyalBold" }}
                className="text-[#E91E63] text-xl"
              >
                {selectedPlan?.price}
              </Text>
            </View>

            <Text className="text-gray-400 font-bold text-xs mb-4 uppercase tracking-widest">
              Select Payment Method
            </Text>

            {PAYMENT_METHODS.map((method) => (
              <TouchableOpacity
                key={method.id}
                onPress={() => {
                  setShowPayment(false);
                  alert(`Proceeding with ${method.name}`);
                }}
                className="flex-row items-center bg-white p-4 rounded-2xl mb-3 border border-blue-100 shadow-sm shadow-blue-50"
              >
                <View className="bg-[#2D89B5]/10 p-2 rounded-xl">
                  <Ionicons
                    name={method.icon as any}
                    size={20}
                    color="#2D89B5"
                  />
                </View>
                <Text className="text-[#333] font-bold text-sm ml-4 flex-1">
                  {method.name}
                </Text>
                <Ionicons name="chevron-forward" size={16} color="#2D89B5" />
              </TouchableOpacity>
            ))}

            <Text className="text-gray-400 font-medium text-[10px] text-center mt-6">
              By proceeding, you agree to our Terms of Service and Privacy
              Policy. Secure encrypted payment processing.
            </Text>
            <View style={{ height: insets.bottom + 20 }} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Membership;
