import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Dimensions,
    Image,
    Modal,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const AccordionItem = ({ 
    title, 
    content, 
    isLocked = false, 
    onLockedPress 
}: { 
    title: string; 
    content: React.ReactNode; 
    isLocked?: boolean;
    onLockedPress?: () => void;
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const handlePress = () => {
        if (isLocked) {
            onLockedPress?.();
        } else {
            setIsOpen(!isOpen);
        }
    };

    return (
        <View className="mb-4">
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={handlePress}
                className="bg-[#0B2B1F] p-5 rounded-2xl flex-row justify-between items-center border border-[#C5A059]/10"
            >
                <View className="flex-row items-center">
                    <Text style={{ fontFamily: "RoyalBold" }} className="text-white text-lg">
                        {title}
                    </Text>
                    {isLocked && (
                        <View className="ml-2 bg-[#C5A059]/20 px-2 py-0.5 rounded-full border border-[#C5A059]/30">
                            <Ionicons name="lock-closed" size={12} color="#C5A059" />
                        </View>
                    )}
                </View>
                <Ionicons
                    name={isLocked ? "chevron-forward" : (isOpen ? "chevron-up" : "chevron-down")}
                    size={20}
                    color="#C5A059"
                />
            </TouchableOpacity>
            {!isLocked && isOpen && (
                <View className="bg-[#0B2B1F]/40 p-5 rounded-b-2xl -mt-2 border-x border-b border-[#C5A059]/10">
                    {content}
                </View>
            )}
        </View>
    );
};

const ProfileDetails = () => {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [mainImage, setMainImage] = useState(require("../assets/images/bride1.png"));
    const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

    const thumbnails = [
        require("../assets/images/bride1.png"),
        require("../assets/images/bride2.png"),
        require("../assets/images/bride3.png"),
    ];

    return (
        <View className="flex-1 bg-[#010302]">
            {/* Header */}
            <View
                style={{ paddingTop: insets.top + 10 }}
                className="bg-[#0B2B1F] px-6 pb-4 flex-row items-center border-b border-[#C5A059]/20"
            >
                <TouchableOpacity onPress={() => router.replace("/dashboard")} className="mr-4">
                    <Ionicons name="arrow-back" size={24} color="#C5A059" />
                </TouchableOpacity>
                <Text style={{ fontFamily: "RoyalBold" }} className="text-white text-xl">
                    Profile Details
                </Text>
            </View>

            <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
                {/* Gallery Section */}
                <View className="flex-row mb-8 bg-[#0B2B1F]/20 p-4 rounded-3xl border border-[#C5A059]/10">
                    <View className="flex-1 mr-4">
                        <Image
                            source={mainImage}
                            className="w-full h-80 rounded-2xl"
                            resizeMode="cover"
                        />
                    </View>
                    <View className="w-20 justify-between">
                        {thumbnails.map((img, idx) => (
                            <TouchableOpacity
                                key={idx}
                                onPress={() => setMainImage(img)}
                                className="mb-2"
                            >
                                <Image
                                    source={img}
                                    className="w-20 h-24 rounded-xl border border-[#C5A059]/20"
                                    resizeMode="cover"
                                />
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Dropdowns */}
                <AccordionItem
                    title="Initial Details"
                    content={
                        <View>
                            <DetailRow label="Name" value="Bhavya Sharma" />
                            <DetailRow label="Age" value="26 Years" />
                            <DetailRow label="Height" value={"5'4\""} />
                            <DetailRow label="Diet" value="Vegetarian" />
                            <DetailRow label="Language" value="Hindi, English" />
                        </View>
                    }
                />

                <AccordionItem
                    title="Family Details"
                    isLocked={true}
                    onLockedPress={() => setShowSubscriptionModal(true)}
                    content={
                        <View>
                            <DetailRow label="Father" value="Business Owner" />
                            <DetailRow label="Mother" value="Homemaker" />
                            <DetailRow label="Siblings" value="1 Brother (Married)" />
                            <DetailRow label="Family Type" value="Nuclear Family" />
                            <DetailRow label="Status" value="Middle Class" />
                        </View>
                    }
                />

                <AccordionItem
                    title="Contact Details"
                    isLocked={true}
                    onLockedPress={() => setShowSubscriptionModal(true)}
                    content={
                        <View>
                            <DetailRow label="Mobile" value="+91 98765 43210" />
                            <DetailRow label="Email" value="bhavya.s@example.com" />
                            <DetailRow label="Location" value="Mumbai, Maharashtra" />
                            <DetailRow label="Timing" value="10:00 AM - 08:00 PM" />
                        </View>
                    }
                />
                <View className="h-10" />
            </ScrollView>

            {/* Subscription Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={showSubscriptionModal}
                onRequestClose={() => setShowSubscriptionModal(false)}
            >
                <View className="flex-1 justify-center items-center bg-black/80 px-6">
                    <View className="bg-[#0B2B1F] w-full rounded-[40px] border border-[#C5A059]/30 overflow-hidden">
                        <View className="p-8 items-center">
                            <View className="bg-[#C5A059]/10 p-6 rounded-full mb-6 border border-[#C5A059]/20">
                                <Ionicons name="ribbon" size={50} color="#C5A059" />
                            </View>
                            
                            <Text style={{ fontFamily: "RoyalBold" }} className="text-white text-3xl text-center mb-2">
                                Premium Access
                            </Text>
                            
                            <Text className="text-white/60 text-center mb-8 px-4 leading-5">
                                Upgrade to a premium plan to view detailed family information and contact details of your matches.
                            </Text>

                            <TouchableOpacity 
                                className="bg-[#C5A059] w-full py-4 rounded-2xl items-center mb-4 shadow-lg"
                                onPress={() => {
                                    setShowSubscriptionModal(false);
                                    // Navigate to plans if needed
                                }}
                            >
                                <Text style={{ fontFamily: "RoyalBold" }} className="text-black text-lg">
                                    View Plans
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                className="w-full py-2 items-center"
                                onPress={() => setShowSubscriptionModal(false)}
                            >
                                <Text className="text-white/40 text-sm">
                                    Maybe Later
                                </Text>
                            </TouchableOpacity>
                        </View>
                        
                        <View className="bg-[#C5A059]/10 py-4 px-8 border-t border-[#C5A059]/10">
                            <Text className="text-[#C5A059]/60 text-[10px] text-center uppercase tracking-widest font-bold">
                                Trusted by 10,000+ members
                            </Text>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const DetailRow = ({ label, value }: { label: string; value: string }) => (
    <View className="flex-row justify-between py-2 border-b border-[#C5A059]/10">
        <Text className="text-white/60 text-sm">{label}</Text>
        <Text style={{ fontFamily: "RoyalBold" }} className="text-[#C5A059] text-sm">
            {value}
        </Text>
    </View>
);

export default ProfileDetails;
