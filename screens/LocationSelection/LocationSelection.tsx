import { StyleSheet, Image, Button, TextInput, Modal } from 'react-native';
import React, { useState, useEffect } from 'react';
import MapView, { Marker } from 'react-native-maps';

import { Text, View } from '../../components/Themed';
import { RootTabScreenProps } from '../../types';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

import { LocationSelectionProps } from './LocationSelectionProps';

export const LocationSelection: React.FC<LocationSelectionProps> = ({
  currentLocation,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>({
    latitude: 0,
    longitude: 0,
  });

  const [usingCurrentLocation, setUsingCurrentLocation] =
    useState<boolean>(true);

  const [locationErrorMsg, setLocationErrorMsg] = useState('');

  const handleLocationSelect = (event: any) => {
    setUsingCurrentLocation(false);
    setSelectedLocation(event.nativeEvent.coordinate);
  };

  return (
    <View>
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
      <Button title='Set A Location' onPress={() => setModalVisible(true)} />
      <Text>{locationErrorMsg}</Text>
    </View>
  );
};
