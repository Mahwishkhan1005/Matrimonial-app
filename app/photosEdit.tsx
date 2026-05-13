import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import api from "../axios/axiosInterceptor";
import TopNavBar from "../components/TopNavBar";
import { useAuth } from "../context/AuthContext";

const { width } = Dimensions.get("window");
const BOX_WIDTH = (width - 48 - 16) / 2; // Screen width minus padding and gap

const PhotosEdit = () => {
  const router = useRouter();
  const { user } = useAuth();

  // State to hold image objects { id, imageUrl, userid }
  const [images, setImages] = useState<(any | null)[]>([
    null,
    null,
    null,
    null,
  ]);
  const [loading, setLoading] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const response = await api.get("/user/images");
      // Map API response to our 4-slot grid
      const fetchedImages = response.data || [];
      const newImages = [null, null, null, null];
      fetchedImages.forEach((img: any, index: number) => {
        if (index < 4) newImages[index] = img;
      });
      setImages(newImages);
    } catch (error) {
      console.error("Error fetching images:", error);
      // Alert.alert("Error", "Failed to load images.");
    } finally {
      setLoading(false);
    }
  };

  // Function to pick an image and upload/update
  const pickImage = async (index: number) => {
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
      aspect: [4, 5],
      quality: 0.8,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      let uri = asset.uri;

      const formData = new FormData();
      const existingImage = images[index];
      const key = existingImage && existingImage.id ? "file" : "files";
      const fileName = asset.fileName || `photo_${index}.jpg`;
      const mimeType = asset.mimeType || "image/jpeg";

      setUploadingIndex(index);
      try {
        if (Platform.OS === "web") {
          // Web: Must convert URI to Blob/File for FormData to work correctly
          const response = await fetch(uri);
          const blob = await response.blob();
          formData.append(key, blob, fileName);
        } else {
          // Native: Use the object format
          if (Platform.OS === "android" && !uri.startsWith("file://")) {
            uri = `file://${uri}`;
          }
          formData.append(key, {
            uri,
            name: fileName,
            type: mimeType,
          } as any);
        }

        // Configuration to handle the header conflict with the global interceptor
        const config = {
          headers: {
            // On Web, we MUST leave Content-Type undefined so the browser adds the boundary
            // On Native, we usually need to set it explicitly
            "Content-Type":
              Platform.OS === "web"
                ? "multipart/form-data"
                : "multipart/form-data",
          },
          // This is a trick to force Axios to NOT use the default application/json from the interceptor
          transformRequest: (data: any, headers: any) => {
            if (Platform.OS === "web") {
              delete headers["Content-Type"]; // Let the browser set it with boundary
            }
            return data;
          },
        };

        if (existingImage && existingImage.id) {
          // UPDATE existing image (PUT)
          await api.put(
            `/user/update-image/${existingImage.id}`,
            formData,
            config,
          );
          Alert.alert("Success", "Image updated successfully!");
        } else {
          // UPLOAD new image (POST)
          await api.post("/user/upload-images", formData, config);
          Alert.alert("Success", "Image uploaded successfully!");
        }
        fetchImages();
      } catch (error) {
        console.error("Upload error:", error);
        Alert.alert(
          "Upload Failed",
          "Could not upload image. Please try again.",
        );
      } finally {
        setUploadingIndex(null);
      }
    }
  };

  // Function to remove an image
  const deleteImage = (index: number) => {
    const imageToDelete = images[index];
    if (!imageToDelete) return;

    Alert.alert("Delete Photo", "Are you sure you want to remove this photo?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          setLoading(true);
          try {
            await api.delete(`/user/delete-image/${imageToDelete.id}`);
            Alert.alert("Deleted", "Image Deleted Successfully");
            fetchImages();
          } catch (error) {
            console.error("Delete error:", error);
            Alert.alert("Error", "Failed to delete image.");
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  if (loading && images.every((img) => img === null)) {
    return (
      <View className="flex-1 bg-[#F0F7FA] justify-center items-center">
        <ActivityIndicator size="large" color="#2D89B5" />
        <Text className="mt-4 text-[#2D89B5] font-medium">
          Loading Photos...
        </Text>
      </View>
    );
  }

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
                  {uploadingIndex === index ? (
                    <View className="flex-1 justify-center items-center">
                      <ActivityIndicator color="#2D89B5" />
                    </View>
                  ) : (
                    <Image
                      source={{ uri: images[index].imageUrl }}
                      style={{ width: "100%", height: "100%" }}
                      resizeMode="cover"
                    />
                  )}

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
                  disabled={uploadingIndex !== null}
                  style={{ width: BOX_WIDTH, height: BOX_WIDTH * 1.2 }}
                  className="bg-white rounded-2xl border-2 border-dashed border-blue-200 justify-center items-center shadow-sm shadow-blue-50"
                >
                  {uploadingIndex === index ? (
                    <ActivityIndicator color="#2D89B5" />
                  ) : (
                    <>
                      <View className="w-12 h-12 rounded-full bg-[#2D89B5]/10 justify-center items-center mb-3">
                        <Ionicons name="camera" size={24} color="#2D89B5" />
                      </View>
                      <Text className="text-[#2D89B5] font-bold text-xs uppercase tracking-wider">
                        Click Here
                      </Text>
                      <Text className="text-gray-400 font-medium text-[10px] mt-1">
                        Upload Photo
                      </Text>
                    </>
                  )}
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
