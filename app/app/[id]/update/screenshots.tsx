// AppScreenshots.tsx
import * as React from 'react';
import {useState} from 'react';
import {Image, Pressable, ScrollView, View} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {Text} from '~/components/ui/text';
import {NavHeaderLink} from '~/components/NavHeader';
import {Button} from '~/components/ui/button';
import {I_ImageAsset} from '~/types';
import {manipulateAsync, SaveFormat} from 'expo-image-manipulator';
import { toast } from 'sonner-native';
import {useLocalSearchParams} from "expo-router";
import {ImagePickerAsset} from "expo-image-picker";
import {useUpdateApp} from "~/hook/useApps";
import {arrayToIndexedObject} from "~/lib/utils";

export default function AppScreenshots() {
  const {id} = useLocalSearchParams();
  const [selectedImages, setSelectedImages] = useState<ImagePickerAsset[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const updateApp = useUpdateApp();
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 5MB

  const checkImageSize = (uri: string): Promise<boolean> => {
    return new Promise((resolve) => {
      Image.getSize(uri, (width, height) => {
        const maxDimension = Math.max(width, height);
        resolve(maxDimension <= 4096); // Most cloud services limit to 4096px
      });
    });
  };

  const optimizeImage = async (uri: string) => {
    try {
      return await manipulateAsync(
        uri,
        [
          { resize: { width: 1080, height: 1920 } }, // 16:9 aspect ratio
        ],
        {
          compress: 0.7,
          format: SaveFormat.JPEG
        }
      );
    } catch (error) {
      console.error('Error optimizing image:', error);
      throw error;
    }
  };

  const pickImages = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        alert('Permission to access gallery is required');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [9, 16],
        quality: 0.8,
        allowsMultipleSelection: true,
        base64: false,
      });

      if (!result.canceled) {
        // Process each image
        const optimizedImages = await Promise.all(
          result.assets.map(async (asset) => {
            if (asset.fileSize && asset.fileSize > MAX_FILE_SIZE) {
              toast.error(`Image ${asset.fileName} is too large`);
              return null;
            }

            if (!(await checkImageSize(asset.uri))) {
              toast.error(`Image ${asset.fileName} dimensions are too large`);
              return null;
            }

            const optimized = await optimizeImage(asset.uri);
            return {
              ...asset,
              uri: optimized.uri,
            };
          })
        );
        setSelectedImages(prevImages => {
          const newImages = [...prevImages, ...optimizedImages];
          return newImages.slice(0, 4); // Limit to 4 screenshots
        });
      }
    } catch (error) {
      console.error('Error picking images:', error);
      alert('Failed to pick images');
    }
  };

  const handleSubmit = async () => {
    if (selectedImages.length === 0) return;

    try {
      setIsSubmitting(true);

      // Upload each screenshot
      const uploadPromises = selectedImages.map(async (image, index) => {
        const formData = new FormData();
        formData.append('screenshot', {
          uri: image.uri,
          type: 'image/jpeg',
          name: `screenshot-${index}-${Date.now()}.jpg`,
        } as any);

        const response = await fetch(
          `${process.env.EXPO_PUBLIC_RAILWAY_UPLOAD_SERVICE_BASE_URL}/apps/${id}/screenshots`,
          {
            method: 'POST',
            body: formData,
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Upload failed: ${errorText}`);
        }

        return response.json();
      });

      const results = await Promise.all(uploadPromises);
      const screenshotUrls = results.map(result => result.screenshotUrl);

      // Convert array to indexed object
      const indexedScreenshots = arrayToIndexedObject(screenshotUrls);

      // Update app with new screenshot URLs
      // ... your update app logic here
      // Update the logo in our DB
      await updateApp.mutateAsync({
        id: id as string,
        updates: {screenshots: indexedScreenshots}
      });

      toast.success('Screenshots uploaded successfully');
    } catch (error) {
      console.error('Error uploading screenshots:', error);
      if (error instanceof Error) {
        toast.error(`Failed to upload screenshots: ${error.message}`);
      } else {
        toast.error('Failed to upload screenshots');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const EmptySlot = () => (
    <Pressable
      onPress={pickImages}
      className="flex-1 min-w-[240px] h-[320px] bg-base-200 rounded-xl items-center justify-center m-2"
    >
      <Text className="text-4xl mb-2">+</Text>
      <Text>Select images to upload</Text>
    </Pressable>
  );

  return (
    <View className="flex-1">
      <NavHeaderLink headerTitle="Update Screenshots"/>

      <ScrollView className="flex-1 p-4">
        <View className="flex-row flex-wrap justify-center">
          {selectedImages.map((image, index) => (
            <View key={index} className="m-2">
              <Image
                source={{uri: image.uri}}
                className="w-[240px] h-[320px] rounded-xl"
                resizeMode="cover"
              />
            </View>
          ))}

          {selectedImages.length < 4 && Array(4 - selectedImages.length)
            .fill(null)
            .map((_, index) => (
              <EmptySlot key={`empty-${index}`}/>
            ))}
        </View>
      </ScrollView>

      {selectedImages.length > 0 && (
        <View className="p-4 bg-white dark:bg-[#111314]">
          <Button
            onPress={handleSubmit}
            disabled={isSubmitting}
            className="w-72 mx-auto rounded-xl bg-nine"
          >
            <Text>{isSubmitting ? 'Uploading...' : 'Save'}</Text>
          </Button>
        </View>
      )}
    </View>
  );
}
