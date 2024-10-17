import { Image, StyleSheet, Platform, Text, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { View } from 'react-native';
import useLocation from '@/hooks/useLocation';
import { useState, useEffect } from 'react';

interface MarkerType {
  latitude: number;
  longitude: number;
  distance?: number; 
}

export default function HomeScreen() {
  const { location, errorMsg, isFetching } = useLocation();
  const [markers, setMarkers] = useState<MarkerType[]>([]); 

  const defaultRegion = {
    latitude: 15.4817, 
    longitude: 120.5979, 
    latitudeDelta: 0.05, 
    longitudeDelta: 0.05,
  };

  // Haversine formula to calculate the distance between two points (in meters)
  const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const toRad = (value: number) => (value * Math.PI) / 180; // Convert degrees to radians

    const R = 6371e3; // Radius of the Earth in meters
    const φ1 = toRad(lat1); // Latitude 1 in radians
    const φ2 = toRad(lat2); // Latitude 2 in radians
    const Δφ = toRad(lat2 - lat1); // Difference in latitude
    const Δλ = toRad(lon2 - lon1); // Difference in longitude

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // Distance in meters
    return distance;
  };

  const handleMapPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    
    // Calculate distance from the user's current location to the new marker
    if (location) {
      const distance = haversineDistance(
        location.coords.latitude,
        location.coords.longitude,
        latitude,
        longitude
      );

      // Add the new marker with calculated distance
      setMarkers((prevMarkers) => [
        ...prevMarkers,
        { latitude, longitude, distance },
      ]);

      const nearbyMarkers = markers.filter(marker => 
        haversineDistance(
          marker.latitude,
          marker.longitude,
          latitude,
          longitude
        ) < 50000 // Check if the distance is less than 100 meters
      );

      // Log the nearby markers
      if (nearbyMarkers.length > 0) {
        console.log('Nearby markers:', nearbyMarkers);
        Alert.alert('Nearby Marker', 'You have placed a marker near an existing one.');
      } else {
        console.log('No nearby markers found');
      }
    }
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
          onPress={handleMapPress}
        >
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="You are here"
            description="Your current location"
          />
          {markers.map((marker, index) => (
            <Marker
              key={index}
              coordinate={marker}
              title={`Marker ${index + 1}`}
              description={`Distance: ${(marker.distance! / 1000).toFixed(2)} km`} 
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
