import { StyleSheet, Image, Button, TextInput, Modal } from 'react-native';
import React, { useState, useEffect } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import * as ImagePicker from 'expo-image-picker';

import { LocationNotes } from './LocationNotes';
import { LocationSelection } from './LocationSelection';
import * as Location from 'expo-location';

export default function TabOneScreen({}: RootTabScreenProps<'TabOne'>) {
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [hasMediaPermission, setHasMediaPermission] = useState<boolean | null>(
    null
  );
  const [hasCameraPermission, setHasCameraPermission] = useState<
    boolean | null
  >(null);

  const [notes, setNotes] = useState<string>('');

  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>({
    latitude: 0,
    longitude: 0,
  });
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>({
    latitude: 0,
    longitude: 0,
  });
  const [usingCurrentLocation, setUsingCurrentLocation] =
    useState<boolean>(true);

  const handleUseCurrentLocation = () => {
    setUsingCurrentLocation(true);
  };

  const handleSelectLocation = (modalLocation: {
    latitude: number;
    longitude: number;
  }) => {
    setSelectedLocation(modalLocation);
    setUsingCurrentLocation(false);
  };

  const onNotesChange = (text: string) => {
    setNotes(text);
  };

  async function userGaveCameraPermission() {
    if (hasCameraPermission == null) {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      console.log('camera permissions:' + status);
      if (status !== 'granted') {
        setHasCameraPermission(false);
        return false;
      } else {
        setHasCameraPermission(true);
        return true;
      }
    } else {
      return hasCameraPermission;
    }
  }

  async function userGaveMediaPermission() {
    if (hasMediaPermission == null) {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        setHasMediaPermission(false);
        return false;
      } else {
        setHasMediaPermission(true);
        return true;
      }
    } else {
      return hasMediaPermission;
    }
  }

  useEffect(() => {
    // Get the user's current location
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      console.log('location permissions:' + status);
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  // async function coordsToAddress(lat: number, long: number) {
  //   console.log(GOOGLE_MAPS_API_KEY);
  // }

  // const handleTextInputChange = (text: string) => {
  //   setNotes(text);
  // };

  const takePhoto = async () => {
    if ((await userGaveCameraPermission()) == true) {
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
      alert('Sorry, we need camera permissions to make this work!');
      // todo: then let them set permissions again by setting hasCameraPermission to null
    }
  };

  const choosePhoto = async () => {
    if ((await userGaveMediaPermission()) == true) {
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
      alert('Sorry, we need camera permissions to make this work!');
      // todo: then let them set permissions again by setting hasMediaPermission to null
    }
  };

  const handleSave = () => {};

  return (
    <View style={styles.container}>
      <Text>Camera permissions: {hasCameraPermission?.toString()}</Text>
      <Text>Media permissions: {hasMediaPermission?.toString()}</Text>
      {photoUri && <Image source={{ uri: photoUri }} style={styles.photo} />}
      <Button title='Take a photo' onPress={takePhoto} />
      <Button title='Choose from library' onPress={choosePhoto} />
      {/* <TextInput
        style={styles.textInput}
        placeholder='Notes'
        onChangeText={handleTextInputChange}
        value={notes}
      /> */}
      <LocationNotes onNotesChange={onNotesChange} notes={notes} />
      <Button title='Save audit notes' onPress={handleSave} />
      {currentLocation && usingCurrentLocation ? (
        <Text>
          Current: {`${currentLocation.latitude}, ${currentLocation.longitude}`}
        </Text>
      ) : selectedLocation && !usingCurrentLocation ? (
        <Text>
          Selected:
          {`${selectedLocation.latitude}, ${selectedLocation.longitude}`}
        </Text>
      ) : (
        <Text>No Location Available</Text>
      )}
      <LocationSelection
        currentLocation={currentLocation}
        selectedLocation={selectedLocation}
        onUseCurrentLocation={handleUseCurrentLocation}
        onSelectLocation={handleSelectLocation}
        usingCurrentLocation={usingCurrentLocation}
      />
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
  textInput: {
    height: 40,
    width: 300,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 10,
    padding: 5,
    color: 'white',
  },
});
