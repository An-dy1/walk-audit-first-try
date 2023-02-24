import { StyleSheet, Image, Button } from 'react-native';
import React, { useState, useEffect } from 'react';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import * as ImagePicker from 'expo-image-picker';

export default function TabOneScreen({
  navigation,
}: RootTabScreenProps<'TabOne'>) {
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [hasMediaPermission, setHasMediaPermission] = useState<boolean | null>(
    false
  );
  const [hasCameraPermission, setHasCameraPermission] = useState<
    boolean | null
  >(false);

  useEffect(() => {
    console.log('in use effect');
    async () => {
      console.log('in camera permission request');
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      console.log('camera status', status);
      if (status !== 'granted') {
        alert('Sorry, we need camera permissions to make this work!');
        return;
      }
      setHasCameraPermission(true);
    };

    async () => {
      console.log('in media permission request');
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log('media status', status);
      if (status !== 'granted') {
        alert('Sorry, we need media library permissions to make this work!');
        return;
      }
      setHasCameraPermission(true);
    };
  }, []);

  const takePhoto = async () => {
    if (hasCameraPermission) {
      console.log('has camera permission');
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setPhotoUri(result.assets[0].uri);
      }
    } else {
      console.log('no camera permission');
    }
  };

  const choosePhoto = async () => {
    if (hasMediaPermission) {
      console.log('has media permission');
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled) {
        setPhotoUri(result.assets[0].uri);
      }
    } else {
      console.log('no media permission');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Take a photo:</Text>
      {photoUri && <Image source={{ uri: photoUri }} style={styles.photo} />}
      <Button title='Take a photo' onPress={takePhoto} />
      <Button title='Choose from library' onPress={choosePhoto} />
      <View
        style={styles.separator}
        lightColor='#eee'
        darkColor='rgba(255,255,255,0.1)'
      />
      <EditScreenInfo path='/screens/TabOneScreen.tsx' />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  photo: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
});
