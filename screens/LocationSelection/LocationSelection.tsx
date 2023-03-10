import { StyleSheet, Image, Button, TextInput, Modal } from 'react-native';
import React, { useState, useEffect } from 'react';
import MapView, { MapPressEvent, Marker } from 'react-native-maps';

import { Text, View } from '../../components/Themed';
import { RootTabScreenProps } from '../../types';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

import { LocationSelectionProps } from './LocationSelectionProps';

export const LocationSelection: React.FC<LocationSelectionProps> = ({
  currentLocation,
  usingCurrentLocation,
  selectedLocation,
  onUseCurrentLocation,
  onSelectLocation,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleLocationSelect = (event: MapPressEvent) => {
    onSelectLocation(event.nativeEvent.coordinate);
  };

  const handleUseCurrentLocation = () => {
    onUseCurrentLocation(true);
  };

  return (
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
            {currentLocation && usingCurrentLocation && (
              <Marker
                title='Current Location'
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
              onPress={handleUseCurrentLocation}
            />
            <Button title='Save' onPress={() => setModalVisible(false)} />
            <Button title='Cancel' onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
      <Button title='Set A Location' onPress={() => setModalVisible(true)} />
    </View>
  );
};
