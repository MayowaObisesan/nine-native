// AppLogo.tsx
import * as React from 'react';
import {useState} from 'react';
import {Image, View} from "react-native";
import * as ImagePicker from 'expo-image-picker';
import {ImagePickerAsset} from 'expo-image-picker';
import {Button} from "~/components/ui/button";
import {Text} from "~/components/ui/text";
import {NavHeaderLink} from "~/components/NavHeader";
import {I_AppLogoProps} from '~/types';
import {toast} from "sonner-native";
import {supabase} from "~/lib/supabase";
import {NINE_MEDIA_BUCKET_NAME} from "~/lib/constants";
import {decode} from "base64-arraybuffer";
import {useLocalSearchParams} from "expo-router";
import {PutObjectCommand, S3Client} from '@aws-sdk/client-s3';
import {useUpdateApp} from "~/hook/useApps";
import { manipulateAsync } from 'expo-image-manipulator';

export default function AppLogo({currentLogo}: I_AppLogoProps) {
  const {id} = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImagePickerAsset | null>(null);
  const updateApp = useUpdateApp();

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        alert('Permission to access gallery is required');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5, // Reduce quality to 50%
        base64: false,
      });

      if (!result.canceled) {
        // Compress image if needed
        const manipResult = await manipulateAsync(
          result.assets[0].uri,
          [{ resize: { width: 500 } }], // Resize to reasonable dimensions
          { compress: 0.7 } // Additional compression
        );
        setSelectedImage({
          ...result.assets[0],
          uri: manipResult.uri
        });

        // setSelectedImage(result.assets[0]);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      alert('Failed to pick image');
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) return;

    try {
      setIsLoading(true);

      // Create a smaller blob from the image
      /*const response = await fetch(selectedImage.uri);
      const blob = await response.blob();
      console.log(blob);*/

      const uploadPath = `${new Date().valueOf()}-${Math.random()}-${selectedImage.fileName}`;
      /*const formData = new FormData();
      formData.append('logo', blob, uploadPath);*/
      const formData = new FormData();
      formData.append('logo', {
        uri: selectedImage.uri,
        type: 'image/jpeg',
        name: uploadPath,
      });

      // console.log(selectedImage);
      // console.log(new Date().valueOf());
      console.log("app name", id);

      /*// const avatarFile = event.target.files[0]
      const {data, error} = await supabase
        .storage
        .from(NINE_MEDIA_BUCKET_NAME)
        .upload(uploadPath, decode(selectedImage.base64!), {
          contentType: 'image/png'
        })

      if (error) {
        throw new Error('Upload failed' + error.message);
      }
      console.log(data);
      */

      const uploadResponse = await fetch(`${process.env.EXPO_PUBLIC_RAILWAY_UPLOAD_SERVICE_BASE_URL}/apps/${id}/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        throw new Error('Upload failed:'+ errorText);
      }

      const {logoUrl} = await uploadResponse.json();
      console.log(logoUrl);

      // Update the logo in our DB
      await updateApp.mutateAsync({
        id: id as string,
        updates: {logo: logoUrl}
      });

      alert('Logo updated successfully');
      toast.success('Upload successfully');
    } catch (error) {
      console.error('Error uploading logo:', error);
      if (error instanceof Error) {
        alert(`Failed to upload logo: ${error.message}`);
        toast.error(`Failed to upload logo: ${error.message}`);
      } else {
        alert('Failed to upload logo due to an unknown error');
        toast.error('Failed to upload logo due to an unknown error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View>
      <View className="flex flex-col w-full h-full">
        <NavHeaderLink headerTitle={"Update Logo"}/>

        <View className="flex-1 block mx-auto my-16 text-center">
          <View
            className="block mx-auto w-[288px] h-[288px] rounded-full bg-base-200 shadow-inner border-2 border-base-200">
            {selectedImage?.uri ? (
              <View className="relative w-full h-full rounded-full overflow-hidden">
                <Image
                  src={selectedImage.uri}
                  alt="Selected logo"
                  className="w-full h-full object-cover object-center"
                />
              </View>
            ) : currentLogo ? (
              <Image
                src={currentLogo}
                alt="Current logo"
                className="w-full h-full object-cover object-center rounded-full"
              />
            ) : null}
          </View>

          <Button
            onPress={pickImage}
            className="w-8/12 h-12 rounded-xl mx-auto px-4 my-8 bg-base-300 dark:bg-222425"
          >
            <Text className={"font-semibold text-base text-foreground"}>Select new logo</Text>
          </Button>
        </View>

        <View className="sticky bottom-0 py-8 w-full mx-auto">
          <Button
            disabled={!selectedImage || isLoading}
            onPress={handleUpload}
            className="w-72 mx-auto rounded-xl bg-nine"
          >
            <Text>{isLoading ? 'Uploading...' : 'Save'}</Text>
          </Button>
        </View>
      </View>
    </View>
  );
}
