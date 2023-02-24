import ILocationNotes from '../interfaces/ILocationNotes';
import uuid from 'react-native-uuid';

class LocationNotes implements ILocationNotes {
  constructor(
    public readonly locationId: string | number[] = uuid.v4(),
    public readonly date: Date = new Date(),
    public notes: string,
    public photo: string
  ) // public latitude: number, // public longitude: number, // public accuracy: number, // public altitude: number, // public altitudeAccuracy: number, // public heading: number
  {}
}

export default LocationNotes;
