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

const { width } = Dimensions.get("window");

const PLANS = [
  {
    id: "silver",
    name: "Silver Plan",
    price: "₹1,999",
    duration: "3 Months",
    features: ["View 25 Contacts", "Send 50 Interests", "Direct Message Support"],
    color: "#C0C0C0",
    icon: "shield-outline",
  },
  {
    id: "gold",
    name: "Gold Plan",
    price: "₹4,499",
    duration: "6 Months",
    features: ["View 100 Contacts", "Unlimited Interests", "Featured Profile", "Priority Support"],
    color: "#FFD700",
    icon: "star-outline",
    popular: true,
  },
  {
    id: "diamond",
    name: "Diamond Plan",
    price: "₹7,999",
    duration: "12 Months",
    features: ["Unlimited Everything", "Matchmaker Services", "Verified Badge", "Profile Booster"],
    color: "#B9F2FF",
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
  const [selectedPlan, setSelectedPlan] = useState<typeof PLANS[0] | null>(null);
  const [showPayment, setShowPayment] = useState(false);

  const handlePlanSelect = (plan: typeof PLANS[0]) => {
    setSelectedPlan(plan);
    setShowPayment(true);
  };

  return (
    <View className="flex-1 bg-[#010302]">
      {/* Header */}
      <View
        style={{ paddingTop: insets.top + 10 }}
        className="bg-[#0B2B1F] px-6 pb-4 flex-row items-center border-b border-[#C5A059]/20"
      >
        <TouchableOpacity
          onPress={() => router.back()}
          className="mr-4"
        >
          <Ionicons name="arrow-back" size={24} color="#C5A059" />
        </TouchableOpacity>
        <Text
          style={{ fontFamily: "RoyalBold" }}
          className="text-white text-xl"
        >
          Membership Plans
        </Text>
      </View>

      <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
        <Text className="text-white/60 text-center mb-8 text-sm">
          Choose a plan that fits your journey to find the eternal partner
        </Text>

        {PLANS.map((plan) => (
          <TouchableOpacity
            key={plan.id}
            activeOpacity={0.9}
            onPress={() => handlePlanSelect(plan)}
            className="mb-6"
          >
            <LinearGradient
              colors={["#0B2B1F", "#05150F"]}
              className="rounded-3xl p-6 border border-[#C5A059]/20 overflow-hidden"
            >
              {plan.popular && (
                <View className="absolute top-0 right-0 bg-[#C5A059] px-4 py-1 rounded-bl-2xl">
                  <Text className="text-black text-[10px] font-bold uppercase">Popular</Text>
                </View>
              )}

              <View className="flex-row justify-between items-start mb-4">
                <View>
                  <View className="flex-row items-center mb-1">
                    <Ionicons name={plan.icon as any} size={20} color={plan.color} />
                    <Text
                      style={{ fontFamily: "RoyalBold" }}
                      className="text-white text-xl ml-2"
                    >
                      {plan.name}
                    </Text>
                  </View>
                  <Text className="text-[#C5A059] text-sm font-bold">{plan.duration}</Text>
                </View>
                <View className="items-end">
                  <Text
                    style={{ fontFamily: "RoyalBold" }}
                    className="text-white text-2xl"
                  >
                    {plan.price}
                  </Text>
                  <Text className="text-white/40 text-[10px]">Tax Included</Text>
                </View>
              </View>

              <View className="h-[1px] bg-[#C5A059]/10 my-4" />

              {plan.features.map((feature, idx) => (
                <View key={idx} className="flex-row items-center mb-2">
                  <Ionicons name="checkmark-circle" size={16} color="#C5A059" />
                  <Text className="text-white/80 text-sm ml-2">{feature}</Text>
                </View>
              ))}

              <TouchableOpacity
                onPress={() => handlePlanSelect(plan)}
                className="mt-6 bg-[#C5A059] py-3 rounded-2xl items-center"
              >
                <Text className="text-black font-bold uppercase tracking-wider">Select Plan</Text>
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
        <View className="flex-1 justify-end bg-black/80">
          <View className="bg-[#0B2B1F] rounded-t-[40px] p-8 border-t border-[#C5A059]/30">
            <View className="flex-row justify-between items-center mb-6">
              <View>
                <Text className="text-white/60 text-xs uppercase tracking-widest">Confirm Payment</Text>
                <Text
                  style={{ fontFamily: "RoyalBold" }}
                  className="text-white text-2xl"
                >
                  {selectedPlan?.name}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowPayment(false)}
                className="bg-white/10 p-2 rounded-full"
              >
                <Ionicons name="close" size={20} color="#C5A059" />
              </TouchableOpacity>
            </View>

            <View className="bg-black/40 p-4 rounded-2xl mb-8 flex-row justify-between items-center border border-[#C5A059]/10">
                <Text className="text-white/80">Total Amount</Text>
                <Text style={{ fontFamily: "RoyalBold" }} className="text-[#C5A059] text-xl">
                    {selectedPlan?.price}
                </Text>
            </View>

            <Text className="text-white/60 text-xs mb-4 uppercase tracking-widest">Select Payment Method</Text>
            
            {PAYMENT_METHODS.map((method) => (
              <TouchableOpacity
                key={method.id}
                onPress={() => {
                  setShowPayment(false);
                  alert(`Proceeding with ${method.name}`);
                }}
                className="flex-row items-center bg-black/20 p-4 rounded-2xl mb-3 border border-[#C5A059]/10"
              >
                <View className="bg-[#C5A059]/10 p-2 rounded-xl">
                    <Ionicons name={method.icon as any} size={20} color="#C5A059" />
                </View>
                <Text className="text-white text-sm ml-4 flex-1">{method.name}</Text>
                <Ionicons name="chevron-forward" size={16} color="#C5A059" />
              </TouchableOpacity>
            ))}

            <Text className="text-white/30 text-[10px] text-center mt-6">
              By proceeding, you agree to our Terms of Service and Privacy Policy. Secure encrypted payment processing.
            </Text>
            <View style={{ height: insets.bottom + 20 }} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Membership;
