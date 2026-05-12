import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Dimensions,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const AccordionItem = ({ title, content }: { title: string; content: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <View className="mb-4">
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setIsOpen(!isOpen)}
                className="bg-[#0B2B1F] p-5 rounded-2xl flex-row justify-between items-center border border-[#C5A059]/10"
            >
                <Text style={{ fontFamily: "RoyalBold" }} className="text-white text-lg">
                    {title}
                </Text>
                <Ionicons
                    name={isOpen ? "chevron-up" : "chevron-down"}
                    size={20}
                    color="#C5A059"
                />
            </TouchableOpacity>
            {isOpen && (
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
