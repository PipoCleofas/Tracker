import { Image, StyleSheet, Platform, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { View } from 'react-native';
import useLocation from '@/hooks/useLocation';
import { useState } from 'react';

// Define the type for the marker object
interface MarkerType {
  latitude: number;
  longitude: number;
}

export default function HomeScreen() {
  const { location, errorMsg, isFetching } = useLocation();
  const [markers, setMarkers] = useState<MarkerType[]>([]); // State to store markers with proper type

  const defaultRegion = {
    latitude: 15.4817, 
    longitude: 120.5979, 
    latitudeDelta: 0.05, 
    longitudeDelta: 0.05,
  };

  // Function to handle map press and add new marker
  const handleMapPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setMarkers((prevMarkers) => [
      ...prevMarkers,
      { latitude, longitude }, // Add new marker with latitude and longitude
    ]);
  };

  return (
    <View style={styles.container}>
      {isFetching && <Text>Fetching location...</Text>}
      {errorMsg && <Text>{errorMsg}</Text>}
      {!isFetching && location && (
        <MapView
          style={styles.map}
          initialRegion={defaultRegion}
          region={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          onPress={handleMapPress} // Add this to capture click events
        >
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="Got you"
            description="got you"
          />
          {markers.map((marker, index) => (
            <Marker
              key={index}
              coordinate={marker}
              title={`Marker ${index + 1}`}
              description={`Latitude: ${marker.latitude}, Longitude: ${marker.longitude}`}
            />
          ))}
        </MapView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
