import { StyleSheet, Image, Button, TextInput, Modal } from 'react-native';
import React, { useState, useEffect } from 'react';
import MapView, { Marker } from 'react-native-maps';

import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

export default function TabOneScreen({
  navigation,
}: RootTabScreenProps<'TabOne'>) {
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [hasMediaPermission, setHasMediaPermission] = useState<boolean | null>(
    null
  );
  const [hasCameraPermission, setHasCameraPermission] = useState<
    boolean | null
  >(null);
  const [notes, setNotes] = useState<string>('');
  const [modalVisible, setModalVisible] = useState(false);
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

  const [locationErrorMsg, setLocationErrorMsg] = useState('');

  async function userGaveCameraPermission() {
    if (hasCameraPermission == null) {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
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
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      console.log('inside use effect now');
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

  const handleTextInputChange = (text: string) => {
    setNotes(text);
  };

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

  const handleLocationSelect = (event: any) => {
    setUsingCurrentLocation(false);
    setSelectedLocation(event.nativeEvent.coordinate);
  };

  const handleSave = () => {};

  return (
    <View style={styles.container}>
      {currentLocation && (
        <Text>{`${currentLocation.latitude}, ${currentLocation.longitude}`}</Text>
      )}
      {photoUri && <Image source={{ uri: photoUri }} style={styles.photo} />}
      <Button title='Take a photo' onPress={takePhoto} />
      <Button title='Choose from library' onPress={choosePhoto} />
      <TextInput
        style={styles.textInput}
        placeholder='Notes'
        onChangeText={handleTextInputChange}
        value={notes}
      />
      <Button title='Save audit notes' onPress={handleSave} />
      <View>
        <Modal visible={modalVisible} animationType='slide'>
          <View style={{ flex: 1 }}>
            <MapView
              style={{ flex: 1 }}
              initialRegion={{
                latitude:
                  selectedLocation?.latitude ||
                  currentLocation?.latitude ||
                  39.0073,
                longitude:
                  selectedLocation?.longitude ||
                  currentLocation?.longitude ||
                  -94.5293,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              onPress={handleLocationSelect}
            >
              {usingCurrentLocation && currentLocation && (
                <Marker
                  title='Selected Location'
                  coordinate={{
                    latitude: currentLocation.latitude,
                    longitude: currentLocation.longitude,
                  }}
                />
              )}
              {selectedLocation && !usingCurrentLocation && (
                <Marker
                  title='Selected Location'
                  coordinate={{
                    latitude: selectedLocation.latitude,
                    longitude: selectedLocation.longitude,
                  }}
                />
              )}
            </MapView>
            <View>
              <Button
                title='Use Current Location'
                onPress={() => setUsingCurrentLocation(true)}
              />
              <Button title='Save' onPress={() => setModalVisible(false)} />
              <Button title='Cancel' onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </Modal>
      </View>
      <Button title='Set A Location' onPress={() => setModalVisible(true)} />
      <Text>{locationErrorMsg}</Text>
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
  },
});
