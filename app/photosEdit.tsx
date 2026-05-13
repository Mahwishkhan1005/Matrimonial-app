import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import TopNavBar from "../components/TopNavBar";

const { width } = Dimensions.get("window");
const BOX_WIDTH = (width - 48 - 16) / 2; // Screen width minus padding and gap

const PhotosEdit = () => {
  const router = useRouter();

  // State to hold the 4 image URIs (null means no image uploaded yet)
  const [images, setImages] = useState<string | null[]>([
    null,
    null,
    null,
    null,
  ]);

  // Function to pick an image from the device gallery
  const pickImage = async (index: number) => {
    // Request permission (Expo handles this under the hood mostly, but good practice)
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Sorry, we need camera roll permissions to upload photos.",
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 5], // Standard portrait aspect ratio
      quality: 0.8,
    });

    if (!result.canceled) {
      const newImages = [...images];
      newImages[index] = result.assets[0].uri;
      setImages(newImages);
    }
  };

  // Function to remove an image
  const deleteImage = (index: number) => {
    Alert.alert("Delete Photo", "Are you sure you want to remove this photo?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          const newImages = [...images];
          newImages[index] = null;
          setImages(newImages);
        },
      },
    ]);
  };

  return (
    <View className="flex-1 bg-[#F0F7FA]">
      {/* Header */}
      <TopNavBar title="Photos Update" />

      <ScrollView
        className="flex-1 px-6 pt-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Photo Grid */}
        <View className="flex-row flex-wrap justify-between">
          {[0, 1, 2, 3].map((index) => (
            <View key={index} className="mb-6">
              <Text className="text-[#2D89B5] font-RoyalBold mb-2 ml-1">
                Image {index + 1}
              </Text>

              {images[index] ? (
                // State: Image Uploaded
                <View
                  style={{ width: BOX_WIDTH, height: BOX_WIDTH * 1.2 }}
                  className="rounded-2xl overflow-hidden border border-blue-100 relative shadow-md shadow-blue-100 bg-white"
                >
                  <Image
                    source={{ uri: images[index] as string }}
                    style={{ width: "100%", height: "100%" }}
                    resizeMode="cover"
                  />
                  {/* Overlay Controls */}
                  <LinearGradient
                    colors={["transparent", "rgba(0,0,0,0.8)"]}
                    className="absolute bottom-0 w-full p-2 flex-row justify-between items-end h-1/3"
                  >
                    <TouchableOpacity
                      onPress={() => pickImage(index)}
                      className="bg-[#2D89B5]/90 p-2 rounded-full backdrop-blur-md"
                    >
                      <Ionicons name="pencil" size={18} color="#FFF" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => deleteImage(index)}
                      className="bg-[#E91E63]/90 p-2 rounded-full backdrop-blur-md"
                    >
                      <Ionicons name="trash" size={18} color="#FFF" />
                    </TouchableOpacity>
                  </LinearGradient>
                </View>
              ) : (
                // State: Empty Box
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => pickImage(index)}
                  style={{ width: BOX_WIDTH, height: BOX_WIDTH * 1.2 }}
                  className="bg-white rounded-2xl border-2 border-dashed border-blue-200 justify-center items-center shadow-sm shadow-blue-50"
                >
                  <View className="w-12 h-12 rounded-full bg-[#2D89B5]/10 justify-center items-center mb-3">
                    <Ionicons name="camera" size={24} color="#2D89B5" />
                  </View>
                  <Text className="text-[#2D89B5] font-bold text-xs uppercase tracking-wider">
                    Click Here
                  </Text>
                  <Text className="text-gray-400 font-medium text-[10px] mt-1">
                    Upload Photo
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        {/* Approval Status Section */}
        <View className="bg-white p-6 rounded-[30px] border border-blue-50 mt-4 mb-8 shadow-md shadow-blue-100">
          <Text className="text-[#2D89B5] text-lg font-RoyalBold mb-4">
            Photo Approve Status:
          </Text>

          {[0, 1, 2, 3].map((index) => (
            <View key={index} className="flex-row items-center mb-3">
              <Text className="text-[#333] font-bold w-20">
                Image {index + 1}:
              </Text>
              <View
                className={`px-3 py-1 rounded-full ${
                  images[index] ? "bg-orange-100" : "bg-gray-100"
                }`}
              >
                <Text
                  className={`text-[10px] uppercase tracking-wider font-black ${
                    images[index] ? "text-orange-500" : "text-gray-400"
                  }`}
                >
                  {images[index] ? "Pending Review" : "Not Uploaded"}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          className="w-full bg-[#E91E63] h-16 rounded-2xl justify-center items-center shadow-lg shadow-pink-200 mb-6"
          onPress={() => {
            const uploadedCount = images.filter((img) => img !== null).length;
            if (uploadedCount === 0) {
              Alert.alert(
                "No Photos",
                "Please upload at least one photo before submitting.",
              );
            } else {
              Alert.alert("Success", "Photos submitted for approval!");
              // router.back();
            }
          }}
        >
          <Text className="text-white font-extrabold text-lg tracking-widest uppercase">
            Submit
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default PhotosEdit;
