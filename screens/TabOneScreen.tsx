import {
  StyleSheet,
  Image,
  Button,
  TextInput,
  Modal,
  Platform,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import * as ImagePicker from 'expo-image-picker';

import { LocationNotes } from './LocationNotes';
import { LocationSelection } from './LocationSelection';
import * as Location from 'expo-location';
import { TouchableOpacity } from 'react-native';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';

export default function AuditNotes({}: RootTabScreenProps<'TabOne'>) {
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
      <Text style={styles.title}>New Audit Notes</Text>
      {currentLocation && usingCurrentLocation ? (
        <Text style={styles.locationText}>
          Current: {`${currentLocation.latitude}, ${currentLocation.longitude}`}
        </Text>
      ) : selectedLocation && !usingCurrentLocation ? (
        <Text style={styles.locationText}>
          Selected:
          {`${selectedLocation.latitude}, ${selectedLocation.longitude}`}
        </Text>
      ) : (
        <Text style={styles.locationText}>No Location Available</Text>
      )}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.iconButton} onPress={takePhoto}>
          <MaterialIcons name='camera-alt' size={40} color='black' />
          <Text>Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={choosePhoto}>
          <AntDesign name='picture' size={40} color='black' />
          <Text>Gallery</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonRow}>
        <LocationSelection
          currentLocation={currentLocation}
          selectedLocation={selectedLocation}
          onUseCurrentLocation={handleUseCurrentLocation}
          onSelectLocation={handleSelectLocation}
          usingCurrentLocation={usingCurrentLocation}
        />
        <TouchableOpacity style={styles.iconButton}>
          <LocationNotes onNotesChange={onNotesChange} notes={notes} />
          <MaterialIcons name='note-add' size={40} color='black' />
          <Text>Add Notes</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save audit notes</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    color: 'black',
  },
  locationText: {
    fontSize: 16,
    color: 'darkgrey',
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '33%',
    height: Platform.OS === 'ios' ? 120 : 100,
    borderRadius: 20,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  saveButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    marginBottom: 20,
  },
  saveButtonText: {
    fontSize: 18,
    color: 'white',
  },
});

// Old version
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   separator: {
//     marginVertical: 30,
//     height: 1,
//     width: '80%',
//   },
//   photo: {
//     width: 300,
//     height: 300,
//     marginBottom: 20,
//   },
//   textInput: {
//     height: 40,
//     width: 300,
//     borderColor: 'gray',
//     borderWidth: 1,
//     margin: 10,
//     padding: 5,
//     color: 'white',
//   },
// });

//
// }

// return (
//   <View style={styles.container}>
//     {currentLocation && usingCurrentLocation ? (
//       <Text>
//         Current: {`${currentLocation.latitude}, ${currentLocation.longitude}`}
//       </Text>
//     ) : selectedLocation && !usingCurrentLocation ? (
//       <Text>
//         Selected:
//         {`${selectedLocation.latitude}, ${selectedLocation.longitude}`}
//       </Text>
//     ) : (
//       <Text>No Location Available</Text>
//     )}
//     {/* <Text>Camera permissions: {hasCameraPermission?.toString()}</Text>
//     <Text>Media permissions: {hasMediaPermission?.toString()}</Text> */}
//     {photoUri && <Image source={{ uri: photoUri }} style={styles.photo} />}
//     <Button title='Take a photo' onPress={takePhoto} />
//     <Button title='Choose from library' onPress={choosePhoto} />
//     {/* <TextInput
//       style={styles.textInput}
//       placeholder='Notes'
//       onChangeText={handleTextInputChange}
//       value={notes}
//     /> */}
//     <LocationNotes onNotesChange={onNotesChange} notes={notes} />

//     <LocationSelection
//       currentLocation={currentLocation}
//       selectedLocation={selectedLocation}
//       onUseCurrentLocation={handleUseCurrentLocation}
//       onSelectLocation={handleSelectLocation}
//       usingCurrentLocation={usingCurrentLocation}
//     />
//     <Button title='Save audit notes' onPress={handleSave} />
//   </View>
// );
