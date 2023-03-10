export interface LocationSelectionProps {
  currentLocation: {
    latitude: number;
    longitude: number;
  } | null;
  selectedLocation: {
    latitude: number;
    longitude: number;
  } | null;
  onUseCurrentLocation: (setting: boolean) => void;
  onSelectLocation: (location: { latitude: number; longitude: number }) => void;
  usingCurrentLocation: boolean;
}
